// Auth.js 세션 및 JWT 타입 확장
// 세션 객체에 사용자 ID와 온보딩 완료 여부를 포함하기 위한 타입 선언

import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isOnboarded: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    isOnboarded?: boolean;
  }
}
