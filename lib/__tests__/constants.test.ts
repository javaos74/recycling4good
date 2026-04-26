// 상수 정의 단위 테스트

import { describe, it, expect } from "vitest";
import { VALID_REGIONS, VALID_BAG_SIZES } from "@/lib/constants";

describe("VALID_REGIONS", () => {
  it("17개 광역시/도가 정의되어 있다", () => {
    expect(VALID_REGIONS).toHaveLength(17);
  });

  it("모든 17개 광역시/도가 포함되어 있다", () => {
    const expected = [
      "서울특별시", "부산광역시", "대구광역시", "인천광역시",
      "광주광역시", "대전광역시", "울산광역시", "세종특별자치시",
      "경기도", "강원특별자치도", "충청북도", "충청남도",
      "전북특별자치도", "전라남도", "경상북도", "경상남도",
      "제주특별자치도",
    ];
    for (const region of expected) {
      expect(VALID_REGIONS).toContain(region);
    }
  });
});

describe("VALID_BAG_SIZES", () => {
  it("5개 종량제봉투 크기가 정의되어 있다", () => {
    expect(VALID_BAG_SIZES).toHaveLength(5);
  });

  it("올바른 크기 목록이 포함되어 있다", () => {
    expect(VALID_BAG_SIZES).toEqual(["5L", "10L", "20L", "30L", "50L"]);
  });
});
