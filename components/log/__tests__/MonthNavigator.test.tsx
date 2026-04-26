// MonthNavigator 컴포넌트 렌더링 및 동작 테스트
// 월 이동 화살표, 한국어 월 표시, 미래 월 비활성화 검증
// 요구사항: 7.2, 7.3, 7.4

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MonthNavigator from "@/components/log/MonthNavigator";

describe("MonthNavigator 컴포넌트", () => {
  const onPrevMonth = vi.fn();
  const onNextMonth = vi.fn();

  beforeEach(() => {
    // 현재 날짜를 2025년 7월 15일로 고정
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 6, 15));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("현재 월을 한국어 형식으로 표시한다", () => {
    render(
      <MonthNavigator
        currentMonth="2025-04"
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
      />
    );
    expect(screen.getByText("2025년 4월")).toBeInTheDocument();
  });

  it("이전 월 버튼을 클릭하면 onPrevMonth가 호출된다", () => {
    render(
      <MonthNavigator
        currentMonth="2025-04"
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
      />
    );
    fireEvent.click(screen.getByLabelText("이전 월"));
    expect(onPrevMonth).toHaveBeenCalledTimes(1);
  });

  it("다음 월 버튼을 클릭하면 onNextMonth가 호출된다", () => {
    render(
      <MonthNavigator
        currentMonth="2025-04"
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
      />
    );
    fireEvent.click(screen.getByLabelText("다음 월"));
    expect(onNextMonth).toHaveBeenCalledTimes(1);
  });

  it("현재 월일 때 다음 월 버튼이 비활성화된다", () => {
    render(
      <MonthNavigator
        currentMonth="2025-07"
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
      />
    );
    const nextButton = screen.getByLabelText("다음 월");
    expect(nextButton).toBeDisabled();
  });

  it("과거 월일 때 다음 월 버튼이 활성화된다", () => {
    render(
      <MonthNavigator
        currentMonth="2025-04"
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
      />
    );
    const nextButton = screen.getByLabelText("다음 월");
    expect(nextButton).not.toBeDisabled();
  });

  it("이전 월 버튼은 항상 활성화된다", () => {
    render(
      <MonthNavigator
        currentMonth="2025-07"
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
      />
    );
    const prevButton = screen.getByLabelText("이전 월");
    expect(prevButton).not.toBeDisabled();
  });

  it("월 앞의 0을 제거하여 표시한다 (예: 01 → 1월)", () => {
    render(
      <MonthNavigator
        currentMonth="2025-01"
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
      />
    );
    expect(screen.getByText("2025년 1월")).toBeInTheDocument();
  });
});
