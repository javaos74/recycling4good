# ♻️ 서울시 일반쓰레기 줄이기 트래커

시민들이 올바른 분리배출을 실천하고 배출량을 추적할 수 있도록 돕는 모바일 웹 애플리케이션입니다.

## 주요 기능 (Phase 1)

- **소셜 로그인** — 카카오, 네이버, 구글 계정으로 간편 가입/로그인
- **분리배출 가이드** — 6개 재활용 카테고리(플라스틱, 비닐, 종이, 스티로폼, 유리, 캔)별 오염도 3단계 처리 방법 안내
- **배출량 기록** — 날짜별 무게/종량제봉투 기록, 월별 요약 대시보드, 배출 타임라인
- **프로필 관리** — 닉네임/거주 지역 설정, 회원 탈퇴

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 14 (App Router) + TypeScript |
| 스타일링 | Tailwind CSS |
| 인증 | Auth.js (NextAuth v5) — 카카오/네이버/구글 |
| ORM | Prisma |
| 데이터베이스 | PostgreSQL |
| 테스트 | Vitest + React Testing Library + fast-check |
| 유효성 검증 | Zod |

## 프로젝트 구조

```
app/
├── (auth)/                    # 인증 (로그인, 온보딩)
├── (main)/                    # 메인 앱 (인증 필요)
│   ├── guide/                 # 분리배출 가이드
│   ├── log/                   # 배출량 기록
│   ├── profile/               # 프로필 설정
│   ├── dashboard/             # 현황 & 단체 (Phase 2)
│   ├── ranking/               # 비교 & 랭킹 (Phase 2)
│   └── community/             # 소통 & 팁 (Phase 2)
├── api/
│   ├── auth/[...nextauth]/    # Auth.js API
│   ├── guide/categories/      # 분리배출 가이드 API
│   ├── profile/               # 프로필 API
│   └── waste-records/         # 배출량 기록 API
components/
├── auth/                      # 로그인/온보딩 컴포넌트
├── guide/                     # 가이드 컴포넌트
├── log/                       # 배출량 기록 컴포넌트
├── profile/                   # 프로필 컴포넌트
├── layout/                    # 레이아웃/네비게이션
└── ui/                        # 범용 UI (Accordion, Dialog, Dropdown)
lib/
├── prisma.ts                  # Prisma 클라이언트 싱글턴
├── types.ts                   # 공통 타입 정의
├── constants.ts               # 상수 (지역, 봉투 크기)
├── validations.ts             # 유효성 검증 함수
├── waste-calculations.ts      # 월별 집계 유틸리티
└── serialization.ts           # 데이터 직렬화 (Zod)
```

## 시작하기

### 사전 요구사항

- Node.js 20+
- PostgreSQL
- 카카오/네이버/구글 OAuth 앱 등록

### 설치

```bash
npm install
```

### 환경변수 설정

`.env.local` 파일에 다음 값을 설정하세요:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/seoul_waste_tracker?schema=public"
AUTH_SECRET="your-auth-secret"
NEXTAUTH_URL="http://localhost:3000"

# 카카오 OAuth
AUTH_KAKAO_ID="your-kakao-client-id"
AUTH_KAKAO_SECRET="your-kakao-client-secret"

# 네이버 OAuth
AUTH_NAVER_ID="your-naver-client-id"
AUTH_NAVER_SECRET="your-naver-client-secret"

# 구글 OAuth
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
```

### 데이터베이스 설정

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인할 수 있습니다.

## 테스트

```bash
# 전체 테스트 실행
npx vitest --run

# 감시 모드
npx vitest
```

## 빌드

```bash
npm run build
npm start
```

## OAuth 콜백 URL

| 프로바이더 | 콜백 URL |
|-----------|----------|
| 카카오 | `{도메인}/api/auth/callback/kakao` |
| 네이버 | `{도메인}/api/auth/callback/naver` |
| 구글 | `{도메인}/api/auth/callback/google` |

## 라이선스

Private
