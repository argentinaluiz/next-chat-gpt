"use client";

import { SessionProvider as NextSessionProvider } from "next-auth/react";

export function SessionProvider({ session, children }) {
  return (
    <NextSessionProvider session={session}>{children}</NextSessionProvider>
  );
}
