// 분리배출 가이드 시드 데이터
// 6개 재활용 카테고리 × 3단계 오염도 = 18개 처리 방법 레코드

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 시드 데이터 정의: 서울시 분리배출 가이드 기준
const categories = [
  {
    name: "플라스틱",
    icon: "♻️",
    items: ["페트병", "PP용기", "플라스틱 트레이", "세제 용기", "샴푸 용기", "요거트 용기"],
    tip: "라벨을 제거하고 내용물을 비운 후 물로 헹궈서 배출하세요. 뚜껑은 별도 분리해주세요.",
    sortOrder: 1,
    levels: [
      {
        level: "low",
        label: "🟢 약한 오염",
        description: "물이나 세제로 쉽게 씻길 정도의 가벼운 오염",
        action: "내용물을 비우고 물로 한 번 헹군 후 재활용 배출하세요.",
      },
      {
        level: "medium",
        label: "🟡 중간 오염",
        description: "기름기나 음식물이 남아있지만 세척하면 제거 가능한 오염",
        action: "따뜻한 물과 세제로 기름기를 제거한 후 재활용 배출하세요. 라벨도 반드시 제거해주세요.",
      },
      {
        level: "high",
        label: "🔴 심한 오염",
        description: "씻어도 기름기나 음식물 냄새가 사라지지 않는 심한 오염",
        action: "재활용이 불가능합니다. 일반 쓰레기(종량제봉투)로 배출하세요.",
      },
    ],
  },
  {
    name: "비닐",
    icon: "🛍️",
    items: ["비닐봉지", "과자 봉지", "라면 봉지", "택배 비닐", "에어캡(뽁뽁이)", "식품 포장 랩"],
    tip: "이물질을 제거하고 투명 비닐과 유색 비닐을 구분하지 않아도 됩니다. 깨끗한 상태로 배출하세요.",
    sortOrder: 2,
    levels: [
      {
        level: "low",
        label: "🟢 약한 오염",
        description: "내용물이 거의 없고 가볍게 털어내면 깨끗해지는 상태",
        action: "이물질을 털어내고 비닐류 수거함에 재활용 배출하세요.",
      },
      {
        level: "medium",
        label: "🟡 중간 오염",
        description: "음식물이나 기름기가 묻어있지만 물로 씻으면 제거 가능한 상태",
        action: "물로 헹궈 이물질을 제거한 후 재활용 배출하세요. 물기를 털어내고 배출하면 좋습니다.",
      },
      {
        level: "high",
        label: "🔴 심한 오염",
        description: "기름, 양념 등이 깊이 배어 세척해도 제거되지 않는 상태",
        action: "재활용이 불가능합니다. 일반 쓰레기(종량제봉투)로 배출하세요.",
      },
    ],
  },
  {
    name: "종이",
    icon: "📄",
    items: ["신문지", "택배 상자", "종이 쇼핑백", "복사 용지", "우유팩", "종이컵"],
    tip: "택배 상자의 테이프와 스티커를 제거하고 접어서 배출하세요. 우유팩은 씻어서 별도 배출합니다.",
    sortOrder: 3,
    levels: [
      {
        level: "low",
        label: "🟢 약한 오염",
        description: "약간의 먼지나 가벼운 얼룩이 있는 정도",
        action: "테이프, 스티커 등 이물질을 제거하고 종이류로 재활용 배출하세요.",
      },
      {
        level: "medium",
        label: "🟡 중간 오염",
        description: "물에 젖었거나 일부 음식물이 묻어있는 상태",
        action: "오염된 부분을 잘라내고 깨끗한 부분만 재활용 배출하세요. 젖은 종이는 말린 후 배출합니다.",
      },
      {
        level: "high",
        label: "🔴 심한 오염",
        description: "기름이 배었거나 음식물로 심하게 오염된 상태 (치킨 박스, 피자 박스 등)",
        action: "재활용이 불가능합니다. 일반 쓰레기(종량제봉투)로 배출하세요.",
      },
    ],
  },
  {
    name: "스티로폼",
    icon: "📦",
    items: ["배달 음식 용기", "과일 포장재", "전자제품 완충재", "컵라면 용기", "아이스박스"],
    tip: "이물질을 제거하고 부피를 줄여서 배출하세요. 색깔이 있는 스티로폼은 일반 쓰레기입니다.",
    sortOrder: 4,
    levels: [
      {
        level: "low",
        label: "🟢 약한 오염",
        description: "내용물을 비운 후 가볍게 닦으면 깨끗해지는 상태",
        action: "이물질을 제거하고 스티로폼 전용 수거함에 재활용 배출하세요.",
      },
      {
        level: "medium",
        label: "🟡 중간 오염",
        description: "국물이나 소스가 묻어있지만 세척하면 제거 가능한 상태",
        action: "물로 깨끗이 세척한 후 물기를 제거하고 재활용 배출하세요. 테이프나 라벨도 제거해주세요.",
      },
      {
        level: "high",
        label: "🔴 심한 오염",
        description: "기름이나 양념이 깊이 배어 세척해도 제거되지 않는 상태",
        action: "재활용이 불가능합니다. 부피를 줄여 일반 쓰레기(종량제봉투)로 배출하세요.",
      },
    ],
  },
  {
    name: "유리",
    icon: "🫙",
    items: ["음료수 병", "소주병", "맥주병", "잼 병", "와인 병", "조미료 병"],
    tip: "뚜껑을 분리하고 내용물을 비운 후 배출하세요. 깨진 유리는 신문지에 싸서 종량제봉투에 넣으세요.",
    sortOrder: 5,
    levels: [
      {
        level: "low",
        label: "🟢 약한 오염",
        description: "내용물을 비우고 물로 헹구면 깨끗해지는 상태",
        action: "뚜껑을 분리하고 물로 헹군 후 유리병 전용 수거함에 재활용 배출하세요.",
      },
      {
        level: "medium",
        label: "🟡 중간 오염",
        description: "내용물 잔여물이 있지만 세척하면 제거 가능한 상태",
        action: "따뜻한 물로 내부를 깨끗이 세척한 후 유리병 전용 수거함에 재활용 배출하세요.",
      },
      {
        level: "high",
        label: "🔴 심한 오염",
        description: "도자기, 내열유리, 크리스탈 등 재활용 불가 유리이거나 심하게 오염된 상태",
        action: "재활용이 불가능합니다. 신문지로 감싸 '유리 조각'이라고 표기 후 종량제봉투에 배출하세요.",
      },
    ],
  },
  {
    name: "캔",
    icon: "🥫",
    items: ["음료 캔", "맥주 캔", "참치 캔", "통조림 캔", "부탄가스 캔", "알루미늄 호일"],
    tip: "내용물을 비우고 가능하면 압착하여 부피를 줄여 배출하세요. 부탄가스 캔은 구멍을 뚫어 가스를 빼주세요.",
    sortOrder: 6,
    levels: [
      {
        level: "low",
        label: "🟢 약한 오염",
        description: "내용물을 비우고 물로 헹구면 깨끗해지는 상태",
        action: "내용물을 비우고 물로 헹군 후 캔류 수거함에 재활용 배출하세요. 가능하면 압착해주세요.",
      },
      {
        level: "medium",
        label: "🟡 중간 오염",
        description: "기름기나 음식물이 남아있지만 세척하면 제거 가능한 상태",
        action: "따뜻한 물로 내부를 세척한 후 캔류 수거함에 재활용 배출하세요.",
      },
      {
        level: "high",
        label: "🔴 심한 오염",
        description: "페인트 캔, 오일 캔 등 유해물질이 묻어있거나 세척 불가능한 상태",
        action: "재활용이 불가능합니다. 유해물질이 묻은 캔은 폐기물 전용 수거함에, 그 외에는 종량제봉투에 배출하세요.",
      },
    ],
  },
];

// 시드 실행 함수
async function main() {
  console.log("🌱 분리배출 가이드 시드 데이터 투입을 시작합니다...");

  for (const category of categories) {
    // 카테고리 upsert (멱등성 보장)
    const createdCategory = await prisma.recyclingCategory.upsert({
      where: { name: category.name },
      update: {
        icon: category.icon,
        items: category.items,
        tip: category.tip,
        sortOrder: category.sortOrder,
      },
      create: {
        name: category.name,
        icon: category.icon,
        items: category.items,
        tip: category.tip,
        sortOrder: category.sortOrder,
      },
    });

    console.log(`  ✅ 카테고리 생성/업데이트: ${category.icon} ${category.name}`);

    // 오염도 레벨 upsert (멱등성 보장)
    for (const level of category.levels) {
      await prisma.contaminationLevel.upsert({
        where: {
          categoryId_level: {
            categoryId: createdCategory.id,
            level: level.level,
          },
        },
        update: {
          label: level.label,
          description: level.description,
          action: level.action,
        },
        create: {
          categoryId: createdCategory.id,
          level: level.level,
          label: level.label,
          description: level.description,
          action: level.action,
        },
      });
    }

    console.log(`    → ${category.levels.length}개 오염도 레벨 생성/업데이트 완료`);
  }

  console.log("\n🎉 시드 데이터 투입이 완료되었습니다!");
  console.log(`   총 ${categories.length}개 카테고리, ${categories.length * 3}개 처리 방법 레코드`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ 시드 데이터 투입 중 오류가 발생했습니다:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
