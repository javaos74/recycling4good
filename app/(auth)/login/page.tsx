// 로그인 페이지 — 서버 컴포넌트
// 카카오, 네이버, 구글 소셜 로그인 버튼을 표시
// 모바일 우선 반응형 디자인, 한국어 UI
// 요구사항: 1.1, 1.2, 1.8, 3.4, 3.5

import { Suspense } from "react";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8">
      {/* 앱 로고 및 타이틀 영역 */}
      <div className="mb-8 text-center">
        <div className="mb-4 text-5xl">♻️</div>
        <h1 className="text-xl font-bold text-gray-900">
          서울시 일반쓰레기 줄이기 트래커
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          올바른 분리배출을 실천하고 배출량을 추적해보세요
        </p>
      </div>

      {/* 소셜 로그인 버튼 영역 — Suspense로 감싸서 useSearchParams 지원 */}
      <Suspense
        fallback={
          <div className="w-full max-w-sm mx-auto flex flex-col gap-3">
            <div className="h-12 rounded-lg bg-gray-200 animate-pulse" />
            <div className="h-12 rounded-lg bg-gray-200 animate-pulse" />
            <div className="h-12 rounded-lg bg-gray-200 animate-pulse" />
          </div>
        }
      >
        <SocialLoginButtons />
      </Suspense>

      {/* 하단 안내 문구 */}
      <p className="mt-8 text-center text-xs text-gray-400">
        소셜 계정으로 간편하게 시작할 수 있습니다
      </p>
    </main>
  );
}
