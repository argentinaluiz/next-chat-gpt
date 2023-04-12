import { getToken, JWT } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

type Config = { params: { [key: string]: string } | undefined };

export function withAuth(
  handler: (request: NextRequest, token: JWT, config: Config) => Promise<NextResponse>
) {
  return async function (
    request: NextRequest,
    config: { params: { [key: string]: string } }
  ) {
    const token = await getToken({ req: request });

    if (!token) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }
    return handler(request, token, config);
  };
}
