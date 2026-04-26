// 유효성 검증 함수 모음

import { VALID_REGIONS, VALID_BAG_SIZES } from "@/lib/constants";
import type { BagCounts } from "@/lib/types";

/** 유효성 검증 결과 인터페이스 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * 프로필 유효성 검증
 * - 닉네임: 1~20자, 공백만으로 구성 불가
 * - 거주 지역: 17개 광역시/도 목록에 포함
 */
export function validateProfile(nickname: string, region: string): ValidationResult {
  const errors: string[] = [];

  // 닉네임 검증
  if (!nickname || nickname.trim().length === 0) {
    errors.push("닉네임을 입력해주세요.");
  } else if (nickname.length > 20) {
    errors.push("닉네임은 20자 이내로 입력해주세요.");
  }

  // 거주 지역 검증
  if (!region) {
    errors.push("거주 지역을 선택해주세요.");
  } else if (!(VALID_REGIONS as readonly string[]).includes(region)) {
    errors.push("유효하지 않은 거주 지역입니다.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 배출 기록 유효성 검증
 * - 날짜: 필수 (YYYY-MM-DD 형식)
 * - 무게(weightKg) 또는 종량제봉투 중 하나 이상 입력 필수
 * - 무게는 숫자여야 함 (소수점 포함)
 * - 종량제봉투 개수는 0 이상
 */
export function validateWasteRecord(
  date: string,
  weightKg: number | undefined | null,
  bags: Partial<BagCounts> | undefined | null
): ValidationResult {
  const errors: string[] = [];

  // 날짜 검증
  if (!date || date.trim().length === 0) {
    errors.push("날짜를 선택해주세요.");
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.push("날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)");
  }

  // 무게 검증 — 입력된 경우 숫자인지 확인
  const hasWeight = weightKg !== undefined && weightKg !== null && weightKg > 0;
  if (weightKg !== undefined && weightKg !== null && weightKg !== 0) {
    if (typeof weightKg !== "number" || isNaN(weightKg)) {
      errors.push("숫자만 입력 가능합니다.");
    } else if (weightKg < 0) {
      errors.push("무게는 0 이상이어야 합니다.");
    }
  }

  // 종량제봉투 검증 — 입력된 경우 각 값이 0 이상인지 확인
  let hasBags = false;
  if (bags) {
    for (const size of VALID_BAG_SIZES) {
      const count = bags[size];
      if (count !== undefined && count !== null) {
        if (typeof count !== "number" || isNaN(count)) {
          errors.push(`${size} 봉투 개수는 숫자여야 합니다.`);
        } else if (count < 0) {
          errors.push(`${size} 봉투 개수는 0 이상이어야 합니다.`);
        } else if (count > 0) {
          hasBags = true;
        }
      }
    }
  }

  // 무게 또는 봉투 중 하나 이상 입력 필수
  if (!hasWeight && !hasBags) {
    errors.push("무게 또는 종량제봉투 중 하나 이상을 입력해주세요.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
