// CategoryAccordion 카테고리별 아코디언 카드 목록 테스트
// 카테고리 렌더링, 아코디언 펼침/접힘, 오염도 표시 검증
// 요구사항: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CategoryAccordion from "@/components/guide/CategoryAccordion";
import type { RecyclingCategory } from "@/lib/types";

// 테스트용 카테고리 데이터
const mockCategories: RecyclingCategory[] = [
  {
    id: "1",
    name: "플라스틱",
    icon: "♻️",
    items: ["트레이", "PP용기", "페트병"],
    tip: "라벨을 제거하고 내용물을 비운 후 배출하세요",
    levels: [
      { level: "low", label: "🟢 약한 오염", description: "물·세제로 씻길 정도", action: "세척 후 재활용 배출" },
      { level: "medium", label: "🟡 중간 오염", description: "기름기·음식물 잔여", action: "오염물질 제거 후 재활용 배출" },
      { level: "high", label: "🔴 심한 오염", description: "씻어도 사라지지 않는 오염", action: "일반 쓰레기 배출" },
    ],
  },
  {
    id: "2",
    name: "비닐",
    icon: "🛍️",
    items: ["비닐봉지", "과자봉지"],
    tip: "이물질을 제거하고 배출하세요",
    levels: [
      { level: "low", label: "🟢 약한 오염", description: "물·세제로 씻길 정도", action: "세척 후 재활용 배출" },
      { level: "medium", label: "🟡 중간 오염", description: "기름기·음식물 잔여", action: "오염물질 제거 후 재활용 배출" },
      { level: "high", label: "🔴 심한 오염", description: "씻어도 사라지지 않는 오염", action: "일반 쓰레기 배출" },
    ],
  },
];

describe("CategoryAccordion 컴포넌트", () => {
  it("카테고리 수만큼 아코디언 카드를 렌더링한다", () => {
    render(<CategoryAccordion categories={mockCategories} />);
    expect(screen.getByText("플라스틱")).toBeInTheDocument();
    expect(screen.getByText("비닐")).toBeInTheDocument();
  });

  it("각 카테고리의 아이콘과 이름을 표시한다", () => {
    render(<CategoryAccordion categories={mockCategories} />);
    expect(screen.getByText("♻️")).toBeInTheDocument();
    expect(screen.getByText("플라스틱")).toBeInTheDocument();
    expect(screen.getByText("🛍️")).toBeInTheDocument();
    expect(screen.getByText("비닐")).toBeInTheDocument();
  });

  it("빈 카테고리 배열일 때 안내 메시지를 표시한다", () => {
    render(<CategoryAccordion categories={[]} />);
    expect(screen.getByText("가이드 정보를 불러오는 데 실패했습니다.")).toBeInTheDocument();
  });

  it("아코디언 클릭 시 품목 예시, TIP, 오염도 3단계를 표시한다", async () => {
    const user = userEvent.setup();
    render(<CategoryAccordion categories={mockCategories} />);

    // 초기 상태: 본문 숨김
    expect(screen.queryByText("트레이")).not.toBeInTheDocument();

    // 플라스틱 아코디언 클릭
    const buttons = screen.getAllByRole("button");
    await user.click(buttons[0]);

    // 품목 예시 표시
    expect(screen.getByText("트레이")).toBeInTheDocument();
    expect(screen.getByText("PP용기")).toBeInTheDocument();
    expect(screen.getByText("페트병")).toBeInTheDocument();

    // TIP 표시
    expect(screen.getByText(/라벨을 제거하고 내용물을 비운 후 배출하세요/)).toBeInTheDocument();

    // 오염도 3단계 표시
    expect(screen.getByText("세척 후 재활용 배출")).toBeInTheDocument();
    expect(screen.getByText("오염물질 제거 후 재활용 배출")).toBeInTheDocument();
    expect(screen.getByText("일반 쓰레기 배출")).toBeInTheDocument();
  });

  it("펼쳐진 아코디언을 다시 클릭하면 접힌다", async () => {
    const user = userEvent.setup();
    render(<CategoryAccordion categories={mockCategories} />);

    const buttons = screen.getAllByRole("button");

    // 펼치기
    await user.click(buttons[0]);
    expect(screen.getByText("트레이")).toBeInTheDocument();

    // 접기
    await user.click(buttons[0]);
    expect(screen.queryByText("트레이")).not.toBeInTheDocument();
  });

  it("서로 다른 카테고리를 독립적으로 펼칠 수 있다", async () => {
    const user = userEvent.setup();
    render(<CategoryAccordion categories={mockCategories} />);

    const buttons = screen.getAllByRole("button");

    // 플라스틱 펼치기
    await user.click(buttons[0]);
    expect(screen.getByText("트레이")).toBeInTheDocument();

    // 비닐도 펼치기
    await user.click(buttons[1]);
    expect(screen.getByText("비닐봉지")).toBeInTheDocument();

    // 플라스틱도 여전히 펼쳐져 있음
    expect(screen.getByText("트레이")).toBeInTheDocument();
  });
});
