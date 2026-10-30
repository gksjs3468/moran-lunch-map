import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 모란역 주변 런치 검색 키워드
const SEARCH_KEYWORDS = [
  '모란역 밥집',
  '모란역 백반',
  '모란역 국밥',
  '모란역 김밥',
  '모란역 순대국',
  '모란역 돈까스',
  '모란역 분식',
  '모란역 짜장면',
  '모란역 칼국수',
  '모란역 찌개',
  '모란역 덮밥',
  '모란역 한식'
];

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// 안전한 JSON 파서
function extractApolloJson(html) {
  const startPattern = '__APOLLO_STATE__ = ';
  const startIdx = html.indexOf(startPattern);
  if (startIdx === -1) return null;

  const jsonStart = startIdx + startPattern.length;
  let depth = 0;
  let inString = false;
  let escape = false;
  let jsonEnd = -1;

  for (let i = jsonStart; i < html.length; i++) {
    const char = html[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (char === '\\') {
      escape = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    if (!inString) {
      if (char === '{') depth++;
      else if (char === '}') {
        depth--;
        if (depth === 0) {
          jsonEnd = i + 1;
          break;
        }
      }
    }
  }

  if (jsonEnd === -1) return null;
  return JSON.parse(html.slice(jsonStart, jsonEnd));
}

async function scrapeKeyword(keyword) {
  const url = `https://m.search.naver.com/search.naver?query=${encodeURIComponent(keyword)}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    });
    const html = await res.text();
    const data = extractApolloJson(html);
    if (!data) return [];

    const list = [];
    for (const val of Object.values(data)) {
      if (val && val.__typename === 'PlaceListBusinessesItem') {
        const id = val.id;
        const name = val.name.replace(/<[^>]*>/g, '').trim(); // HTML 태그 제거
        const lat = parseFloat(val.y);
        const lng = parseFloat(val.x);
        const categoryRaw = val.category?.split(',')[0] || '한식';
        const address = val.roadAddress || val.address || val.fullAddress || '';
        const phone = val.phone || '';
        const naverMapUrl = `https://map.naver.com/p/entry/place/${val.id}`;
        const imageUrl = val.imageUrl || '';
        const reviewCount = parseInt(val.visitorReviewCount || 0, 10);

        // 모란역 반경 유효 좌표 체크 (모란역 상권 위도 37.425 ~ 37.442, 경도 127.120 ~ 127.138)
        if (lat >= 37.425 && lat <= 37.442 && lng >= 127.120 && lng <= 127.138) {
          // 사용자가 직접 확인하지 않은 스크랩 식당은 부정확한 메뉴를 지어내지 않고 빈 배열로 둠
          const parsedMenus = [];

          list.push({
            id: `scraped-${id}`,
            name,
            category: categoryRaw,
            address,
            lat,
            lng,
            phone,
            naverMapUrl,
            imageUrl,
            reviewCount,
            budgetFriendly: true,
            avgPrice: null,
            rating: 4.3,
            isTopPick: false,
            verifiedByUser: false, // 사용자가 직접 확인한 것은 아님!
            needsVerification: true, // 확인 필요 플래그!
            tags: [categoryRaw, '모란역식당', '메뉴확인필요'],
            description: `모란역 주변 식당입니다. (${address}) 실제 점심 메뉴 및 가격은 방문 시 확인 또는 제보 부탁드립니다.`,
            menus: [],
            updatedAt: new Date().toISOString().split('T')[0]
          });
        }
      }
    }
    return list;
  } catch (err) {
    console.error(`[Error] 키워드 "${keyword}" 수집 실패:`, err.message);
    return [];
  }
}

async function run() {
  console.log('🚀 [모란역 주변 식당 자동 스크래핑 시작]...\n');

  // 1. 기존 DB 및 사용자 직접 검증 식당 로드
  const dbPath = path.resolve(__dirname, '../data/db.json');
  let currentDb = { restaurants: [], requests: [], history: [], lastScrapedAt: null };
  if (fs.existsSync(dbPath)) {
    try {
      currentDb = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    } catch (e) {}
  }

  // 1일 1회 제한 로직 (--force 플래그 지원)
  const isForce = process.argv.includes('--force') || process.argv.includes('-f');
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  if (!isForce && currentDb.lastScrapedAt) {
    const lastTime = new Date(currentDb.lastScrapedAt).getTime();
    const now = Date.now();
    const diff = now - lastTime;

    if (diff < ONE_DAY_MS) {
      const remainingHours = Math.ceil((ONE_DAY_MS - diff) / (1000 * 60 * 60));
      console.log(`\n⏳ [1일 1회 스크랩 제한 안내]`);
      console.log(`- 최근 스크랩 일시: ${new Date(lastTime).toLocaleString('ko-KR')}`);
      console.log(`- 네이버 지도 차단 방지 및 데이터 안정성을 위해 하루에 한 번만 실행을 권장합니다.`);
      console.log(`- 다음 권장 스크랩까지 약 ${remainingHours}시간 남았습니다.`);
      console.log(`💡 지금 즉시 강제로 스크랩하려면: npm run scrape -- --force\n`);
      return;
    }
  }

  // 사용자가 직접 검증한 식당 목록 (절대 보존)
  const userVerifiedMap = new Map();
  const existingMap = new Map();

  for (const r of currentDb.restaurants || []) {
    if (r.verifiedByUser) {
      userVerifiedMap.set(r.name, r);
    }
    existingMap.set(r.name, r);
  }

  console.log(`📌 현재 사용자 직접 검증 맛집 ${userVerifiedMap.size}곳은 최우선 보존됩니다.\n`);

  // 2. 키워드별 네이버 지도 스크랩
  const newScrapedMap = new Map();

  for (const keyword of SEARCH_KEYWORDS) {
    process.stdout.write(`🔍 "${keyword}" 검색 중... `);
    const results = await scrapeKeyword(keyword);
    let addedCount = 0;
    for (const item of results) {
      // 사용자 검증 맛집이 아니고, 아직 수집되지 않은 새 식당
      if (!userVerifiedMap.has(item.name) && !newScrapedMap.has(item.name)) {
        newScrapedMap.set(item.name, item);
        addedCount++;
      }
    }
    console.log(`새로운 후보 ${addedCount}곳 발견 (누적 스크랩 총 ${newScrapedMap.size}곳)`);
    await sleep(500); // 딜레이
  }

  const scrapedList = Array.from(newScrapedMap.values());
  console.log(`\n✨ 총 ${scrapedList.length}개의 모란역 신규 후보 식당을 발굴했습니다! (확인 필요 상태로 등록)`);

  // 3. 최종 병합:
  // 1위: 사용자 직접 검증 맛집 (14곳)
  // 2위: 기존 확인된 식당들
  // 3위: 새로 스크랩된 후보 식당들
  const finalRestaurants = [...userVerifiedMap.values()];
  const finalNames = new Set(finalRestaurants.map((r) => r.name));

  // 기존 식당 중 사용자 검증이 아니었던 것들 추가
  for (const r of existingMap.values()) {
    if (!finalNames.has(r.name)) {
      finalRestaurants.push(r);
      finalNames.add(r.name);
    }
  }

  // 이번에 새로 스크랩된 식당들 추가
  for (const r of scrapedList) {
    if (!finalNames.has(r.name)) {
      finalRestaurants.push(r);
      finalNames.add(r.name);
    }
  }

  console.log(`📊 최종 병합 식당 총: ${finalRestaurants.length}곳 (사용자 검증: ${userVerifiedMap.size}곳, 확인 필요: ${finalRestaurants.length - userVerifiedMap.size}곳)\n`);

  // 4. data/db.json 파일에 저장
  currentDb.restaurants = finalRestaurants;
  currentDb.lastScrapedAt = new Date().toISOString();
  fs.writeFileSync(dbPath, JSON.stringify(currentDb, null, 2), 'utf-8');
  console.log(`💾 [DB 저장 완료] ${dbPath}`);

  // 5. src/data/initialRestaurants.js 에도 동기화 저장
  const targetPath = path.resolve(__dirname, '../src/data/initialRestaurants.js');
  const fileOutput = `// 모란역 인근 점심 맛집 데이터 (사용자 검증 TOP 14 + 네이버 스크랩 데이터)
// 모란역 중심 좌표: 37.432145, 127.129088
// 최종 수집 일시: ${new Date().toISOString()}

export const BUDGET_LIMIT = 9000;

export const CATEGORIES = ['전체', '한식', '중식', '일식', '분식', '패스트푸드', '양식'];

export const INITIAL_RESTAURANTS = ${JSON.stringify(finalRestaurants, null, 2)};
`;
  fs.writeFileSync(targetPath, fileOutput, 'utf-8');
  console.log(`📁 [코드 저장 완료] ${targetPath}\n🎉 스크랩 작업이 완료되었습니다!`);
}

run();
