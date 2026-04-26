// 분리배출 가이드 카테고리 API 라우트 — GET(전체 카테고리 목록 조회)

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { ApiErrorResponse, ApiSuccessResponse } from "@/lib/types";
import type { RecyclingCategory, ContaminationLevel } from "@prisma/client";

// 카테고리 + 오염도 레벨 포함 타입
type CategoryWithLevels = RecyclingCategory & {
  levels: ContaminationLevel[];
};

// 전체 카테고리 목록 조회 (sortOrder 오름차순, ContaminationLevel 포함)
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: { code: "AUTH_ERROR", message: "로그인이 필요합니다." } },
      { status: 401 }
    );
  }

  try {
    const categories = await prisma.recyclingCategory.findMany({
      orderBy: { sortOrder: "asc" },
      include: { levels: true },
    });

    return NextResponse.json<ApiSuccessResponse<CategoryWithLevels[]>>(
      { success: true, data: categories },
      { status: 200 }
    );
  } catch {
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: { code: "INTERNAL_ERROR", message: "카테고리 목록 조회에 실패했습니다." } },
      { status: 500 }
    );
  }
}
