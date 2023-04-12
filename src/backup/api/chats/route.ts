import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../prisma/prisma";

export async function GET(_request: NextRequest) {
  const chats = await prisma.chat.findMany({
    select: {
      id: true,
      messages: {
        where: { is_from_bot: false },
        orderBy: { created_at: "asc" },
        take: 1,
      },
    },
    orderBy: { created_at: "desc" },
  });
  return NextResponse.json(chats);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const chat = await prisma.chat.create({
    data: {
      messages: {
        create: {
          content: body.message,
        },
      },
    },
    select: {
      id: true,
      messages: true,
    },
  });
  return NextResponse.json(chat);
}
