// WasteTimeline 컴포넌트 렌더링 테스트
// 배출 타임라인: 날짜 역순 기록 표시, 배지, 빈 상태 메시지 검증
// 요구사항: 9.1, 9.2, 9.3, 9.5

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import WasteTimeline from "@/components/log/WasteTimeline";
import type { WasteRecord } from "@/lib/types";

// 테스트용 기록 데이터 (날짜 역순 정렬)
const mockRecords: WasteRecord[] = [
  {
    id: "r1",
    userId: "u1",
    date: "2025-01-20",
    weightKg: 3.5,
    bags: { "5L": 0, "10L": 2, "20L": 0, "30L": 0, "50L": 0 },
    photoUrl: null,
    memo: null,
    createdAt: new Date("2025-01-20T00:00:00.000Z"),
  },
  {
    id: "r2",
    userId: "u1",
    date: "2025-01-15",
    weightKg: 7.0,
    bags: { "5L": 1, "10L": 0, "20L": 1, "30L": 0, "50L": 0 },
    photoUrl: null,
    memo: "테스트",
    createdAt: new Date("2025-01-15T00:00:00.000Z"),
  },
  {
    id: "r3",
    userId: "u1",
    date: "2025-01-05",
    weightKg: 1.2,
    bags: { "5L": 0, "10L": 0, "20L": 0, "30L": 0, "50L": 1 },
    photoUrl: null,
    memo: null,
    createdAt: new Date("2025-01-05T00:00:00.000Z"),
  },
];

describe("WasteTimeline 컴포넌트", () => {
  it("기록이 없을 때 '기록이 없습니다' 메시지를 표시한다", () => {
    render(<WasteTimeline records={[]} />);
    expect(screen.getByText("기록이 없습니다")).toBeInTheDocument();
  });

  it("기록이 없을 때 배지를 표시하지 않는다", () => {
    render(<WasteTimeline records={[]} />);
    expect(screen.queryByText(/건$/)).not.toBeInTheDocument();
  });

  it("기록 횟수 배지를 표시한다", () => {
    render(<WasteTimeline records={mockRecords} />);
    expect(screen.getByText("3건")).toBeInTheDocument();
  });

  it("각 기록의 날짜를 한국어 형식으로 표시한다", () => {
    render(<WasteTimeline records={mockRecords} />);
    expect(screen.getByText("1월 20일")).toBeInTheDocument();
    expect(screen.getByText("1월 15일")).toBeInTheDocument();
    expect(screen.getByText("1월 5일")).toBeInTheDocument();
  });

  it("각 기록의 무게(kg)를 표시한다", () => {
    render(<WasteTimeline records={mockRecords} />);
    expect(screen.getByText("3.5kg")).toBeInTheDocument();
    expect(screen.getByText("7kg")).toBeInTheDocument();
    expect(screen.getByText("1.2kg")).toBeInTheDocument();
  });

  it("개수가 0보다 큰 봉투 크기만 표시한다", () => {
    render(<WasteTimeline records={mockRecords} />);
    // r1: 10L × 2
    expect(screen.getByText("10L × 2")).toBeInTheDocument();
    // r2: 5L × 1, 20L × 1
    expect(screen.getByText("5L × 1")).toBeInTheDocument();
    expect(screen.getByText("20L × 1")).toBeInTheDocument();
    // r3: 50L × 1
    expect(screen.getByText("50L × 1")).toBeInTheDocument();
  });

  it("봉투 개수가 모두 0인 기록에서는 봉투 정보를 표시하지 않는다", () => {
    const noBagRecord: WasteRecord[] = [
      {
        id: "r-no-bag",
        userId: "u1",
        date: "2025-02-01",
        weightKg: 2.0,
        bags: { "5L": 0, "10L": 0, "20L": 0, "30L": 0, "50L": 0 },
        photoUrl: null,
        memo: null,
        createdAt: new Date("2025-02-01T00:00:00.000Z"),
      },
    ];
    render(<WasteTimeline records={noBagRecord} />);
    // 무게는 표시되지만 봉투 태그는 없어야 함
    expect(screen.getByText("2kg")).toBeInTheDocument();
    expect(screen.queryByText(/L × /)).not.toBeInTheDocument();
  });

  it("'배출 타임라인' 제목을 표시한다", () => {
    render(<WasteTimeline records={mockRecords} />);
    expect(screen.getByText("배출 타임라인")).toBeInTheDocument();
  });

  it("기록 항목 수만큼 리스트 아이템을 렌더링한다", () => {
    render(<WasteTimeline records={mockRecords} />);
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(3);
  });
});
