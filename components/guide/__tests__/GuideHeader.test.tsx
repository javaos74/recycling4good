// GuideHeader 컴포넌트 렌더링 테스트
// 안내 문구 및 오염도 기준 설명 표시 검증
// 요구사항: 5.1, 5.2

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import GuideHeader from "@/components/guide/GuideHeader";

describe("GuideHeader 컴포넌트", () => {
  it('"분리배출 전 꼭 확인하세요" 안내 문구를 표시한다', () => {
    render(<GuideHeader />);
    expect(
      screen.getByText("분리배출 전 꼭 확인하세요")
    ).toBeInTheDocument();
  });

  it("약한 오염 기준 설명을 표시한다", () => {
    render(<GuideHeader />);
    expect(screen.getByText("약한 오염")).toBeInTheDocument();
    expect(
      screen.getByText(/물·세제로 씻길 정도/)
    ).toBeInTheDocument();
  });

  it("중간 오염 기준 설명을 표시한다", () => {
    render(<GuideHeader />);
    expect(screen.getByText("중간 오염")).toBeInTheDocument();
    expect(
      screen.getByText(/기름기·음식물 잔여/)
    ).toBeInTheDocument();
  });

  it("심한 오염 기준 설명을 표시한다", () => {
    render(<GuideHeader />);
    expect(screen.getByText("심한 오염")).toBeInTheDocument();
    expect(
      screen.getByText(/씻어도 사라지지 않는 오염/)
    ).toBeInTheDocument();
  });

  it("3가지 오염도 아이콘(🟢, 🟡, 🔴)을 모두 표시한다", () => {
    render(<GuideHeader />);
    expect(screen.getByText("🟢")).toBeInTheDocument();
    expect(screen.getByText("🟡")).toBeInTheDocument();
    expect(screen.getByText("🔴")).toBeInTheDocument();
  });
});
