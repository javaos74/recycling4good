// 분리배출 가이드 카테고리 목록 API 단위 테스트

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";

// auth 모킹
const mockAuth = vi.fn();
vi.mock("@/auth", () => ({
  auth: () => mockAuth(),
}));

// prisma 모킹
const mockFindMany = vi.fn();
vi.mock("@/lib/prisma", () => ({
  prisma: {
    recyclingCategory: {
      findMany: (...args: unknown[]) => mockFindMany(...args),
    },
  },
}));

// 테스트용 카테고리 데이터
const mockCategories = [
  {
    id: "cat-1",
    name: "플라스틱",
    icon: "♻️",
    items: ["트레이", "PP용기", "페트병"],
    tip: "라벨을 제거하고 내용물을 비운 후 배출하세요",
    sortOrder: 0,
    levels: [
      { id: "lv-1", categoryId: "cat-1", level: "low", label: "🟢 약한 오염", description: "물·세제로 씻길 정도", action: "세척 후 재활용 배출" },
      { id: "lv-2", categoryId: "cat-1", level: "medium", label: "🟡 중간 오염", description: "기름기·음식물 잔여", action: "오염물질 제거 후 재활용 배출" },
      { id: "lv-3", categoryId: "cat-1", level: "high", label: "🔴 심한 오염", description: "씻어도 사라지지 않는 오염", action: "일반 쓰레기 배출" },
    ],
  },
  {
    id: "cat-2",
    name: "비닐",
    icon: "🛍️",
    items: ["비닐봉지", "과자봉지", "라면봉지"],
    tip: "이물질을 제거하고 배출하세요",
    sortOrder: 1,
    levels: [
      { id: "lv-4", categoryId: "cat-2", level: "low", label: "🟢 약한 오염", description: "물·세제로 씻길 정도", action: "세척 후 재활용 배출" },
      { id: "lv-5", categoryId: "cat-2", level: "medium", label: "🟡 중간 오염", description: "기름기·음식물 잔여", action: "오염물질 제거 후 재활용 배출" },
      { id: "lv-6", categoryId: "cat-2", level: "high", label: "🔴 심한 오염", description: "씻어도 사라지지 않는 오염", action: "일반 쓰레기 배출" },
    ],
  },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/guide/categories", () => {
  it("인증되지 않은 요청은 401을 반환한다", async () => {
    mockAuth.mockResolvedValue(null);
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error.code).toBe("AUTH_ERROR");
  });

  it("카테고리 목록을 sortOrder 순으로 조회한다", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockFindMany.mockResolvedValue(mockCategories);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveLength(2);
    expect(data.data[0].name).toBe("플라스틱");
    expect(data.data[1].name).toBe("비닐");

    // Prisma 호출 시 sortOrder 오름차순 정렬 및 levels include 확인
    expect(mockFindMany).toHaveBeenCalledWith({
      orderBy: { sortOrder: "asc" },
      include: { levels: true },
    });
  });

  it("각 카테고리에 ContaminationLevel이 포함된다", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockFindMany.mockResolvedValue(mockCategories);

    const response = await GET();
    const data = await response.json();

    expect(data.data[0].levels).toHaveLength(3);
    expect(data.data[0].levels[0].level).toBe("low");
    expect(data.data[0].levels[1].level).toBe("medium");
    expect(data.data[0].levels[2].level).toBe("high");
  });

  it("DB 오류 시 500을 반환한다", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockFindMany.mockRejectedValue(new Error("DB 연결 실패"));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error.code).toBe("INTERNAL_ERROR");
  });
});
