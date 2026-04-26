// 범용 아코디언 컴포넌트 — 클라이언트 컴포넌트
// 펼침/접힘 토글 기능, 접근성(aria) 지원
// 요구사항: 6.7

"use client";

import { useState, useCallback } from "react";
import type { ReactNode } from "react";

interface AccordionProps {
  /** 아코디언 헤더 영역 (항상 표시) */
  header: ReactNode;
  /** 아코디언 본문 영역 (펼침 시 표시) */
  children: ReactNode;
  /** 초기 펼침 상태 */
  defaultOpen?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
}

export default function Accordion({
  header,
  children,
  defaultOpen = false,
  className = "",
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // 토글 핸들러
  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <div className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}>
      {/* 헤더 — 클릭으로 토글 */}
      <button
        type="button"
        role="button"
        aria-expanded={isOpen}
        onClick={handleToggle}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-50"
      >
        <div className="flex-1">{header}</div>
        {/* 화살표 아이콘 */}
        <span
          className={`ml-2 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          ▼
        </span>
      </button>

      {/* 본문 — 펼침 시 표시 */}
      {isOpen && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3">
          {children}
        </div>
      )}
    </div>
  );
}
