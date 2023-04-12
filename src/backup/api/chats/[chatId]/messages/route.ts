import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  const { chatId } = params;
  const messages = await prisma.message.findMany({
    where: { chatId },
    orderBy: { created_at: "asc" },
  });
  return NextResponse.json(messages);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  const { chatId } = params;
  console.log(chatId);
  const body = await request.json();
  const message = await prisma.message.create({
    data: {
        content: body.message,
        chat: {
          connect: { id: chatId },
        },
    }
  })
  
  return NextResponse.json(message);
}
