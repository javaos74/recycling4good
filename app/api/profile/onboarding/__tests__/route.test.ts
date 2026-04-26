// 온보딩 API 라우트 단위 테스트

import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";

// auth 모킹
const mockAuth = vi.fn();
vi.mock("@/auth", () => ({
  auth: () => mockAuth(),
}));

// prisma 모킹
const mockFindUnique = vi.fn();
const mockUpdate = vi.fn();
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
      update: (...args: unknown[]) => mockUpdate(...args),
    },
  },
}));

const mockUser = {
  id: "user-1",
  nickname: null,
  region: null,
  isOnboarded: false,
  accounts: [{ provider: "google" }],
  createdAt: new Date("2025-01-01"),
  updatedAt: new Date("2025-01-01"),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/profile/onboarding", () => {
  it("인증되지 않은 요청은 401을 반환한다", async () => {
    mockAuth.mockResolvedValue(null);
    const request = new Request("http://localhost/api/profile/onboarding", {
      method: "POST",
      body: JSON.stringify({ nickname: "홍길동", region: "서울특별시" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error.code).toBe("AUTH_ERROR");
  });

  it("유효하지 않은 입력이면 400을 반환한다", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    const request = new Request("http://localhost/api/profile/onboarding", {
      method: "POST",
      body: JSON.stringify({ nickname: "   ", region: "" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error.code).toBe("VALIDATION_ERROR");
  });

  it("사용자가 존재하지 않으면 404를 반환한다", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockFindUnique.mockResolvedValue(null);
    const request = new Request("http://localhost/api/profile/onboarding", {
      method: "POST",
      body: JSON.stringify({ nickname: "홍길동", region: "서울특별시" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error.code).toBe("NOT_FOUND");
  });

  it("온보딩 성공 시 isOnboarded=true로 업데이트된 프로필을 반환한다", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockFindUnique.mockResolvedValue(mockUser);
    mockUpdate.mockResolvedValue({
      ...mockUser,
      nickname: "홍길동",
      region: "서울특별시",
      isOnboarded: true,
    });

    const request = new Request("http://localhost/api/profile/onboarding", {
      method: "POST",
      body: JSON.stringify({ nickname: "홍길동", region: "서울특별시" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.nickname).toBe("홍길동");
    expect(data.data.region).toBe("서울특별시");
    expect(data.data.isOnboarded).toBe(true);
    expect(data.data.socialProvider).toBe("google");
  });

  it("닉네임 앞뒤 공백을 제거하여 저장한다", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockFindUnique.mockResolvedValue(mockUser);
    mockUpdate.mockResolvedValue({
      ...mockUser,
      nickname: "홍길동",
      region: "서울특별시",
      isOnboarded: true,
    });

    const request = new Request("http://localhost/api/profile/onboarding", {
      method: "POST",
      body: JSON.stringify({ nickname: "  홍길동  ", region: "서울특별시" }),
    });

    await POST(request);

    // update 호출 시 trim된 닉네임이 전달되는지 확인
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ nickname: "홍길동" }),
      })
    );
  });
});
