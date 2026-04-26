// ContaminationLevel 오염도 단계 표시 컴포넌트 테스트
// 레벨별 아이콘, 색상, 처리 방법 표시 검증
// 요구사항: 6.3, 6.4

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ContaminationLevel from "@/components/guide/ContaminationLevel";
import type { ContaminationLevel as ContaminationLevelType } from "@/lib/types";

// 테스트 데이터
const lowLevel: ContaminationLevelType = {
  level: "low",
  label: "🟢 약한 오염",
  description: "물·세제로 씻길 정도",
  action: "세척 후 재활용 배출",
};

const mediumLevel: ContaminationLevelType = {
  level: "medium",
  label: "🟡 중간 오염",
  description: "기름기·음식물 잔여",
  action: "오염물질 제거 후 재활용 배출",
};

const highLevel: ContaminationLevelType = {
  level: "high",
  label: "🔴 심한 오염",
  description: "씻어도 사라지지 않는 오염",
  action: "일반 쓰레기 배출",
};

describe("ContaminationLevel 컴포넌트", () => {
  it("약한 오염(low) 레벨의 아이콘(🟢)과 처리 방법을 표시한다", () => {
    render(<ContaminationLevel level={lowLevel} />);
    expect(screen.getByText("🟢")).toBeInTheDocument();
    expect(screen.getByText("세척 후 재활용 배출")).toBeInTheDocument();
    expect(screen.getByText("물·세제로 씻길 정도")).toBeInTheDocument();
  });

  it("중간 오염(medium) 레벨의 아이콘(🟡)과 처리 방법을 표시한다", () => {
    render(<ContaminationLevel level={mediumLevel} />);
    expect(screen.getByText("🟡")).toBeInTheDocument();
    expect(screen.getByText("오염물질 제거 후 재활용 배출")).toBeInTheDocument();
    expect(screen.getByText("기름기·음식물 잔여")).toBeInTheDocument();
  });

  it("심한 오염(high) 레벨의 아이콘(🔴)과 처리 방법을 표시한다", () => {
    render(<ContaminationLevel level={highLevel} />);
    expect(screen.getByText("🔴")).toBeInTheDocument();
    expect(screen.getByText("일반 쓰레기 배출")).toBeInTheDocument();
    expect(screen.getByText("씻어도 사라지지 않는 오염")).toBeInTheDocument();
  });

  it("data-testid 속성이 레벨에 맞게 설정된다", () => {
    const { container } = render(<ContaminationLevel level={lowLevel} />);
    expect(container.querySelector('[data-testid="contamination-low"]')).toBeInTheDocument();
  });
});
