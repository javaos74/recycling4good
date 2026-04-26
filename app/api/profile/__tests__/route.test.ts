// 프로필 API 라우트 단위 테스트

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, PUT, DELETE } from "../route";

// auth 모킹
const mockAuth = vi.fn();
vi.mock("@/auth", () => ({
  auth: () => mockAuth(),
}));

// prisma 모킹
const mockFindUnique = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
      update: (...args: unknown[]) => mockUpdate(...args),
      delete: (...args: unknown[]) => mockDelete(...args),
    },
  },
}));

// 테스트용 사용자 데이터
const mockUser = {
  id: "user-1",
  nickname: "홍길동",
  region: "서울특별시",
  isOnboarded: true,
  accounts: [{ provider: "kakao" }],
  createdAt: new Date("2025-01-01"),
  updatedAt: new Date("2025-01-01"),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/profile", () => {
  it("인증되지 않은 요청은 401을 반환한다", async () => {
    mockAuth.mockResolvedValue(null);
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error.code).toBe("AUTH_ERROR");
  });

  it("사용자가 존재하지 않으면 404를 반환한다", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockFindUnique.mockResolvedValue(null);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error.code).toBe("NOT_FOUND");
  });

  it("프로필 조회에 성공하면 사용자 데이터를 반환한다", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockFindUnique.mockResolvedValue(mockUser);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.nickname).toBe("홍길동");
    expect(data.data.region).toBe("서울특별시");
    expect(data.data.socialProvider).toBe("kakao");
  });
});

describe("PUT /api/profile", () => {
  it("인증되지 않은 요청은 401을 반환한다", async () => {
    mockAuth.mockResolvedValue(null);
    const request = new Request("http://localhost/api/profile", {
      method: "PUT",
      body: JSON.stringify({ nickname: "새닉네임", region: "서울특별시" }),
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
  });

  it("유효하지 않은 닉네임이면 400을 반환한다", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    const request = new Request("http://localhost/api/profile", {
      method: "PUT",
      body: JSON.stringify({ nickname: "", region: "서울특별시" }),
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error.code).toBe("VALIDATION_ERROR");
  });

  it("유효하지 않은 거주 지역이면 400을 반환한다", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    const request = new Request("http://localhost/api/profile", {
      method: "PUT",
      body: JSON.stringify({ nickname: "홍길동", region: "뉴욕시" }),
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error.code).toBe("VALIDATION_ERROR");
  });

  it("사용자가 존재하지 않으면 404를 반환한다", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockFindUnique.mockResolvedValue(null);
    const request = new Request("http://localhost/api/profile", {
      method: "PUT",
      body: JSON.stringify({ nickname: "새닉네임", region: "서울특별시" }),
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error.code).toBe("NOT_FOUND");
  });

  it("프로필 수정에 성공하면 업데이트된 데이터를 반환한다", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockFindUnique.mockResolvedValue(mockUser);
    mockUpdate.mockResolvedValue({ ...mockUser, nickname: "새닉네임", region: "경기도" });

    const request = new Request("http://localhost/api/profile", {
      method: "PUT",
      body: JSON.stringify({ nickname: "새닉네임", region: "경기도" }),
    });

    const response = await PUT(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.nickname).toBe("새닉네임");
    expect(data.data.region).toBe("경기도");
  });
});

describe("DELETE /api/profile", () => {
  it("인증되지 않은 요청은 401을 반환한다", async () => {
    mockAuth.mockResolvedValue(null);
    const response = await DELETE();
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
  });

  it("사용자가 존재하지 않으면 404를 반환한다", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockFindUnique.mockResolvedValue(null);

    const response = await DELETE();
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error.code).toBe("NOT_FOUND");
  });

  it("회원 탈퇴에 성공하면 완료 메시지를 반환한다", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockFindUnique.mockResolvedValue(mockUser);
    mockDelete.mockResolvedValue(mockUser);

    const response = await DELETE();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.message).toBe("회원 탈퇴가 완료되었습니다.");
  });
});
