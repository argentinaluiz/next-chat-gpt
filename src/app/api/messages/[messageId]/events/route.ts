import { NextRequest } from "next/server";
import prisma from "../../../../../prisma/prisma";
import { ChatServiceClientFactory } from "../../../../../grpc-client/chat-service-client";
import { getToken } from "next-auth/jwt";

export async function GET(
  _request: NextRequest,
  { params }: { params: { messageId: string } }
) {
  let responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();

  const token = await getToken({ req: _request });

  if (!token) {
    writeStream(writer, "error", "Unauthenticated");
    writer.close();
    return response(responseStream, 401);
  }

  const { messageId } = params;
  const message = await prisma.message.findUniqueOrThrow({
    where: { id: messageId },
    include: { chat: true },
  });

  if (message.chat.user_id !== token.sub) {
    writeStream(writer, "error", "Unauthorized");
    writer.close();
    return response(responseStream, 403);
  }

  if (message.is_answered || message.is_from_bot) {
    writeStream(writer, "error", "Message already answered");
    writer.close();
    return response(responseStream, 403);
  }

  const grpcChatService = ChatServiceClientFactory.create();

  console.log({
    chatId: message.chat.remote_chat_id,
    message: message.content,
  });
  const subscriberStream = grpcChatService.chatStream({
    chatId: message.chat.remote_chat_id,
    message: message.content,
  });
  let lastMessage: any = null;
  subscriberStream.subscribe({
    next: (data) => {
      lastMessage = data;
      writeStream(writer, "message", data);
    },
    error: (error) => {
      console.log(`error: ${error}`);
      writeStream(writer, "error", error);
    },
    complete: async () => {
      console.log("stream completed");

      if (!lastMessage) {
        writeStream(
          writer,
          "error",
          "It was not possible to get a response from the bot"
        );
        writer.close();
        return;
      }

      const [newMessage] = await prisma.$transaction([
        prisma.message.create({
          data: {
            content: lastMessage.message,
            chat: {
              connect: { id: message.chatId },
            },
            is_from_bot: true,
            is_answered: true,
          },
        }),
        prisma.chat.update({
          where: { id: message.chatId },
          data: {
            remote_chat_id: lastMessage.chat_id,
          },
        }),

        prisma.message.update({
          where: { id: message.id },
          data: {
            is_answered: true,
          },
        }),
      ]);

      console.log(newMessage);

      writeStream(writer, "complete", newMessage);
      writer.close();
    },
  });

  return response(responseStream);
}

function response(responseStream: TransformStream, status: number = 200) {
  return new Response(responseStream.readable, {
    status,
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}

type Event = "message" | "complete" | "error";

function writeStream(
  writer: WritableStreamDefaultWriter,
  event: Event,
  data: any
) {
  const encoder = new TextEncoder();
  writer.write(encoder.encode(`event: ${event}\n`));
  writer.write(encoder.encode(`id: ${new Date().getTime()}\n`));
  let _data = typeof data === "string" ? data : JSON.stringify(data);
  writer.write(encoder.encode(`data: ${_data}\n\n`));
}
