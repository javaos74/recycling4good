// 루트 페이지 — 로그인된 사용자는 분리배출 가이드 페이지로 리다이렉트
// 요구사항: 3.9

import { redirect } from "next/navigation";

export default function Home() {
  redirect("/guide");
}
