import { describe, it, expect, vi } from "vitest";
import {
  serializeWasteRecords,
  deserializeWasteRecords,
  BagCountsSchema,
  WasteRecordSchema,
  WasteRecordArraySchema,
} from "../serialization";
import type { WasteRecord } from "../types";

// 테스트용 유효한 배출량 기록 데이터
const validRecord: WasteRecord = {
  id: "test-id-1",
  userId: "user-1",
  date: "2025-01-15",
  weightKg: 3.5,
  bags: { "5L": 0, "10L": 1, "20L": 0, "30L": 0, "50L": 0 },
  photoUrl: null,
  memo: "테스트 메모",
  createdAt: new Date("2025-01-15T10:00:00.000Z"),
};

const validRecordWithPhoto: WasteRecord = {
  id: "test-id-2",
  userId: "user-1",
  date: "2025-02-20",
  weightKg: 5.0,
  bags: { "5L": 1, "10L": 0, "20L": 2, "30L": 0, "50L": 1 },
  photoUrl: "https://example.com/photo.jpg",
  memo: null,
  createdAt: new Date("2025-02-20T14:30:00.000Z"),
};

describe("BagCountsSchema", () => {
  it("유효한 봉투 개수 데이터를 통과시킨다", () => {
    const data = { "5L": 0, "10L": 1, "20L": 0, "30L": 0, "50L": 0 };
    const result = BagCountsSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("필수 필드가 누락되면 실패한다", () => {
    const data = { "5L": 0, "10L": 1 };
    const result = BagCountsSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("숫자가 아닌 값이 있으면 실패한다", () => {
    const data = { "5L": "abc", "10L": 1, "20L": 0, "30L": 0, "50L": 0 };
    const result = BagCountsSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});

describe("WasteRecordSchema", () => {
  it("유효한 배출량 기록을 통과시킨다", () => {
    // JSON 직렬화/역직렬화 시뮬레이션 (Date → string)
    const jsonData = JSON.parse(JSON.stringify(validRecord));
    const result = WasteRecordSchema.safeParse(jsonData);
    expect(result.success).toBe(true);
  });

  it("필수 필드가 누락되면 실패한다", () => {
    const data = { id: "test", userId: "user" };
    const result = WasteRecordSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});

describe("serializeWasteRecords", () => {
  it("빈 배열을 직렬화한다", () => {
    const result = serializeWasteRecords([]);
    expect(result).toBe("[]");
  });

  it("단일 기록을 직렬화한다", () => {
    const result = serializeWasteRecords([validRecord]);
    const parsed = JSON.parse(result);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].id).toBe("test-id-1");
    expect(parsed[0].weightKg).toBe(3.5);
  });

  it("여러 기록을 직렬화한다", () => {
    const result = serializeWasteRecords([validRecord, validRecordWithPhoto]);
    const parsed = JSON.parse(result);
    expect(parsed).toHaveLength(2);
  });

  it("유효한 JSON 문자열을 반환한다", () => {
    const result = serializeWasteRecords([validRecord]);
    expect(() => JSON.parse(result)).not.toThrow();
  });
});

describe("deserializeWasteRecords", () => {
  it("유효한 JSON을 역직렬화한다", () => {
    const json = serializeWasteRecords([validRecord]);
    const result = deserializeWasteRecords(json);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("test-id-1");
    expect(result[0].weightKg).toBe(3.5);
    expect(result[0].date).toBe("2025-01-15");
  });

  it("역직렬화 후 createdAt이 Date 객체이다", () => {
    const json = serializeWasteRecords([validRecord]);
    const result = deserializeWasteRecords(json);
    expect(result[0].createdAt).toBeInstanceOf(Date);
  });

  it("빈 배열 JSON을 역직렬화한다", () => {
    const result = deserializeWasteRecords("[]");
    expect(result).toEqual([]);
  });

  it("잘못된 JSON 문자열에 대해 빈 배열을 반환한다", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = deserializeWasteRecords("invalid json");
    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("유효하지 않은 데이터 구조에 대해 빈 배열을 반환한다", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const invalidData = JSON.stringify([{ id: 123, invalid: true }]);
    const result = deserializeWasteRecords(invalidData);
    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("빈 문자열에 대해 빈 배열을 반환한다", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = deserializeWasteRecords("");
    expect(result).toEqual([]);
    consoleSpy.mockRestore();
  });

  it("직렬화-역직렬화 라운드트립이 데이터를 보존한다", () => {
    const records = [validRecord, validRecordWithPhoto];
    const json = serializeWasteRecords(records);
    const result = deserializeWasteRecords(json);

    expect(result).toHaveLength(2);
    // 핵심 필드 보존 확인
    expect(result[0].id).toBe(records[0].id);
    expect(result[0].userId).toBe(records[0].userId);
    expect(result[0].date).toBe(records[0].date);
    expect(result[0].weightKg).toBe(records[0].weightKg);
    expect(result[0].bags).toEqual(records[0].bags);
    expect(result[0].photoUrl).toBe(records[0].photoUrl);
    expect(result[0].memo).toBe(records[0].memo);
    // createdAt은 Date 객체로 복원되어야 함
    expect(result[0].createdAt.getTime()).toBe(records[0].createdAt.getTime());
  });

  it("photoUrl과 memo가 null인 경우를 처리한다", () => {
    const json = serializeWasteRecords([validRecord]);
    const result = deserializeWasteRecords(json);
    expect(result[0].photoUrl).toBeNull();
    expect(result[0].memo).toBe("테스트 메모");
  });

  it("배열이 아닌 JSON에 대해 빈 배열을 반환한다", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = deserializeWasteRecords('{"not": "array"}');
    expect(result).toEqual([]);
    consoleSpy.mockRestore();
  });
});
