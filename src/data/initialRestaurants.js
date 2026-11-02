export const BUDGET_LIMIT = 9000;

export const CATEGORIES = ['전체', '한식', '중식', '일식', '분식', '국밥', '패스트푸드', '기타'];

export const INITIAL_RESTAURANTS = [
  {
    "id": "moran-top-1",
    "name": "우본관",
    "category": "한식",
    "address": "경기 성남시 중원구 광명로 31 1층 104호",
    "lat": 37.4336627,
    "lng": 127.1324412,
    "phone": "031-755-9292",
    "naverMapUrl": "https://map.naver.com/p/search/우본관%20모란본점",
    "budgetFriendly": true,
    "avgPrice": 7900,
    "rating": 4.8,
    "isTopPick": true,
    "verifiedByUser": true,
    "tags": [
      "육회비빔밥",
      "점심특선",
      "가성비최고",
      "모란역1번출구"
    ],
    "description": "모란역 1번/12번 출구 도보 3분! 점심특선 육회 비빔밥 7,900원의 갓성비 명소.",
    "menus": [
      {
        "id": "m-ub-1",
        "name": "점심특선 육회 비빔밥",
        "price": 7900,
        "isRecommended": true,
        "updatedDate": "2026-10-30"
      },
      {
        "id": "m-ub-2",
        "name": "한우 차돌된장찌개",
        "price": 8900,
        "isRecommended": false,
        "updatedDate": "2026-10-30"
      }
    ],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "moran-top-2",
    "name": "전주콩뿌리콩나물국밥 모란점",
    "category": "한식",
    "address": "경기 성남시 중원구 성남대로1148번길 11 1층",
    "lat": 37.4323,
    "lng": 127.13025,
    "phone": "031-758-8889",
    "naverMapUrl": "https://map.naver.com/p/search/전주콩뿌리콩나물국밥%20모란",
    "budgetFriendly": true,
    "avgPrice": 9000,
    "rating": 4.6,
    "isTopPick": true,
    "verifiedByUser": true,
    "tags": [
      "콩나물국밥",
      "해장",
      "든든한국물",
      "모란먹자골목"
    ],
    "description": "모란역 먹자골목 안쪽! 시원하고 깊은 육수의 전주 콩나물 국밥 정석 9,000원.",
    "menus": [
      {
        "id": "m-jj-1",
        "name": "콩나물 국밥",
        "price": 9000,
        "isRecommended": true,
        "updatedDate": "2026-10-30"
      },
      {
        "id": "m-jj-2",
        "name": "얼큰 콩나물국밥",
        "price": 9000,
        "isRecommended": true,
        "updatedDate": "2026-10-30"
      }
    ],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "moran-top-3",
    "name": "미나리풍년쭈꾸미",
    "category": "한식",
    "address": "경기 성남시 중원구 성남대로1148번길 5-1 1층",
    "lat": 37.43245,
    "lng": 127.12985,
    "phone": "031-752-3392",
    "naverMapUrl": "https://map.naver.com/p/search/미나리풍년쭈꾸미%20모란",
    "budgetFriendly": true,
    "avgPrice": 9000,
    "rating": 4.7,
    "isTopPick": true,
    "verifiedByUser": true,
    "tags": [
      "제육덮밥",
      "쭈꾸미덮밥",
      "매콤한맛",
      "미나리"
    ],
    "description": "모란역 2번 출구 바로 뒷골목! 향긋한 미나리와 불향 쭈꾸미/제육 덮밥 9,000원.",
    "menus": [
      {
        "id": "m-mn-1",
        "name": "직화 제육 덮밥",
        "price": 9000,
        "isRecommended": true,
        "updatedDate": "2026-10-30"
      },
      {
        "id": "m-mn-2",
        "name": "불향 쭈꾸미 덮밥",
        "price": 9000,
        "isRecommended": true,
        "updatedDate": "2026-10-30"
      }
    ],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "moran-top-4",
    "name": "홍굴이해물짬뽕",
    "category": "중식",
    "address": "경기 성남시 중원구 둔촌대로101번길 29 1층",
    "lat": 37.4323958,
    "lng": 127.1299166,
    "phone": "031-756-5544",
    "naverMapUrl": "https://map.naver.com/p/search/홍굴이해물짬뽕%20모란",
    "budgetFriendly": true,
    "avgPrice": 8300,
    "rating": 4.5,
    "isTopPick": true,
    "verifiedByUser": true,
    "tags": [
      "짜장면",
      "짜장밥",
      "볶음밥",
      "해물짬뽕"
    ],
    "description": "짜장면 7,500원, 짜장밥 8,500원, 볶음밥 9,000원의 가성비 중식 맛집.",
    "menus": [
      {
        "id": "m-hg-1",
        "name": "짜장면",
        "price": 7500,
        "isRecommended": true,
        "updatedDate": "2026-10-30"
      },
      {
        "id": "m-hg-2",
        "name": "짜장밥",
        "price": 8500,
        "isRecommended": false,
        "updatedDate": "2026-10-30"
      },
      {
        "id": "m-hg-3",
        "name": "고소한 볶음밥",
        "price": 9000,
        "isRecommended": true,
        "updatedDate": "2026-10-30"
      }
    ],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "moran-top-5",
    "name": "베이징락",
    "category": "중식",
    "address": "경기 성남시 수정구 산성대로 93 1층 (진주빌딩)",
    "lat": 37.43415,
    "lng": 127.12935,
    "phone": "031-754-0060",
    "naverMapUrl": "https://map.naver.com/p/search/베이징락%20성남",
    "budgetFriendly": true,
    "avgPrice": 7600,
    "rating": 4.6,
    "isTopPick": true,
    "verifiedByUser": true,
    "tags": [
      "짜장면6500원",
      "가성비중식",
      "모란역10번출구"
    ],
    "description": "모란역 10번/11번 출구 대로변! 짜장 6,500원, 짬뽕 8,000원, 볶음밥 8,500원.",
    "menus": [
      {
        "id": "m-bj-1",
        "name": "옛날 짜장면",
        "price": 6500,
        "isRecommended": true,
        "updatedDate": "2026-10-30"
      },
      {
        "id": "m-bj-2",
        "name": "얼큰 짬뽕",
        "price": 8000,
        "isRecommended": true,
        "updatedDate": "2026-10-30"
      },
      {
        "id": "m-bj-3",
        "name": "중화 볶음밥",
        "price": 8500,
        "isRecommended": false,
        "updatedDate": "2026-10-30"
      }
    ],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "moran-top-6",
    "name": "덕원수제돈까스 모란직영점",
    "category": "한식",
    "address": "경기 성남시 수정구 산성대로 93 진주빌딩 1층",
    "lat": 37.4341906,
    "lng": 127.1293898,
    "phone": "031-755-8788",
    "naverMapUrl": "https://map.naver.com/p/search/덕원수제돈까스%20모란",
    "budgetFriendly": true,
    "avgPrice": 8000,
    "rating": 4.5,
    "isTopPick": true,
    "verifiedByUser": true,
    "tags": [
      "수제냉면",
      "돈까스명가",
      "모란역10번출구"
    ],
    "description": "모란역 10번 출구 진주빌딩! 살얼음 동동 물냉면/비빔냉면 8,000원.",
    "menus": [
      {
        "id": "m-dw-1",
        "name": "살얼음 물냉면",
        "price": 8000,
        "isRecommended": true,
        "updatedDate": "2026-10-30"
      },
      {
        "id": "m-dw-2",
        "name": "매콤 비빔냉면",
        "price": 8000,
        "isRecommended": true,
        "updatedDate": "2026-10-30"
      }
    ],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "moran-top-7",
    "name": "쿠니라멘 성남점",
    "category": "일식",
    "address": "경기 성남시 수정구 산성대로93번길 25 밀란체2 B01호",
    "lat": 37.4362554,
    "lng": 127.1289107,
    "phone": "031-758-0909",
    "naverMapUrl": "https://map.naver.com/p/search/쿠니라멘%20성남점",
    "budgetFriendly": true,
    "avgPrice": 9000,
    "rating": 4.7,
    "isTopPick": true,
    "verifiedByUser": true,
    "tags": [
      "일본라멘",
      "돈코츠라멘",
      "혼밥추천",
      "수진동"
    ],
    "description": "모란역 10번 출구 인근 수진동 상권! 쿠니라멘 & 핫쿠니라멘 9,000원.",
    "menus": [
      {
        "id": "m-kn-1",
        "name": "쿠니라멘 (돈코츠)",
        "price": 9000,
        "isRecommended": true,
        "updatedDate": "2026-10-30"
      },
      {
        "id": "m-kn-2",
        "name": "핫쿠니라멘 (매운맛)",
        "price": 9000,
        "isRecommended": true,
        "updatedDate": "2026-10-30"
      }
    ],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "moran-top-8",
    "name": "고봉민김밥 모란역점",
    "category": "분식",
    "address": "경기 성남시 중원구 광명로 2 1층",
    "lat": 37.43265,
    "lng": 127.1295,
    "phone": "031-758-5522",
    "naverMapUrl": "https://map.naver.com/p/search/고봉민김밥%20모란",
    "budgetFriendly": true,
    "avgPrice": 5500,
    "rating": 4.4,
    "isTopPick": true,
    "verifiedByUser": true,
    "tags": [
      "김밥",
      "참치김밥",
      "라면",
      "모란역2번출구"
    ],
    "description": "모란역 2번 출구 바로 앞! 돈까스·냉면 제외 전 메뉴 9,000원 이하.",
    "menus": [
      {
        "id": "m-gb-1",
        "name": "고봉민김밥",
        "price": 3800,
        "isRecommended": true,
        "updatedDate": "2026-10-30"
      },
      {
        "id": "m-gb-2",
        "name": "참치김밥",
        "price": 4800,
        "isRecommended": true,
        "updatedDate": "2026-10-30"
      },
      {
        "id": "m-gb-3",
        "name": "신라면",
        "price": 4500,
        "isRecommended": false,
        "updatedDate": "2026-10-30"
      },
      {
        "id": "m-gb-4",
        "name": "새콤달콤 쫄면",
        "price": 6500,
        "isRecommended": false,
        "updatedDate": "2026-10-30"
      }
    ],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "moran-top-9",
    "name": "신사골감자탕 모란점",
    "category": "한식",
    "address": "경기 성남시 중원구 광명로 10-1 1층",
    "lat": 37.43292,
    "lng": 127.13035,
    "phone": "031-755-2882",
    "naverMapUrl": "https://map.naver.com/p/search/신사골감자탕%20모란",
    "budgetFriendly": true,
    "avgPrice": 8000,
    "rating": 4.6,
    "isTopPick": true,
    "verifiedByUser": true,
    "tags": [
      "뼈해장국",
      "황태해장국",
      "모란역광명로"
    ],
    "description": "모란역 2번 출구 광명로변! 뼈해장국 8,500원, 황태해장국 7,500원.",
    "menus": [
      {
        "id": "m-sg-1",
        "name": "사골 뼈해장국",
        "price": 8500,
        "isRecommended": true,
        "updatedDate": "2026-10-30"
      },
      {
        "id": "m-sg-2",
        "name": "황태 해장국",
        "price": 7500,
        "isRecommended": true,
        "updatedDate": "2026-10-30"
      }
    ],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "moran-top-10",
    "name": "신전떡볶이 성남모란점",
    "category": "분식",
    "address": "경기 성남시 중원구 광명로 12 1층",
    "lat": 37.4329751,
    "lng": 127.1305001,
    "phone": "031-752-6339",
    "naverMapUrl": "https://map.naver.com/p/search/신전떡볶이%20모란",
    "budgetFriendly": true,
    "avgPrice": 5000,
    "rating": 4.5,
    "isTopPick": true,
    "verifiedByUser": true,
    "tags": [
      "매운떡볶이",
      "치즈떡볶이",
      "컵밥",
      "전메뉴가능"
    ],
    "description": "광명로변 신사골감자탕 옆! 매콤 떡볶이와 컵밥 9천원 이하 조합.",
    "menus": [
      {
        "id": "m-sj-1",
        "name": "신전 떡볶이 (순/매)",
        "price": 3500,
        "isRecommended": true,
        "updatedDate": "2026-10-30"
      },
      {
        "id": "m-sj-2",
        "name": "치즈 떡볶이",
        "price": 5500,
        "isRecommended": true,
        "updatedDate": "2026-10-30"
      },
      {
        "id": "m-sj-3",
        "name": "스팸마요 컵밥",
        "price": 4000,
        "isRecommended": false,
        "updatedDate": "2026-10-30"
      },
      {
        "id": "m-sj-4",
        "name": "오뎅 튀김 (5개)",
        "price": 1700,
        "isRecommended": false,
        "updatedDate": "2026-10-30"
      }
    ],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "moran-top-11",
    "name": "역전국밥 모란점",
    "category": "한식",
    "address": "경기 성남시 중원구 광명로 18 1층",
    "lat": 37.4331219,
    "lng": 127.1312011,
    "phone": "031-759-9898",
    "naverMapUrl": "https://map.naver.com/p/search/역전국밥%20모란",
    "budgetFriendly": true,
    "avgPrice": 9000,
    "rating": 4.5,
    "isTopPick": true,
    "verifiedByUser": true,
    "tags": [
      "순대국",
      "얼큰한국물",
      "광명로"
    ],
    "description": "광명로 성남동 주민센터 방면! 깔끔하고 진한 순대국 9,000원.",
    "menus": [
      {
        "id": "m-yj-1",
        "name": "진국 순대국",
        "price": 9000,
        "isRecommended": true,
        "updatedDate": "2026-10-30"
      },
      {
        "id": "m-yj-2",
        "name": "얼큰 순대국",
        "price": 9000,
        "isRecommended": true,
        "updatedDate": "2026-10-30"
      }
    ],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "moran-top-12",
    "name": "써브웨이 성남모란역점",
    "category": "패스트푸드",
    "address": "경기 성남시 중원구 성남대로 1156 1층",
    "lat": 37.4330793,
    "lng": 127.1293089,
    "phone": "031-756-7788",
    "naverMapUrl": "https://map.naver.com/p/search/써브웨이%20모란",
    "budgetFriendly": true,
    "avgPrice": 7200,
    "rating": 4.6,
    "isTopPick": true,
    "verifiedByUser": true,
    "tags": [
      "샌드위치",
      "에그마요",
      "모란역1번출구"
    ],
    "description": "모란역 1번 출구 바로 앞 대로변! 15cm 단품 샌드위치 5천~8천원대.",
    "menus": [
      {
        "id": "m-sw-1",
        "name": "에그마요 (15cm)",
        "price": 5900,
        "isRecommended": true,
        "updatedDate": "2026-10-30"
      },
      {
        "id": "m-sw-2",
        "name": "이탈리안 비엠티 (15cm)",
        "price": 7400,
        "isRecommended": true,
        "updatedDate": "2026-10-30"
      },
      {
        "id": "m-sw-3",
        "name": "로스트 치킨 (15cm)",
        "price": 8200,
        "isRecommended": false,
        "updatedDate": "2026-10-30"
      }
    ],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "moran-top-13",
    "name": "롯데리아 모란역점",
    "category": "패스트푸드",
    "address": "경기 성남시 중원구 광명로 8 1, 2층",
    "lat": 37.4328771,
    "lng": 127.1300094,
    "phone": "031-751-2486",
    "naverMapUrl": "https://map.naver.com/p/search/롯데리아%20모란",
    "budgetFriendly": true,
    "avgPrice": 6200,
    "rating": 4.3,
    "isTopPick": true,
    "verifiedByUser": true,
    "tags": [
      "버거",
      "착한점심",
      "모란역2번출구"
    ],
    "description": "모란역 2번 출구 광명로 입구 코너! 든든점심 버거 세트 6천~7천원대.",
    "menus": [
      {
        "id": "m-lt-1",
        "name": "데리버거 세트",
        "price": 5600,
        "isRecommended": true,
        "updatedDate": "2026-10-30"
      },
      {
        "id": "m-lt-2",
        "name": "불고기버거 세트",
        "price": 6900,
        "isRecommended": true,
        "updatedDate": "2026-10-30"
      },
      {
        "id": "m-lt-3",
        "name": "새우버거 세트",
        "price": 6900,
        "isRecommended": true,
        "updatedDate": "2026-10-30"
      }
    ],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "moran-top-14",
    "name": "맘스터치 모란역점",
    "category": "패스트푸드",
    "address": "경기 성남시 중원구 성남대로 1144 2층",
    "lat": 37.4318106,
    "lng": 127.1295256,
    "phone": "031-757-9282",
    "naverMapUrl": "https://map.naver.com/p/search/맘스터치%20모란",
    "budgetFriendly": true,
    "avgPrice": 7400,
    "rating": 4.6,
    "isTopPick": true,
    "verifiedByUser": true,
    "tags": [
      "싸이버거",
      "케이준감자튀김",
      "모란역3번출구"
    ],
    "description": "모란역 3번 출구 앞 2층! 두툼한 치킨 싸이버거 세트 7,300원.",
    "menus": [
      {
        "id": "m-mt-1",
        "name": "싸이버거 세트",
        "price": 7300,
        "isRecommended": true,
        "updatedDate": "2026-10-30"
      },
      {
        "id": "m-mt-2",
        "name": "싸이버거 단품",
        "price": 4900,
        "isRecommended": false,
        "updatedDate": "2026-10-30"
      },
      {
        "id": "m-mt-3",
        "name": "불싸이버거 세트",
        "price": 7700,
        "isRecommended": true,
        "updatedDate": "2026-10-30"
      }
    ],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "moran-top-15",
    "name": "병천아우네순대",
    "category": "국밥",
    "address": "경기 성남시 중원구 산성대로80번길 11 1층",
    "lat": 37.43225,
    "lng": 127.12805,
    "phone": "031-754-0828",
    "naverMapUrl": "https://map.naver.com/p/search/병천아우네순대%20성남",
    "budgetFriendly": true,
    "avgPrice": 9000,
    "rating": 4.6,
    "isTopPick": true,
    "verifiedByUser": true,
    "tags": [
      "장터순대국",
      "순대국",
      "국밥",
      "착한가격업소",
      "모란시장"
    ],
    "description": "모란시장 인근 착한가격업소! 든든하고 진한 육수의 장터순대국 9,000원.",
    "menus": [
      {
        "id": "m-bcas-1",
        "name": "장터순대국",
        "price": 9000,
        "isRecommended": true,
        "updatedDate": "2026-11-02"
      }
    ],
    "updatedAt": "2026-11-02"
  },
  {
    "id": "moran-top-16",
    "name": "시골추어탕매운탕",
    "category": "국밥",
    "address": "경기 성남시 중원구 산성대로80번길 18 1층 102호",
    "lat": 37.43215,
    "lng": 127.128,
    "phone": "031-755-6677",
    "naverMapUrl": "https://map.naver.com/p/search/시골추어탕매운탕%20성남",
    "budgetFriendly": true,
    "avgPrice": 8750,
    "rating": 4.5,
    "isTopPick": true,
    "verifiedByUser": true,
    "tags": [
      "통추어탕",
      "갈은추어탕",
      "소내장탕",
      "소한마리탕",
      "모란시장"
    ],
    "description": "모란시장 골목의 든든한 보양탕 전문점! 통추어탕 9천원, 소내장탕 8천원 등 갓성비 탕 요리.",
    "menus": [
      {
        "id": "m-sgct-1",
        "name": "통추어탕",
        "price": 9000,
        "isRecommended": true,
        "updatedDate": "2026-11-02"
      },
      {
        "id": "m-sgct-2",
        "name": "갈은 추어탕",
        "price": 9000,
        "isRecommended": true,
        "updatedDate": "2026-11-02"
      },
      {
        "id": "m-sgct-3",
        "name": "소내장탕",
        "price": 8000,
        "isRecommended": true,
        "updatedDate": "2026-11-02"
      },
      {
        "id": "m-sgct-4",
        "name": "소한마리탕",
        "price": 9000,
        "isRecommended": false,
        "updatedDate": "2026-11-02"
      }
    ],
    "updatedAt": "2026-11-02"
  },
  {
    "id": "moran-top-17",
    "name": "전주식당",
    "category": "한식",
    "address": "경기 성남시 중원구 산성대로80번길 5",
    "lat": 37.43235,
    "lng": 127.1281,
    "phone": "031-751-3221",
    "naverMapUrl": "https://map.naver.com/p/search/전주식당%20성남동",
    "budgetFriendly": true,
    "avgPrice": 7000,
    "rating": 4.5,
    "isTopPick": true,
    "verifiedByUser": true,
    "tags": [
      "순두부백반",
      "부대찌개",
      "백반",
      "가성비",
      "실제가격비교필요"
    ],
    "description": "모란시장 골목 가성비 백반 맛집. 순두부백반 6,000원, 부대찌개 8,000원 (실제 가격 비교 및 확인 필요).",
    "menus": [
      {
        "id": "m-jjsd-1",
        "name": "순두부백반",
        "price": 6000,
        "isRecommended": true,
        "updatedDate": "2026-11-02"
      },
      {
        "id": "m-jjsd-2",
        "name": "부대찌개",
        "price": 8000,
        "isRecommended": true,
        "updatedDate": "2026-11-02"
      }
    ],
    "updatedAt": "2026-11-02"
  },
  {
    "id": "moran-top-18",
    "name": "홍콩반점0410 모란시장점",
    "category": "중식",
    "address": "경기 성남시 중원구 둔촌대로 101 월드팰리스 1층",
    "lat": 37.4297769,
    "lng": 127.1304856,
    "phone": "031-755-0410",
    "naverMapUrl": "https://map.naver.com/p/search/홍콩반점0410%20모란시장점",
    "budgetFriendly": true,
    "avgPrice": 8000,
    "rating": 4.4,
    "isTopPick": true,
    "verifiedByUser": true,
    "tags": [
      "짜장면",
      "짬뽕",
      "중식",
      "모란시장",
      "가성비"
    ],
    "description": "모란시장 사거리 월드팰리스 1층. 믿고 먹는 짜장면 7,000원, 불맛 짬뽕 9,000원.",
    "menus": [
      {
        "id": "m-hkbj-1",
        "name": "짜장면",
        "price": 7000,
        "isRecommended": true,
        "updatedDate": "2026-11-02"
      },
      {
        "id": "m-hkbj-2",
        "name": "짬뽕",
        "price": 9000,
        "isRecommended": true,
        "updatedDate": "2026-11-02"
      }
    ],
    "updatedAt": "2026-11-02"
  },
  {
    "id": "scraped-1962405716",
    "name": "엄마의밥상",
    "category": "백반",
    "address": "제일로73번길 16",
    "lat": 37.4336153,
    "lng": 127.133661,
    "phone": "",
    "naverMapUrl": "https://map.naver.com/p/entry/place/1962405716",
    "imageUrl": "https://ldb-phinf.pstatic.net/20220930_259/1664498276310LkbNW_JPEG/ED61AB8A-F29D-4FAE-AABD-4192B53A3601.jpeg",
    "reviewCount": 50,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": true,
    "tags": [
      "백반",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "네이버 지도 등록 기준 정보입니다. (제일로73번길 16) 실제 매장 방문 시 메뉴/가격 확인이 필요합니다.",
    "menus": [],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-1808976880",
    "name": "우심85",
    "category": "육류",
    "address": "성남대로1140번길 11 1층 우심85",
    "lat": 37.4316814,
    "lng": 127.1307191,
    "phone": "",
    "naverMapUrl": "https://map.naver.com/p/entry/place/1808976880",
    "imageUrl": "https://ldb-phinf.pstatic.net/20261003_75/1790983557696NXR9B_JPEG/%B0%ED%B1%DE_%C0%B0%C8%B8%BF%CD_%BB%FD%B0%ED%B1%E2_%B8%F0%B5%D2_%C7%C3%B7%A1%C5%CD.jpg",
    "reviewCount": 326,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": true,
    "tags": [
      "육류",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "네이버 지도 등록 기준 정보입니다. (성남대로1140번길 11 1층 우심85) 실제 매장 방문 시 메뉴/가격 확인이 필요합니다.",
    "menus": [],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-756062482",
    "name": "아르까",
    "category": "백반",
    "address": "성남대로1148번길 2",
    "lat": 37.4323138,
    "lng": 127.1295593,
    "phone": "031-756-1945",
    "naverMapUrl": "https://map.naver.com/p/entry/place/756062482",
    "imageUrl": "https://ldb-phinf.pstatic.net/20210518_191/1621327415927cXuEJ_JPEG/VqwGD844sC2HTfzDayxLvNC5.jpg",
    "reviewCount": 193,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": true,
    "tags": [
      "백반",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "네이버 지도 등록 기준 정보입니다. (성남대로1148번길 2) 실제 매장 방문 시 메뉴/가격 확인이 필요합니다.",
    "menus": [],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-2002142278",
    "name": "계화정 성남모란점",
    "category": "닭갈비",
    "address": "제일로35번길 54 1층",
    "lat": 37.4325473,
    "lng": 127.1315352,
    "phone": "",
    "naverMapUrl": "https://map.naver.com/p/entry/place/2002142278",
    "imageUrl": "https://ldb-phinf.pstatic.net/20250806_210/1754453612406QJp2H_JPEG/%C7%C3%B7%B9%C0%CC%BD%BA2.jpg",
    "reviewCount": 646,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": true,
    "tags": [
      "닭갈비",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "네이버 지도 등록 기준 정보입니다. (제일로35번길 54 1층) 실제 매장 방문 시 메뉴/가격 확인이 필요합니다.",
    "menus": [],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-1685440753",
    "name": "정아네밥집",
    "category": "한식",
    "address": "성남대로1155번길 4",
    "lat": 37.43296,
    "lng": 127.1284511,
    "phone": "",
    "naverMapUrl": "https://map.naver.com/p/entry/place/1685440753",
    "imageUrl": "https://ldb-phinf.pstatic.net/20210515_70/1621073007934in1eg_JPEG/sLMTQnlBLXbnaW7PVjlevIQn.jpg",
    "reviewCount": 144,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": true,
    "tags": [
      "한식",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "네이버 지도 등록 기준 정보입니다. (성남대로1155번길 4) 실제 매장 방문 시 메뉴/가격 확인이 필요합니다.",
    "menus": [],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-19421758",
    "name": "장터식당",
    "category": "한식",
    "address": "둔촌대로83번길 2",
    "lat": 37.4304564,
    "lng": 127.1283865,
    "phone": "031-721-0176",
    "naverMapUrl": "https://map.naver.com/p/entry/place/19421758",
    "imageUrl": "https://ldb-phinf.pstatic.net/20220923_17/1663881358274juqMt_JPEG/1663380919292.jpg",
    "reviewCount": 553,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": true,
    "tags": [
      "한식",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "네이버 지도 등록 기준 정보입니다. (둔촌대로83번길 2) 실제 매장 방문 시 메뉴/가격 확인이 필요합니다.",
    "menus": [],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-1980889797",
    "name": "찌개랑 밥이랑 태평역 본점",
    "category": "한식",
    "address": "성남대로1221번길 11 1층 찌개랑 밥이랑",
    "lat": 37.4386869,
    "lng": 127.1264949,
    "phone": "",
    "naverMapUrl": "https://map.naver.com/p/entry/place/1980889797",
    "imageUrl": "https://ldb-phinf.pstatic.net/20251014_96/1760412888751AODQG_JPEG/1000071382.jpg",
    "reviewCount": 97,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": true,
    "tags": [
      "한식",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "네이버 지도 등록 기준 정보입니다. (성남대로1221번길 11 1층 찌개랑 밥이랑) 실제 매장 방문 시 메뉴/가격 확인이 필요합니다.",
    "menus": [],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-1611230103",
    "name": "이가네수라간 태평역점",
    "category": "육류",
    "address": "성남대로1221번길 12 1층 이가네수라간",
    "lat": 37.4388133,
    "lng": 127.1264928,
    "phone": "",
    "naverMapUrl": "https://map.naver.com/p/entry/place/1611230103",
    "imageUrl": "https://ldb-phinf.pstatic.net/20251008_256/1759933011265E0iDX_JPEG/1000014763.jpg",
    "reviewCount": 213,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": true,
    "tags": [
      "육류",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "네이버 지도 등록 기준 정보입니다. (성남대로1221번길 12 1층 이가네수라간) 실제 매장 방문 시 메뉴/가격 확인이 필요합니다.",
    "menus": [],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-1205910872",
    "name": "이자카야잔잔 모란역점",
    "category": "이자카야",
    "address": "성남대로1148번길 26 1층",
    "lat": 37.432788,
    "lng": 127.1320824,
    "phone": "",
    "naverMapUrl": "https://map.naver.com/p/entry/place/1205910872",
    "imageUrl": "https://ldb-phinf.pstatic.net/20250423_10/1745391345649ydNNH_JPEG/%B8%F0%B6%F54.jpeg",
    "reviewCount": 1,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": true,
    "tags": [
      "이자카야",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "네이버 지도 등록 기준 정보입니다. (성남대로1148번길 26 1층) 실제 매장 방문 시 메뉴/가격 확인이 필요합니다.",
    "menus": [],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-1574802319",
    "name": "꽁지네김밥",
    "category": "분식",
    "address": "성남대로 1133",
    "lat": 37.4309388,
    "lng": 127.1288948,
    "phone": "031-721-4643",
    "naverMapUrl": "https://map.naver.com/p/entry/place/1574802319",
    "imageUrl": "https://ldb-phinf.pstatic.net/20210514_113/1620988938877oWaBI_JPEG/81b0KdmZRUhsjUqyvMpP-36B.jpg",
    "reviewCount": 3,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": false,
    "tags": [
      "김밥",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "모란역 5번 출구 앞. 24시간 언제든 가성비 좋게 김밥과 라면을 즐길 수 있는 분식집.",
    "menus": [
      {
        "id": "m-kj-1",
        "name": "야채김밥",
        "price": 3000,
        "isRecommended": true
      },
      {
        "id": "m-kj-2",
        "name": "라면",
        "price": 4000,
        "isRecommended": true
      },
      {
        "id": "m-kj-3",
        "name": "떡볶이",
        "price": 4000,
        "isRecommended": true
      },
      {
        "id": "m-kj-4",
        "name": "참치김밥",
        "price": 4500,
        "isRecommended": true
      }
    ],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-1144345928",
    "name": "볼하이 본점",
    "category": "이자카야",
    "address": "제일로35번길 55 3층",
    "lat": 37.4324491,
    "lng": 127.1312877,
    "phone": "",
    "naverMapUrl": "https://map.naver.com/p/entry/place/1144345928",
    "imageUrl": "https://ldb-phinf.pstatic.net/20220428_239/1651094554578ocToT_JPEG/KakaoTalk_20220428_060813367_02.jpg",
    "reviewCount": 492,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": true,
    "tags": [
      "이자카야",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "네이버 지도 등록 기준 정보입니다. (제일로35번길 55 3층) 실제 매장 방문 시 메뉴/가격 확인이 필요합니다.",
    "menus": [],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-2030774014",
    "name": "면빨",
    "category": "김밥",
    "address": "성남대로 1132 1층 106호",
    "lat": 37.430874,
    "lng": 127.1296034,
    "phone": "",
    "naverMapUrl": "https://map.naver.com/p/entry/place/2030774014",
    "imageUrl": "https://ldb-phinf.pstatic.net/20250822_180/1755814549585vovLa_JPEG/1755814490091.jpg",
    "reviewCount": 65,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": true,
    "tags": [
      "김밥",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "네이버 지도 등록 기준 정보입니다. (성남대로 1132 1층 106호) 실제 매장 방문 시 메뉴/가격 확인이 필요합니다.",
    "menus": [],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-2048809518",
    "name": "이층횟집",
    "category": "생선회",
    "address": "둔촌대로101번길 18 2층",
    "lat": 37.4313299,
    "lng": 127.1302597,
    "phone": "031-778-8804",
    "naverMapUrl": "https://map.naver.com/p/entry/place/2048809518",
    "imageUrl": "https://ldb-phinf.pstatic.net/20251028_115/1761645343904lFzAa_JPEG/KakaoTalk_Photo_2025-10-28-18-54-42-1.jpeg",
    "reviewCount": 156,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": true,
    "tags": [
      "생선회",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "네이버 지도 등록 기준 정보입니다. (둔촌대로101번길 18 2층) 실제 매장 방문 시 메뉴/가격 확인이 필요합니다.",
    "menus": [],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-35606619",
    "name": "왕십리곱창순대국",
    "category": "순대",
    "address": "제일로35번길 29 1층 왕십리곱창순대국",
    "lat": 37.4311415,
    "lng": 127.1336972,
    "phone": "031-759-7595",
    "naverMapUrl": "https://map.naver.com/p/entry/place/35606619",
    "imageUrl": "https://ldb-phinf.pstatic.net/20241228_11/1735366655883bgJVk_JPEG/1000028702.jpg",
    "reviewCount": 303,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": true,
    "tags": [
      "순대",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "네이버 지도 등록 기준 정보입니다. (제일로35번길 29 1층 왕십리곱창순대국) 실제 매장 방문 시 메뉴/가격 확인이 필요합니다.",
    "menus": [],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-2032816156",
    "name": "밧골순대국머릿고기",
    "category": "순대",
    "address": "성남대로1151번길 4 1층",
    "lat": 37.4326336,
    "lng": 127.1285427,
    "phone": "031-752-0111",
    "naverMapUrl": "https://map.naver.com/p/entry/place/2032816156",
    "imageUrl": "https://ldb-phinf.pstatic.net/20260619_216/1781871230379oEeks_JPEG/1000003041.jpg",
    "reviewCount": 62,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": true,
    "tags": [
      "순대",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "네이버 지도 등록 기준 정보입니다. (성남대로1151번길 4 1층) 실제 매장 방문 시 메뉴/가격 확인이 필요합니다.",
    "menus": [],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-1489467735",
    "name": "이로 이자카야",
    "category": "일식당",
    "address": "광명로16번길 11 1층 이로 이자카야",
    "lat": 37.4321889,
    "lng": 127.1312794,
    "phone": "",
    "naverMapUrl": "https://map.naver.com/p/entry/place/1489467735",
    "imageUrl": "https://ldb-phinf.pstatic.net/20241128_167/17327861502769HIXW_JPEG/%B4%EB%B9%E6%BE%EE.jpg",
    "reviewCount": 3,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": true,
    "tags": [
      "일식당",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "네이버 지도 등록 기준 정보입니다. (광명로16번길 11 1층 이로 이자카야) 실제 매장 방문 시 메뉴/가격 확인이 필요합니다.",
    "menus": [],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-2034765085",
    "name": "소울식당",
    "category": "한식",
    "address": "제일로35번길 29-1 1층 소울식당",
    "lat": 37.4311993,
    "lng": 127.1335454,
    "phone": "",
    "naverMapUrl": "https://map.naver.com/p/entry/place/2034765085",
    "imageUrl": "https://ldb-phinf.pstatic.net/20260316_171/1773638617473Ahf1O_JPEG/17736385611944993612835152047206.jpg",
    "reviewCount": 270,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": true,
    "tags": [
      "한식",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "네이버 지도 등록 기준 정보입니다. (제일로35번길 29-1 1층 소울식당) 실제 매장 방문 시 메뉴/가격 확인이 필요합니다.",
    "menus": [],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-2056026789",
    "name": "두끼 성남모란점",
    "category": "분식",
    "address": "성남대로1148번길 3 2층",
    "lat": 37.4325195,
    "lng": 127.1296384,
    "phone": "031-752-0070",
    "naverMapUrl": "https://map.naver.com/p/entry/place/2056026789",
    "imageUrl": "https://ldb-phinf.pstatic.net/20250706_100/17517936997020ej1x_PNG/4.png",
    "reviewCount": 42,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": true,
    "tags": [
      "분식",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "네이버 지도 등록 기준 정보입니다. (성남대로1148번길 3 2층) 실제 매장 방문 시 메뉴/가격 확인이 필요합니다.",
    "menus": [],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-1115263061",
    "name": "정직유부 성남모란점",
    "category": "분식",
    "address": "성남대로 1132 114호",
    "lat": 37.4309624,
    "lng": 127.1300819,
    "phone": "031-752-7911",
    "naverMapUrl": "https://map.naver.com/p/entry/place/1115263061",
    "imageUrl": "https://ldb-phinf.pstatic.net/20211112_277/1636707968358KDAKp_JPEG/SNS_%C3%CA%B1%E2%BC%BC%C6%C3_%BB%E7%C1%F8_%C0%FC%B4%DE.jpg",
    "reviewCount": 267,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": false,
    "tags": [
      "분식",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "모란 센트럴스퀘어 1층. 불맛을 입힌 수제 토핑 유부초밥과 우동/라면 혼밥 맛집.",
    "menus": [
      {
        "id": "m-jj-1",
        "name": "정직유부 (4p)",
        "price": 4700,
        "isRecommended": true
      },
      {
        "id": "m-jj-2",
        "name": "참치마요유부 (4p)",
        "price": 5900,
        "isRecommended": true
      },
      {
        "id": "m-jj-3",
        "name": "볶음김치유부 (4p)",
        "price": 5900,
        "isRecommended": true
      },
      {
        "id": "m-jj-4",
        "name": "정직라면",
        "price": 3500,
        "isRecommended": true
      },
      {
        "id": "m-jj-5",
        "name": "정직우동",
        "price": 5500,
        "isRecommended": true
      },
      {
        "id": "m-jj-6",
        "name": "[1인] 혼밥세트 (유부3p+면)",
        "price": 9000,
        "isRecommended": true
      }
    ],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-2004982160",
    "name": "영웅반점 모란본점",
    "category": "중식",
    "address": "산성대로 60",
    "lat": 37.432687,
    "lng": 127.1259136,
    "phone": "031-751-7272",
    "naverMapUrl": "https://map.naver.com/p/entry/place/2004982160",
    "imageUrl": "https://ldb-phinf.pstatic.net/20260713_240/1783917611550rdqtO_JPEG/IMG_1570.jpg",
    "reviewCount": 7,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": false,
    "tags": [
      "중식당",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "산성대로변 위치. 한우사골 육수와 자가제면 손짜장면 전문점.",
    "menus": [
      {
        "id": "m-yh-1",
        "name": "특허 손짜장면",
        "price": 9000,
        "isRecommended": true
      }
    ],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-2055568245",
    "name": "칭하이",
    "category": "중식",
    "address": "성남대로 1149 2층",
    "lat": 37.4323854,
    "lng": 127.1286911,
    "phone": "",
    "naverMapUrl": "https://map.naver.com/p/entry/place/2055568245",
    "imageUrl": "https://ldb-phinf.pstatic.net/20251114_229/17631067764264Vqdd_JPEG/IMG_4804.jpeg",
    "reviewCount": 83,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": false,
    "tags": [
      "중식당",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "모란역 7번 출구 앞 2층. 방송에도 다수 소개된 오랜 전통의 모란역 중식당.",
    "menus": [
      {
        "id": "m-ch-1",
        "name": "유니짜장면",
        "price": 6500,
        "isRecommended": true
      },
      {
        "id": "m-ch-2",
        "name": "해물짬뽕",
        "price": 9000,
        "isRecommended": true
      }
    ],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-38317991",
    "name": "고래성",
    "category": "중식당",
    "address": "제일로109번길 1",
    "lat": 37.4363675,
    "lng": 127.1337277,
    "phone": "031-752-1346",
    "naverMapUrl": "https://map.naver.com/p/entry/place/38317991",
    "imageUrl": "https://ldb-phinf.pstatic.net/20190130_292/1548847972981eXuof_JPEG/KyyHw22M27gGA5zegtgerHmo.jpg",
    "reviewCount": 1,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": true,
    "tags": [
      "중식당",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "네이버 지도 등록 기준 정보입니다. (제일로109번길 1) 실제 매장 방문 시 메뉴/가격 확인이 필요합니다.",
    "menus": [],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-1464755144",
    "name": "조개의진심, 카이네꼬 모란점",
    "category": "한식",
    "address": "성남대로1148번길 28 1층",
    "lat": 37.4328317,
    "lng": 127.132256,
    "phone": "",
    "naverMapUrl": "https://map.naver.com/p/entry/place/1464755144",
    "imageUrl": "https://ldb-phinf.pstatic.net/20260629_273/17827324592812Wtoi_JPEG/IMG_9787.jpg",
    "reviewCount": 883,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": true,
    "tags": [
      "한식",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "네이버 지도 등록 기준 정보입니다. (성남대로1148번길 28 1층) 실제 매장 방문 시 메뉴/가격 확인이 필요합니다.",
    "menus": [],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-37260503",
    "name": "등촌샤브칼국수 성남점",
    "category": "칼국수",
    "address": "광명로42번길 15",
    "lat": 37.4325794,
    "lng": 127.1342411,
    "phone": "",
    "naverMapUrl": "https://map.naver.com/p/entry/place/37260503",
    "imageUrl": "https://ldb-phinf.pstatic.net/20151105_107/1446713223612DchU3_JPEG/166981558755306_0.jpeg",
    "reviewCount": 1,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": true,
    "tags": [
      "칼국수",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "네이버 지도 등록 기준 정보입니다. (광명로42번길 15) 실제 매장 방문 시 메뉴/가격 확인이 필요합니다.",
    "menus": [],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-1429515623",
    "name": "시장을 여는 사람들 모란점",
    "category": "요리주점",
    "address": "둔촌대로101번길 27 엠타워 2층 201호, 204호",
    "lat": 37.4321278,
    "lng": 127.1297856,
    "phone": "",
    "naverMapUrl": "https://map.naver.com/p/entry/place/1429515623",
    "imageUrl": "https://ldb-phinf.pstatic.net/20230319_284/16792300929133kOwq_JPEG/%B4%D9%BF%EE%B7%CE%B5%E5_%286%29.jpg",
    "reviewCount": 560,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": true,
    "tags": [
      "요리주점",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "네이버 지도 등록 기준 정보입니다. (둔촌대로101번길 27 엠타워 2층 201호, 204호) 실제 매장 방문 시 메뉴/가격 확인이 필요합니다.",
    "menus": [],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-2044764593",
    "name": "망부석 성남모란점",
    "category": "요리주점",
    "address": "둔촌대로101번길 27 2층 망부석",
    "lat": 37.4321279,
    "lng": 127.1297856,
    "phone": "",
    "naverMapUrl": "https://map.naver.com/p/entry/place/2044764593",
    "imageUrl": "https://ldb-phinf.pstatic.net/20250818_94/17555043569118KO0X_PNG/1000060343.png",
    "reviewCount": 336,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": true,
    "tags": [
      "요리주점",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "네이버 지도 등록 기준 정보입니다. (둔촌대로101번길 27 2층 망부석) 실제 매장 방문 시 메뉴/가격 확인이 필요합니다.",
    "menus": [],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-2041757426",
    "name": "을지포차 모란점",
    "category": "요리주점",
    "address": "광명로16번길 5 2층",
    "lat": 37.4328351,
    "lng": 127.1312078,
    "phone": "070-8633-3161",
    "naverMapUrl": "https://map.naver.com/p/entry/place/2041757426",
    "imageUrl": "https://ldb-phinf.pstatic.net/20250818_232/17555065576615F3oO_JPEG/%C4%C1%BC%C1%BC%A6_1.jpg",
    "reviewCount": 128,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": true,
    "tags": [
      "요리주점",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "네이버 지도 등록 기준 정보입니다. (광명로16번길 5 2층) 실제 매장 방문 시 메뉴/가격 확인이 필요합니다.",
    "menus": [],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-1168441708",
    "name": "감성쪽갈비 모란본점",
    "category": "육류",
    "address": "성남대로1148번길 16-1 1층 감성쪽갈비",
    "lat": 37.4324918,
    "lng": 127.1310114,
    "phone": "",
    "naverMapUrl": "https://map.naver.com/p/entry/place/1168441708",
    "imageUrl": "https://ldb-phinf.pstatic.net/20250219_70/1739892812373uukej_JPEG/1000021082.jpg",
    "reviewCount": 1,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": true,
    "tags": [
      "육류",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "네이버 지도 등록 기준 정보입니다. (성남대로1148번길 16-1 1층 감성쪽갈비) 실제 매장 방문 시 메뉴/가격 확인이 필요합니다.",
    "menus": [],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-1654300304",
    "name": "꾼돈 숯불갈비 모란본점",
    "category": "육류",
    "address": "둔촌대로151번길 48 102동 102호 꾼돈숯불갈비 모란본점",
    "lat": 37.4301568,
    "lng": 127.1305156,
    "phone": "",
    "naverMapUrl": "https://map.naver.com/p/entry/place/1654300304",
    "imageUrl": "https://ldb-phinf.pstatic.net/20260902_14/1788281545757MkUiX_JPEG/%BD%A1%BA%D2_%B5%C5%C1%F6%B0%A5%BA%F1%BF%CD_%C7%B3%BC%BA%C7%D1_%C7%D1%BB%F3.jpg",
    "reviewCount": 3,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": true,
    "tags": [
      "육류",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "네이버 지도 등록 기준 정보입니다. (둔촌대로151번길 48 102동 102호 꾼돈숯불갈비 모란본점) 실제 매장 방문 시 메뉴/가격 확인이 필요합니다.",
    "menus": [],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-1623769557",
    "name": "류돈",
    "category": "육류",
    "address": "광명로 34-1 1층 류돈",
    "lat": 37.4334568,
    "lng": 127.1329716,
    "phone": "031-751-2003",
    "naverMapUrl": "https://map.naver.com/p/entry/place/1623769557",
    "imageUrl": "https://ldb-phinf.pstatic.net/20231007_216/1696680142952ttyeG_JPEG/%B4%D9%BF%EE%B7%CE%B5%E5_%281%29.jpg",
    "reviewCount": 283,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": true,
    "tags": [
      "육류",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "네이버 지도 등록 기준 정보입니다. (광명로 34-1 1층 류돈) 실제 매장 방문 시 메뉴/가격 확인이 필요합니다.",
    "menus": [],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-1589204842",
    "name": "연탄길 모란본점",
    "category": "육류",
    "address": "성남대로1140번길 13 1층",
    "lat": 37.4316995,
    "lng": 127.1308494,
    "phone": "",
    "naverMapUrl": "https://map.naver.com/p/entry/place/1589204842",
    "imageUrl": "https://ldb-phinf.pstatic.net/20210522_182/1621674946385KYLqb_JPEG/nb4j6wWoqVYWYGKgwDDgfD5q.jpg",
    "reviewCount": 345,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": true,
    "tags": [
      "육류",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "네이버 지도 등록 기준 정보입니다. (성남대로1140번길 13 1층) 실제 매장 방문 시 메뉴/가격 확인이 필요합니다.",
    "menus": [],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-1358640683",
    "name": "별미곱창 모란직영점",
    "category": "곱창",
    "address": "성남대로1148번길 8 별미곱창",
    "lat": 37.4324554,
    "lng": 127.1302496,
    "phone": "",
    "naverMapUrl": "https://map.naver.com/p/entry/place/1358640683",
    "imageUrl": "https://ldb-phinf.pstatic.net/20240201_127/170676672125572n9m_PNG/%BA%B0%B9%CC%B0%F6%C3%A2_%B8%F0%B6%F5%C1%A1_240201_%281%29.png",
    "reviewCount": 537,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": true,
    "tags": [
      "곱창",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "네이버 지도 등록 기준 정보입니다. (성남대로1148번길 8 별미곱창) 실제 매장 방문 시 메뉴/가격 확인이 필요합니다.",
    "menus": [],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-1153760681",
    "name": "토부덮밥",
    "category": "덮밥",
    "address": "성남대로 1132 1층 118호",
    "lat": 37.4309457,
    "lng": 127.1298129,
    "phone": "",
    "naverMapUrl": "https://map.naver.com/p/entry/place/1153760681",
    "imageUrl": "https://ldb-phinf.pstatic.net/20210913_29/16314991927947kku7_JPEG/rnPRi_d-L_BzCkJtWPVfuByO.jpeg.jpg",
    "reviewCount": 490,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": true,
    "tags": [
      "덮밥",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "네이버 지도 등록 기준 정보입니다. (성남대로 1132 1층 118호) 실제 매장 방문 시 메뉴/가격 확인이 필요합니다.",
    "menus": [],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-1905754473",
    "name": "다닐식당",
    "category": "일식당",
    "address": "제일로63번길 25-4 1층 다닐식당",
    "lat": 37.4319694,
    "lng": 127.1329273,
    "phone": "",
    "naverMapUrl": "https://map.naver.com/p/entry/place/1905754473",
    "imageUrl": "https://naverbooking-phinf.pstatic.net/20260411_54/1775895224176HWwn6_JPEG/image.jpg",
    "reviewCount": 380,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": true,
    "tags": [
      "일식당",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "네이버 지도 등록 기준 정보입니다. (제일로63번길 25-4 1층 다닐식당) 실제 매장 방문 시 메뉴/가격 확인이 필요합니다.",
    "menus": [],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-1243825116",
    "name": "햇쌀",
    "category": "베트남음식",
    "address": "광명로42번길 12 1층일부호",
    "lat": 37.4328366,
    "lng": 127.1339657,
    "phone": "",
    "naverMapUrl": "https://map.naver.com/p/entry/place/1243825116",
    "imageUrl": "https://ldb-phinf.pstatic.net/20241227_230/1735287106141ULnka_JPEG/1000015134.jpg",
    "reviewCount": 1,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": true,
    "tags": [
      "베트남음식",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "네이버 지도 등록 기준 정보입니다. (광명로42번길 12 1층일부호) 실제 매장 방문 시 메뉴/가격 확인이 필요합니다.",
    "menus": [],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-33305834",
    "name": "등갈비달인 모란 본점",
    "category": "육류",
    "address": "제일로35번길 52 1층",
    "lat": 37.4324382,
    "lng": 127.1315501,
    "phone": "",
    "naverMapUrl": "https://map.naver.com/p/entry/place/33305834",
    "imageUrl": "https://ldb-phinf.pstatic.net/20220428_51/1651134352829L02GA_JPEG/KakaoTalk_20220428_172447859_01.jpg",
    "reviewCount": 8,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": true,
    "tags": [
      "육류",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "네이버 지도 등록 기준 정보입니다. (제일로35번길 52 1층) 실제 매장 방문 시 메뉴/가격 확인이 필요합니다.",
    "menus": [],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-1528847751",
    "name": "삼시세끼쭈꾸미 본점",
    "category": "주꾸미요리",
    "address": "성남대로1130번길 9 102호 삼시세끼쭈꾸미 모란점",
    "lat": 37.4307528,
    "lng": 127.1305402,
    "phone": "",
    "naverMapUrl": "https://map.naver.com/p/entry/place/1528847751",
    "imageUrl": "https://ldb-phinf.pstatic.net/20221222_137/1671696645899UIEGF_JPEG/1671696560571.jpg",
    "reviewCount": 2,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": true,
    "tags": [
      "주꾸미요리",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "네이버 지도 등록 기준 정보입니다. (성남대로1130번길 9 102호 삼시세끼쭈꾸미 모란점) 실제 매장 방문 시 메뉴/가격 확인이 필요합니다.",
    "menus": [],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-38287163",
    "name": "맛찬들왕소금구이 모란점",
    "category": "육류",
    "address": "둔촌대로101번길 16-7 비전빌딩 1층 맛찬들왕소금구이",
    "lat": 37.4312327,
    "lng": 127.1304417,
    "phone": "",
    "naverMapUrl": "https://map.naver.com/p/entry/place/38287163",
    "imageUrl": "https://ldb-phinf.pstatic.net/20220927_43/16642463649592T8DS_JPEG/1.jpg",
    "reviewCount": 3,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": true,
    "tags": [
      "육류",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "네이버 지도 등록 기준 정보입니다. (둔촌대로101번길 16-7 비전빌딩 1층 맛찬들왕소금구이) 실제 매장 방문 시 메뉴/가격 확인이 필요합니다.",
    "menus": [],
    "updatedAt": "2026-10-30"
  },
  {
    "id": "scraped-2052034035",
    "name": "호르몬치치 모란점",
    "category": "육류",
    "address": "둔촌대로101번길 26 2층",
    "lat": 37.4319299,
    "lng": 127.1301123,
    "phone": "",
    "naverMapUrl": "https://map.naver.com/p/entry/place/2052034035",
    "imageUrl": "https://ldb-phinf.pstatic.net/20260928_97/17905868495482Eho0_JPEG/KakaoTalk_20260409_143109446_28.jpg",
    "reviewCount": 641,
    "budgetFriendly": true,
    "avgPrice": null,
    "rating": 4.4,
    "isTopPick": false,
    "verifiedByUser": false,
    "needsVerification": true,
    "tags": [
      "육류",
      "네이버스크랩",
      "현장확인필요"
    ],
    "description": "네이버 지도 등록 기준 정보입니다. (둔촌대로101번길 26 2층) 실제 매장 방문 시 메뉴/가격 확인이 필요합니다.",
    "menus": [],
    "updatedAt": "2026-10-30"
  }
];
