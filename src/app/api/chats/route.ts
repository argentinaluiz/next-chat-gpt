import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../prisma/prisma";
import { JWT } from "next-auth/jwt";
import { withAuth } from "../../../utils/api-helpers";

export const GET = withAuth(async (_request: NextRequest, token: JWT) => {
  console.log(token);
  const chats = await prisma.chat.findMany({
    where: {
      user_id: token.sub,
    },
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
});

export const POST = withAuth(async (request: NextRequest, token: JWT) => {
  const body = await request.json();
  const chat = await prisma.chat.create({
    data: {
      user_id: token.sub!,
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
});
