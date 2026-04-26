// Next.js 미들웨어 — 인증 보호
// 로그인하지 않은 사용자 → /login 리다이렉트
// 프로필 미완성(isOnboarded=false) 사용자 → /onboarding 리다이렉트
// /login, /onboarding, /api/auth 경로는 인증 불필요

import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;

  // 인증이 필요 없는 공개 경로 목록
  const publicPaths = ["/login", "/onboarding", "/api/auth"];
  const isPublicPath = publicPaths.some((path) =>
    nextUrl.pathname.startsWith(path)
  );

  // 공개 경로는 인증 검사 없이 통과
  if (isPublicPath) {
    return NextResponse.next();
  }

  // API 경로는 인증 확인만 하고 온보딩 리다이렉트는 하지 않음
  // (API는 JSON 응답을 반환해야 하므로 HTML 리다이렉트 불가)
  const isApiPath = nextUrl.pathname.startsWith("/api");

  // 로그인하지 않은 사용자 → /login 리다이렉트 (API는 401 응답으로 처리됨)
  if (!session) {
    if (isApiPath) {
      return NextResponse.next(); // API 라우트 자체에서 401 처리
    }
    const loginUrl = new URL("/login", nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  // 프로필 미완성(온보딩 미완료) 사용자 → /onboarding 리다이렉트
  // API 경로는 리다이렉트하지 않음 (온보딩 API 호출이 차단되는 문제 방지)
  if (!session.user?.isOnboarded && !isApiPath) {
    const onboardingUrl = new URL("/onboarding", nextUrl.origin);
    return NextResponse.redirect(onboardingUrl);
  }

  return NextResponse.next();
});

// 미들웨어 적용 경로 설정
// 정적 파일, _next 내부 경로, favicon은 제외
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};
