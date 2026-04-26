// 유효성 검증 함수 단위 테스트

import { describe, it, expect } from "vitest";
import { validateProfile, validateWasteRecord } from "@/lib/validations";

describe("validateProfile", () => {
  // 유효한 입력 케이스
  it("유효한 닉네임과 거주 지역이면 통과한다", () => {
    const result = validateProfile("홍길동", "서울특별시");
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("1자 닉네임도 통과한다", () => {
    const result = validateProfile("김", "경기도");
    expect(result.valid).toBe(true);
  });

  it("20자 닉네임도 통과한다", () => {
    const result = validateProfile("가".repeat(20), "제주특별자치도");
    expect(result.valid).toBe(true);
  });

  // 닉네임 실패 케이스
  it("빈 닉네임이면 실패한다", () => {
    const result = validateProfile("", "서울특별시");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("닉네임을 입력해주세요.");
  });

  it("공백만 있는 닉네임이면 실패한다", () => {
    const result = validateProfile("   ", "서울특별시");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("닉네임을 입력해주세요.");
  });

  it("21자 이상 닉네임이면 실패한다", () => {
    const result = validateProfile("가".repeat(21), "서울특별시");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("닉네임은 20자 이내로 입력해주세요.");
  });

  // 거주 지역 실패 케이스
  it("빈 거주 지역이면 실패한다", () => {
    const result = validateProfile("홍길동", "");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("거주 지역을 선택해주세요.");
  });

  it("유효하지 않은 거주 지역이면 실패한다", () => {
    const result = validateProfile("홍길동", "뉴욕시");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("유효하지 않은 거주 지역입니다.");
  });

  // 복합 실패 케이스
  it("닉네임과 거주 지역 모두 유효하지 않으면 에러 2개 반환", () => {
    const result = validateProfile("", "");
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(2);
  });
});

describe("validateWasteRecord", () => {
  // 유효한 입력 케이스
  it("날짜와 무게가 있으면 통과한다", () => {
    const result = validateWasteRecord("2025-01-15", 2.5, null);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("날짜와 봉투 개수가 있으면 통과한다", () => {
    const result = validateWasteRecord("2025-01-15", 0, {
      "5L": 0, "10L": 1, "20L": 0, "30L": 0, "50L": 0,
    });
    expect(result.valid).toBe(true);
  });

  it("무게와 봉투 모두 있으면 통과한다", () => {
    const result = validateWasteRecord("2025-01-15", 3.0, {
      "5L": 0, "10L": 0, "20L": 1, "30L": 0, "50L": 0,
    });
    expect(result.valid).toBe(true);
  });

  // 날짜 실패 케이스
  it("날짜가 비어있으면 실패한다", () => {
    const result = validateWasteRecord("", 2.5, null);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("날짜를 선택해주세요.");
  });

  it("날짜 형식이 잘못되면 실패한다", () => {
    const result = validateWasteRecord("2025/01/15", 2.5, null);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)");
  });

  // 무게/봉투 필수 입력 실패 케이스
  it("무게와 봉투 모두 없으면 실패한다", () => {
    const result = validateWasteRecord("2025-01-15", 0, null);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("무게 또는 종량제봉투 중 하나 이상을 입력해주세요.");
  });

  it("무게가 0이고 봉투도 모두 0이면 실패한다", () => {
    const result = validateWasteRecord("2025-01-15", 0, {
      "5L": 0, "10L": 0, "20L": 0, "30L": 0, "50L": 0,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("무게 또는 종량제봉투 중 하나 이상을 입력해주세요.");
  });

  // 음수 무게 케이스
  it("무게가 음수이면 실패한다", () => {
    const result = validateWasteRecord("2025-01-15", -1, null);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("무게는 0 이상이어야 합니다.");
  });
});
