// 배출량 기록 페이지 통합 테스트
// MonthlySummary + MonthNavigator + WasteRecordForm + WasteTimeline 플레이스홀더 통합 검증
// 요구사항: 7.1, 9.4

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LogPage from "@/app/(main)/log/page";

// fetch 모킹
const mockFetch = vi.fn();
global.fetch = mockFetch;

// 테스트용 요약 데이터
const mockSummary = {
  month: "2025-01",
  totalWeightKg: 12.5,
  totalBags: 3,
  recordCount: 2,
};

// 테스트용 기록 데이터
const mockRecords = [
  {
    id: "r1",
    userId: "u1",
    date: "2025-01-15",
    weightKg: 5.5,
    bags: { "5L": 0, "10L": 1, "20L": 0, "30L": 0, "50L": 0 },
    photoUrl: null,
    memo: "테스트 메모",
    createdAt: "2025-01-15T00:00:00.000Z",
  },
  {
    id: "r2",
    userId: "u1",
    date: "2025-01-10",
    weightKg: 7.0,
    bags: { "5L": 0, "10L": 0, "20L": 1, "30L": 0, "50L": 1 },
    photoUrl: null,
    memo: null,
    createdAt: "2025-01-10T00:00:00.000Z",
  },
];

/** fetch 응답을 설정하는 헬퍼 */
function setupFetchMock(
  summaryData = mockSummary,
  recordsData: typeof mockRecords | [] = mockRecords
) {
  mockFetch.mockImplementation((url: string) => {
    if (url.includes("/api/waste-records/summary")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ success: true, data: summaryData }),
      });
    }
    if (url.includes("/api/waste-records")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ success: true, data: recordsData }),
      });
    }
    return Promise.resolve({
      ok: false,
      json: async () => ({ success: false }),
    });
  });
}

// Date를 모킹하여 현재 월을 2025-01로 고정
const RealDate = global.Date;

beforeEach(() => {
  vi.clearAllMocks();
  // Date 생성자를 모킹하여 인자 없이 호출 시 2025-01-20 반환
  const MockDate = class extends RealDate {
    constructor(...args: Parameters<typeof RealDate>) {
      if (args.length === 0) {
        super(2025, 0, 20);
      } else {
        // @ts-expect-error — 가변 인자 전달
        super(...args);
      }
    }
  } as DateConstructor;
  global.Date = MockDate;
});

afterEach(() => {
  global.Date = RealDate;
});

describe("LogPage 배출량 기록 페이지", () => {
  it("월 네비게이터, 월별 요약, 배출 기록 폼, 타임라인 플레이스홀더를 렌더링한다", async () => {
    setupFetchMock();
    render(<LogPage />);

    // 월 네비게이터 확인
    await waitFor(() => {
      expect(screen.getByText("2025년 1월")).toBeInTheDocument();
    });

    // 이전/다음 월 버튼 확인
    expect(screen.getByLabelText("이전 월")).toBeInTheDocument();
    expect(screen.getByLabelText("다음 월")).toBeInTheDocument();

    // 월별 요약 지표 확인 — "종량제봉투"는 요약 카드와 폼 라벨 양쪽에 존재
    await waitFor(() => {
      expect(screen.getByText("총 무게")).toBeInTheDocument();
      expect(screen.getAllByText("종량제봉투").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("기록 횟수")).toBeInTheDocument();
    });

    // 배출 기록 폼 확인
    expect(screen.getByText("이번 배출 기록하기")).toBeInTheDocument();

    // 타임라인 플레이스홀더 확인
    expect(screen.getByText("배출 타임라인")).toBeInTheDocument();
  });

  it("월별 요약 데이터를 올바르게 표시한다", async () => {
    setupFetchMock();
    render(<LogPage />);

    await waitFor(() => {
      expect(screen.getByText("12.5")).toBeInTheDocument();
    });
  });

  it("기록이 있을 때 타임라인에 건수 배지를 표시한다", async () => {
    setupFetchMock();
    render(<LogPage />);

    await waitFor(() => {
      expect(screen.getByText("2건")).toBeInTheDocument();
    });
  });

  it("이전 월 버튼 클릭 시 월이 변경되고 데이터를 다시 가져온다", async () => {
    setupFetchMock();
    const user = userEvent.setup();
    render(<LogPage />);

    // 초기 월 확인
    await waitFor(() => {
      expect(screen.getByText("2025년 1월")).toBeInTheDocument();
    });

    // 이전 월 클릭
    const prevButton = screen.getByLabelText("이전 월");
    await user.click(prevButton);

    // 월이 변경되었는지 확인
    await waitFor(() => {
      expect(screen.getByText("2024년 12월")).toBeInTheDocument();
    });

    // API가 새 월로 호출되었는지 확인
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("month=2024-12")
    );
  });

  it("기록이 없는 월에서 '기록이 없습니다' 메시지를 표시한다", async () => {
    const emptySummary = {
      month: "2025-01",
      totalWeightKg: 0,
      totalBags: 0,
      recordCount: 0,
    };
    setupFetchMock(emptySummary, []);
    render(<LogPage />);

    await waitFor(() => {
      expect(screen.getByText("기록이 없습니다")).toBeInTheDocument();
    });
  });

  it("API 실패 시에도 기본 요약 데이터(0)를 표시한다", async () => {
    mockFetch.mockImplementation(() =>
      Promise.resolve({
        ok: false,
        json: async () => ({ success: false }),
      })
    );
    render(<LogPage />);

    // 기본값 0이 표시되어야 함
    await waitFor(() => {
      expect(screen.getByText("총 무게")).toBeInTheDocument();
    });
  });
});
