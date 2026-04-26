// 배출량 기록 페이지 — 월별 요약 + 월 네비게이터 + 배출 기록 폼 + 타임라인 통합
// 요구사항: 7.1, 9.4

"use client";

import { useState, useEffect, useCallback } from "react";
import MonthlySummary from "@/components/log/MonthlySummary";
import MonthNavigator from "@/components/log/MonthNavigator";
import WasteRecordForm from "@/components/log/WasteRecordForm";
import WasteTimeline from "@/components/log/WasteTimeline";
import type { MonthlySummary as MonthlySummaryType, WasteRecord } from "@/lib/types";

/** 현재 월을 YYYY-MM 형식으로 반환 */
function getCurrentMonth(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

/** YYYY-MM 형식에서 이전 월 계산 */
function getPrevMonth(month: string): string {
  const [year, mon] = month.split("-").map(Number);
  const date = new Date(year, mon - 2, 1);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

/** YYYY-MM 형식에서 다음 월 계산 */
function getNextMonth(month: string): string {
  const [year, mon] = month.split("-").map(Number);
  const date = new Date(year, mon, 1);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

/** 기본 월별 요약 데이터 */
const DEFAULT_SUMMARY: MonthlySummaryType = {
  month: getCurrentMonth(),
  totalWeightKg: 0,
  totalBags: 0,
  recordCount: 0,
};

export default function LogPage() {
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());
  const [summary, setSummary] = useState<MonthlySummaryType>(DEFAULT_SUMMARY);
  const [records, setRecords] = useState<WasteRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 월별 요약 데이터 가져오기
  const fetchSummary = useCallback(async (month: string) => {
    try {
      const res = await fetch(`/api/waste-records/summary?month=${month}`);
      const result = await res.json();
      if (result.success) {
        setSummary(result.data);
      } else {
        setSummary({ ...DEFAULT_SUMMARY, month });
      }
    } catch {
      setSummary({ ...DEFAULT_SUMMARY, month });
    }
  }, []);

  // 월별 기록 데이터 가져오기
  const fetchRecords = useCallback(async (month: string) => {
    try {
      const res = await fetch(`/api/waste-records?month=${month}`);
      const result = await res.json();
      if (result.success) {
        setRecords(result.data);
      } else {
        setRecords([]);
      }
    } catch {
      setRecords([]);
    }
  }, []);

  // 월별 데이터 전체 가져오기
  const fetchData = useCallback(async (month: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([fetchSummary(month), fetchRecords(month)]);
    } catch {
      setError("데이터를 불러오는 데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [fetchSummary, fetchRecords]);

  // 초기 로드 및 월 변경 시 데이터 갱신
  useEffect(() => {
    fetchData(currentMonth);
  }, [currentMonth, fetchData]);

  // 이전 월 이동
  const handlePrevMonth = () => {
    setCurrentMonth(getPrevMonth(currentMonth));
  };

  // 다음 월 이동
  const handleNextMonth = () => {
    const next = getNextMonth(currentMonth);
    if (next <= getCurrentMonth()) {
      setCurrentMonth(next);
    }
  };

  // 기록 저장 후 데이터 갱신
  const handleSave = () => {
    fetchData(currentMonth);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto max-w-lg space-y-6">
        {/* 월 네비게이터 */}
        <MonthNavigator
          currentMonth={currentMonth}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />

        {/* 월별 요약 대시보드 */}
        {isLoading ? (
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl bg-white p-4 shadow-sm"
              >
                <div className="mx-auto h-3 w-12 rounded bg-gray-200" />
                <div className="mx-auto mt-2 h-6 w-8 rounded bg-gray-200" />
                <div className="mx-auto mt-1 h-3 w-6 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : (
          <MonthlySummary summary={summary} />
        )}

        {/* 에러 메시지 */}
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-700">
            {error}
            <button
              type="button"
              onClick={() => fetchData(currentMonth)}
              className="ml-2 font-medium text-red-800 underline"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* 배출 기록 입력 폼 */}
        <WasteRecordForm onSave={handleSave} />

        {/* 배출 타임라인 */}
        {isLoading ? (
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="animate-pulse">
              <div className="h-5 w-28 rounded bg-gray-200" />
              <div className="mt-4 space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-16 rounded-xl bg-gray-100" />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <WasteTimeline records={records} />
        )}
      </div>
    </div>
  );
}
