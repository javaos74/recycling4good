// 네비게이션 탭 컴포넌트 렌더링 테스트
// 실제 NavigationTabs 컴포넌트를 렌더링하여 탭 표시, 활성 상태 검증
// 요구사항: 3.1, 3.2, 3.3

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import NavigationTabs, {
  tabs,
  isTabActive,
} from "@/components/layout/NavigationTabs";

// next/navigation 모킹
let mockPathname = "/guide";
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

// next/link 모킹 — 실제 <a> 태그로 렌더링
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("NavigationTabs 컴포넌트", () => {
  it("5개 네비게이션 탭을 모두 렌더링한다", () => {
    render(<NavigationTabs />);
    expect(screen.getByText("현황 & 단체")).toBeInTheDocument();
    expect(screen.getByText("분리배출 가이드")).toBeInTheDocument();
    expect(screen.getByText("배출량 기록")).toBeInTheDocument();
    expect(screen.getByText("비교 & 랭킹")).toBeInTheDocument();
    expect(screen.getByText("소통 & 팁")).toBeInTheDocument();
  });

  it("현재 경로에 해당하는 탭에 aria-current='page'가 설정된다", () => {
    mockPathname = "/guide";
    render(<NavigationTabs />);
    const guideLink = screen.getByText("분리배출 가이드").closest("a");
    expect(guideLink).toHaveAttribute("aria-current", "page");
  });

  it("현재 경로가 아닌 탭에는 aria-current가 없다", () => {
    mockPathname = "/guide";
    render(<NavigationTabs />);
    const logLink = screen.getByText("배출량 기록").closest("a");
    expect(logLink).not.toHaveAttribute("aria-current");
  });

  it("각 탭이 올바른 href를 가진다", () => {
    render(<NavigationTabs />);
    expect(screen.getByText("현황 & 단체").closest("a")).toHaveAttribute(
      "href",
      "/dashboard"
    );
    expect(screen.getByText("분리배출 가이드").closest("a")).toHaveAttribute(
      "href",
      "/guide"
    );
    expect(screen.getByText("배출량 기록").closest("a")).toHaveAttribute(
      "href",
      "/log"
    );
  });

  it("nav 요소에 aria-label이 설정되어 있다", () => {
    render(<NavigationTabs />);
    expect(screen.getByLabelText("메인 네비게이션")).toBeInTheDocument();
  });
});

describe("tabs 데이터", () => {
  it("5개 탭이 정의되어 있다", () => {
    expect(tabs).toHaveLength(5);
  });

  it("Phase 1 탭은 분리배출 가이드와 배출량 기록이다", () => {
    const phase1 = tabs.filter((t) => t.phase === 1);
    expect(phase1.map((t) => t.label)).toEqual([
      "분리배출 가이드",
      "배출량 기록",
    ]);
  });

  it("모든 탭의 href가 고유하다", () => {
    const hrefs = tabs.map((t) => t.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});

describe("isTabActive 유틸리티", () => {
  it("정확히 일치하는 경로에서 true를 반환한다", () => {
    expect(isTabActive("/guide", "/guide")).toBe(true);
  });

  it("하위 경로에서도 true를 반환한다", () => {
    expect(isTabActive("/guide/detail", "/guide")).toBe(true);
  });

  it("다른 경로에서 false를 반환한다", () => {
    expect(isTabActive("/guide", "/log")).toBe(false);
  });
});
