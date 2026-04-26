// 월 이동 네비게이터 컴포넌트
// 좌/우 화살표로 월 이동, 현재 월보다 미래 월 이동 불가
// 요구사항: 7.2, 7.3, 7.4

"use client";

interface MonthNavigatorProps {
  /** 현재 선택된 월 (YYYY-MM 형식) */
  currentMonth: string;
  /** 이전 월로 이동 콜백 */
  onPrevMonth: () => void;
  /** 다음 월로 이동 콜백 */
  onNextMonth: () => void;
}

/**
 * YYYY-MM 형식의 월 문자열을 한국어 형식으로 변환합니다.
 * 예: "2025-04" → "2025년 4월"
 */
function formatMonthKorean(month: string): string {
  const [year, monthNum] = month.split("-");
  return `${year}년 ${parseInt(monthNum, 10)}월`;
}

/**
 * 현재 실제 월을 YYYY-MM 형식으로 반환합니다.
 */
function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export default function MonthNavigator({
  currentMonth,
  onPrevMonth,
  onNextMonth,
}: MonthNavigatorProps) {
  // 현재 월이면 우측 화살표 비활성화 (미래 월 이동 불가)
  const isCurrentMonth = currentMonth >= getCurrentMonth();

  return (
    <div className="flex items-center justify-center gap-4 py-3">
      <button
        type="button"
        onClick={onPrevMonth}
        aria-label="이전 월"
        className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 active:bg-gray-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <span className="min-w-[120px] text-center text-lg font-semibold text-gray-800">
        {formatMonthKorean(currentMonth)}
      </span>

      <button
        type="button"
        onClick={onNextMonth}
        disabled={isCurrentMonth}
        aria-label="다음 월"
        className={`rounded-full p-2 transition-colors ${
          isCurrentMonth
            ? "cursor-not-allowed text-gray-300"
            : "text-gray-600 hover:bg-gray-100 active:bg-gray-200"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
