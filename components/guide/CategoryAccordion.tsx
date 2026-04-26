// 카테고리별 아코디언 카드 목록 컴포넌트 — 클라이언트 컴포넌트
// RecyclingCategory 배열을 받아 아코디언 카드로 렌더링
// 요구사항: 6.1, 6.2, 6.4, 6.5, 6.6

"use client";

import type { RecyclingCategory } from "@/lib/types";
import Accordion from "@/components/ui/Accordion";
import ContaminationLevel from "@/components/guide/ContaminationLevel";

interface CategoryAccordionProps {
  /** 재활용 카테고리 배열 */
  categories: RecyclingCategory[];
}

export default function CategoryAccordion({ categories }: CategoryAccordionProps) {
  if (categories.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-500">
        가이드 정보를 불러오는 데 실패했습니다.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {categories.map((category) => (
        <Accordion
          key={category.id}
          header={
            <div className="flex items-center gap-2">
              <span className="text-xl" aria-hidden="true">{category.icon}</span>
              <span className="font-semibold text-gray-900">{category.name}</span>
            </div>
          }
        >
          {/* 품목 예시 */}
          <div className="mb-3">
            <h4 className="mb-1 text-xs font-medium text-gray-500">품목 예시</h4>
            <div className="flex flex-wrap gap-1.5">
              {category.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* 실용적 TIP */}
          <div className="mb-3 rounded-lg bg-blue-50 p-2.5">
            <p className="text-xs text-blue-700">
              <span className="font-semibold">💡 TIP:</span> {category.tip}
            </p>
          </div>

          {/* 오염도 3단계 */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-500">오염도별 처리 방법</h4>
            {category.levels.map((level) => (
              <ContaminationLevel key={level.level} level={level} />
            ))}
          </div>
        </Accordion>
      ))}
    </div>
  );
}
