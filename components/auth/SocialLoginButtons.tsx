"use client";

// 소셜 로그인 버튼 컴포넌트
// 카카오, 네이버, 구글 3개 프로바이더의 로그인 버튼을 렌더링
// 각 버튼 클릭 시 next-auth/react의 signIn 함수를 호출하여 OAuth 인증 시작

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

// 인증 에러 코드별 한국어 메시지 매핑
export const ERROR_MESSAGES: Record<string, string> = {
  OAuthSignin: "소셜 로그인 요청 중 오류가 발생했습니다.",
  OAuthCallback: "소셜 로그인 처리 중 오류가 발생했습니다.",
  OAuthCreateAccount: "계정 생성 중 오류가 발생했습니다.",
  OAuthAccountNotLinked: "이미 다른 소셜 계정으로 가입된 이메일입니다.",
  Callback: "로그인 처리 중 오류가 발생했습니다.",
  AccessDenied: "로그인이 거부되었습니다.",
  default: "로그인에 실패했습니다. 다시 시도해주세요.",
};

// 에러 코드에 해당하는 한국어 메시지 반환
export function getErrorMessage(error: string | null): string | null {
  if (!error) return null;
  return ERROR_MESSAGES[error] || ERROR_MESSAGES.default;
}

export default function SocialLoginButtons() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const errorMessage = getErrorMessage(error);

  // 소셜 로그인 핸들러 — 프로바이더별 signIn 호출
  const handleSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col gap-3">
      {/* 에러 메시지 표시 영역 */}
      {errorMessage && (
        <div
          role="alert"
          className="mb-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      )}

      {/* 카카오 로그인 버튼 */}
      <button
        type="button"
        onClick={() => handleSignIn("kakao")}
        className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
        style={{ backgroundColor: "#FEE500", color: "#191919" }}
      >
        <KakaoIcon />
        카카오로 시작하기
      </button>

      {/* 네이버 로그인 버튼 */}
      <button
        type="button"
        onClick={() => handleSignIn("naver")}
        className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        style={{ backgroundColor: "#03C75A" }}
      >
        <NaverIcon />
        네이버로 시작하기
      </button>

      {/* 구글 로그인 버튼 */}
      <button
        type="button"
        onClick={() => handleSignIn("google")}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
      >
        <GoogleIcon />
        구글로 시작하기
      </button>
    </div>
  );
}

// 카카오 아이콘 SVG
function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M9 1C4.58 1 1 3.79 1 7.21c0 2.17 1.45 4.08 3.64 5.18-.16.56-.58 2.03-.66 2.34-.1.39.14.38.3.28.12-.08 1.94-1.32 2.73-1.86.64.09 1.3.14 1.99.14 4.42 0 8-2.79 8-6.08C17 3.79 13.42 1 9 1z"
        fill="#191919"
      />
    </svg>
  );
}

// 네이버 아이콘 SVG
function NaverIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M12.13 9.72L5.61 1H1v16h4.87V9.28L12.39 18H17V1h-4.87v8.72z"
        fill="white"
      />
    </svg>
  );
}

// 구글 아이콘 SVG
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}
