import { INITIAL_RESTAURANTS } from '../data/initialRestaurants';
import { telegramService } from './telegramService';

const STORAGE_KEY = 'moran_lunch_restaurants_v4';
const HISTORY_KEY = 'moran_lunch_price_history_v1';
const CLIENT_ID_KEY = 'naver_map_client_id_v1';
const REQUESTS_KEY = 'moran_lunch_requests_v1';
const MEAL_TICKETS_KEY = 'moran_lunch_meal_tickets_v1';
const MEAL_LOGS_KEY = 'moran_lunch_meal_logs_v1';

export const INITIAL_MEAL_TICKETS = [
  {
    id: 'ticket-1',
    name: '김민수',
    department: '개발팀',
    totalCount: 20,
    usedCount: 4,
    remainingCount: 16,
    pricePerTicket: 9000,
    recentRestaurant: '우본관',
    recentUseDate: '2026-11-02 12:30',
    memo: '11월 정기 지급',
    createdAt: '2026-11-01'
  },
  {
    id: 'ticket-2',
    name: '이지은',
    department: '기획팀',
    totalCount: 20,
    usedCount: 7,
    remainingCount: 13,
    pricePerTicket: 9000,
    recentRestaurant: '미나리풍년쭈꾸미',
    recentUseDate: '2026-11-01 12:15',
    memo: '11월 정기 지급',
    createdAt: '2026-11-01'
  },
  {
    id: 'ticket-3',
    name: '박준호',
    department: '디자인팀',
    totalCount: 20,
    usedCount: 18,
    remainingCount: 2,
    pricePerTicket: 9000,
    recentRestaurant: '쿠니라멘 성남점',
    recentUseDate: '2026-11-02 13:00',
    memo: '잔여 2장 (소진 임박)',
    createdAt: '2026-11-01'
  },
  {
    id: 'ticket-4',
    name: '최유진',
    department: '운영팀',
    totalCount: 20,
    usedCount: 10,
    remainingCount: 10,
    pricePerTicket: 9000,
    recentRestaurant: '홍콩반점0410 모란시장점',
    recentUseDate: '2026-11-02 11:50',
    memo: '11월 정기 지급',
    createdAt: '2026-11-01'
  },
  {
    id: 'ticket-5',
    name: '정태양',
    department: '마케팅팀',
    totalCount: 20,
    usedCount: 20,
    remainingCount: 0,
    pricePerTicket: 9000,
    recentRestaurant: '시골추어탕매운탕',
    recentUseDate: '2026-11-02 12:40',
    memo: '식권 전액 소진 (추가 충전 요망)',
    createdAt: '2026-11-01'
  }
];

export const INITIAL_MEAL_LOGS = [
  {
    id: 'log-1',
    memberId: 'ticket-1',
    memberName: '김민수',
    department: '개발팀',
    restaurantName: '우본관',
    usedAt: '2026-11-02 12:30',
    count: 1,
    memo: '점심특선 육회 비빔밥'
  },
  {
    id: 'log-2',
    memberId: 'ticket-3',
    memberName: '박준호',
    department: '디자인팀',
    restaurantName: '쿠니라멘 성남점',
    usedAt: '2026-11-02 13:00',
    count: 1,
    memo: '돈코츠 라멘'
  },
  {
    id: 'log-3',
    memberId: 'ticket-4',
    memberName: '최유진',
    department: '운영팀',
    restaurantName: '홍콩반점0410 모란시장점',
    usedAt: '2026-11-02 11:50',
    count: 1,
    memo: '짜장면'
  },
  {
    id: 'log-4',
    memberId: 'ticket-5',
    memberName: '정태양',
    department: '마케팅팀',
    restaurantName: '시골추어탕매운탕',
    usedAt: '2026-11-02 12:40',
    count: 1,
    memo: '소한마리탕'
  }
];

export const storageService = {
  // 1. 식당 목록 동기식 가져오기 (초기 렌더링용 로컬 캐시)
  getRestaurants: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RESTAURANTS));
        return INITIAL_RESTAURANTS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load restaurants from localStorage', e);
      return INITIAL_RESTAURANTS;
    }
  },

  // 2. 서버 DB(data/db.json)에서 최신 식당 목록 비동기 동기화
  fetchRestaurantsFromDb: async () => {
    try {
      const res = await fetch('/api/db/restaurants');
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list) && list.length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
          return list;
        }
      }
    } catch (err) {
      // 서버 미들웨어 연결 불가 시 로컬스토리지 사용
      console.warn('API DB fetch failed, fallback to local storage:', err.message);
    }
    return storageService.getRestaurants();
  },

  // 식당 전체 로컬 저장
  saveRestaurants: (restaurants) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(restaurants));
    } catch (e) {
      console.error('Failed to save restaurants to localStorage', e);
    }
  },

  // 3. 식당 및 메뉴 가격 수정 (관리자 전용 - DB 파일 영구 저장)
  updateRestaurant: (updatedItem, priceChangeLog = null) => {
    const list = storageService.getRestaurants();
    const index = list.findIndex((r) => r.id === updatedItem.id);
    if (index !== -1) {
      list[index] = {
        ...list[index],
        ...updatedItem,
        updatedAt: new Date().toISOString().split('T')[0],
      };
      storageService.saveRestaurants(list);

      // 백엔드 JSON DB 파일에 영구 저장 요청
      fetch(`/api/db/restaurants/${updatedItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(list[index]),
      }).catch((e) => console.warn('DB update sync failed:', e.message));

      if (priceChangeLog) {
        storageService.addHistoryLog({
          restaurantId: updatedItem.id,
          restaurantName: updatedItem.name,
          log: priceChangeLog,
          timestamp: new Date().toISOString(),
        });
      }
    }
    return list;
  },

  // 4. 새 식당 추가 (관리자 전용 - DB 파일 영구 저장)
  addRestaurant: (newRestaurant) => {
    const list = storageService.getRestaurants();
    const created = {
      ...newRestaurant,
      id: `rest-${Date.now()}`,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    const updatedList = [created, ...list];
    storageService.saveRestaurants(updatedList);

    // 백엔드 JSON DB 파일에 영구 저장
    fetch('/api/db/restaurants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(created),
    }).catch((e) => console.warn('DB add sync failed:', e.message));

    return { list: updatedList, created };
  },

  // 5. 식당 삭제 (관리자 전용 - DB 파일 영구 저장)
  deleteRestaurant: (restaurantId) => {
    const list = storageService.getRestaurants();
    const updated = list.filter((r) => r.id !== restaurantId);
    storageService.saveRestaurants(updated);

    // 백엔드 JSON DB 파일에서 삭제
    fetch(`/api/db/restaurants/${restaurantId}`, {
      method: 'DELETE',
    }).catch((e) => console.warn('DB delete sync failed:', e.message));

    return updated;
  },

  // ===================== [사용자 수정 요청 (제보) 시스템] =====================

  // 사용자 수정 요청 제출 (일반 사용자가 제보 시 호출)
  submitPriceRequest: async ({ restaurantId, restaurantName, requestedMenus, reason }) => {
    const payload = {
      restaurantId,
      restaurantName,
      requestedMenus,
      reason: reason || '가격 변동 제보',
      createdAt: new Date().toISOString(),
    };

    // 1. 텔레그램 알림 즉시 발송 (정적 배포 환경에서도 관리자 스마트폰으로 직통 전달)
    telegramService.sendPriceReport({
      restaurantName,
      reason: payload.reason,
      requestedMenus,
    }).catch((e) => console.warn('Telegram notification failed:', e.message));

    // 2. 백엔드 DB 저장 시도
    try {
      const res = await fetch('/api/db/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        return data.request;
      }
    } catch (err) {
      console.warn('API request failed, saving to local fallback:', err.message);
    }

    // 로컬 폴백 저장
    const localReqs = storageService.getLocalRequests();
    const fallbackItem = { ...payload, id: `req-${Date.now()}`, status: 'pending' };
    localStorage.setItem(REQUESTS_KEY, JSON.stringify([fallbackItem, ...localReqs]));
    return fallbackItem;
  },

  // 수정 요청 목록 가져오기 (관리자용)
  fetchRequests: async () => {
    try {
      const res = await fetch('/api/db/requests');
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (err) {
      console.warn('API fetch requests failed, using local storage:', err.message);
    }
    return storageService.getLocalRequests();
  },

  getLocalRequests: () => {
    try {
      const d = localStorage.getItem(REQUESTS_KEY);
      return d ? JSON.parse(d) : [];
    } catch {
      return [];
    }
  },

  // 관리자: 수정 요청 승인 (식당 메뉴 자동 갱신 및 DB 저장)
  approveRequest: async (requestId) => {
    try {
      const res = await fetch(`/api/db/requests/${requestId}/approve`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        // 최신 식당 목록 재동기화
        const freshList = await storageService.fetchRestaurantsFromDb();
        return { success: true, list: freshList, updatedRestaurant: data.updatedRestaurant };
      }
    } catch (err) {
      console.error('Approve failed:', err.message);
    }
    return { success: false };
  },

  // 관리자: 수정 요청 반려
  rejectRequest: async (requestId) => {
    try {
      const res = await fetch(`/api/db/requests/${requestId}/reject`, {
        method: 'POST',
      });
      if (res.ok) {
        return { success: true };
      }
    } catch (err) {
      console.error('Reject failed:', err.message);
    }
    return { success: false };
  },

  // 초기 데이터로 초기화
  resetToInitial: () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RESTAURANTS));
    return INITIAL_RESTAURANTS;
  },

  // JSON 파일로 내보내기 (공유용)
  exportToJson: () => {
    const data = storageService.getRestaurants();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moran-lunch-map-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // JSON 파일에서 불러오기
  importFromJson: (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data)) {
        storageService.saveRestaurants(data);
        return data;
      }
      throw new Error('유효한 JSON 배열 형식이 아닙니다.');
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 가격 변동 히스토리 로그
  getHistoryLogs: () => {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addHistoryLog: (logEntry) => {
    const logs = storageService.getHistoryLogs();
    const updated = [logEntry, ...logs].slice(0, 50);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  },

  // 네이버 지도 클라이언트 ID
  getNaverClientId: () => {
    if (import.meta.env.VITE_NAVER_MAP_CLIENT_ID) {
      return import.meta.env.VITE_NAVER_MAP_CLIENT_ID;
    }
    return localStorage.getItem(CLIENT_ID_KEY) || '';
  },

  saveNaverClientId: (id) => {
    localStorage.setItem(CLIENT_ID_KEY, id.trim());
  },

  // ===================== [식권 명단 관리 API & LocalStorage] =====================
  // 식권 명단 조회
  getMealTickets: () => {
    try {
      const data = localStorage.getItem(MEAL_TICKETS_KEY);
      if (!data) {
        localStorage.setItem(MEAL_TICKETS_KEY, JSON.stringify(INITIAL_MEAL_TICKETS));
        return INITIAL_MEAL_TICKETS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load meal tickets from localStorage', e);
      return INITIAL_MEAL_TICKETS;
    }
  },

  // 서버 DB에서 식권 목록 비동기 동기화
  fetchMealTicketsFromDb: async () => {
    try {
      const res = await fetch('/api/db/meal-tickets');
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list) && list.length > 0) {
          localStorage.setItem(MEAL_TICKETS_KEY, JSON.stringify(list));
          return list;
        }
      }
    } catch (err) {
      console.warn('API DB fetchMealTickets failed, fallback to local storage:', err.message);
    }
    return storageService.getMealTickets();
  },

  // 식권 명단 전체 저장
  saveMealTickets: (tickets) => {
    try {
      localStorage.setItem(MEAL_TICKETS_KEY, JSON.stringify(tickets));
      fetch('/api/db/meal-tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tickets),
      }).catch((e) => console.warn('DB meal-tickets sync failed:', e.message));
    } catch (e) {
      console.error('Failed to save meal tickets to localStorage', e);
    }
  },

  // 식권 사용 기록 조회
  getMealLogs: () => {
    try {
      const data = localStorage.getItem(MEAL_LOGS_KEY);
      if (!data) {
        localStorage.setItem(MEAL_LOGS_KEY, JSON.stringify(INITIAL_MEAL_LOGS));
        return INITIAL_MEAL_LOGS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_MEAL_LOGS;
    }
  },

  // 서버 DB에서 사용 기록 동기화
  fetchMealLogsFromDb: async () => {
    try {
      const res = await fetch('/api/db/meal-logs');
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list) && list.length > 0) {
          localStorage.setItem(MEAL_LOGS_KEY, JSON.stringify(list));
          return list;
        }
      }
    } catch (err) {
      console.warn('API DB fetchMealLogs failed:', err.message);
    }
    return storageService.getMealLogs();
  },

  // 식권 1회 사용 기록 추가
  addMealLog: (logEntry) => {
    const logs = storageService.getMealLogs();
    const newEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      usedAt: new Date().toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }),
      ...logEntry,
    };
    const updated = [newEntry, ...logs].slice(0, 100);
    localStorage.setItem(MEAL_LOGS_KEY, JSON.stringify(updated));
    fetch('/api/db/meal-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEntry),
    }).catch(() => {});
    return updated;
  },
};
