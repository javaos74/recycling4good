// Accordion 범용 아코디언 컴포넌트 테스트
// 펼침/접힘 토글 동작, 접근성 속성 검증
// 요구사항: 6.7

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Accordion from "@/components/ui/Accordion";

describe("Accordion 컴포넌트", () => {
  const header = <span>헤더 텍스트</span>;
  const body = <p>본문 콘텐츠</p>;

  it("헤더를 항상 표시한다", () => {
    render(<Accordion header={header}>{body}</Accordion>);
    expect(screen.getByText("헤더 텍스트")).toBeInTheDocument();
  });

  it("기본 상태에서 본문이 숨겨져 있다", () => {
    render(<Accordion header={header}>{body}</Accordion>);
    expect(screen.queryByText("본문 콘텐츠")).not.toBeInTheDocument();
  });

  it("defaultOpen=true일 때 본문이 표시된다", () => {
    render(
      <Accordion header={header} defaultOpen>
        {body}
      </Accordion>
    );
    expect(screen.getByText("본문 콘텐츠")).toBeInTheDocument();
  });

  it("클릭 시 본문이 펼쳐진다", async () => {
    const user = userEvent.setup();
    render(<Accordion header={header}>{body}</Accordion>);

    await user.click(screen.getByRole("button"));
    expect(screen.getByText("본문 콘텐츠")).toBeInTheDocument();
  });

  it("펼친 상태에서 다시 클릭하면 본문이 접힌다", async () => {
    const user = userEvent.setup();
    render(<Accordion header={header}>{body}</Accordion>);

    // 펼치기
    await user.click(screen.getByRole("button"));
    expect(screen.getByText("본문 콘텐츠")).toBeInTheDocument();

    // 접기
    await user.click(screen.getByRole("button"));
    expect(screen.queryByText("본문 콘텐츠")).not.toBeInTheDocument();
  });

  it("aria-expanded 속성이 토글 상태를 반영한다", async () => {
    const user = userEvent.setup();
    render(<Accordion header={header}>{body}</Accordion>);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-expanded", "false");

    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");

    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("토글 2회 수행 시 원래 상태로 복귀한다 (라운드트립)", async () => {
    const user = userEvent.setup();
    render(<Accordion header={header}>{body}</Accordion>);

    const button = screen.getByRole("button");

    // 초기: 접힘
    expect(screen.queryByText("본문 콘텐츠")).not.toBeInTheDocument();

    // 1회 토글: 펼침
    await user.click(button);
    // 2회 토글: 접힘 (원래 상태)
    await user.click(button);
    expect(screen.queryByText("본문 콘텐츠")).not.toBeInTheDocument();
  });
});
