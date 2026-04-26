// 배출량 기록 API 라우트 — GET(월별 기록 목록 조회), POST(배출 기록 생성)

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { validateWasteRecord } from "@/lib/validations";
import type { ApiErrorResponse, ApiSuccessResponse, WasteRecord } from "@/lib/types";

// 월별 기록 목록 조회
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
      orderBy: { date: "desc" },
    });

    // Prisma 결과를 WasteRecord 인터페이스에 맞게 변환
    const data: WasteRecord[] = records.map((record) => ({
      id: record.id,
      userId: record.userId,
      date: record.date.toISOString().split("T")[0],
      weightKg: Number(record.weightKg),
      bags: (record.bags as unknown as WasteRecord["bags"]) ?? { "5L": 0, "10L": 0, "20L": 0, "30L": 0, "50L": 0 },
      photoUrl: record.photoUrl,
      memo: record.memo,
      createdAt: record.createdAt,
    }));

    return NextResponse.json<ApiSuccessResponse<WasteRecord[]>>(
      { success: true, data },
      { status: 200 }
    );
  } catch {
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: { code: "INTERNAL_ERROR", message: "배출 기록 조회에 실패했습니다." } },
      { status: 500 }
    );
  }
}

// 배출 기록 생성
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
    const { date, weightKg, bags, memo } = body;

    // 유효성 검증
    const validation = validateWasteRecord(date, weightKg, bags);
    if (!validation.valid) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: { code: "VALIDATION_ERROR", message: validation.errors[0] } },
        { status: 400 }
      );
    }

    // 배출 기록 생성
    const record = await prisma.wasteRecord.create({
      data: {
        userId: session.user.id,
        date: new Date(date),
        weightKg: weightKg ?? 0,
        bags: bags ?? { "5L": 0, "10L": 0, "20L": 0, "30L": 0, "50L": 0 },
        memo: memo ?? null,
      },
    });

    const data: WasteRecord = {
      id: record.id,
      userId: record.userId,
      date: record.date.toISOString().split("T")[0],
      weightKg: Number(record.weightKg),
      bags: (record.bags as unknown as WasteRecord["bags"]) ?? { "5L": 0, "10L": 0, "20L": 0, "30L": 0, "50L": 0 },
      photoUrl: record.photoUrl,
      memo: record.memo,
      createdAt: record.createdAt,
    };

    return NextResponse.json<ApiSuccessResponse<WasteRecord>>(
      { success: true, data },
      { status: 201 }
    );
  } catch {
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: { code: "INTERNAL_ERROR", message: "배출 기록 저장에 실패했습니다." } },
      { status: 500 }
    );
  }
}
