// 프로필 API 라우트 — GET(조회), PUT(수정), DELETE(탈퇴)

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { validateProfile } from "@/lib/validations";
import type { ApiErrorResponse, ApiSuccessResponse, UserProfile } from "@/lib/types";

// 프로필 조회
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: { code: "AUTH_ERROR", message: "로그인이 필요합니다." } },
      { status: 401 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { accounts: { select: { provider: true } } },
    });

    if (!user) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: { code: "NOT_FOUND", message: "사용자를 찾을 수 없습니다." } },
        { status: 404 }
      );
    }

    const profile: UserProfile = {
      id: user.id,
      nickname: user.nickname,
      region: user.region,
      isOnboarded: user.isOnboarded,
      socialProvider: user.accounts[0]?.provider ?? "",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json<ApiSuccessResponse<UserProfile>>(
      { success: true, data: profile },
      { status: 200 }
    );
  } catch {
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: { code: "INTERNAL_ERROR", message: "프로필 조회에 실패했습니다." } },
      { status: 500 }
    );
  }
}

// 프로필 수정 (닉네임, 거주 지역)
export async function PUT(request: Request) {
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

    // 프로필 업데이트
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { nickname: nickname.trim(), region },
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
      { success: false, error: { code: "INTERNAL_ERROR", message: "프로필 수정에 실패했습니다." } },
      { status: 500 }
    );
  }
}

// 회원 탈퇴 (계정 및 모든 관련 데이터 Cascade 삭제)
export async function DELETE() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: { code: "AUTH_ERROR", message: "로그인이 필요합니다." } },
      { status: 401 }
    );
  }

  try {
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

    // 사용자 삭제 — Prisma 스키마의 onDelete: Cascade로 관련 데이터 자동 삭제
    await prisma.user.delete({
      where: { id: session.user.id },
    });

    return NextResponse.json<ApiSuccessResponse<{ message: string }>>(
      { success: true, data: { message: "회원 탈퇴가 완료되었습니다." } },
      { status: 200 }
    );
  } catch {
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: { code: "INTERNAL_ERROR", message: "회원 탈퇴에 실패했습니다." } },
      { status: 500 }
    );
  }
}
