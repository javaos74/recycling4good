// 오염도 단계별 처리 방법 표시 컴포넌트 — 클라이언트 컴포넌트
// 🟢 약한 오염 / 🟡 중간 오염 / 🔴 심한 오염 색상 구분 + 예시 이미지
// 요구사항: 6.3, 6.4

"use client";

import { useState } from "react";
import type { ContaminationLevel as ContaminationLevelType } from "@/lib/types";

/** 오염도 레벨별 색상 매핑 */
const LEVEL_STYLES: Record<string, { bg: string; border: string; text: string }> = {
  low: { bg: "bg-green-50", border: "border-green-200", text: "text-green-800" },
  medium: { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-800" },
  high: { bg: "bg-red-50", border: "border-red-200", text: "text-red-800" },
};

/** 오염도 레벨별 아이콘 매핑 */
export const LEVEL_ICONS: Record<string, string> = {
  low: "🟢",
  medium: "🟡",
  high: "🔴",
};

interface ContaminationLevelProps {
  /** 오염도 단계 데이터 */
  level: ContaminationLevelType;
}

export default function ContaminationLevel({ level }: ContaminationLevelProps) {
  const style = LEVEL_STYLES[level.level] ?? LEVEL_STYLES.low;
  const icon = LEVEL_ICONS[level.level] ?? "⚪";
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`rounded-lg border p-3 ${style.bg} ${style.border}`}
      data-testid={`contamination-${level.level}`}
    >
      {/* 레벨 라벨 */}
      <div className={`mb-1 text-sm font-semibold ${style.text}`}>
        <span aria-hidden="true">{icon}</span>{" "}
        {level.label.replace(/^[🟢🟡🔴]\s*/, "")}
      </div>

      {/* 오염도 예시 이미지 — 이미지가 있고 로드 실패하지 않은 경우 표시 */}
      {level.imageUrl && !imgError && (
        <div className="my-2 overflow-hidden rounded-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={level.imageUrl}
            alt={`${level.label} 예시`}
            className="h-auto w-full object-cover"
            onError={() => setImgError(true)}
          />
        </div>
      )}

      {/* 오염도 설명 */}
      <p className="mb-1 text-xs text-gray-500">{level.description}</p>
      {/* 처리 방법 */}
      <p className={`text-sm font-medium ${style.text}`}>{level.action}</p>
    </div>
  );
}
