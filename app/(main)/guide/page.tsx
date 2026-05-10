// 분리배출 가이드 페이지 — 서버 컴포넌트
// GuideHeader + GuideTabs 조합, Prisma로 직접 DB 조회
// 요구사항: 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2

import GuideHeader from "@/components/guide/GuideHeader";
import GuideTabs from "@/components/guide/GuideTabs";
import CategoryAccordion from "@/components/guide/CategoryAccordion";
import WasteRecordForm from "@/components/log/WasteRecordForm";
import { prisma } from "@/lib/prisma";
import type { RecyclingCategory } from "@/lib/types";

// 카테고리 데이터를 Prisma로 직접 조회
// 서버 컴포넌트에서는 API fetch 대신 DB 직접 접근 (세션 쿠키 전달 문제 방지)
async function getCategories(): Promise<RecyclingCategory[]> {
  try {
    const categories = await prisma.recyclingCategory.findMany({
      orderBy: { sortOrder: "asc" },
      include: { levels: true },
    });

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      items: cat.items,
      tip: cat.tip,
      levels: cat.levels.map((lv) => ({
        level: lv.level as "low" | "medium" | "high",
        label: lv.label,
        description: lv.description,
        action: lv.action,
        imageUrl: lv.imageUrl ?? null,
      })),
    }));
  } catch {
    return [];
  }
}

export default async function GuidePage() {
  const categories = await getCategories();

  // "분리배출 가이드" 탭 콘텐츠 — 카테고리 아코디언 카드 목록
  const guideContent = <CategoryAccordion categories={categories} />;

  // "배출량 입력" 탭 콘텐츠 — 배출 기록 입력 폼
  // 요구사항: 5.3, 5.5
  const inputContent = <WasteRecordForm />;

  return (
    <div>
      <GuideHeader />
      <GuideTabs guideContent={guideContent} inputContent={inputContent} />
    </div>
  );
}
