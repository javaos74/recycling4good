// 배출량 월별 집계 유틸리티 함수

import type { WasteRecord, MonthlySummary, BagCounts } from "@/lib/types";

/**
 * 월별 배출량 요약을 계산합니다.
 * - 총 무게(kg) 합산
 * - 종량제봉투 전체 합계
 * - 기록 횟수
 *
 * 빈 배열이 전달되면 모든 지표를 0으로 반환합니다.
 *
 * @param records - WasteRecord 배열
 * @returns 총 무게, 봉투 합계, 기록 횟수를 포함한 객체
 */
export function calculateMonthlySummary(
  records: WasteRecord[]
): Omit<MonthlySummary, "month"> {
  // 기록이 없는 경우 모든 지표 0 반환
  if (records.length === 0) {
    return {
      totalWeightKg: 0,
      totalBags: 0,
      recordCount: 0,
    };
  }

  // 총 무게 합산 (소수점 2자리 반올림)
  const totalWeightKg = records.reduce(
    (sum, record) => sum + Number(record.weightKg),
    0
  );

  // 종량제봉투 전체 합계 계산
  const totalBags = records.reduce((sum, record) => {
    const bags: BagCounts = record.bags;
    return (
      sum +
      Object.values(bags).reduce(
        (bagSum: number, count: number) => bagSum + (count || 0),
        0
      )
    );
  }, 0);

  return {
    totalWeightKg: Math.round(totalWeightKg * 100) / 100,
    totalBags,
    recordCount: records.length,
  };
}
