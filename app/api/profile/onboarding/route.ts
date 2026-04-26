// 온보딩 API 라우트 — POST(최초 프로필 설정)

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { validateProfile } from "@/lib/validations";
import type { ApiErrorResponse, ApiSuccessResponse, UserProfile } from "@/lib/types";

// 최초 프로필 설정 (닉네임 + 거주 지역 + isOnboarded=true)
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: { code: "AUTH_ERROR", message: "로그인이 필요합니다." } },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { nickname, region } = body;

    // 유효성 검증
    const validation = validateProfile(nickname, region);
    if (!validation.valid) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: { code: "VALIDATION_ERROR", message: validation.errors[0] } },
        { status: 400 }
      );
    }

    // 사용자 존재 확인
    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!existingUser) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: { code: "NOT_FOUND", message: "사용자를 찾을 수 없습니다." } },
        { status: 404 }
      );
    }

    // 프로필 설정 및 온보딩 완료 처리
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        nickname: nickname.trim(),
        region,
        isOnboarded: true,
      },
      include: { accounts: { select: { provider: true } } },
    });

    const profile: UserProfile = {
      id: updatedUser.id,
      nickname: updatedUser.nickname,
      region: updatedUser.region,
      isOnboarded: updatedUser.isOnboarded,
      socialProvider: updatedUser.accounts[0]?.provider ?? "",
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };

    return NextResponse.json<ApiSuccessResponse<UserProfile>>(
      { success: true, data: profile },
      { status: 200 }
    );
  } catch {
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: { code: "INTERNAL_ERROR", message: "프로필 설정에 실패했습니다." } },
      { status: 500 }
    );
  }
}
