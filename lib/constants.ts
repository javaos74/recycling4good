// 앱 전역 상수 정의

/** 17개 광역시/도 목록 */
export const VALID_REGIONS = [
  "서울특별시",
  "부산광역시",
  "대구광역시",
  "인천광역시",
  "광주광역시",
  "대전광역시",
  "울산광역시",
  "세종특별자치시",
  "경기도",
  "강원특별자치도",
  "충청북도",
  "충청남도",
  "전북특별자치도",
  "전라남도",
  "경상북도",
  "경상남도",
  "제주특별자치도",
] as const;

/** 거주 지역 타입 */
export type Region = (typeof VALID_REGIONS)[number];

/** 종량제봉투 크기 목록 */
export const VALID_BAG_SIZES = ["5L", "10L", "20L", "30L", "50L"] as const;

/** 종량제봉투 크기 타입 */
export type BagSize = (typeof VALID_BAG_SIZES)[number];
