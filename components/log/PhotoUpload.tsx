// 사진 업로드 컴포넌트
// 카메라 촬영 또는 이미지 갤러리 선택 지원
// 요구사항: 8.5

"use client";

import { useRef } from "react";

interface PhotoUploadProps {
  /** 선택된 파일 */
  file: File | null;
  /** 파일 변경 콜백 */
  onChange: (file: File | null) => void;
}

export default function PhotoUpload({ file, onChange }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    onChange(selected);
  };

  // 업로드 영역 클릭 시 파일 입력 트리거
  const handleClick = () => {
    inputRef.current?.click();
  };

  // 선택된 파일 제거
  const handleRemove = () => {
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        사진 (선택)
      </label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        aria-label="사진 업로드"
      />
      {file ? (
        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
          <span className="truncate text-sm text-gray-600">{file.name}</span>
          <button
            type="button"
            onClick={handleRemove}
            aria-label="사진 제거"
            className="ml-2 text-sm text-red-500 hover:text-red-700"
          >
            삭제
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-6 text-gray-500 transition-colors hover:border-green-400 hover:text-green-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm">사진 촬영 또는 갤러리에서 선택</span>
        </button>
      )}
    </div>
  );
}
