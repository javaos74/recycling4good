// 분리배출 가이드 페이지 렌더링 테스트
// Prisma 직접 조회 기반 카테고리 데이터 표시 검증
// 요구사항: 5.1, 5.2, 5.3, 5.4, 5.5

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import GuidePage from "@/app/(main)/guide/page";

// Prisma 모킹
const mockFindMany = vi.fn();
vi.mock("@/lib/prisma", () => ({
  prisma: {
    recyclingCategory: {
      findMany: (...args: unknown[]) => mockFindMany(...args),
    },
  },
}));

// 테스트용 카테고리 데이터 (Prisma 반환 형식)
const mockCategories = [
  {
    id: "1",
    name: "플라스틱",
    icon: "♻️",
    items: ["트레이", "PP용기", "페트병"],
    tip: "라벨을 제거하고 내용물을 비운 후 배출하세요",
    sortOrder: 1,
    levels: [
      { id: "lv1", categoryId: "1", level: "low", label: "🟢 약한 오염", description: "물·세제로 씻길 정도", action: "세척 후 재활용 배출" },
      { id: "lv2", categoryId: "1", level: "medium", label: "🟡 중간 오염", description: "기름기·음식물 잔여", action: "오염물질 제거 후 재활용 배출" },
      { id: "lv3", categoryId: "1", level: "high", label: "🔴 심한 오염", description: "씻어도 사라지지 않는 오염", action: "일반 쓰레기 배출" },
    ],
  },
  {
    id: "2",
    name: "비닐",
    icon: "🛍️",
    items: ["비닐봉지", "과자봉지"],
    tip: "내용물을 비우고 배출하세요",
    sortOrder: 2,
    levels: [
      { id: "lv4", categoryId: "2", level: "low", label: "🟢 약한 오염", description: "물·세제로 씻길 정도", action: "세척 후 재활용 배출" },
      { id: "lv5", categoryId: "2", level: "medium", label: "🟡 중간 오염", description: "기름기·음식물 잔여", action: "오염물질 제거 후 재활용 배출" },
      { id: "lv6", categoryId: "2", level: "high", label: "🔴 심한 오염", description: "씻어도 사라지지 않는 오염", action: "일반 쓰레기 배출" },
    ],
  },
];

describe("GuidePage 페이지", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("카테고리 데이터를 성공적으로 불러와 표시한다", async () => {
    mockFindMany.mockResolvedValue(mockCategories);

    const page = await GuidePage();
    render(page);

    expect(screen.getByText("분리배출 전 꼭 확인하세요")).toBeInTheDocument();
    expect(screen.getByText("플라스틱")).toBeInTheDocument();
    expect(screen.getByText("비닐")).toBeInTheDocument();
    expect(screen.getByText("♻️")).toBeInTheDocument();
    expect(screen.getByText("🛍️")).toBeInTheDocument();
  });

  it("DB 조회 실패 시 에러 메시지를 표시한다", async () => {
    mockFindMany.mockRejectedValue(new Error("DB error"));

    const page = await GuidePage();
    render(page);

    expect(
      screen.getByText("가이드 정보를 불러오는 데 실패했습니다.")
    ).toBeInTheDocument();
  });

  it("두 개의 탭(분리배출 가이드, 배출량 입력)을 표시한다", async () => {
    mockFindMany.mockResolvedValue(mockCategories);

    const page = await GuidePage();
    render(page);

    expect(screen.getByRole("tab", { name: "분리배출 가이드" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "배출량 입력" })).toBeInTheDocument();
  });

  it("Prisma를 sortOrder 오름차순으로 호출한다", async () => {
    mockFindMany.mockResolvedValue([]);

    await GuidePage();

    expect(mockFindMany).toHaveBeenCalledWith({
      orderBy: { sortOrder: "asc" },
      include: { levels: true },
    });
  });

  it("카테고리가 없으면 에러 메시지를 표시한다", async () => {
    mockFindMany.mockResolvedValue([]);

    const page = await GuidePage();
    render(page);

    expect(
      screen.getByText("가이드 정보를 불러오는 데 실패했습니다.")
    ).toBeInTheDocument();
  });
});
