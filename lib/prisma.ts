// Prisma 클라이언트 싱글턴 인스턴스
// 개발 환경에서 핫 리로드 시 여러 Prisma 인스턴스가 생성되는 것을 방지합니다.

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
