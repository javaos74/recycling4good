// 종량제봉투 크기별 개수 선택 컴포넌트
// 5L/10L/20L/30L/50L 봉투 크기별 +/- 버튼, 개수 최솟값 0 제한
// 요구사항: 8.2, 8.3, 8.4

"use client";

import { VALID_BAG_SIZES, type BagSize } from "@/lib/constants";
import type { BagCounts } from "@/lib/types";

interface BagSizeSelectorProps {
  /** 봉투 크기별 개수 */
  bags: BagCounts;
  /** 봉투 개수 변경 콜백 */
  onChange: (bags: BagCounts) => void;
}

export default function BagSizeSelector({ bags, onChange }: BagSizeSelectorProps) {
  // 특정 봉투 크기의 개수를 변경하는 핸들러
  const handleChange = (size: BagSize, delta: number) => {
    const current = bags[size] ?? 0;
    const next = Math.max(0, current + delta);
    onChange({ ...bags, [size]: next });
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        종량제봉투
      </label>
      <div className="space-y-2">
        {VALID_BAG_SIZES.map((size) => (
          <div
            key={size}
            className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
          >
            <span className="text-sm font-medium text-gray-700 w-12">{size}</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleChange(size, -1)}
                disabled={bags[size] <= 0}
                aria-label={`${size} 감소`}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-lg font-bold transition-colors ${
                  bags[size] <= 0
                    ? "cursor-not-allowed bg-gray-200 text-gray-400"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400 active:bg-gray-500"
                }`}
              >
                −
              </button>
              <span
                className="w-8 text-center text-base font-semibold text-gray-900"
                aria-label={`${size} 개수`}
              >
                {bags[size]}
              </span>
              <button
                type="button"
                onClick={() => handleChange(size, 1)}
                aria-label={`${size} 증가`}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-lg font-bold text-white transition-colors hover:bg-green-600 active:bg-green-700"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
