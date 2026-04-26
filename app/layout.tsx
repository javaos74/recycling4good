import type { Metadata } from "next";
import SessionProvider from "@/components/providers/SessionProvider";
import "./globals.css";

// 앱 메타데이터 설정
export const metadata: Metadata = {
  title: "서울시 일반쓰레기 줄이기 트래커",
  description:
    "시민들이 올바른 분리배출을 실천하고 배출량을 추적할 수 있도록 돕는 모바일 웹 애플리케이션",
};

// 루트 레이아웃 — 한국어 lang 설정, SessionProvider로 세션 컨텍스트 제공
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
