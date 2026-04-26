// 배출 타임라인 컴포넌트
// 현재 선택 월의 기록을 날짜 역순으로 표시
// 각 기록: 날짜(한국어 형식), 무게(kg), 종량제봉투 크기별 개수
// 요구사항: 9.1, 9.2, 9.3, 9.4, 9.5

"use client";

import type { WasteRecord, BagCounts } from "@/lib/types";

interface WasteTimelineProps {
  records: WasteRecord[];
}

/** 종량제봉투 크기 목록 */
const BAG_SIZES: (keyof BagCounts)[] = ["5L", "10L", "20L", "30L", "50L"];

/** 날짜 문자열을 한국어 형식으로 변환 (예: "2025-01-15" → "1월 15일") */
function formatDateKorean(dateStr: string): string {
  const [, month, day] = dateStr.split("-").map(Number);
  return `${month}월 ${day}일`;
}

/** 봉투 정보에서 개수가 0보다 큰 항목만 문자열로 반환 */
function formatBags(bags: BagCounts): string[] {
  return BAG_SIZES
    .filter((size) => bags[size] > 0)
    .map((size) => `${size} × ${bags[size]}`);
}

export default function WasteTimeline({ records }: WasteTimelineProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      {/* 헤더: 제목 + 기록 횟수 배지 */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">배출 타임라인</h2>
        {records.length > 0 && (
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
            {records.length}건
          </span>
        )}
      </div>

      {/* 빈 상태 메시지 */}
      {records.length === 0 ? (
        <div className="mt-6 flex items-center justify-center py-8">
          <p className="text-sm text-gray-400">기록이 없습니다</p>
        </div>
      ) : (
        /* 기록 목록 — 날짜 역순 (이미 정렬된 상태로 전달됨) */
        <ul className="mt-4 space-y-3">
          {records.map((record) => {
            const bagLabels = formatBags(record.bags);
            return (
              <li
                key={record.id}
                className="rounded-xl border border-gray-100 p-4"
              >
                {/* 날짜 + 무게 */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-800">
                    {formatDateKorean(record.date)}
                  </span>
                  <span className="text-sm font-bold text-green-600">
                    {record.weightKg}kg
                  </span>
                </div>

                {/* 종량제봉투 정보 */}
                {bagLabels.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {bagLabels.map((label) => (
                      <span
                        key={label}
                        className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
