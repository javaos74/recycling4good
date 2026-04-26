// 온보딩 폼 관련 단위 테스트
// 거주 지역 드롭다운 옵션 생성 및 유효성 검증 로직 검증
// 요구사항: 1.5, 1.6, 1.7

import { describe, it, expect } from "vitest";
import { VALID_REGIONS } from "@/lib/constants";
import { validateProfile } from "@/lib/validations";

// 드롭다운 옵션 생성 로직 (OnboardingForm에서 사용하는 것과 동일)
const regionOptions = VALID_REGIONS.map((region) => ({
  value: region,
  label: region,
}));

describe("온보딩 거주 지역 드롭다운 옵션", () => {
  it("17개 광역시/도 옵션이 생성된다", () => {
    expect(regionOptions).toHaveLength(17);
  });

  it("각 옵션의 value와 label이 동일하다", () => {
    for (const option of regionOptions) {
      expect(option.value).toBe(option.label);
    }
  });

  it("서울특별시가 옵션에 포함된다", () => {
    expect(regionOptions.some((o) => o.value === "서울특별시")).toBe(true);
  });

  it("제주특별자치도가 옵션에 포함된다", () => {
    expect(regionOptions.some((o) => o.value === "제주특별자치도")).toBe(true);
  });
});

describe("온보딩 폼 제출 유효성 검증", () => {
  it("닉네임과 거주 지역 모두 유효하면 통과한다", () => {
    const result = validateProfile("테스트유저", "서울특별시");
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("닉네임이 비어있으면 제출할 수 없다", () => {
    const result = validateProfile("", "서울특별시");
    expect(result.valid).toBe(false);
  });

  it("거주 지역이 비어있으면 제출할 수 없다", () => {
    const result = validateProfile("테스트유저", "");
    expect(result.valid).toBe(false);
  });

  it("닉네임과 거주 지역 모두 비어있으면 제출할 수 없다", () => {
    const result = validateProfile("", "");
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(2);
  });

  it("모든 17개 지역이 유효한 거주 지역으로 인정된다", () => {
    for (const region of VALID_REGIONS) {
      const result = validateProfile("닉네임", region);
      expect(result.valid).toBe(true);
    }
  });
});
