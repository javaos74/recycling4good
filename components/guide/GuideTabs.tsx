// 분리배출 가이드 탭 컴포넌트 — 클라이언트 컴포넌트
// "분리배출 가이드" / "배출량 입력" 두 개 탭 전환
// 요구사항: 5.3, 5.4, 5.5

"use client";

import { useState } from "react";
import type { ReactNode } from "react";

// 탭 ID 타입
export type GuideTabId = "guide" | "input";

// 탭 정의
export const GUIDE_TABS: { id: GuideTabId; label: string }[] = [
  { id: "guide", label: "분리배출 가이드" },
  { id: "input", label: "배출량 입력" },
];

interface GuideTabsProps {
  /** "분리배출 가이드" 탭 콘텐츠 */
  guideContent: ReactNode;
  /** "배출량 입력" 탭 콘텐츠 */
  inputContent: ReactNode;
}

export default function GuideTabs({
  guideContent,
  inputContent,
}: GuideTabsProps) {
  const [activeTab, setActiveTab] = useState<GuideTabId>("guide");

  return (
    <div>
      {/* 탭 버튼 영역 */}
      <div className="mb-4 flex rounded-lg bg-gray-100 p-1" role="tablist">
        {GUIDE_TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-white text-green-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 영역 */}
      <div
        id="tabpanel-guide"
        role="tabpanel"
        hidden={activeTab !== "guide"}
      >
        {activeTab === "guide" && guideContent}
      </div>
      <div
        id="tabpanel-input"
        role="tabpanel"
        hidden={activeTab !== "input"}
      >
        {activeTab === "input" && inputContent}
      </div>
    </div>
  );
}
