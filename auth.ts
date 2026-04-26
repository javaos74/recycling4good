// Auth.js (NextAuth v5) 설정 파일
// 카카오, 네이버, 구글 소셜 로그인 프로바이더 및 Prisma 어댑터 연결
// JWT 세션 전략 사용 — Edge Runtime(미들웨어)에서 Prisma 호출 불가 문제 해결

import NextAuth from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import NaverProvider from "next-auth/providers/naver";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Prisma 어댑터를 통해 사용자/계정 정보를 PostgreSQL에 저장
  adapter: PrismaAdapter(prisma),

  // JWT 세션 전략 — Edge Runtime 호환 (미들웨어에서 DB 호출 불필요)
  session: {
    strategy: "jwt",
  },

  // 소셜 로그인 프로바이더 설정
  // 로그아웃 후 재로그인 시 계정 선택/재인증 화면을 표시하기 위한 설정
  providers: [
    KakaoProvider({
      clientId: process.env.AUTH_KAKAO_ID!,
      clientSecret: process.env.AUTH_KAKAO_SECRET!,
      // 카카오: prompt=login으로 매번 로그인 화면 표시
      // scope에서 openid 제외 (카카오 콘솔에서 미설정 시 오류 발생)
      authorization: {
        url: "https://kauth.kakao.com/oauth/authorize",
        params: {
          prompt: "login",
          scope: "profile_nickname",
        },
      },
    }),
    NaverProvider({
      clientId: process.env.AUTH_NAVER_ID!,
      clientSecret: process.env.AUTH_NAVER_SECRET!,
      // 네이버는 auth_type으로 재인증 요구
      authorization: {
        url: "https://nid.naver.com/oauth2.0/authorize",
        params: { auth_type: "reauthenticate" },
      },
    }),
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      // 구글은 prompt로 계정 선택 화면 표시
      authorization: { params: { prompt: "select_account" } },
    }),
  ],

  // 커스텀 페이지 경로 설정
  pages: {
    signIn: "/login",
    newUser: "/onboarding",
  },

  // 콜백 설정
  callbacks: {
    // JWT 콜백: 토큰에 사용자 ID와 온보딩 완료 여부를 포함
    async jwt({ token, user, trigger }) {
      // 최초 로그인 시 또는 세션 업데이트 시 DB에서 사용자 정보 조회
      if (user) {
        token.id = user.id;
      }

      // DB에서 온보딩 완료 여부 조회
      // 온보딩 미완료 상태이거나 로그인/세션 업데이트 시 DB에서 최신 값 확인
      const shouldCheckDb =
        trigger === "signIn" ||
        trigger === "update" ||
        token.isOnboarded !== true;

      if (token.id && shouldCheckDb) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { isOnboarded: true },
          });
          token.isOnboarded = dbUser?.isOnboarded ?? false;
        } catch {
          // Edge Runtime에서 Prisma 호출 실패 시 기존 토큰 값 유지
          token.isOnboarded = token.isOnboarded ?? false;
        }
      }

      return token;
    },

    // 세션 콜백: JWT 토큰의 정보를 세션 객체에 전달
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isOnboarded = (token.isOnboarded as boolean) ?? false;
      }
      return session;
    },

    // 로그인 콜백: 항상 허용 (온보딩 리다이렉트는 미들웨어에서 처리)
    async signIn() {
      return true;
    },
  },
});
