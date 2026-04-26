"use client";

// Auth.js SessionProvider 래퍼
// 클라이언트 컴포넌트에서 useSession 훅을 사용하기 위해 필요

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
