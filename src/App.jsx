import React, { useState, useEffect, useMemo } from 'react';
import {
  Utensils,
  Search,
  Filter,
  SlidersHorizontal,
  Plus,
  Dice5,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  ChevronRight,
  TrendingDown,
  Clock,
  History,
  Building,
  Map,
  List,
  Shield,
  X,
  ExternalLink,
  ChevronUp
} from 'lucide-react';
import { CATEGORIES, BUDGET_LIMIT } from './data/initialRestaurants';
import { storageService } from './services/storageService';
import NaverMapView from './components/NaverMapView';
import RestaurantDetail from './components/RestaurantDetail';
import PriceUpdateModal from './components/PriceUpdateModal';
import PriceRequestModal from './components/PriceRequestModal';
import AddRestaurantModal from './components/AddRestaurantModal';
import LunchRoulette from './components/LunchRoulette';
import AdminDashboard from './components/AdminDashboard';
import AdminLoginModal from './components/AdminLoginModal';

export default function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [budgetLimit, setBudgetLimit] = useState(BUDGET_LIMIT);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [onlyTopPicks, setOnlyTopPicks] = useState(false);

  // 모바일 전용 뷰 탭 ('map' | 'list')
  const [mobileTab, setMobileTab] = useState('list');
  // 관리자 모드 토글 및 로그인 모달
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  // 모바일에서 상세 모달 열기
  const [showMobileDetailModal, setShowMobileDetailModal] = useState(false);

  // 모달 상태 관리
  const [showPriceModal, setShowPriceModal] = useState(false); // 관리자 직접 수정
  const [showRequestModal, setShowRequestModal] = useState(false); // 일반 사용자 제보 요청
  const [targetForPriceUpdate, setTargetForPriceUpdate] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRoulette, setShowRoulette] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [priceHistory, setPriceHistory] = useState([]);

  // 데이터 로드 및 서버 DB(data/db.json)와 자동 동기화
  useEffect(() => {
    // 1단계: 로컬 캐시 즉시 렌더링
    const cached = storageService.getRestaurants();
    setRestaurants(cached);
    setPriceHistory(storageService.getHistoryLogs());
    if (cached.length > 0) {
      setSelectedRestaurant(cached[0]);
    }

    // 2단계: 백엔드 DB(data/db.json)에서 최신 데이터 동기화
    storageService.fetchRestaurantsFromDb().then((freshList) => {
      if (freshList && freshList.length > 0) {
        setRestaurants(freshList);
      }
    });
  }, []);

  // 필터링된 식당 목록
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((r) => {
      // 카테고리 필터
      const matchCategory =
        selectedCategory === '전체' || r.category === selectedCategory;

      // 직접 검증 TOP 14 필터
      const matchTopPick = !onlyTopPicks || r.verifiedByUser || r.isTopPick;

      // 검색어 필터
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        q === '' ||
        r.name.toLowerCase().includes(q) ||
        r.tags?.some((t) => t.toLowerCase().includes(q)) ||
        r.menus?.some((m) => m.name.toLowerCase().includes(q)) ||
        r.address?.toLowerCase().includes(q);

      // 예산 필터 (설정한 예산 이하의 메뉴가 하나라도 있거나, 메뉴가 아직 미등록된 식당도 포함)
      const hasBudgetMenu =
        !r.menus || r.menus.length === 0 || r.menus.some((m) => m.price <= budgetLimit);

      return matchCategory && matchTopPick && matchSearch && hasBudgetMenu;
    });
  }, [restaurants, selectedCategory, onlyTopPicks, searchQuery, budgetLimit]);

  // 가격 업데이트 핸들러
  const handleUpdatePrice = (updatedItem, logSummary) => {
    const updatedList = storageService.updateRestaurant(updatedItem, logSummary);
    setRestaurants([...updatedList]);
    setSelectedRestaurant(updatedItem);
    setPriceHistory(storageService.getHistoryLogs());
  };

  // 새 식당 추가 핸들러
  const handleAddRestaurant = (newItem) => {
    const { list, created } = storageService.addRestaurant(newItem);
    setRestaurants([...list]);
    setSelectedRestaurant(created);
  };

  // 식당 삭제 핸들러
  const handleDeleteRestaurant = (id) => {
    const updated = storageService.deleteRestaurant(id);
    setRestaurants(updated);
    if (selectedRestaurant?.id === id) {
      setSelectedRestaurant(updated.length > 0 ? updated[0] : null);
      setShowMobileDetailModal(false);
    }
  };

  // 관리자 모드 열기 핸들러 (인증 여부 확인)
  const handleOpenAdmin = () => {
    const isAuth = sessionStorage.getItem('moran_admin_authenticated') === 'true';
    if (isAuth) {
      setIsAdminMode(true);
    } else {
      setShowLoginModal(true);
    }
  };

  // 관리자 로그아웃 핸들러
  const handleAdminLogout = () => {
    sessionStorage.removeItem('moran_admin_authenticated');
    setIsAdminMode(false);
  };

  // 관리자 모드 진입/퇴장
  if (isAdminMode) {
    return (
      <AdminDashboard
        restaurants={restaurants}
        onUpdateRestaurants={(newList) => {
          setRestaurants([...newList]);
          if (newList.length > 0 && (!selectedRestaurant || !newList.find(r => r.id === selectedRestaurant.id))) {
            setSelectedRestaurant(newList[0]);
          }
        }}
        onCloseAdmin={() => setIsAdminMode(false)}
        onLogout={handleAdminLogout}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-stone-100 text-stone-800 overflow-hidden font-sans">
      {/* 1. 글로벌 헤더 */}
      <header className="bg-white border-b border-stone-200/90 px-3.5 sm:px-6 py-2.5 flex items-center justify-between shrink-0 z-30 shadow-xs">
        {/* 로고 & 슬로건 */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-9 sm:sm:h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-orange-600/20">
            🍚
      </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm sm:text-base font-black text-stone-900 tracking-tight">
                모란 점심 로드
              </h1>
              <span className="text-[10px] font-black bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
                9,000원 갓성비
              </span>
        </div>
            <p className="text-[11px] text-stone-500 hidden sm:block">
              모란역 직장인 직접 검증 9,000원 이하 착한 점심 지도
            </p>
      </div>
    </div>

        {/* 상단 액션 바 */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* 오늘 뭐먹지 룰렛 */}
          <button
            onClick={() => setShowRoulette(true)}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/15 transition active:scale-95"
          >
            <Dice5 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">오늘 뭐 먹지?</span>
            <span className="sm:hidden text-[11px]">룰렛</span>
          </button>

          {/* 식당 추가 */}
          <button
            onClick={() => setShowAddModal(true)}
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow-sm transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>식당 추가</span>
          </button>

          {/* 관리자 모드 버튼 */}
          <button
            onClick={handleOpenAdmin}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold border border-stone-300/80 transition"
            title="관리자 페이지"
          >
            <Shield className="w-3.5 h-3.5 text-stone-600" />
            <span className="hidden sm:inline">관리자</span>
            <span className="sm:hidden text-[11px]">Admin</span>
          </button>

          {/* 가격 변동 이력 */}
          <button
            onClick={() => setShowHistoryModal(true)}
            className="p-1.5 sm:p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-xl transition"
            title="가격 변동 내역"
          >
            <History className="w-4 h-4" />
          </button>
    </div>
      </header>

      {/* 2. 모바일 전용 뷰 탭 바 (모바일 화면일 때만 노출) */}
      <div className="md:hidden bg-white border-b border-stone-200 px-3 py-2 flex items-center justify-between z-20 shrink-0">
        <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl w-full text-xs font-bold">
          <button
            onClick={() => setMobileTab('list')}
            className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
              mobileTab === 'list'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500'
            }`}
          >
            <List className="w-4 h-4" />
            <span>식당 목록 ({filteredRestaurants.length})</span>
          </button>
          <button
            onClick={() => setMobileTab('map')}
            className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
              mobileTab === 'map'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500'
            }`}
          >
            <Map className="w-4 h-4 text-orange-600" />
            <span>네이버 지도</span>
          </button>
    </div>
  </div>

      {/* 3. 본문 레이아웃 (반응형: 데스크톱=Split View, 모바일=Tab View) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* 좌측 사이드바: 검색, 필터, 리스트 (모바일에서는 mobileTab === 'list'일 때만 표시) */}
        <aside
          className={`
            ${mobileTab === 'list' ? 'flex' : 'hidden'}
            md:flex w-full md:w-96 lg:w-[420px] bg-white border-r border-stone-200 flex-col shrink-0 z-20 shadow-xs
          `}
        >
          {/* 상단 검색 & 필터 영역 */}
          <div className="p-3.5 border-b border-stone-100 space-y-2.5 bg-stone-50/50">
            {/* 검색창 */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="식당명, 대표 메뉴(육회비빔밥, 짬뽕, 순대국)..."
                className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500/40 focus:outline-none transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 text-xs"
                >
                  ✕
                </button>
              )}
        </div>

            {/* 필터 칩: TOP 14 검증 맛집 토글 & 예산 조절 */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setOnlyTopPicks(!onlyTopPicks)}
                className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                  onlyTopPicks
                    ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-orange-300'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>검증 TOP 14만 보기</span>
              </button>

              <div className="px-2.5 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-700 flex items-center gap-1 shrink-0">
                <span className="text-[11px] text-stone-400">한도:</span>
                <span className="text-orange-600 font-bold tabular-nums">
                  {budgetLimit.toLocaleString()}원
                </span>
          </div>
        </div>

            {/* 카테고리 스크롤 칩 */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg shrink-0 font-bold transition text-xs ${
                    selectedCategory === cat
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-white text-stone-600 border border-stone-200/80 hover:bg-stone-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
        </div>
      </div>

          {/* 식당 목록 카드 리스트 */}
          <div className="flex-1 overflow-y-auto divide-y divide-stone-100 p-2 space-y-1.5">
            {filteredRestaurants.length === 0 ? (
              <div className="py-20 text-center space-y-2">
                <p className="text-sm font-semibold text-stone-500">
                  조건에 맞는 식당이 없습니다.
                </p>
                <p className="text-xs text-stone-400">
                  예산을 올리거나 검색어를 변경해 보세요.
                </p>
          </div>
            ) : (
              filteredRestaurants.map((restaurant) => {
                const isSelected = selectedRestaurant?.id === restaurant.id;
                const isTop = restaurant.verifiedByUser || restaurant.isTopPick;
                const hasMenus = restaurant.menus && restaurant.menus.length > 0;
                const budgetMenus =
                  hasMenus ? restaurant.menus.filter((m) => m.price <= budgetLimit) : [];
                const lowestPrice =
                  budgetMenus.length > 0
                    ? Math.min(...budgetMenus.map((m) => m.price))
                    : restaurant.avgPrice;

                return (
                  <div
                    key={restaurant.id}
                    onClick={() => {
                      setSelectedRestaurant(restaurant);
                      // 모바일 리스트에서 클릭 시 상세 팝업 열기
                      if (window.innerWidth < 768) {
                        setShowMobileDetailModal(true);
                      }
                    }}
                    className={`
                      p-3 rounded-2xl cursor-pointer transition border text-left
                      ${
                        isSelected
                          ? 'bg-orange-50/80 border-orange-400/80 shadow-xs'
                          : 'bg-white hover:bg-stone-50 border-stone-200/70'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span className="text-xs font-black text-stone-900">
                            {restaurant.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-semibold">
                            {restaurant.category}
                          </span>
                          {isTop && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-200/60">
                              ⭐ 직접검증
                            </span>
                          )}
                          {!hasMenus && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-stone-100 text-stone-500">
                              메뉴 미등록
                            </span>
                          )}
                    </div>

                        <p className="text-[11px] text-stone-500 line-clamp-1">
                          {restaurant.address}
                        </p>
                  </div>

                      <div className="text-right shrink-0">
                        {lowestPrice ? (
                          <>
                            <div className="text-xs font-black text-orange-600 font-bold tabular-nums">
                              {lowestPrice.toLocaleString()}원~
                        </div>
                            <span className="text-[10px] text-stone-400">
                              9천원 이하 {budgetMenus.length}종
                            </span>
                          </>
                        ) : (
                          <div className="text-right">
                            <span className="text-[10px] font-bold text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                              가격정보 없음
                            </span>
                      </div>
                        )}
                  </div>
                </div>

                    {/* 대표 9,000원 메뉴 태그 또는 미등록 상태 안내 */}
                    {budgetMenus.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-1 mt-2">
                        {budgetMenus.slice(0, 3).map((m) => (
                          <span
                            key={m.id || m.name}
                            className="text-[10px] bg-stone-50 px-2 py-0.5 rounded-md text-stone-600 border border-stone-200/60"
                          >
                            {m.name} <b>{m.price.toLocaleString()}원</b>
                          </span>
                        ))}
                  </div>
                    ) : hasMenus ? (
                      <div className="mt-1.5 text-[10px] text-stone-400">
                        설정 예산 이하 메뉴 없음
                  </div>
                    ) : (
                      <div className="mt-1.5 text-[10px] text-stone-400 flex items-center gap-1">
                        <span>🏷️ 메뉴/가격 정보 미등록 (제보 대기)</span>
                  </div>
                    )}
              </div>
                );
              })
            )}
      </div>
        </aside>

        {/* 중앙 지도 영역 (모바일에서는 mobileTab === 'map'일 때만 표시, 데스크톱은 항상 표시) */}
        <main
          className={`
            ${mobileTab === 'map' ? 'flex' : 'hidden'}
            md:flex flex-1 h-full relative overflow-hidden bg-stone-100 flex-col
          `}
        >
          <NaverMapView
            restaurants={filteredRestaurants}
            selectedRestaurant={selectedRestaurant}
            onSelectRestaurant={(rest) => {
              setSelectedRestaurant(rest);
              // 모바일 지도에서 마커 클릭 시 플로팅 바텀 카드 노출
            }}
            budgetLimit={budgetLimit}
          />

          {/* 모바일 지도 모드일 때 하단에 플로팅되는 선택된 식당 요약 카드 */}
          {selectedRestaurant && (
            <div className="md:hidden absolute bottom-3 left-3 right-3 z-30 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl border border-stone-200/90 animate-in fade-in slide-in-from-bottom duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black text-stone-900">
                      {selectedRestaurant.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-stone-100 text-stone-600 rounded font-semibold">
                      {selectedRestaurant.category}
                    </span>
                    {(selectedRestaurant.verifiedByUser || selectedRestaurant.isTopPick) && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-orange-100 text-orange-800 rounded">
                        ⭐ 검증
                      </span>
                    )}
              </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {selectedRestaurant.address}
                  </p>
            </div>
                <button
                  onClick={() => setShowMobileDetailModal(true)}
                  className="px-3 py-1.5 bg-stone-900 text-white rounded-xl text-xs font-bold shrink-0 shadow-xs"
                >
                  상세보기
                </button>
          </div>

              {/* 9천원 메뉴 요약 또는 메뉴 미등록 안내 */}
              <div className="flex flex-wrap items-center gap-1 mt-2">
                {selectedRestaurant.menus && selectedRestaurant.menus.length > 0 ? (
                  selectedRestaurant.menus
                    ?.filter((m) => m.price <= budgetLimit)
                    .slice(0, 2)
                    .map((m) => (
                      <span
                        key={m.id || m.name}
                        className="text-[11px] bg-orange-50 text-orange-800 px-2 py-0.5 rounded-md font-medium border border-orange-200/60"
                      >
                        {m.name} <b>{m.price.toLocaleString()}원</b>
                      </span>
                    ))
                ) : (
                  <span className="text-[11px] text-stone-400">
                    💡 메뉴 정보 미등록 (제보 대기)
                  </span>
                )}
          </div>
        </div>
          )}
        </main>

        {/* 데스크톱 우측 상세 패널 (화면 너비 lg 이상에서 분할 노출) */}
        {selectedRestaurant && (
          <div className="hidden lg:block w-96 bg-white border-l border-stone-200 z-20 shrink-0 p-3 h-full">
            <RestaurantDetail
              restaurant={selectedRestaurant}
              onClose={() => setSelectedRestaurant(null)}
              onOpenPriceModal={(item) => {
                setTargetForPriceUpdate(item);
                setShowRequestModal(true);
              }}
              onDelete={handleDeleteRestaurant}
              budgetLimit={budgetLimit}
              isAdmin={false}
            />
      </div>
        )}
  </div>

      {/* 모바일 전용 상세 모달 */}
      {showMobileDetailModal && selectedRestaurant && (
        <div className="md:hidden fixed inset-0 z-[999999] flex flex-col justify-end bg-black/75 backdrop-blur-md p-3 animate-in fade-in duration-200">
          <div className="max-h-[85vh] h-auto overflow-hidden rounded-3xl">
            <RestaurantDetail
              restaurant={selectedRestaurant}
              onClose={() => setShowMobileDetailModal(false)}
              onOpenPriceModal={(item) => {
                setShowMobileDetailModal(false);
                setTargetForPriceUpdate(item);
                setShowRequestModal(true);
              }}
              onDelete={(id) => {
                handleDeleteRestaurant(id);
                setShowMobileDetailModal(false);
              }}
              budgetLimit={budgetLimit}
              isAdmin={false}
            />
      </div>
    </div>
      )}

      {/* 오늘 뭐먹지 룰렛 모달 */}
      {showRoulette && (
        <LunchRoulette
          restaurants={filteredRestaurants}
          onClose={() => setShowRoulette(false)}
          onSelectRestaurant={(rest) => {
            setSelectedRestaurant(rest);
            setShowRoulette(false);
            if (window.innerWidth < 768) {
              setMobileTab('map');
            }
          }}
          budgetLimit={budgetLimit}
        />
      )}

      {/* 새 식당 추가 모달 */}
      {showAddModal && (
        <AddRestaurantModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddRestaurant}
        />
      )}

      {/* 사용자 전용: 가격 변동 제보 / 수정 요청 모달 */}
      {showRequestModal && (
        <PriceRequestModal
          restaurant={targetForPriceUpdate || selectedRestaurant}
          onClose={() => {
            setShowRequestModal(false);
            setTargetForPriceUpdate(null);
          }}
          onSubmitRequest={async (reqData) => {
            await storageService.submitPriceRequest(reqData);
          }}
        />
      )}

      {/* 관리자 전용: 가격 및 메뉴 즉시 DB 수정 모달 */}
      {showPriceModal && (
        <PriceUpdateModal
          restaurant={targetForPriceUpdate || selectedRestaurant}
          onClose={() => {
            setShowPriceModal(false);
            setTargetForPriceUpdate(null);
          }}
          onSave={handleUpdatePrice}
        />
      )}

      {/* 가격 변동 히스토리 모달 */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-5 max-w-lg w-full shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-orange-500" />
                <h3 className="text-base font-bold text-stone-900">
                  가격 변동 히스토리
                </h3>
          </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
        </div>

            <div className="mt-4 max-h-80 overflow-y-auto space-y-2 text-xs">
              {priceHistory.length === 0 ? (
                <p className="text-center py-8 text-stone-400">
                  아직 기록된 가격 변동 내역이 없습니다.
                </p>
              ) : (
                priceHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-stone-50 rounded-2xl border border-stone-200/70"
                  >
                    <div className="flex items-center justify-between text-stone-400 text-[11px] mb-1">
                      <span className="font-bold text-stone-700">
                        {item.restaurantName}
                      </span>
                      <span>
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                </div>
                    <p className="text-stone-800 font-medium">{item.log}</p>
              </div>
                ))
              )}
        </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold"
              >
                닫기
              </button>
        </div>
      </div>
    </div>
      )}
  {/* 8. 관리자 로그인 모달 */}
      <AdminLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={() => setIsAdminMode(true)}
      />
    </div>
  );
}
