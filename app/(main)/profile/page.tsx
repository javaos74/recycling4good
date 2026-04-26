"use client";

// 프로필 설정 페이지
// 닉네임/거주 지역 변경, 소셜 계정 정보 표시, 로그아웃 기능
// 요구사항: 2.1, 2.2, 2.3, 2.4, 2.5

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import ProfileForm from "@/components/profile/ProfileForm";
import AccountInfo from "@/components/profile/AccountInfo";
import DeleteAccountDialog from "@/components/profile/DeleteAccountDialog";
import type { UserProfile } from "@/lib/types";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // 프로필 데이터 조회
  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();

      if (!res.ok || !data.success) {
        setLoadError(data.error?.message || "프로필을 불러오는 데 실패했습니다.");
        return;
      }

      setProfile(data.data);
      setLoadError(null);
    } catch {
      setLoadError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // 로그아웃 핸들러
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ redirectTo: "/login" });
    } catch {
      // signOut이 리다이렉트하므로 에러는 무시
      router.push("/login");
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-gray-500">프로필을 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태
  if (loadError || !profile) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-sm text-red-600">{loadError || "프로필을 불러올 수 없습니다."}</p>
        <button
          onClick={() => {
            setIsLoading(true);
            setLoadError(null);
            fetchProfile();
          }}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      {/* 페이지 제목 */}
      <h1 className="mb-6 text-xl font-bold text-gray-900">프로필 설정</h1>

      <div className="space-y-6">
        {/* 소셜 계정 정보 */}
        <AccountInfo socialProvider={profile.socialProvider} />

        {/* 프로필 수정 폼 */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="mb-4 text-sm font-medium text-gray-700">프로필 수정</h2>
          <ProfileForm
            initialNickname={profile.nickname || ""}
            initialRegion={profile.region || ""}
            onSuccess={fetchProfile}
          />
        </div>

        {/* 로그아웃 버튼 */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
        </button>

        {/* 회원 탈퇴 버튼 */}
        <button
          type="button"
          onClick={() => setIsDeleteDialogOpen(true)}
          className="w-full rounded-lg border border-red-300 bg-white px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          회원 탈퇴
        </button>
      </div>

      {/* 회원 탈퇴 확인 다이얼로그 */}
      <DeleteAccountDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
}
