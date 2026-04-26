// MonthlySummary 컴포넌트 렌더링 테스트
// 3가지 지표 카드(총 무게, 종량제봉투 합계, 기록 횟수) 표시 검증
// 요구사항: 7.1, 7.5

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MonthlySummary from "@/components/log/MonthlySummary";
import type { MonthlySummary as MonthlySummaryType } from "@/lib/types";

describe("MonthlySummary 컴포넌트", () => {
  const mockSummary: MonthlySummaryType = {
    month: "2025-04",
    totalWeightKg: 12.5,
    totalBags: 8,
    recordCount: 3,
  };

  it("총 무게(kg) 지표를 표시한다", () => {
    render(<MonthlySummary summary={mockSummary} />);
    expect(screen.getByText("총 무게")).toBeInTheDocument();
    expect(screen.getByText("12.5")).toBeInTheDocument();
    expect(screen.getByText("kg")).toBeInTheDocument();
  });

  it("종량제봉투 합계(개) 지표를 표시한다", () => {
    render(<MonthlySummary summary={mockSummary} />);
    expect(screen.getByText("종량제봉투")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("개")).toBeInTheDocument();
  });

  it("기록 횟수(회) 지표를 표시한다", () => {
    render(<MonthlySummary summary={mockSummary} />);
    expect(screen.getByText("기록 횟수")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("회")).toBeInTheDocument();
  });

  it("기록이 없는 월에 대해 모든 지표를 0으로 표시한다", () => {
    const emptySummary: MonthlySummaryType = {
      month: "2025-01",
      totalWeightKg: 0,
      totalBags: 0,
      recordCount: 0,
    };
    render(<MonthlySummary summary={emptySummary} />);
    // 3개의 0이 표시되어야 함
    const zeros = screen.getAllByText("0");
    expect(zeros).toHaveLength(3);
  });

  it("3개의 지표 카드를 렌더링한다", () => {
    render(<MonthlySummary summary={mockSummary} />);
    expect(screen.getByText("총 무게")).toBeInTheDocument();
    expect(screen.getByText("종량제봉투")).toBeInTheDocument();
    expect(screen.getByText("기록 횟수")).toBeInTheDocument();
  });
});
