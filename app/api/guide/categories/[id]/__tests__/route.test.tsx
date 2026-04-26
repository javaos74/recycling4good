// 분리배출 가이드 카테고리 상세 API 단위 테스트

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "../route";

// auth 모킹
const mockAuth = vi.fn();
vi.mock("@/auth", () => ({
  auth: () => mockAuth(),
}));

// prisma 모킹
const mockFindUnique = vi.fn();
vi.mock("@/lib/prisma", () => ({
  prisma: {
    recyclingCategory: {
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
    },
  },
}));

// 테스트용 카테고리 데이터
const mockCategory = {
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
};

// 헬퍼: params를 Promise로 감싸서 Next.js 15 형식에 맞춤
function createContext(id: string) {
  return {
    params: Promise.resolve({ id }),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/guide/categories/[id]", () => {
  it("인증되지 않은 요청은 401을 반환한다", async () => {
    mockAuth.mockResolvedValue(null);
    const request = new Request("http://localhost/api/guide/categories/cat-1");
    const response = await GET(request, createContext("cat-1"));
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error.code).toBe("AUTH_ERROR");
  });

  it("존재하지 않는 카테고리는 404를 반환한다", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockFindUnique.mockResolvedValue(null);

    const request = new Request("http://localhost/api/guide/categories/nonexistent");
    const response = await GET(request, createContext("nonexistent"));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error.code).toBe("NOT_FOUND");
    expect(data.error.message).toBe("카테고리를 찾을 수 없습니다.");
  });

  it("카테고리 상세 조회에 성공하면 ContaminationLevel을 포함한 데이터를 반환한다", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockFindUnique.mockResolvedValue(mockCategory);

    const request = new Request("http://localhost/api/guide/categories/cat-1");
    const response = await GET(request, createContext("cat-1"));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.name).toBe("플라스틱");
    expect(data.data.levels).toHaveLength(3);
    expect(data.data.tip).toBe("라벨을 제거하고 내용물을 비운 후 배출하세요");

    // Prisma 호출 확인
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: "cat-1" },
      include: { levels: true },
    });
  });

  it("DB 오류 시 500을 반환한다", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockFindUnique.mockRejectedValue(new Error("DB 연결 실패"));

    const request = new Request("http://localhost/api/guide/categories/cat-1");
    const response = await GET(request, createContext("cat-1"));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error.code).toBe("INTERNAL_ERROR");
  });
});
