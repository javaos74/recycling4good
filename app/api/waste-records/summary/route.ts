// 배출량 월별 요약 API 라우트 — GET(월별 요약: 총 무게, 봉투 합계, 기록 횟수)

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { ApiErrorResponse, ApiSuccessResponse, MonthlySummary, BagCounts } from "@/lib/types";

// 월별 요약 조회
export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: { code: "AUTH_ERROR", message: "로그인이 필요합니다." } },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");

    // month 파라미터 검증 (YYYY-MM 형식)
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: { code: "VALIDATION_ERROR", message: "월 형식이 올바르지 않습니다. (YYYY-MM)" } },
        { status: 400 }
      );
    }

    // 해당 월의 시작일과 종료일 계산
    const [year, mon] = month.split("-").map(Number);
    const startDate = new Date(year, mon - 1, 1);
    const endDate = new Date(year, mon, 1);

    const records = await prisma.wasteRecord.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
    });

    // 총 무게 합산
    const totalWeightKg = records.reduce(
      (sum, record) => sum + Number(record.weightKg),
      0
    );

    // 종량제봉투 합계 계산
    const totalBags = records.reduce((sum, record) => {
      const bags = record.bags as unknown as BagCounts | null;
      if (!bags) return sum;
      return sum + Object.values(bags).reduce((bagSum: number, count: number) => bagSum + (count || 0), 0);
    }, 0);

    const summary: MonthlySummary = {
      month,
      totalWeightKg: Math.round(totalWeightKg * 100) / 100,
      totalBags,
      recordCount: records.length,
    };

    return NextResponse.json<ApiSuccessResponse<MonthlySummary>>(
      { success: true, data: summary },
      { status: 200 }
    );
  } catch {
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: { code: "INTERNAL_ERROR", message: "월별 요약 조회에 실패했습니다." } },
      { status: 500 }
    );
  }
}
