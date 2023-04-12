import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";
import { withAuth } from "../../../../../utils/api-helpers";

export const GET = withAuth(async (_request: NextRequest, token, config) => {
  const { chatId } = config.params!;

  const chat = await prisma.chat.findUniqueOrThrow({
    where: { id: chatId },
  });

  if (chat.user_id !== token.sub) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const messages = await prisma.message.findMany({
    where: { chatId },
    orderBy: { created_at: "asc" },
  });
  return NextResponse.json(messages);
});

export const POST = withAuth(async (request: NextRequest, token, config) => {
  const { chatId } = config.params!;

  const chat = await prisma.chat.findUniqueOrThrow({
    where: { id: chatId },
  });

  if (chat.user_id !== token.sub) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const message = await prisma.message.create({
    data: {
      content: body.message,
      chat: {
        connect: { id: chatId },
      },
    },
  });

  return NextResponse.json(message);
});
