// 배출량 기록 API 라우트 단위 테스트

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "../route";
import { NextRequest } from "next/server";

// auth 모킹
const mockAuth = vi.fn();
vi.mock("@/auth", () => ({
  auth: () => mockAuth(),
}));

// prisma 모킹
const mockFindMany = vi.fn();
const mockCreate = vi.fn();
vi.mock("@/lib/prisma", () => ({
  prisma: {
    wasteRecord: {
      findMany: (...args: unknown[]) => mockFindMany(...args),
      create: (...args: unknown[]) => mockCreate(...args),
    },
  },
}));

// 테스트용 기록 데이터
const mockRecord = {
  id: "record-1",
  userId: "user-1",
  date: new Date("2025-04-15"),
  weightKg: 2.5,
  bags: { "5L": 0, "10L": 1, "20L": 0, "30L": 0, "50L": 0 },
  photoUrl: null,
  memo: "테스트 메모",
  createdAt: new Date("2025-04-15T10:00:00Z"),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/waste-records", () => {
  it("인증되지 않은 요청은 401을 반환한다", async () => {
    mockAuth.mockResolvedValue(null);
    const request = new NextRequest("http://localhost/api/waste-records?month=2025-04");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error.code).toBe("AUTH_ERROR");
  });

  it("month 파라미터가 없으면 400을 반환한다", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    const request = new NextRequest("http://localhost/api/waste-records");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error.code).toBe("VALIDATION_ERROR");
  });

  it("month 형식이 잘못되면 400을 반환한다", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    const request = new NextRequest("http://localhost/api/waste-records?month=2025-4-1");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error.code).toBe("VALIDATION_ERROR");
  });

  it("월별 기록 목록을 정상 반환한다", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockFindMany.mockResolvedValue([mockRecord]);
    const request = new NextRequest("http://localhost/api/waste-records?month=2025-04");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveLength(1);
    expect(data.data[0].date).toBe("2025-04-15");
    expect(data.data[0].weightKg).toBe(2.5);
    expect(data.data[0].memo).toBe("테스트 메모");
  });

  it("기록이 없는 월은 빈 배열을 반환한다", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockFindMany.mockResolvedValue([]);
    const request = new NextRequest("http://localhost/api/waste-records?month=2025-01");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveLength(0);
  });

  it("DB 오류 시 500을 반환한다", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockFindMany.mockRejectedValue(new Error("DB 오류"));
    const request = new NextRequest("http://localhost/api/waste-records?month=2025-04");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error.code).toBe("INTERNAL_ERROR");
  });
});

describe("POST /api/waste-records", () => {
  it("인증되지 않은 요청은 401을 반환한다", async () => {
    mockAuth.mockResolvedValue(null);
    const request = new Request("http://localhost/api/waste-records", {
      method: "POST",
      body: JSON.stringify({ date: "2025-04-15", weightKg: 2.5, bags: { "5L": 0, "10L": 1, "20L": 0, "30L": 0, "50L": 0 } }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error.code).toBe("AUTH_ERROR");
  });

  it("유효하지 않은 데이터면 400을 반환한다", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    const request = new Request("http://localhost/api/waste-records", {
      method: "POST",
      body: JSON.stringify({ date: "", weightKg: 0, bags: {} }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error.code).toBe("VALIDATION_ERROR");
  });

  it("배출 기록 생성에 성공하면 201을 반환한다", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockCreate.mockResolvedValue(mockRecord);
    const request = new Request("http://localhost/api/waste-records", {
      method: "POST",
      body: JSON.stringify({
        date: "2025-04-15",
        weightKg: 2.5,
        bags: { "5L": 0, "10L": 1, "20L": 0, "30L": 0, "50L": 0 },
        memo: "테스트 메모",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.weightKg).toBe(2.5);
    expect(data.data.date).toBe("2025-04-15");
  });

  it("DB 오류 시 500을 반환한다", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockCreate.mockRejectedValue(new Error("DB 오류"));
    const request = new Request("http://localhost/api/waste-records", {
      method: "POST",
      body: JSON.stringify({
        date: "2025-04-15",
        weightKg: 2.5,
        bags: { "5L": 0, "10L": 1, "20L": 0, "30L": 0, "50L": 0 },
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error.code).toBe("INTERNAL_ERROR");
  });
});
