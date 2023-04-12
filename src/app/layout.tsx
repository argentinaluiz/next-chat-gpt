import "./globals.css";
import { getServerSession } from "next-auth";
import { authConfig } from "./api/auth/[...nextauth]/route";
import { SessionProvider } from "./components/providers/SessionProviders";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authConfig);
  console.log("session in layout", session);
  return (
    <html lang="en">
      {/* <body className="flex flex-row h-screen">{children}</body> */}
      <body>
        <SessionProvider session={session}>{children}</SessionProvider>
        {/* <Providers>{children}</Providers> */}
      </body>
    </html>
  );
}
