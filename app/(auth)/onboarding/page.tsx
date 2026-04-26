// 온보딩 페이지 — 서버 컴포넌트
// 최초 소셜 로그인 후 닉네임 및 거주 지역 설정 화면
// 요구사항: 1.5, 1.6, 1.7

import OnboardingForm from "@/components/auth/OnboardingForm";

export default function OnboardingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8">
      {/* 헤더 영역 */}
      <div className="mb-8 text-center">
        <div className="mb-4 text-5xl">👋</div>
        <h1 className="text-xl font-bold text-gray-900">프로필 설정</h1>
        <p className="mt-2 text-sm text-gray-500">
          닉네임과 거주 지역을 설정하면 앱을 사용할 수 있습니다
        </p>
      </div>

      {/* 온보딩 폼 */}
      <OnboardingForm />

      {/* 하단 안내 문구 */}
      <p className="mt-8 text-center text-xs text-gray-400">
        설정한 정보는 나중에 프로필에서 변경할 수 있습니다
      </p>
    </main>
  );
}
