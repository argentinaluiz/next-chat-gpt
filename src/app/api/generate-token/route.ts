import { NextRequest, NextResponse } from "next/server";
import { encode } from "next-auth/jwt";

export async function POST(request: NextRequest) {
  const body = await request.json();  
  console.log(body)
  const user = {
    name: "admin",
    sub: body.user_id ?? "e148e395-96be-4066-b809-c302814644d1",
  };

  const secret = process.env.NEXTAUTH_SECRET as string;

  const token = await encode({
    secret,
    token: user,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  return NextResponse.json({ token });
}
