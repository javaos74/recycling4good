# 구현 계획: 서울시 일반쓰레기 줄이기 트래커 (Phase 1)

## 개요

Phase 1은 회원 가입(소셜 로그인, 프로필 관리, 회원 탈퇴), 분리배출 가이드(6개 카테고리별 오염도 3단계), 배출량 기록(월별 요약, 입력 폼, 타임라인)을 구현합니다. Next.js 14 App Router + TypeScript + Tailwind CSS + Auth.js + Prisma + PostgreSQL 기술 스택을 사용합니다.

## Tasks

- [x] 1. 프로젝트 초기 설정 및 핵심 인프라 구성
  - [x] 1.1 Next.js 14 프로젝트 생성 및 기본 설정
    - `npx create-next-app@latest` 으로 App Router + TypeScript + Tailwind CSS 프로젝트 생성
    - `tsconfig.json` 경로 별칭(`@/`) 설정 확인
    - 프로젝트 루트에 `.env.local` 파일 생성 (OAuth 키, DATABASE_URL 등 환경변수 템플릿)
    - _요구사항: 3.4, 3.5_
  - [x] 1.2 Prisma ORM 및 PostgreSQL 설정
    - `prisma`, `@prisma/client` 설치
    - `prisma/schema.prisma` 파일 작성: User, Account, Session, VerificationToken, RecyclingCategory, ContaminationLevel, WasteRecord 모델 정의 (design.md 데이터 모델 참조)
    - `npx prisma migrate dev --name init` 으로 초기 마이그레이션 실행
    - `lib/prisma.ts` — Prisma 클라이언트 싱글턴 인스턴스 생성
    - _요구사항: 15.1, 15.4_
  - [x] 1.3 Auth.js (NextAuth v5) 설정 및 소셜 프로바이더 등록
    - `next-auth@beta`, `@auth/prisma-adapter` 설치
    - `auth.ts` 파일 작성: KakaoProvider, NaverProvider, GoogleProvider 설정, PrismaAdapter 연결
    - `app/api/auth/[...nextauth]/route.ts` API 라우트 생성
    - Auth.js 콜백 설정: session 콜백에 `isOnboarded` 포함, signIn 콜백에 최초 가입 시 온보딩 리다이렉트 로직
    - _요구사항: 1.2, 1.3, 1.4, 1.9_
  - [x] 1.4 OAuth 앱 등록 안내 및 환경변수 설정
    - 카카오 개발자 콘솔(developers.kakao.com): 앱 생성, 카카오 로그인 활성화, Redirect URI 설정 (`{도메인}/api/auth/callback/kakao`)
    - 네이버 개발자 센터(developers.naver.com): 앱 등록, 네아로 API 사용 신청, Callback URL 설정 (`{도메인}/api/auth/callback/naver`)
    - 구글 클라우드 콘솔(console.cloud.google.com): OAuth 2.0 클라이언트 ID 생성, 승인된 리디렉션 URI 설정 (`{도메인}/api/auth/callback/google`)
    - `.env.local`에 각 프로바이더의 CLIENT_ID, CLIENT_SECRET 환경변수 추가
    - _요구사항: 1.1, 1.2_
  - [x] 1.5 Next.js 미들웨어 작성 (인증 보호)
    - `middleware.ts` 작성: 로그인하지 않은 사용자 → `/login` 리다이렉트, 프로필 미완성(`isOnboarded=false`) → `/onboarding` 리다이렉트
    - `/login`, `/onboarding`, `/api/auth` 경로는 인증 불필요로 제외
    - _요구사항: 1.5, 1.10_
  - [x] 1.6 공통 API 응답 타입 및 유틸리티 정의
    - `lib/types.ts` — ApiResponse, ApiErrorResponse, ApiSuccessResponse 타입 정의
    - `lib/constants.ts` — VALID_REGIONS(17개 광역시/도), VALID_BAG_SIZES 상수 정의
    - `lib/validations.ts` — 프로필 유효성 검증 함수(`validateProfile`), 배출 기록 유효성 검증 함수(`validateWasteRecord`) 작성
    - _요구사항: 1.6, 1.7, 8.6, 8.8_

- [x] 2. 체크포인트 — 프로젝트 초기 설정 확인
  - 모든 의존성 설치 확인, Prisma 마이그레이션 정상 실행 확인, Auth.js 설정 파일 정상 로드 확인. 문제가 있으면 사용자에게 질문하세요.

- [x] 3. 소셜 로그인 및 온보딩 구현
  - [x] 3.1 로그인 페이지 구현 (`app/(auth)/login/page.tsx`)
    - 카카오, 네이버, 구글 소셜 로그인 버튼 3개 렌더링
    - 각 버튼 클릭 시 `signIn(provider)` 호출
    - 인증 실패/취소 시 에러 메시지 표시 (URL 쿼리 파라미터 `error` 확인)
    - 모바일 우선 반응형 디자인, 한국어 UI
    - `components/auth/SocialLoginButtons.tsx` 컴포넌트 분리
    - _요구사항: 1.1, 1.2, 1.8, 3.4, 3.5_
  - [x] 3.2 온보딩 페이지 구현 (`app/(auth)/onboarding/page.tsx`)
    - `components/auth/OnboardingForm.tsx` — 닉네임 입력(1~20자, 공백만 불가) + 거주 지역 드롭다운(17개 광역시/도)
    - 필수 입력 검증: 닉네임과 거주 지역 모두 설정되어야 제출 가능
    - 제출 시 `POST /api/profile/onboarding` 호출 → 성공 시 메인 페이지로 리다이렉트
    - `components/ui/Dropdown.tsx` — 범용 드롭다운 컴포넌트
    - _요구사항: 1.5, 1.6, 1.7_
  - [ ]* 3.3 속성 기반 테스트 — 프로필 유효성 검증 (Property 1)
    - **Property 1: 프로필 유효성 검증 — 닉네임과 거주 지역이 모두 유효해야 온보딩 완료**
    - fast-check으로 임의의 닉네임/거주 지역 조합 생성, `validateProfile` 함수가 유효한 입력만 통과시키는지 검증
    - **검증: 요구사항 1.6**
  - [x] 3.4 프로필 API 라우트 구현
    - `app/api/profile/route.ts` — GET(프로필 조회), PUT(닉네임/거주 지역 수정), DELETE(회원 탈퇴)
    - `app/api/profile/onboarding/route.ts` — POST(최초 프로필 설정, `isOnboarded=true` 업데이트)
    - 세션 기반 인증 확인, 유효성 검증 적용
    - _요구사항: 1.3, 1.6, 2.1, 2.2, 2.9_

- [x] 4. 프로필 관리 및 회원 탈퇴 구현
  - [x] 4.1 프로필 설정 페이지 구현 (`app/(main)/profile/page.tsx`)
    - `components/profile/ProfileForm.tsx` — 닉네임 변경, 거주 지역 변경 폼
    - `components/profile/AccountInfo.tsx` — 연결된 소셜 계정 정보(서비스명) 표시
    - 로그아웃 버튼: 클릭 시 `signOut()` 호출 → 로그인 화면 이동
    - _요구사항: 2.1, 2.2, 2.3, 2.4, 2.5_
  - [x] 4.2 회원 탈퇴 기능 구현
    - `components/profile/DeleteAccountDialog.tsx` — 탈퇴 확인 다이얼로그
    - "탈퇴 시 모든 데이터(배출량 기록, 게시글, 댓글 등)가 영구 삭제됩니다" 경고 문구 표시
    - 확인 시 `DELETE /api/profile` 호출 → 계정 및 모든 관련 데이터 Cascade 삭제 → 로그인 화면 이동
    - 취소 시 다이얼로그 닫기, 프로필 설정 화면 유지
    - `components/ui/Dialog.tsx` — 범용 확인 다이얼로그 컴포넌트
    - _요구사항: 2.6, 2.7, 2.8, 2.9, 2.10_

- [x] 5. 앱 레이아웃 및 네비게이션 구현
  - [x] 5.1 루트 레이아웃 및 메인 레이아웃 구현
    - `app/layout.tsx` — 루트 레이아웃 (한국어 lang 설정, Tailwind CSS 글로벌 스타일)
    - `app/(main)/layout.tsx` — 메인 레이아웃 (네비게이션 탭 포함)
    - `components/layout/MobileLayout.tsx` — 모바일 우선 반응형 래퍼 (320px 이상)
    - _요구사항: 3.4, 3.5_
  - [x] 5.2 네비게이션 탭 구현
    - `components/layout/NavigationTabs.tsx` — 상단 5개 탭 ("현황 & 단체", "분리배출 가이드", "배출량 기록", "비교 & 랭킹", "소통 & 팁")
    - 현재 활성 탭 시각적 구분 (하이라이트/언더라인)
    - Phase 2 탭(현황 & 단체, 비교 & 랭킹, 소통 & 팁)은 "준비 중" 표시 또는 빈 페이지로 연결
    - 기본 표시 섹션: "분리배출 가이드" (Phase 1에서 현황 & 단체는 미구현이므로)
    - _요구사항: 3.1, 3.2, 3.3, 3.6_

- [x] 6. 체크포인트 — 인증 및 레이아웃 확인
  - 소셜 로그인 → 온보딩 → 메인 페이지 플로우 정상 동작 확인, 네비게이션 탭 전환 확인. 문제가 있으면 사용자에게 질문하세요.

- [x] 7. 분리배출 가이드 구현
  - [x] 7.1 분리배출 가이드 DB 시드 데이터 작성
    - `prisma/seed.ts` — 6개 카테고리(플라스틱, 비닐, 종이, 스티로폼, 유리, 캔) × 3단계 오염도 = 18개 처리 방법 레코드 시드
    - 각 카테고리에 품목 예시(items), 실용적 TIP(tip), 표시 순서(sortOrder) 포함
    - `package.json`에 `prisma.seed` 스크립트 설정, `npx prisma db seed` 실행
    - _요구사항: 6.1, 6.5, 6.6_
  - [x] 7.2 분리배출 가이드 API 구현
    - `app/api/guide/categories/route.ts` — GET: 전체 카테고리 목록 조회 (sortOrder 순, ContaminationLevel 포함)
    - `app/api/guide/categories/[id]/route.ts` — GET: 특정 카테고리 상세 조회
    - _요구사항: 6.1, 6.2_
  - [x] 7.3 분리배출 가이드 페이지 구현 (`app/(main)/guide/page.tsx`)
    - `components/guide/GuideHeader.tsx` — "분리배출 전 꼭 확인하세요" 안내 문구, 오염도 기준 설명
    - `components/guide/GuideTabs.tsx` — "분리배출 가이드" / "배출량 입력" 두 개 탭
    - _요구사항: 5.1, 5.2, 5.3, 5.4, 5.5_
  - [x] 7.4 아코디언 카드 컴포넌트 구현
    - `components/ui/Accordion.tsx` — 범용 아코디언 컴포넌트 (펼침/접힘 토글)
    - `components/guide/CategoryAccordion.tsx` — 카테고리별 아코디언 카드 목록 렌더링
    - `components/guide/ContaminationLevel.tsx` — 오염도 단계별 처리 방법 표시 (🟢/🟡/🔴 아이콘)
    - 아코디언 클릭 시 펼침, 다시 클릭 시 접힘
    - _요구사항: 6.1, 6.2, 6.3, 6.4, 6.7_
  - [ ]* 7.5 속성 기반 테스트 — 아코디언 카드 수 일치 (Property 2)
    - **Property 2: 아코디언 카드 수 일치 — 카테고리 수만큼 아코디언 카드가 렌더링됨**
    - fast-check으로 임의 길이의 RecyclingCategory 배열 생성, 렌더링된 카드 수가 배열 길이와 동일한지 검증
    - **검증: 요구사항 6.1**
  - [ ]* 7.6 속성 기반 테스트 — 아코디언 펼침 시 오염도 단계 완전 표시 (Property 3)
    - **Property 3: 아코디언 펼침 시 오염도 단계 완전 표시**
    - fast-check으로 임의의 RecyclingCategory 생성, 펼침 시 모든 ContaminationLevel이 표시되고 action이 비어있지 않은지 검증
    - **검증: 요구사항 6.2, 6.4**
  - [ ]* 7.7 속성 기반 테스트 — 오염도 레벨-아이콘 매핑 정확성 (Property 4)
    - **Property 4: 오염도 레벨-아이콘 매핑 정확성**
    - fast-check으로 임의의 ContaminationLevel 생성, level 값에 따라 올바른 아이콘(🟢/🟡/🔴)이 매핑되는지 검증
    - **검증: 요구사항 6.3**
  - [ ]* 7.8 속성 기반 테스트 — 카테고리 데이터 완전성 (Property 5)
    - **Property 5: 카테고리 데이터 완전성**
    - fast-check으로 임의의 RecyclingCategory 생성, items 비어있지 않음, tip 비어있지 않음, levels에 3단계 모두 포함 검증
    - **검증: 요구사항 6.5, 6.6**
  - [ ]* 7.9 속성 기반 테스트 — 아코디언 토글 라운드트립 (Property 6)
    - **Property 6: 아코디언 토글 라운드트립**
    - fast-check으로 임의의 초기 상태에서 토글 2회 수행 후 원래 상태로 복귀하는지 검증
    - **검증: 요구사항 6.7**

- [x] 8. 체크포인트 — 분리배출 가이드 확인
  - 시드 데이터 정상 투입 확인, 6개 카테고리 아코디언 렌더링 확인, 오염도 3단계 표시 확인. 문제가 있으면 사용자에게 질문하세요.

- [x] 9. 배출량 기록 — 월별 요약 대시보드 구현
  - [x] 9.1 배출량 기록 API 구현
    - `app/api/waste-records/route.ts` — GET(월별 기록 목록 조회, `?month=YYYY-MM`), POST(배출 기록 생성)
    - `app/api/waste-records/summary/route.ts` — GET(월별 요약: 총 무게, 봉투 합계, 기록 횟수)
    - 세션 기반 인증, 유효성 검증 적용
    - _요구사항: 7.1, 7.5, 8.7, 8.8_
  - [x] 9.2 월별 집계 유틸리티 함수 구현
    - `lib/waste-calculations.ts` — `calculateMonthlySummary(records)`: 총 무게 합산, 봉투 합계, 기록 횟수 계산
    - 기록이 없는 월은 모든 지표 0 반환
    - _요구사항: 17.1, 17.2, 17.3_
  - [ ]* 9.3 속성 기반 테스트 — 월별 집계 정확성 (Property 9)
    - **Property 9: 월별 집계 정확성**
    - fast-check으로 임의의 WasteRecord 배열 생성, 월별 총 무게가 해당 월 기록들의 weightKg 합과 동일하고, 기록 횟수가 배열 길이와 동일한지 검증
    - **검증: 요구사항 17.4, 17.5, 17.6**
  - [x] 9.4 월별 요약 대시보드 컴포넌트 구현
    - `components/log/MonthlySummary.tsx` — 이번달 총 무게(kg), 종량제봉투 합계(개), 기록 횟수(회) 3가지 지표 카드
    - `components/log/MonthNavigator.tsx` — 좌/우 화살표로 월 이동, 현재 월보다 미래 월 이동 불가 (우측 화살표 비활성화)
    - _요구사항: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 10. 배출량 기록 — 입력 폼 구현
  - [x] 10.1 배출 기록 입력 폼 구현
    - `components/log/WasteRecordForm.tsx` — "이번 배출 기록하기" 폼: 날짜 선택(달력 피커), 무게 입력(kg, 숫자만), 종량제봉투 크기 선택, 사진 업로드, 메모 입력
    - `components/log/BagSizeSelector.tsx` — 5L/10L/20L/30L/50L 봉투 크기별 +/- 버튼, 개수 최솟값 0 제한
    - `components/log/PhotoUpload.tsx` — 사진 업로드 영역 (카메라 촬영/이미지 갤러리 선택)
    - 필수 입력 검증: 날짜 필수, 무게 또는 종량제봉투 중 하나 이상 입력
    - 저장 성공 시 폼 초기화 + 성공 피드백, 월별 요약 갱신
    - _요구사항: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9_
  - [x] 10.2 배출량 기록 페이지 통합 (`app/(main)/log/page.tsx`)
    - MonthlySummary + MonthNavigator + WasteRecordForm + WasteTimeline 통합
    - 월 변경 시 요약 및 타임라인 데이터 갱신
    - _요구사항: 7.1, 9.4_

- [x] 11. 배출량 기록 — 타임라인 구현
  - [x] 11.1 배출 타임라인 컴포넌트 구현
    - `components/log/WasteTimeline.tsx` — 현재 선택 월의 기록을 날짜 역순 표시
    - 각 기록 항목: 날짜, 무게(kg), 종량제봉투 정보 표시
    - 해당 월 총 기록 횟수 배지 표시
    - 기록 없는 월: "기록이 없습니다" 안내 메시지
    - _요구사항: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 12. 데이터 직렬화 및 유효성 검증 유틸리티 구현
  - [x] 12.1 데이터 직렬화/역직렬화 유틸리티 구현
    - `lib/serialization.ts` — WasteRecord JSON 직렬화/역직렬화 함수
    - JSON 파싱 실패 시 오류 로그 + 기본값 반환
    - Zod 스키마를 활용한 데이터 구조 검증
    - _요구사항: 16.1, 16.2, 16.3, 16.4_
  - [ ]* 12.2 속성 기반 테스트 — 데이터 직렬화 라운드트립 (Property 7)
    - **Property 7: 데이터 직렬화 라운드트립 — 배출량 기록**
    - fast-check으로 임의의 유효한 WasteRecord 생성, JSON 직렬화 후 역직렬화하면 원본과 동일한지 검증
    - **검증: 요구사항 16.3**

- [x] 13. 체크포인트 — 배출량 기록 전체 기능 확인
  - 배출 기록 입력 → 저장 → 월별 요약 갱신 → 타임라인 표시 플로우 확인, 월 이동 동작 확인. 문제가 있으면 사용자에게 질문하세요.

- [x] 14. 전체 통합 및 마무리
  - [x] 14.1 분리배출 가이드 탭에서 배출량 입력 연결
    - "분리배출 가이드" 페이지의 "배출량 입력" 탭 클릭 시 배출량 기록 입력 폼으로 전환
    - _요구사항: 5.3, 5.5_
  - [x] 14.2 Phase 2 플레이스홀더 페이지 생성
    - `app/(main)/dashboard/page.tsx` — "현황 & 단체 — 준비 중입니다" 플레이스홀더
    - `app/(main)/ranking/page.tsx` — "비교 & 랭킹 — 준비 중입니다" 플레이스홀더
    - `app/(main)/community/page.tsx` — "소통 & 팁 — 준비 중입니다" 플레이스홀더
    - _요구사항: 3.1, 3.2_

- [x] 15. 최종 체크포인트 — Phase 1 전체 기능 확인
  - 전체 사용자 플로우 확인: 소셜 로그인 → 온보딩 → 분리배출 가이드 조회 → 배출량 기록 → 프로필 관리/탈퇴. 모든 테스트 통과 확인. 문제가 있으면 사용자에게 질문하세요.

## Notes

- `*` 표시된 태스크는 선택 사항이며 빠른 MVP를 위해 건너뛸 수 있습니다
- 각 태스크는 관련 요구사항 번호를 참조합니다
- 체크포인트에서 점진적 검증을 수행합니다
- 속성 기반 테스트는 fast-check 라이브러리를 사용하며 정확성 속성(Correctness Properties)을 검증합니다
- Phase 2 기능(현황 & 단체, 비교 & 랭킹, 소통 & 팁)은 플레이스홀더만 생성합니다
