"use client";

// 온보딩 폼 컴포넌트
// 닉네임 입력(1~20자, 공백만 불가) + 거주 지역 드롭다운(17개 광역시/도)
// 제출 시 POST /api/profile/onboarding → 성공 시 가이드 페이지로 리다이렉트
// 요구사항: 1.5, 1.6, 1.7

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Dropdown, { type DropdownOption } from "@/components/ui/Dropdown";
import { VALID_REGIONS } from "@/lib/constants";
import { validateProfile } from "@/lib/validations";

// 거주 지역 드롭다운 옵션 생성
const regionOptions: DropdownOption[] = VALID_REGIONS.map((region) => ({
  value: region,
  label: region,
}));

export default function OnboardingForm() {
  const router = useRouter();
  const { update: updateSession } = useSession();

  const [nickname, setNickname] = useState("");
  const [region, setRegion] = useState("");
  const [errors, setErrors] = useState<{ nickname?: string; region?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

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
      const res = await fetch("/api/profile/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: nickname.trim(), region }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setServerError(
          data.error?.message || "프로필 저장에 실패했습니다. 다시 시도해주세요."
        );
        return;
      }

      // 성공 시 전체 페이지 새로고침으로 가이드 페이지 이동
      // 새로운 요청에서 JWT 토큰이 갱신되어 미들웨어가 isOnboarded=true를 인식
      window.location.href = "/guide";
    } catch (error) {
      console.error("온보딩 폼 제출 오류:", error);
      setServerError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto space-y-6">
      {/* 서버 에러 메시지 */}
      {serverError && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
        >
          {serverError}
        </div>
      )}

      {/* 닉네임 입력 */}
      <div>
        <label
          htmlFor="nickname"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          닉네임
        </label>
        <input
          id="nickname"
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
          id="region"
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

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "저장 중..." : "시작하기"}
      </button>
    </form>
  );
}
