// 메인 앱 레이아웃 — 네비게이션 탭 및 모바일 래퍼 포함
// 로그인된 사용자만 접근 가능한 영역의 공통 레이아웃

import MobileLayout from "@/components/layout/MobileLayout";
import NavigationTabs from "@/components/layout/NavigationTabs";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MobileLayout>
      <NavigationTabs />
      <main className="px-4 py-4">{children}</main>
    </MobileLayout>
  );
}
