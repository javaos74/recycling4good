// GuideTabs 컴포넌트 렌더링 및 탭 전환 테스트
// "분리배출 가이드" / "배출량 입력" 탭 동작 검증
// 요구사항: 5.3, 5.4, 5.5

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GuideTabs from "@/components/guide/GuideTabs";

// 테스트용 콘텐츠
const guideContent = <div>가이드 콘텐츠</div>;
const inputContent = <div>배출량 입력 콘텐츠</div>;

describe("GuideTabs 컴포넌트", () => {
  it('"분리배출 가이드"와 "배출량 입력" 두 개 탭을 표시한다', () => {
    render(
      <GuideTabs guideContent={guideContent} inputContent={inputContent} />
    );
    expect(screen.getByRole("tab", { name: "분리배출 가이드" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "배출량 입력" })).toBeInTheDocument();
  });

  it("기본으로 '분리배출 가이드' 탭이 활성화되어 있다", () => {
    render(
      <GuideTabs guideContent={guideContent} inputContent={inputContent} />
    );
    const guideTab = screen.getByRole("tab", { name: "분리배출 가이드" });
    expect(guideTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("가이드 콘텐츠")).toBeInTheDocument();
  });

  it("'배출량 입력' 탭 클릭 시 해당 콘텐츠를 표시한다", async () => {
    const user = userEvent.setup();
    render(
      <GuideTabs guideContent={guideContent} inputContent={inputContent} />
    );

    await user.click(screen.getByRole("tab", { name: "배출량 입력" }));

    expect(screen.getByText("배출량 입력 콘텐츠")).toBeInTheDocument();
    expect(screen.queryByText("가이드 콘텐츠")).not.toBeInTheDocument();
  });

  it("'분리배출 가이드' 탭으로 다시 전환할 수 있다", async () => {
    const user = userEvent.setup();
    render(
      <GuideTabs guideContent={guideContent} inputContent={inputContent} />
    );

    // 배출량 입력 탭으로 전환
    await user.click(screen.getByRole("tab", { name: "배출량 입력" }));
    expect(screen.getByText("배출량 입력 콘텐츠")).toBeInTheDocument();

    // 다시 분리배출 가이드 탭으로 전환
    await user.click(screen.getByRole("tab", { name: "분리배출 가이드" }));
    expect(screen.getByText("가이드 콘텐츠")).toBeInTheDocument();
    expect(screen.queryByText("배출량 입력 콘텐츠")).not.toBeInTheDocument();
  });

  it("활성 탭의 aria-selected가 true이고 비활성 탭은 false이다", async () => {
    const user = userEvent.setup();
    render(
      <GuideTabs guideContent={guideContent} inputContent={inputContent} />
    );

    const guideTab = screen.getByRole("tab", { name: "분리배출 가이드" });
    const inputTab = screen.getByRole("tab", { name: "배출량 입력" });

    // 초기 상태
    expect(guideTab).toHaveAttribute("aria-selected", "true");
    expect(inputTab).toHaveAttribute("aria-selected", "false");

    // 탭 전환 후
    await user.click(inputTab);
    expect(guideTab).toHaveAttribute("aria-selected", "false");
    expect(inputTab).toHaveAttribute("aria-selected", "true");
  });
});
