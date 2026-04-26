// PhotoUpload 컴포넌트 렌더링 테스트
// 사진 업로드 영역 표시, 파일 선택/제거 동작 검증
// 요구사항: 8.5

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PhotoUpload from "@/components/log/PhotoUpload";

describe("PhotoUpload 컴포넌트", () => {
  it("파일이 없을 때 업로드 버튼을 표시한다", () => {
    render(<PhotoUpload file={null} onChange={() => {}} />);
    expect(screen.getByText("사진 촬영 또는 갤러리에서 선택")).toBeInTheDocument();
  });

  it("파일이 선택되면 파일명과 삭제 버튼을 표시한다", () => {
    const file = new File(["test"], "photo.jpg", { type: "image/jpeg" });
    render(<PhotoUpload file={file} onChange={() => {}} />);
    expect(screen.getByText("photo.jpg")).toBeInTheDocument();
    expect(screen.getByLabelText("사진 제거")).toBeInTheDocument();
  });

  it("삭제 버튼 클릭 시 onChange(null)을 호출한다", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const file = new File(["test"], "photo.jpg", { type: "image/jpeg" });
    render(<PhotoUpload file={file} onChange={onChange} />);

    await user.click(screen.getByLabelText("사진 제거"));
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it("image/* 파일만 허용하는 input을 가진다", () => {
    render(<PhotoUpload file={null} onChange={() => {}} />);
    const input = screen.getByLabelText("사진 업로드");
    expect(input).toHaveAttribute("accept", "image/*");
  });
});
