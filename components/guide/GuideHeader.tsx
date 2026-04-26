// 분리배출 가이드 헤더 컴포넌트 — 서버 컴포넌트
// "분리배출 전 꼭 확인하세요" 안내 문구 및 오염도 기준 설명 표시
// 요구사항: 5.1, 5.2

export default function GuideHeader() {
  return (
    <section className="mb-6 rounded-xl bg-white p-4 shadow-sm">
      {/* 안내 문구 */}
      <h2 className="mb-3 text-lg font-bold text-gray-900">
        분리배출 전 꼭 확인하세요
      </h2>

      {/* 오염도 기준 설명 */}
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 shrink-0">🟢</span>
          <p>
            <span className="font-semibold text-gray-800">약한 오염</span> —
            물·세제로 씻길 정도
          </p>
        </div>
        <div className="flex items-start gap-2">
          <span className="mt-0.5 shrink-0">🟡</span>
          <p>
            <span className="font-semibold text-gray-800">중간 오염</span> —
            기름기·음식물 잔여
          </p>
        </div>
        <div className="flex items-start gap-2">
          <span className="mt-0.5 shrink-0">🔴</span>
          <p>
            <span className="font-semibold text-gray-800">심한 오염</span> —
            씻어도 사라지지 않는 오염
          </p>
        </div>
      </div>
    </section>
  );
}
