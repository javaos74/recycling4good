// 상단 네비게이션 탭 컴포넌트
// 5개 주요 섹션 간 이동 탭 + 설정(프로필/로그아웃) 아이콘
// Phase 2 탭은 "준비 중" 페이지로 연결

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// 탭 정의: label(표시 텍스트), href(라우트 경로), phase(구현 단계)
export const tabs = [
  { label: "현황 & 단체", href: "/dashboard", phase: 2 },
  { label: "분리배출 가이드", href: "/guide", phase: 1 },
  { label: "배출량 기록", href: "/log", phase: 1 },
  { label: "비교 & 랭킹", href: "/ranking", phase: 2 },
  { label: "소통 & 팁", href: "/community", phase: 2 },
] as const;

// 현재 경로가 탭에 해당하는지 확인하는 유틸리티 함수
export function isTabActive(pathname: string, tabHref: string): boolean {
  return pathname.startsWith(tabHref);
}

export default function NavigationTabs() {
  const pathname = usePathname();
  const isProfileActive = pathname.startsWith("/profile");

  return (
    <nav
      className="border-b border-gray-200 bg-white"
      aria-label="메인 네비게이션"
    >
      <div className="flex items-center">
        {/* 탭 영역 — 가로 스크롤 */}
        <ul className="flex min-w-0 flex-1 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = pathname.startsWith(tab.href);

            return (
              <li key={tab.href} className="flex-shrink-0">
                <Link
                  href={tab.href}
                  className={`relative block whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* 설정(프로필) 아이콘 — 우측 고정 */}
        <Link
          href="/profile"
          className={`flex-shrink-0 border-l border-gray-200 px-3 py-3 transition-colors ${
            isProfileActive
              ? "text-green-600"
              : "text-gray-400 hover:text-gray-600"
          }`}
          aria-label="설정"
          aria-current={isProfileActive ? "page" : undefined}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </Link>
      </div>
    </nav>
  );
}
