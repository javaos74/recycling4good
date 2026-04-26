// 배출량 월별 요약 API 라우트 단위 테스트

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";
import { NextRequest } from "next/server";

// auth 모킹
const mockAuth = vi.fn();
vi.mock("@/auth", () => ({
  auth: () => mockAuth(),
}));

// prisma 모킹
const mockFindMany = vi.fn();
vi.mock("@/lib/prisma", () => ({
  prisma: {
    wasteRecord: {
      findMany: (...args: unknown[]) => mockFindMany(...args),
    },
  },
}));

// 테스트용 기록 데이터
const mockRecords = [
  {
    id: "record-1",
    userId: "user-1",
    date: new Date("2025-04-10"),
    weightKg: 2.5,
    bags: { "5L": 0, "10L": 1, "20L": 0, "30L": 0, "50L": 0 },
    createdAt: new Date(),
  },
  {
    id: "record-2",
    userId: "user-1",
    date: new Date("2025-04-20"),
    weightKg: 3.0,
    bags: { "5L": 1, "10L": 0, "20L": 1, "30L": 0, "50L": 0 },
    createdAt: new Date(),
  },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/waste-records/summary", () => {
  it("인증되지 않은 요청은 401을 반환한다", async () => {
    mockAuth.mockResolvedValue(null);
    const request = new NextRequest("http://localhost/api/waste-records/summary?month=2025-04");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error.code).toBe("AUTH_ERROR");
  });

  it("month 파라미터가 없으면 400을 반환한다", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    const request = new NextRequest("http://localhost/api/waste-records/summary");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error.code).toBe("VALIDATION_ERROR");
  });

  it("month 형식이 잘못되면 400을 반환한다", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    const request = new NextRequest("http://localhost/api/waste-records/summary?month=04-2025");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error.code).toBe("VALIDATION_ERROR");
  });

  it("월별 요약을 정상 반환한다", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockFindMany.mockResolvedValue(mockRecords);
    const request = new NextRequest("http://localhost/api/waste-records/summary?month=2025-04");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.month).toBe("2025-04");
    // 총 무게: 2.5 + 3.0 = 5.5
    expect(data.data.totalWeightKg).toBe(5.5);
    // 총 봉투: (0+1+0+0+0) + (1+0+1+0+0) = 1 + 2 = 3
    expect(data.data.totalBags).toBe(3);
    // 기록 횟수: 2
    expect(data.data.recordCount).toBe(2);
  });

  it("기록이 없는 월은 모든 지표가 0이다", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockFindMany.mockResolvedValue([]);
    const request = new NextRequest("http://localhost/api/waste-records/summary?month=2025-01");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.totalWeightKg).toBe(0);
    expect(data.data.totalBags).toBe(0);
    expect(data.data.recordCount).toBe(0);
  });

  it("DB 오류 시 500을 반환한다", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockFindMany.mockRejectedValue(new Error("DB 오류"));
    const request = new NextRequest("http://localhost/api/waste-records/summary?month=2025-04");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error.code).toBe("INTERNAL_ERROR");
  });
});
