// 분리배출 가이드 카테고리 상세 API 라우트 — GET(특정 카테고리 조회)

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { ApiErrorResponse, ApiSuccessResponse } from "@/lib/types";
import type { RecyclingCategory, ContaminationLevel } from "@prisma/client";

// 카테고리 + 오염도 레벨 포함 타입
type CategoryWithLevels = RecyclingCategory & {
  levels: ContaminationLevel[];
};

// 특정 카테고리 상세 조회
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: { code: "AUTH_ERROR", message: "로그인이 필요합니다." } },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;

    const category = await prisma.recyclingCategory.findUnique({
      where: { id },
      include: { levels: true },
    });

    if (!category) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: { code: "NOT_FOUND", message: "카테고리를 찾을 수 없습니다." } },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiSuccessResponse<CategoryWithLevels>>(
      { success: true, data: category },
      { status: 200 }
    );
  } catch {
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: { code: "INTERNAL_ERROR", message: "카테고리 조회에 실패했습니다." } },
      { status: 500 }
    );
  }
}
