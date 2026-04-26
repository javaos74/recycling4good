// 모바일 우선 반응형 래퍼 컴포넌트
// 320px 이상 화면에서 정상 표시, 큰 화면에서는 중앙 정렬 및 최대 너비 제한

interface MobileLayoutProps {
  children: React.ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-lg min-w-[320px]">
        {children}
      </div>
    </div>
  );
}
