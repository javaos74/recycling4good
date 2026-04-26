"use client";

// 연결된 소셜 계정 정보 표시 컴포넌트
// 소셜 프로바이더명(카카오/네이버/구글)을 한국어로 표시
// 요구사항: 2.3

/** 소셜 프로바이더 코드를 한국어 서비스명으로 변환 */
function getProviderLabel(provider: string): string {
  const map: Record<string, string> = {
    kakao: "카카오",
    naver: "네이버",
    google: "구글",
  };
  return map[provider] || provider;
}

/** 소셜 프로바이더별 아이콘 색상 */
function getProviderColor(provider: string): string {
  const map: Record<string, string> = {
    kakao: "bg-yellow-400",
    naver: "bg-green-500",
    google: "bg-blue-500",
  };
  return map[provider] || "bg-gray-400";
}

interface AccountInfoProps {
  /** 소셜 프로바이더 코드 ("kakao" | "naver" | "google") */
  socialProvider: string;
}

export default function AccountInfo({ socialProvider }: AccountInfoProps) {
  const label = getProviderLabel(socialProvider);
  const color = getProviderColor(socialProvider);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-medium text-gray-700">연결된 소셜 계정</h3>
      <div className="flex items-center gap-3">
        {/* 프로바이더 색상 인디케이터 */}
        <span
          className={`inline-block h-3 w-3 rounded-full ${color}`}
          aria-hidden="true"
        />
        <span className="text-sm text-gray-900">{label} 계정으로 로그인됨</span>
      </div>
    </div>
  );
}
