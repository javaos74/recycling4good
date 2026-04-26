// 회원 탈퇴 다이얼로그 렌더링 테스트
// 실제 DeleteAccountDialog 컴포넌트를 렌더링하여 경고 문구, 버튼 동작 검증
// 요구사항: 2.6, 2.7, 2.8, 2.9, 2.10

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DeleteAccountDialog from "@/components/profile/DeleteAccountDialog";

// next-auth/react 모킹
vi.mock("next-auth/react", () => ({
  signOut: vi.fn(),
}));

describe("DeleteAccountDialog 컴포넌트", () => {
  it("isOpen이 true이면 다이얼로그를 렌더링한다", () => {
    render(<DeleteAccountDialog isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("isOpen이 false이면 다이얼로그를 렌더링하지 않는다", () => {
    render(<DeleteAccountDialog isOpen={false} onClose={vi.fn()} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("회원 탈퇴 제목을 표시한다", () => {
    render(<DeleteAccountDialog isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText("회원 탈퇴")).toBeInTheDocument();
  });

  it("영구 삭제 경고 문구를 표시한다", () => {
    render(<DeleteAccountDialog isOpen={true} onClose={vi.fn()} />);
    expect(
      screen.getByText(/탈퇴 시 모든 데이터.*영구 삭제됩니다/)
    ).toBeInTheDocument();
  });

  it("경고 문구에 배출량 기록, 게시글, 댓글이 포함되어 있다", () => {
    render(<DeleteAccountDialog isOpen={true} onClose={vi.fn()} />);
    const warning = screen.getByText(/탈퇴 시 모든 데이터/);
    expect(warning.textContent).toContain("배출량 기록");
    expect(warning.textContent).toContain("게시글");
    expect(warning.textContent).toContain("댓글");
  });

  it("탈퇴하기 버튼과 취소 버튼을 표시한다", () => {
    render(<DeleteAccountDialog isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText("탈퇴하기")).toBeInTheDocument();
    expect(screen.getByText("취소")).toBeInTheDocument();
  });

  it("취소 버튼 클릭 시 onClose를 호출한다", () => {
    const onClose = vi.fn();
    render(<DeleteAccountDialog isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByText("취소"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("되돌릴 수 없다는 안내 문구를 표시한다", () => {
    render(<DeleteAccountDialog isOpen={true} onClose={vi.fn()} />);
    expect(
      screen.getByText("이 작업은 되돌릴 수 없습니다. 정말 탈퇴하시겠습니까?")
    ).toBeInTheDocument();
  });
});
