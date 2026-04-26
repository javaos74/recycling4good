// WasteRecordForm 컴포넌트 렌더링 및 동작 테스트
// 폼 필드 렌더링, 입력 검증, 저장 동작 검증
// 요구사항: 8.1, 8.6, 8.7, 8.8, 8.9

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WasteRecordForm from "@/components/log/WasteRecordForm";

// fetch 모킹
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("WasteRecordForm 컴포넌트", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("폼 제목 '이번 배출 기록하기'를 표시한다", () => {
    render(<WasteRecordForm />);
    expect(screen.getByText("이번 배출 기록하기")).toBeInTheDocument();
  });

  it("날짜, 무게, 종량제봉투, 사진, 메모 필드를 렌더링한다", () => {
    render(<WasteRecordForm />);
    expect(screen.getByLabelText(/날짜/)).toBeInTheDocument();
    expect(screen.getByLabelText(/무게/)).toBeInTheDocument();
    expect(screen.getByText("종량제봉투")).toBeInTheDocument();
    expect(screen.getByText("사진 (선택)")).toBeInTheDocument();
    expect(screen.getByLabelText(/메모/)).toBeInTheDocument();
  });

  it("'+ 기록 저장하기' 버튼을 렌더링한다", () => {
    render(<WasteRecordForm />);
    expect(screen.getByRole("button", { name: /기록 저장하기/ })).toBeInTheDocument();
  });

  it("무게 입력에 숫자만 허용한다", async () => {
    const user = userEvent.setup();
    render(<WasteRecordForm />);

    const weightInput = screen.getByLabelText(/무게/);
    await user.type(weightInput, "12.5");
    expect(weightInput).toHaveValue("12.5");
  });

  it("무게 입력에 문자를 입력하면 무시된다", async () => {
    const user = userEvent.setup();
    render(<WasteRecordForm />);

    const weightInput = screen.getByLabelText(/무게/);
    await user.type(weightInput, "abc");
    expect(weightInput).toHaveValue("");
  });

  it("무게와 봉투 모두 입력하지 않으면 에러 메시지를 표시한다", async () => {
    const user = userEvent.setup();
    render(<WasteRecordForm />);

    const submitButton = screen.getByRole("button", { name: /기록 저장하기/ });
    await user.click(submitButton);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "무게 또는 종량제봉투 중 하나 이상을 입력해주세요."
    );
  });

  it("저장 성공 시 성공 메시지를 표시하고 폼을 초기화한다", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { id: "1", date: "2025-01-01", weightKg: 2.5 },
      }),
    });

    render(<WasteRecordForm onSave={onSave} />);

    // 무게 입력
    const weightInput = screen.getByLabelText(/무게/);
    await user.type(weightInput, "2.5");

    // 저장
    const submitButton = screen.getByRole("button", { name: /기록 저장하기/ });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("배출 기록이 저장되었습니다!")).toBeInTheDocument();
    });

    // onSave 콜백 호출 확인
    expect(onSave).toHaveBeenCalled();

    // 폼 초기화 확인 — 무게 입력이 비워짐
    expect(weightInput).toHaveValue("");
  });

  it("API 실패 시 에러 메시지를 표시한다", async () => {
    const user = userEvent.setup();

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        error: { code: "INTERNAL_ERROR", message: "기록 저장에 실패했습니다." },
      }),
    });

    render(<WasteRecordForm />);

    const weightInput = screen.getByLabelText(/무게/);
    await user.type(weightInput, "1.0");

    const submitButton = screen.getByRole("button", { name: /기록 저장하기/ });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("기록 저장에 실패했습니다.");
    });
  });
});
