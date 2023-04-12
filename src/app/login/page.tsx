"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { status: statusAuth } = useSession();
  const router = useRouter();
  console.log("statusAuth1", statusAuth);

  useEffect(() => {
    console.log("statusAuth2", statusAuth);
    if (statusAuth === "authenticated") {
      router.push("/");
    }
    if (statusAuth === "unauthenticated") {
      console.log("unauthenticated");
      signIn("keycloak", {});
    }
  }, [statusAuth, router]);

  return <div>carregando...</div>;
}
