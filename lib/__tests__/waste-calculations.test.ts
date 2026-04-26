// 월별 집계 유틸리티 함수 단위 테스트

import { describe, it, expect } from "vitest";
import { calculateMonthlySummary } from "@/lib/waste-calculations";
import type { WasteRecord } from "@/lib/types";

// 테스트용 WasteRecord 헬퍼 함수
function makeRecord(
  overrides: Partial<WasteRecord> = {}
): WasteRecord {
  return {
    id: "test-id",
    userId: "user-1",
    date: "2025-01-15",
    weightKg: 0,
    bags: { "5L": 0, "10L": 0, "20L": 0, "30L": 0, "50L": 0 },
    photoUrl: null,
    memo: null,
    createdAt: new Date(),
    ...overrides,
  };
}

describe("calculateMonthlySummary", () => {
  it("빈 배열이면 모든 지표를 0으로 반환한다", () => {
    const result = calculateMonthlySummary([]);

    expect(result).toEqual({
      totalWeightKg: 0,
      totalBags: 0,
      recordCount: 0,
    });
  });

  it("단일 기록의 무게와 봉투를 정확히 반환한다", () => {
    const records = [
      makeRecord({
        weightKg: 3.5,
        bags: { "5L": 1, "10L": 0, "20L": 2, "30L": 0, "50L": 0 },
      }),
    ];

    const result = calculateMonthlySummary(records);

    expect(result.totalWeightKg).toBe(3.5);
    expect(result.totalBags).toBe(3); // 1 + 0 + 2 + 0 + 0
    expect(result.recordCount).toBe(1);
  });

  it("여러 기록의 무게를 합산한다", () => {
    const records = [
      makeRecord({ weightKg: 1.5 }),
      makeRecord({ weightKg: 2.3 }),
      makeRecord({ weightKg: 0.7 }),
    ];

    const result = calculateMonthlySummary(records);

    expect(result.totalWeightKg).toBe(4.5);
    expect(result.recordCount).toBe(3);
  });

  it("여러 기록의 봉투 개수를 합산한다", () => {
    const records = [
      makeRecord({
        bags: { "5L": 2, "10L": 1, "20L": 0, "30L": 0, "50L": 0 },
      }),
      makeRecord({
        bags: { "5L": 0, "10L": 0, "20L": 1, "30L": 3, "50L": 1 },
      }),
    ];

    const result = calculateMonthlySummary(records);

    expect(result.totalBags).toBe(8); // (2+1) + (1+3+1)
  });

  it("소수점 무게를 정확히 합산하고 2자리로 반올림한다", () => {
    const records = [
      makeRecord({ weightKg: 0.1 }),
      makeRecord({ weightKg: 0.2 }),
    ];

    const result = calculateMonthlySummary(records);

    // 부동소수점 오차 방지: 0.1 + 0.2 = 0.30000000000000004 → 0.3
    expect(result.totalWeightKg).toBe(0.3);
  });

  it("무게가 0이고 봉투만 있는 기록도 정상 처리한다", () => {
    const records = [
      makeRecord({
        weightKg: 0,
        bags: { "5L": 0, "10L": 0, "20L": 1, "30L": 0, "50L": 0 },
      }),
    ];

    const result = calculateMonthlySummary(records);

    expect(result.totalWeightKg).toBe(0);
    expect(result.totalBags).toBe(1);
    expect(result.recordCount).toBe(1);
  });

  it("모든 봉투 크기에 값이 있는 경우 전체 합산한다", () => {
    const records = [
      makeRecord({
        bags: { "5L": 1, "10L": 2, "20L": 3, "30L": 4, "50L": 5 },
      }),
    ];

    const result = calculateMonthlySummary(records);

    expect(result.totalBags).toBe(15); // 1+2+3+4+5
  });
});
