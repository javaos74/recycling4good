// BagSizeSelector 컴포넌트 렌더링 및 동작 테스트
// +/- 버튼 동작, 최솟값 0 제한 검증
// 요구사항: 8.2, 8.3, 8.4

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BagSizeSelector from "@/components/log/BagSizeSelector";
import type { BagCounts } from "@/lib/types";

const INITIAL_BAGS: BagCounts = {
  "5L": 0,
  "10L": 0,
  "20L": 0,
  "30L": 0,
  "50L": 0,
};

describe("BagSizeSelector 컴포넌트", () => {
  it("5개 봉투 크기(5L/10L/20L/30L/50L)를 모두 렌더링한다", () => {
    render(<BagSizeSelector bags={INITIAL_BAGS} onChange={() => {}} />);
    expect(screen.getByText("5L")).toBeInTheDocument();
    expect(screen.getByText("10L")).toBeInTheDocument();
    expect(screen.getByText("20L")).toBeInTheDocument();
    expect(screen.getByText("30L")).toBeInTheDocument();
    expect(screen.getByText("50L")).toBeInTheDocument();
  });

  it("+ 버튼 클릭 시 해당 봉투 개수가 1 증가한다", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<BagSizeSelector bags={INITIAL_BAGS} onChange={onChange} />);

    const plusButton = screen.getByLabelText("10L 증가");
    await user.click(plusButton);

    expect(onChange).toHaveBeenCalledWith({
      ...INITIAL_BAGS,
      "10L": 1,
    });
  });

  it("- 버튼 클릭 시 해당 봉투 개수가 1 감소한다", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const bags: BagCounts = { ...INITIAL_BAGS, "20L": 3 };
    render(<BagSizeSelector bags={bags} onChange={onChange} />);

    const minusButton = screen.getByLabelText("20L 감소");
    await user.click(minusButton);

    expect(onChange).toHaveBeenCalledWith({
      ...INITIAL_BAGS,
      "20L": 2,
    });
  });

  it("개수가 0일 때 - 버튼이 비활성화된다", () => {
    render(<BagSizeSelector bags={INITIAL_BAGS} onChange={() => {}} />);

    const minusButton = screen.getByLabelText("5L 감소");
    expect(minusButton).toBeDisabled();
  });

  it("개수가 0일 때 - 버튼을 클릭해도 0 미만으로 내려가지 않는다", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<BagSizeSelector bags={INITIAL_BAGS} onChange={onChange} />);

    // 비활성화된 버튼이므로 클릭이 무시됨
    const minusButton = screen.getByLabelText("5L 감소");
    await user.click(minusButton);

    expect(onChange).not.toHaveBeenCalled();
  });

  it("현재 봉투 개수를 올바르게 표시한다", () => {
    const bags: BagCounts = { "5L": 2, "10L": 0, "20L": 1, "30L": 0, "50L": 3 };
    render(<BagSizeSelector bags={bags} onChange={() => {}} />);

    expect(screen.getByLabelText("5L 개수")).toHaveTextContent("2");
    expect(screen.getByLabelText("10L 개수")).toHaveTextContent("0");
    expect(screen.getByLabelText("20L 개수")).toHaveTextContent("1");
    expect(screen.getByLabelText("50L 개수")).toHaveTextContent("3");
  });
});
