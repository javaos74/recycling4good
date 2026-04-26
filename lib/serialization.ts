import { z } from "zod";
import type { WasteRecord, BagCounts } from "./types";

// 종량제봉투 크기별 개수 Zod 스키마
export const BagCountsSchema = z.object({
  "5L": z.number(),
  "10L": z.number(),
  "20L": z.number(),
  "30L": z.number(),
  "50L": z.number(),
});

// 배출량 기록 Zod 스키마
export const WasteRecordSchema = z.object({
  id: z.string(),
  userId: z.string(),
  date: z.string(), // "YYYY-MM-DD" 형식
  weightKg: z.number(),
  bags: BagCountsSchema,
  photoUrl: z.string().nullable(),
  memo: z.string().nullable(),
  createdAt: z
    .string()
    .transform((val) => new Date(val)) // JSON 문자열을 Date 객체로 변환
    .or(z.date()),
});

// 배출량 기록 배열 Zod 스키마
export const WasteRecordArraySchema = z.array(WasteRecordSchema);

/**
 * 배출량 기록 배열을 JSON 문자열로 직렬화
 * @param records - 직렬화할 WasteRecord 배열
 * @returns JSON 문자열
 */
export function serializeWasteRecords(records: WasteRecord[]): string {
  return JSON.stringify(records);
}

/**
 * JSON 문자열을 배출량 기록 배열로 역직렬화
 * Zod 스키마로 데이터 구조를 검증하며, 파싱 실패 시 빈 배열 반환
 * @param json - 역직렬화할 JSON 문자열
 * @returns WasteRecord 배열 (실패 시 빈 배열)
 */
export function deserializeWasteRecords(json: string): WasteRecord[] {
  try {
    const parsed = JSON.parse(json);
    const result = WasteRecordArraySchema.safeParse(parsed);

    if (!result.success) {
      // Zod 검증 실패 시 오류 로그 출력 후 기본값 반환
      console.error("데이터 구조 검증 실패:", result.error.message);
      return [];
    }

    return result.data as WasteRecord[];
  } catch (error) {
    // JSON 파싱 실패 시 오류 로그 출력 후 기본값 반환
    console.error("JSON 파싱 실패:", error);
    return [];
  }
}
