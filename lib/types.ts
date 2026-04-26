// 공통 API 응답 타입 정의

/** API 에러 응답 타입 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string; // "VALIDATION_ERROR" | "AUTH_ERROR" | "NOT_FOUND" | "INTERNAL_ERROR"
    message: string; // 사용자에게 표시할 한국어 메시지
  };
}

/** API 성공 응답 타입 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

/** API 응답 유니온 타입 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/** 사용자 프로필 인터페이스 */
export interface UserProfile {
  id: string;
  nickname: string | null;
  region: string | null; // 17개 광역시/도 중 하나
  isOnboarded: boolean; // 프로필 설정 완료 여부
  socialProvider: string; // "kakao" | "naver" | "google"
  createdAt: Date;
  updatedAt: Date;
}

/** 프로필 업데이트 요청 인터페이스 */
export interface ProfileUpdateRequest {
  nickname: string; // 1~20자, 공백만으로 구성 불가
  region: string; // VALID_REGIONS 중 하나
}

/** 종량제봉투 크기별 개수 인터페이스 */
export interface BagCounts {
  "5L": number;
  "10L": number;
  "20L": number;
  "30L": number;
  "50L": number;
}

/** 배출량 기록 인터페이스 */
export interface WasteRecord {
  id: string;
  userId: string;
  date: string; // "YYYY-MM-DD"
  weightKg: number; // 무게 (kg, 소수점 2자리)
  bags: BagCounts; // 종량제봉투 크기별 개수
  photoUrl: string | null; // 사진 URL
  memo: string | null; // 메모
  createdAt: Date;
}

/** 배출 기록 생성 요청 인터페이스 */
export interface WasteRecordCreateRequest {
  date: string; // "YYYY-MM-DD"
  weightKg: number; // 0 이상
  bags: BagCounts; // 각 값 >= 0, 무게가 0이면 최소 하나는 > 0
  memo?: string;
}

/** 월별 요약 인터페이스 */
export interface MonthlySummary {
  month: string; // "YYYY-MM"
  totalWeightKg: number; // 월별 총 무게
  totalBags: number; // 월별 종량제봉투 합계
  recordCount: number; // 월별 기록 횟수
}

/** 분리배출 가이드 — 오염도 단계 인터페이스 */
export interface ContaminationLevel {
  level: "low" | "medium" | "high"; // 약한/중간/심한
  label: string; // "🟢 약한 오염" | "🟡 중간 오염" | "🔴 심한 오염"
  description: string; // 오염도 설명
  action: string; // 처리 방법
}

/** 분리배출 가이드 — 재활용 카테고리 인터페이스 */
export interface RecyclingCategory {
  id: string;
  name: string; // "플라스틱" | "비닐" | "종이" | "스티로폼" | "유리" | "캔"
  icon: string; // 카테고리 아이콘
  items: string[]; // 품목 예시 목록
  tip: string; // 실용적 TIP
  levels: ContaminationLevel[];
}
