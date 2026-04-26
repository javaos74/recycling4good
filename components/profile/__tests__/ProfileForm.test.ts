// 프로필 수정 폼 관련 단위 테스트
// 프로필 유효성 검증 로직 및 드롭다운 옵션 생성 검증
// 요구사항: 2.1, 2.2

import { describe, it, expect } from "vitest";
import { VALID_REGIONS } from "@/lib/constants";
import { validateProfile } from "@/lib/validations";

// ProfileForm에서 사용하는 드롭다운 옵션 생성 로직
const regionOptions = VALID_REGIONS.map((region) => ({
  value: region,
  label: region,
}));

describe("프로필 수정 — 거주 지역 드롭다운 옵션", () => {
  it("17개 광역시/도 옵션이 생성된다", () => {
    expect(regionOptions).toHaveLength(17);
  });

  it("모든 VALID_REGIONS가 옵션에 포함된다", () => {
    const values = regionOptions.map((o) => o.value);
    for (const region of VALID_REGIONS) {
      expect(values).toContain(region);
    }
  });
});

describe("프로필 수정 — 유효성 검증", () => {
  it("유효한 닉네임과 거주 지역으로 프로필 수정이 가능하다", () => {
    const result = validateProfile("새닉네임", "부산광역시");
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("닉네임이 공백만으로 구성되면 수정할 수 없다", () => {
    const result = validateProfile("   ", "서울특별시");
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("닉네임"))).toBe(true);
  });

  it("닉네임이 20자를 초과하면 수정할 수 없다", () => {
    const longName = "가".repeat(21);
    const result = validateProfile(longName, "서울특별시");
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("20자"))).toBe(true);
  });

  it("유효하지 않은 거주 지역으로 수정할 수 없다", () => {
    const result = validateProfile("닉네임", "존재하지않는지역");
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("지역"))).toBe(true);
  });

  it("닉네임 1자도 유효하다", () => {
    const result = validateProfile("가", "경기도");
    expect(result.valid).toBe(true);
  });

  it("닉네임 20자도 유효하다", () => {
    const result = validateProfile("가".repeat(20), "경기도");
    expect(result.valid).toBe(true);
  });
});
