"use client";

// 범용 확인 다이얼로그 컴포넌트
// 확인/취소 액션을 가진 모달 다이얼로그
// 파괴적 액션(destructive) 스타일 지원
// 모바일 우선 반응형 디자인, 접근성(aria) 지원

import { useEffect, useRef, useCallback } from "react";

interface DialogProps {
  /** 다이얼로그 표시 여부 */
  isOpen: boolean;
  /** 다이얼로그 제목 */
  title: string;
  /** 다이얼로그 본문 (문자열 또는 React 노드) */
  children: React.ReactNode;
  /** 확인 버튼 텍스트 */
  confirmLabel?: string;
  /** 취소 버튼 텍스트 */
  cancelLabel?: string;
  /** 확인 버튼 클릭 핸들러 */
  onConfirm: () => void;
  /** 취소/닫기 핸들러 */
  onCancel: () => void;
  /** 파괴적 액션 여부 (빨간색 스타일 적용) */
  destructive?: boolean;
  /** 확인 버튼 비활성화 여부 */
  isConfirmDisabled?: boolean;
}

export default function Dialog({
  isOpen,
  title,
  children,
  confirmLabel = "확인",
  cancelLabel = "취소",
  onConfirm,
  onCancel,
  destructive = false,
  isConfirmDisabled = false,
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  // 다이얼로그 열릴 때 취소 버튼에 포커스
  useEffect(() => {
    if (isOpen) {
      cancelButtonRef.current?.focus();
    }
  }, [isOpen]);

  // Escape 키로 닫기
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    },
    [onCancel]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // 배경 스크롤 방지
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  // 오버레이 클릭 시 닫기
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      onClick={handleOverlayClick}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
      >
        {/* 제목 */}
        <h2
          id="dialog-title"
          className="mb-3 text-lg font-bold text-gray-900"
        >
          {title}
        </h2>

        {/* 본문 */}
        <div className="mb-6 text-sm text-gray-600">{children}</div>

        {/* 버튼 영역 */}
        <div className="flex gap-3">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirmDisabled}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              destructive
                ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
