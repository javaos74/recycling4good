// 소셜 로그인 버튼 컴포넌트 렌더링 테스트
// 실제 SocialLoginButtons 컴포넌트를 렌더링하여 버튼, 에러 메시지 검증
// 요구사항: 1.1, 1.2, 1.8

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SocialLoginButtons, {
  getErrorMessage,
  ERROR_MESSAGES,
} from "@/components/auth/SocialLoginButtons";

// next-auth/react 모킹
const mockSignIn = vi.fn();
vi.mock("next-auth/react", () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
}));

// next/navigation 모킹
let mockSearchParams = new URLSearchParams();
vi.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
}));

describe("SocialLoginButtons 컴포넌트", () => {
  beforeEach(() => {
    mockSignIn.mockClear();
    mockSearchParams = new URLSearchParams();
  });

  it("카카오, 네이버, 구글 3개 로그인 버튼을 렌더링한다", () => {
    render(<SocialLoginButtons />);
    expect(screen.getByText("카카오로 시작하기")).toBeInTheDocument();
    expect(screen.getByText("네이버로 시작하기")).toBeInTheDocument();
    expect(screen.getByText("구글로 시작하기")).toBeInTheDocument();
  });

  it("카카오 버튼 클릭 시 signIn('kakao')를 호출한다", () => {
    render(<SocialLoginButtons />);
    fireEvent.click(screen.getByText("카카오로 시작하기"));
    expect(mockSignIn).toHaveBeenCalledWith("kakao", { callbackUrl: "/" });
  });

  it("네이버 버튼 클릭 시 signIn('naver')를 호출한다", () => {
    render(<SocialLoginButtons />);
    fireEvent.click(screen.getByText("네이버로 시작하기"));
    expect(mockSignIn).toHaveBeenCalledWith("naver", { callbackUrl: "/" });
  });

  it("구글 버튼 클릭 시 signIn('google')를 호출한다", () => {
    render(<SocialLoginButtons />);
    fireEvent.click(screen.getByText("구글로 시작하기"));
    expect(mockSignIn).toHaveBeenCalledWith("google", { callbackUrl: "/" });
  });

  it("에러 파라미터가 있으면 에러 메시지를 표시한다", () => {
    mockSearchParams = new URLSearchParams("error=OAuthSignin");
    render(<SocialLoginButtons />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(
      screen.getByText("소셜 로그인 요청 중 오류가 발생했습니다.")
    ).toBeInTheDocument();
  });

  it("에러 파라미터가 없으면 에러 메시지를 표시하지 않는다", () => {
    render(<SocialLoginButtons />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("3개 버튼 모두 button 타입이다", () => {
    render(<SocialLoginButtons />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
    buttons.forEach((btn) => expect(btn).toHaveAttribute("type", "button"));
  });
});

describe("getErrorMessage 유틸리티", () => {
  it("null 입력 시 null을 반환한다", () => {
    expect(getErrorMessage(null)).toBeNull();
  });

  it("알려진 에러 코드에 대해 한국어 메시지를 반환한다", () => {
    expect(getErrorMessage("OAuthSignin")).toBe(
      "소셜 로그인 요청 중 오류가 발생했습니다."
    );
    expect(getErrorMessage("AccessDenied")).toBe("로그인이 거부되었습니다.");
  });

  it("알 수 없는 에러 코드에 대해 기본 메시지를 반환한다", () => {
    expect(getErrorMessage("UnknownError")).toBe(
      "로그인에 실패했습니다. 다시 시도해주세요."
    );
  });

  it("모든 에러 코드에 비어있지 않은 메시지가 정의되어 있다", () => {
    for (const [, value] of Object.entries(ERROR_MESSAGES)) {
      expect(value).toBeTruthy();
    }
  });
});
