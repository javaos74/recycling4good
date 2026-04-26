// 범용 다이얼로그 컴포넌트 렌더링 테스트
// 실제 Dialog 컴포넌트를 렌더링하여 열기/닫기, 버튼, 접근성 검증

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Dialog from "@/components/ui/Dialog";

describe("Dialog 컴포넌트", () => {
  const defaultProps = {
    isOpen: true,
    title: "테스트 제목",
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  it("isOpen이 true이면 다이얼로그를 렌더링한다", () => {
    render(<Dialog {...defaultProps}>본문 내용</Dialog>);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("테스트 제목")).toBeInTheDocument();
    expect(screen.getByText("본문 내용")).toBeInTheDocument();
  });

  it("isOpen이 false이면 다이얼로그를 렌더링하지 않는다", () => {
    render(
      <Dialog {...defaultProps} isOpen={false}>
        본문 내용
      </Dialog>
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("확인 버튼 클릭 시 onConfirm을 호출한다", () => {
    const onConfirm = vi.fn();
    render(
      <Dialog {...defaultProps} onConfirm={onConfirm}>
        본문
      </Dialog>
    );
    fireEvent.click(screen.getByText("확인"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("취소 버튼 클릭 시 onCancel을 호출한다", () => {
    const onCancel = vi.fn();
    render(
      <Dialog {...defaultProps} onCancel={onCancel}>
        본문
      </Dialog>
    );
    fireEvent.click(screen.getByText("취소"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("커스텀 버튼 라벨을 표시한다", () => {
    render(
      <Dialog {...defaultProps} confirmLabel="삭제하기" cancelLabel="돌아가기">
        본문
      </Dialog>
    );
    expect(screen.getByText("삭제하기")).toBeInTheDocument();
    expect(screen.getByText("돌아가기")).toBeInTheDocument();
  });

  it("Escape 키로 다이얼로그를 닫는다", () => {
    const onCancel = vi.fn();
    render(
      <Dialog {...defaultProps} onCancel={onCancel}>
        본문
      </Dialog>
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("isConfirmDisabled가 true이면 확인 버튼이 비활성화된다", () => {
    render(
      <Dialog {...defaultProps} isConfirmDisabled>
        본문
      </Dialog>
    );
    expect(screen.getByText("확인")).toBeDisabled();
  });

  it("aria-modal 속성이 설정되어 있다", () => {
    render(<Dialog {...defaultProps}>본문</Dialog>);
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
  });
});
