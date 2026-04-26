// 소셜 계정 정보 컴포넌트 렌더링 테스트
// 실제 AccountInfo 컴포넌트를 렌더링하여 프로바이더별 표시 검증
// 요구사항: 2.3

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AccountInfo from "@/components/profile/AccountInfo";

describe("AccountInfo 컴포넌트", () => {
  it("카카오 프로바이더를 한국어로 표시한다", () => {
    render(<AccountInfo socialProvider="kakao" />);
    expect(screen.getByText("카카오 계정으로 로그인됨")).toBeInTheDocument();
  });

  it("네이버 프로바이더를 한국어로 표시한다", () => {
    render(<AccountInfo socialProvider="naver" />);
    expect(screen.getByText("네이버 계정으로 로그인됨")).toBeInTheDocument();
  });

  it("구글 프로바이더를 한국어로 표시한다", () => {
    render(<AccountInfo socialProvider="google" />);
    expect(screen.getByText("구글 계정으로 로그인됨")).toBeInTheDocument();
  });

  it("알 수 없는 프로바이더는 원본 코드를 표시한다", () => {
    render(<AccountInfo socialProvider="github" />);
    expect(screen.getByText("github 계정으로 로그인됨")).toBeInTheDocument();
  });

  it("연결된 소셜 계정 제목을 표시한다", () => {
    render(<AccountInfo socialProvider="kakao" />);
    expect(screen.getByText("연결된 소셜 계정")).toBeInTheDocument();
  });
});
