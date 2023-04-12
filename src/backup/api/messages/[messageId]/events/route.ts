import { NextRequest } from "next/server";
import prisma from "../../../../../prisma/prisma";
import { ChatServiceClientFactory } from "../../../../../grpc-client/chat-service-client";
import { lastValueFrom } from "rxjs";

export async function GET(
  _request: NextRequest,
  { params }: { params: { messageId: string } }
) {
  const { messageId } = params;
  const message = await prisma.message.findUniqueOrThrow({
    where: { id: messageId },
    include: { chat: true },
  });

  let responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  if (message.is_answered || message.is_from_bot) {
    writer.write(encoder.encode("Invalid message"));
    writer.close();
    return new Response(responseStream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        Connection: "keep-alive",
        "Cache-Control": "no-cache, no-transform",
      },
    });
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
      console.log(`message: ${JSON.stringify(data)}`);
      writer.write(encoder.encode("event: message\n"));
      writer.write(encoder.encode(`id: ${new Date().getTime()}\n`));
      writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
    },
    error: (error) => {
      console.log(`error: ${error}`);
      writer.write(encoder.encode(`event: error\n`));
      writer.write(encoder.encode(`id: ${new Date().getTime()}\n`));
      writer.write(encoder.encode(`data: ${JSON.stringify(error)}\n\n`));
    },
    complete: async () => {
      console.log("stream completed");

      if(!lastMessage) {
        writer.write(encoder.encode(`event: error\n`));
        writer.write(encoder.encode(`id: ${new Date().getTime()}\n`));
        writer.write(encoder.encode(`data: It was not possible to get a response from the bot \n\n`));
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

      writer.write(encoder.encode(`event: complete\n`));
      writer.write(encoder.encode(`id: ${new Date().getTime()}\n`));
      writer.write(encoder.encode(`data: ${JSON.stringify(newMessage)}\n\n`));
      writer.close();
    },
  });

  return new Response(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
