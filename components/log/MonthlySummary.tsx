// 월별 요약 대시보드 컴포넌트
// 이번달 총 무게(kg), 종량제봉투 합계(개), 기록 횟수(회) 3가지 지표 카드 표시
// 요구사항: 7.1, 7.5

"use client";

import type { MonthlySummary as MonthlySummaryType } from "@/lib/types";

interface MonthlySummaryProps {
  summary: MonthlySummaryType;
}

/** 지표 카드 데이터 */
interface MetricCard {
  label: string;
  value: number;
  unit: string;
}

export default function MonthlySummary({ summary }: MonthlySummaryProps) {
  // 3가지 지표 카드 정의
  const metrics: MetricCard[] = [
    { label: "총 무게", value: summary.totalWeightKg, unit: "kg" },
    { label: "종량제봉투", value: summary.totalBags, unit: "개" },
    { label: "기록 횟수", value: summary.recordCount, unit: "회" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="rounded-xl bg-white p-4 text-center shadow-sm"
        >
          <p className="text-xs text-gray-500">{metric.label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {metric.value}
          </p>
          <p className="text-sm text-gray-400">{metric.unit}</p>
        </div>
      ))}
    </div>
  );
}
