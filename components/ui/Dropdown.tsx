"use client";

// 범용 드롭다운 컴포넌트
// 재사용 가능한 제네릭 드롭다운 — 옵션 목록에서 하나를 선택
// 모바일 우선 반응형 디자인, 접근성(aria) 지원

import { useState, useRef, useEffect, useCallback } from "react";

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  /** 드롭다운 라벨 */
  label?: string;
  /** 선택 가능한 옵션 목록 */
  options: DropdownOption[];
  /** 현재 선택된 값 */
  value: string;
  /** 값 변경 핸들러 */
  onChange: (value: string) => void;
  /** 플레이스홀더 텍스트 */
  placeholder?: string;
  /** 에러 메시지 */
  error?: string;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 고유 ID */
  id?: string;
}

export default function Dropdown({
  label,
  options,
  value,
  onChange,
  placeholder = "선택해주세요",
  error,
  disabled = false,
  id,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 선택된 옵션의 라벨 표시
  const selectedOption = options.find((opt) => opt.value === value);

  // 외부 클릭 시 드롭다운 닫기
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  // 키보드 접근성 — Escape로 닫기
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // 옵션 선택 핸들러
  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const dropdownId = id || "dropdown";
  const listboxId = `${dropdownId}-listbox`;

  return (
    <div className="w-full" ref={dropdownRef} onKeyDown={handleKeyDown}>
      {/* 라벨 */}
      {label && (
        <label
          htmlFor={dropdownId}
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      {/* 드롭다운 트리거 버튼 */}
      <button
        type="button"
        id={dropdownId}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-label={label || placeholder}
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${
          error
            ? "border-red-400 bg-red-50"
            : "border-gray-300 bg-white hover:border-gray-400"
        } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
      >
        <span className={selectedOption ? "text-gray-900" : "text-gray-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        {/* 화살표 아이콘 */}
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 옵션 목록 */}
      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={label || placeholder}
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
          style={{ width: dropdownRef.current?.offsetWidth }}
        >
          {options.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              onClick={() => handleSelect(option.value)}
              className={`cursor-pointer px-4 py-2.5 text-sm transition-colors hover:bg-green-50 ${
                option.value === value
                  ? "bg-green-50 font-medium text-green-700"
                  : "text-gray-700"
              }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}

      {/* 에러 메시지 */}
      {error && (
        <p className="mt-1 text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
