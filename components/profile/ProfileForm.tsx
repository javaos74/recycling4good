"use client";

// 프로필 수정 폼 컴포넌트
// 닉네임 변경, 거주 지역 변경 기능 제공
// PUT /api/profile 호출로 프로필 업데이트
// 요구사항: 2.1, 2.2

import { useState } from "react";
import Dropdown, { type DropdownOption } from "@/components/ui/Dropdown";
import { VALID_REGIONS } from "@/lib/constants";
import { validateProfile } from "@/lib/validations";

// 거주 지역 드롭다운 옵션 생성
const regionOptions: DropdownOption[] = VALID_REGIONS.map((region) => ({
  value: region,
  label: region,
}));

interface ProfileFormProps {
  /** 현재 닉네임 */
  initialNickname: string;
  /** 현재 거주 지역 */
  initialRegion: string;
  /** 프로필 업데이트 성공 콜백 */
  onSuccess?: () => void;
}

export default function ProfileForm({
  initialNickname,
  initialRegion,
  onSuccess,
}: ProfileFormProps) {
  const [nickname, setNickname] = useState(initialNickname);
  const [region, setRegion] = useState(initialRegion);
  const [errors, setErrors] = useState<{ nickname?: string; region?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    // 클라이언트 유효성 검증
    const validation = validateProfile(nickname, region);
    if (!validation.valid) {
      const newErrors: { nickname?: string; region?: string } = {};
      for (const err of validation.errors) {
        if (err.includes("닉네임")) {
          newErrors.nickname = err;
        } else if (err.includes("지역")) {
          newErrors.region = err;
        }
      }
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: nickname.trim(), region }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setFeedback({
          type: "error",
          message: data.error?.message || "프로필 저장에 실패했습니다. 다시 시도해주세요.",
        });
        return;
      }

      setFeedback({ type: "success", message: "프로필이 저장되었습니다." });
      onSuccess?.();
    } catch {
      setFeedback({
        type: "error",
        message: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 피드백 메시지 */}
      {feedback && (
        <div
          role="alert"
          className={`rounded-lg border px-4 py-3 text-sm ${
            feedback.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* 닉네임 입력 */}
      <div>
        <label
          htmlFor="profile-nickname"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          닉네임
        </label>
        <input
          id="profile-nickname"
          type="text"
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value);
            if (errors.nickname) setErrors((prev) => ({ ...prev, nickname: undefined }));
          }}
          placeholder="닉네임을 입력해주세요 (1~20자)"
          maxLength={20}
          className={`w-full rounded-lg border px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.nickname
              ? "border-red-400 bg-red-50"
              : "border-gray-300 bg-white hover:border-gray-400"
          }`}
        />
        {errors.nickname && (
          <p className="mt-1 text-xs text-red-500" role="alert">
            {errors.nickname}
          </p>
        )}
      </div>

      {/* 거주 지역 드롭다운 */}
      <div className="relative">
        <Dropdown
          id="profile-region"
          label="거주 지역"
          options={regionOptions}
          value={region}
          onChange={(val) => {
            setRegion(val);
            if (errors.region) setErrors((prev) => ({ ...prev, region: undefined }));
          }}
          placeholder="거주 지역을 선택해주세요"
          error={errors.region}
        />
      </div>

      {/* 저장 버튼 */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "저장 중..." : "프로필 저장"}
      </button>
    </form>
  );
}
