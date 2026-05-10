"use client";

// Auth.js SessionProvider 래퍼
// 세션 만료 감지 및 로그인 페이지 자동 리다이렉트 포함
// 요구사항: 1.9, 1.10, 1.11, 1.12

import { SessionProvider as NextAuthSessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// 세션 만료 감지 컴포넌트 — 세션이 없으면 로그인 페이지로 리다이렉트
function SessionGuard({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const pathname = usePathname();

  // 공개 경로는 세션 체크 불필요
  const publicPaths = ["/login", "/onboarding"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  useEffect(() => {
    // 세션이 만료되었고 공개 경로가 아니면 로그인 페이지로 이동
    if (status === "unauthenticated" && !isPublicPath) {
      window.location.href = "/login";
    }
  }, [status, isPublicPath]);

  return children as React.ReactElement;
}

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextAuthSessionProvider
      refetchInterval={5 * 60}
      refetchOnWindowFocus={true}
    >
      <SessionGuard>{children}</SessionGuard>
    </NextAuthSessionProvider>
  );
}
