import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

export const authConfig = {
  providers: [
    KeycloakProvider({
      clientId: "chat-gpt",
      clientSecret: "6TigIHxsbsup3E1q6E1kfodR9hHJ4gB1",
      issuer: "http://host.docker.internal:9000/realms/master",
    }),
  ],
};

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
