// 배출 기록 입력 폼 컴포넌트
// 날짜 선택, 무게 입력(kg), 종량제봉투 크기 선택, 사진 업로드, 메모 입력
// 요구사항: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9

"use client";

import { useState } from "react";
import { validateWasteRecord } from "@/lib/validations";
import type { BagCounts } from "@/lib/types";
import BagSizeSelector from "@/components/log/BagSizeSelector";
import PhotoUpload from "@/components/log/PhotoUpload";

interface WasteRecordFormProps {
  /** 저장 성공 시 콜백 (월별 요약 갱신 등) */
  onSave?: () => void;
}

/** 봉투 개수 초기값 */
const INITIAL_BAGS: BagCounts = {
  "5L": 0,
  "10L": 0,
  "20L": 0,
  "30L": 0,
  "50L": 0,
};

/** 오늘 날짜를 YYYY-MM-DD 형식으로 반환 */
function getTodayString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function WasteRecordForm({ onSave }: WasteRecordFormProps) {
  const [date, setDate] = useState(getTodayString());
  const [weightInput, setWeightInput] = useState("");
  const [bags, setBags] = useState<BagCounts>({ ...INITIAL_BAGS });
  const [photo, setPhoto] = useState<File | null>(null);
  const [memo, setMemo] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // 무게 입력 핸들러 — 숫자(소수점 포함)만 허용
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 빈 문자열이거나 유효한 숫자 패턴만 허용
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setWeightInput(value);
    }
  };

  // 폼 초기화
  const resetForm = () => {
    setDate(getTodayString());
    setWeightInput("");
    setBags({ ...INITIAL_BAGS });
    setPhoto(null);
    setMemo("");
    setErrors([]);
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSuccessMessage("");

    // 무게 파싱
    const weightKg = weightInput ? parseFloat(weightInput) : 0;

    // 클라이언트 유효성 검증
    const validation = validateWasteRecord(date, weightKg, bags);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/waste-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          weightKg,
          bags,
          memo: memo.trim() || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setErrors([result.error?.message ?? "기록 저장에 실패했습니다."]);
        return;
      }

      // 성공: 폼 초기화 + 성공 피드백
      resetForm();
      setSuccessMessage("배출 기록이 저장되었습니다!");
      onSave?.();

      // 3초 후 성공 메시지 숨김
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch {
      setErrors(["네트워크 오류가 발생했습니다. 다시 시도해주세요."]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900">이번 배출 기록하기</h2>

      {/* 성공 메시지 */}
      {successMessage && (
        <div role="alert" className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {/* 에러 메시지 */}
      {errors.length > 0 && (
        <div role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors.map((err, i) => (
            <p key={i}>{err}</p>
          ))}
        </div>
      )}

      {/* 날짜 선택 */}
      <div>
        <label htmlFor="waste-date" className="block text-sm font-medium text-gray-700">
          날짜 <span className="text-red-500">*</span>
        </label>
        <input
          id="waste-date"
          type="date"
          value={date}
          max={getTodayString()}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          required
        />
      </div>

      {/* 무게 입력 */}
      <div>
        <label htmlFor="waste-weight" className="block text-sm font-medium text-gray-700">
          무게 (kg)
        </label>
        <input
          id="waste-weight"
          type="text"
          inputMode="decimal"
          value={weightInput}
          onChange={handleWeightChange}
          placeholder="0.0"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        />
      </div>

      {/* 종량제봉투 선택 */}
      <BagSizeSelector bags={bags} onChange={setBags} />

      {/* 사진 업로드 */}
      <PhotoUpload file={photo} onChange={setPhoto} />

      {/* 메모 입력 */}
      <div>
        <label htmlFor="waste-memo" className="block text-sm font-medium text-gray-700">
          메모 (선택)
        </label>
        <textarea
          id="waste-memo"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="메모를 입력하세요"
          rows={2}
          className="mt-1 block w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
        />
      </div>

      {/* 저장 버튼 */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full rounded-lg py-3 text-base font-semibold text-white transition-colors ${
          isSubmitting
            ? "cursor-not-allowed bg-gray-400"
            : "bg-green-600 hover:bg-green-700 active:bg-green-800"
        }`}
      >
        {isSubmitting ? "저장 중..." : "+ 기록 저장하기"}
      </button>
    </form>
  );
}
