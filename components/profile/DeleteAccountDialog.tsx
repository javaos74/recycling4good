"use client";

// 회원 탈퇴 확인 다이얼로그 컴포넌트
// 탈퇴 경고 문구 표시, 확인 시 DELETE /api/profile 호출 후 로그아웃
// 요구사항: 2.6, 2.7, 2.8, 2.9, 2.10

import { useState } from "react";
import { signOut } from "next-auth/react";
import Dialog from "@/components/ui/Dialog";

interface DeleteAccountDialogProps {
  /** 다이얼로그 표시 여부 */
  isOpen: boolean;
  /** 닫기 핸들러 */
  onClose: () => void;
}

export default function DeleteAccountDialog({
  isOpen,
  onClose,
}: DeleteAccountDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 회원 탈퇴 처리
  const handleConfirm = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch("/api/profile", { method: "DELETE" });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error?.message || "탈퇴 처리에 실패했습니다. 다시 시도해주세요.");
        setIsDeleting(false);
        return;
      }

      // 탈퇴 성공 → 로그아웃 후 로그인 화면으로 이동
      await signOut({ redirectTo: "/login" });
    } catch {
      setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
      setIsDeleting(false);
    }
  };

  // 취소 핸들러 — 에러 상태 초기화 후 닫기
  const handleCancel = () => {
    setError(null);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      title="회원 탈퇴"
      confirmLabel={isDeleting ? "탈퇴 처리 중..." : "탈퇴하기"}
      cancelLabel="취소"
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      destructive
      isConfirmDisabled={isDeleting}
    >
      <div className="space-y-3">
        {/* 경고 아이콘 + 경고 문구 */}
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm font-medium text-red-800">
            ⚠️ 탈퇴 시 모든 데이터(배출량 기록, 게시글, 댓글 등)가 영구 삭제됩니다
          </p>
        </div>
        <p className="text-sm text-gray-500">
          이 작업은 되돌릴 수 없습니다. 정말 탈퇴하시겠습니까?
        </p>

        {/* 에러 메시지 */}
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    </Dialog>
  );
}
