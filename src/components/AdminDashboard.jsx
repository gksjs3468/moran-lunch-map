import React, { useState, useEffect, useMemo } from 'react';
import {
  Utensils,
  Plus,
  Trash2,
  Edit3,
  Download,
  Upload,
  RotateCcw,
  Search,
  CheckCircle2,
  ExternalLink,
  ChevronLeft,
  DollarSign,
  MapPin,
  Sparkles,
  Phone,
  SlidersHorizontal,
  RefreshCw,
  Inbox,
  Check,
  X,
  Clock,
  AlertTriangle,
  LogOut,
  Bell,
  Ticket
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { CATEGORIES } from '../data/initialRestaurants';
import PriceUpdateModal from './PriceUpdateModal';
import AddRestaurantModal from './AddRestaurantModal';
import TelegramConfigModal from './TelegramConfigModal';
import MealTicketManager from './MealTicketManager';

export default function AdminDashboard({
  restaurants = [],
  onUpdateRestaurants = () => {},
  onCloseAdmin = () => {},
  onLogout = () => {},
  initialTab = 'all'
}) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedTab, setSelectedTab] = useState(initialTab); // all, verified, unverified, requests, mealTickets
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // 관리자 내부 모달 상태 (관리자 페이지 유지용)
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTelegramModal, setShowTelegramModal] = useState(false);

  // 수정 요청 목록 로드
  const loadRequests = async () => {
    setLoadingRequests(true);
    const reqs = await storageService.fetchRequests();
    setRequests(reqs || []);
    setLoadingRequests(false);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const pendingRequests = useMemo(() => {
    return requests.filter((r) => r.status === 'pending');
  }, [requests]);

  // 통계 계산
  const stats = useMemo(() => {
    const total = restaurants.length;
    const topPicks = restaurants.filter(r => r.verifiedByUser || r.isTopPick).length;
    const totalMenus = restaurants.reduce((acc, r) => acc + (r.menus?.length || 0), 0);
    const budgetMenus = restaurants.reduce(
      (acc, r) => acc + (r.menus?.filter(m => m.price <= 9000).length || 0),
      0
    );
    const avgPrice = total
      ? Math.round(
          restaurants.reduce((acc, r) => acc + (r.avgPrice || 8000), 0) / total
        )
      : 0;

    return { total, topPicks, totalMenus, budgetMenus, avgPrice, pendingCount: pendingRequests.length };
  }, [restaurants, pendingRequests]);

  // 필터링된 식당
  const filteredList = useMemo(() => {
    return restaurants.filter(r => {
      const matchCategory = selectedCategory === '전체' || r.category === selectedCategory;
      const matchSearch =
        search.trim() === '' ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.address?.toLowerCase().includes(search.toLowerCase()) ||
        r.menus?.some(m => m.name.toLowerCase().includes(search.toLowerCase()));

      let matchTab = true;
      if (selectedTab === 'verified') matchTab = r.verifiedByUser || r.isTopPick;
      if (selectedTab === 'unverified') matchTab = r.needsVerification;

      return matchCategory && matchSearch && matchTab;
    });
  }, [restaurants, selectedCategory, search, selectedTab]);

  // 스크랩 식당 -> 직접 검증 완료로 승격
  const handleMarkAsVerified = (restaurant) => {
    const updatedItem = {
      ...restaurant,
      verifiedByUser: true,
      needsVerification: false,
    };
    const list = storageService.updateRestaurant(updatedItem, '관리자 현장 확인 완료');
    onUpdateRestaurants([...list]);
  };

  // 식당 삭제 (관리자 페이지 유지)
  const handleDelete = (id, name) => {
    if (window.confirm(`'${name}' 식당을 DB에서 삭제하시겠습니까?`)) {
      const updated = storageService.deleteRestaurant(id);
      onUpdateRestaurants(updated);
    }
  };

  // 추천 토글 (관리자 페이지 유지)
  const handleToggleTopPick = (restaurant) => {
    const updatedItem = {
      ...restaurant,
      isTopPick: !restaurant.isTopPick
    };
    const list = storageService.updateRestaurant(updatedItem);
    onUpdateRestaurants([...list]);
  };

  // 메뉴/가격 수정 저장 (관리자 페이지 유지)
  const handleSavePriceUpdate = (updatedItem, logSummary) => {
    const updatedList = storageService.updateRestaurant(updatedItem, logSummary);
    onUpdateRestaurants([...updatedList]);
    setEditingRestaurant(null); // 모달만 닫고 관리자 페이지는 그대로 유지!
  };

  // 새 식당 추가 (관리자 페이지 유지)
  const handleAddRestaurant = (newItem) => {
    const { list } = storageService.addRestaurant(newItem);
    onUpdateRestaurants([...list]);
    setShowAddModal(false); // 모달만 닫고 관리자 페이지는 그대로 유지!
  };

  // 수정 요청 승인 (DB 영구 반영)
  const handleApproveRequest = async (requestId, restName) => {
    if (window.confirm(`'${restName}'의 수정 요청을 승인하여 DB에 즉시 반영하시겠습니까?`)) {
      const res = await storageService.approveRequest(requestId);
      if (res.success && res.list) {
        onUpdateRestaurants(res.list);
        await loadRequests();
        alert('성공적으로 식당 정보가 갱신되어 DB(db.json)에 저장되었습니다!');
      } else {
        alert('승인 처리에 실패했습니다.');
      }
    }
  };

  // 수정 요청 반려
  const handleRejectRequest = async (requestId) => {
    if (window.confirm('이 수정 요청을 반려 처리하시겠습니까?')) {
      await storageService.rejectRequest(requestId);
      await loadRequests();
    }
  };

  // 초기화
  const handleReset = () => {
    if (window.confirm('기본 추천 데이터로 초기화하시겠습니까?')) {
      const initial = storageService.resetToInitial();
      onUpdateRestaurants(initial);
    }
  };

  // 파일 업로드 (가져오기)
  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = storageService.importFromJson(event.target.result);
        onUpdateRestaurants(imported);
        alert('성공적으로 식당 데이터를 불러왔습니다!');
      } catch (err) {
        alert('JSON 파싱 실패: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans pb-16 relative">
      {/* 관리자 헤더 */}
      <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* 좌측: 복귀 및 로고 */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={onCloseAdmin}
              className="p-1.5 sm:p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition flex items-center gap-1 text-xs sm:text-sm font-medium shrink-0"
              title="사용자 화면으로 돌아가기"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">사용자 뷰로 복귀</span>
            </button>
            <div className="h-4 w-px bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs sm:text-sm border border-orange-500/30 shrink-0">
                ⚙️
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-lg font-bold text-white tracking-tight flex items-center gap-1.5 truncate">
                  <span>모란 점심 관리자</span>
                  <span className="text-[10px] bg-orange-500/20 text-orange-300 font-semibold px-1.5 py-0.2 rounded-full border border-orange-500/30 hidden xs:inline shrink-0">
                    DB
                  </span>
                </h1>
              </div>
            </div>
          </div>

          {/* 우측 액션 버튼들 (핵심 버튼 위주 노출, 모바일 최적화) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => setShowTelegramModal(true)}
              className="p-2 sm:px-3 sm:py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition flex items-center gap-1"
              title="텔레그램 제보 알림 설정"
            >
              <Bell className="w-4 h-4 text-sky-400 shrink-0" />
              <span className="hidden md:inline">텔레그램 알림</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 px-2.5 sm:px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-orange-500/20 transition active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>식당 추가</span>
            </button>

            <button
              onClick={storageService.exportToJson}
              className="hidden sm:flex p-2 sm:px-3 sm:py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition items-center gap-1.5"
              title="JSON 백업 다운로드"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">백업(JSON)</span>
            </button>

            <label className="hidden sm:flex p-2 sm:px-3 sm:py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition cursor-pointer items-center gap-1.5">
              <Upload className="w-4 h-4 text-sky-400" />
              <span className="hidden md:inline">불러오기</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
            </label>

            <button
              onClick={handleReset}
              className="hidden sm:block p-2 bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 rounded-xl border border-slate-700 hover:border-rose-800/50 transition"
              title="기본 데이터로 초기화"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onLogout}
              className="p-2 sm:px-3 sm:py-2 bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 rounded-xl text-xs font-bold border border-slate-700 hover:border-rose-800/50 transition flex items-center gap-1 shrink-0"
              title="관리자 로그아웃"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span className="hidden md:inline">로그아웃</span>
            </button>
          </div>
        </div>

        {/* 모바일 전용 보조 툴바 (JSON 백업, 불러오기, 초기화) */}
        <div className="flex sm:hidden items-center justify-between gap-1.5 pt-2 mt-2 border-t border-slate-850 text-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={storageService.exportToJson}
              className="px-2 py-1 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 flex items-center gap-1 text-[11px]"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>백업</span>
            </button>
            <label className="px-2 py-1 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 flex items-center gap-1 text-[11px] cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-sky-400" />
              <span>불러오기</span>
              <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
            </label>
            <button
              onClick={handleReset}
              className="px-2 py-1 bg-slate-850 hover:bg-rose-950/30 text-slate-400 hover:text-rose-400 rounded-lg border border-slate-800 flex items-center gap-1 text-[11px]"
            >
              <RotateCcw className="w-3 h-3" />
              <span>초기화</span>
            </button>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">관리자 전용</span>
        </div>
      </header>

      {/* 메인 컨텐츠 영역 */}
      <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 mt-4 sm:mt-6 space-y-4 sm:space-y-6">
        {/* 통계 카드 그리드 (모바일 2열 정돈 + 요청 카드 풀너비) */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-4">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 sm:p-4 flex flex-col justify-between">
            <span className="text-[11px] sm:text-xs font-medium text-slate-400">총 등록 식당</span>
            <div className="mt-1 sm:mt-2 flex items-baseline gap-1.5">
              <span className="text-xl sm:text-3xl font-extrabold text-white tabular-nums">{stats.total}</span>
              <span className="text-[11px] sm:text-xs text-slate-400">곳</span>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-orange-500/30 rounded-2xl p-3 sm:p-4 flex flex-col justify-between bg-gradient-to-br from-orange-500/10 to-transparent">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-medium text-orange-300">검증 맛집 (TOP픽)</span>
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400" />
            </div>
            <div className="mt-1 sm:mt-2 flex items-baseline gap-1.5">
              <span className="text-xl sm:text-3xl font-extrabold text-orange-400 tabular-nums">{stats.topPicks}</span>
              <span className="text-[11px] sm:text-xs text-orange-300/80">곳</span>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 sm:p-4 flex flex-col justify-between">
            <span className="text-[11px] sm:text-xs font-medium text-slate-400">9천원 이하 메뉴</span>
            <div className="mt-1 sm:mt-2 flex items-baseline gap-1.5">
              <span className="text-xl sm:text-3xl font-extrabold text-emerald-400 tabular-nums">{stats.budgetMenus}</span>
              <span className="text-[10px] sm:text-xs text-slate-400">/ {stats.totalMenus}개</span>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 sm:p-4 flex flex-col justify-between">
            <span className="text-[11px] sm:text-xs font-medium text-slate-400">등록 식당 평균가</span>
            <div className="mt-1 sm:mt-2 flex items-baseline gap-1.5">
              <span className="text-xl sm:text-3xl font-extrabold text-white tabular-nums">
                {stats.avgPrice.toLocaleString()}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-400">원</span>
            </div>
          </div>

          {/* 접수된 수정 요청 카드 (모바일에서는 2열 가로폭 전체 차지) */}
          <button
            onClick={() => setSelectedTab('requests')}
            className={`col-span-2 lg:col-span-1 border rounded-2xl p-3 sm:p-4 flex flex-col justify-between text-left transition ${
              stats.pendingCount > 0
                ? 'bg-amber-950/40 border-amber-500/50 hover:bg-amber-900/40 animate-pulse'
                : 'bg-slate-800/80 border-slate-700/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold text-amber-300">사용자 제보 요청</span>
              <Inbox className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            </div>
            <div className="mt-1 sm:mt-2 flex items-baseline gap-1.5">
              <span className="text-xl sm:text-3xl font-extrabold text-amber-400 tabular-nums">
                {stats.pendingCount}
              </span>
              <span className="text-[11px] sm:text-xs text-amber-300/80">건 대기중</span>
            </div>
          </button>
        </div>

        {/* 탭 네비게이션 (모바일 가로 스크롤 지원) */}
        <div className="border-b border-slate-800 pb-2">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setSelectedTab('all')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition ${
                selectedTab === 'all'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              전체 DB ({restaurants.length})
            </button>
            <button
              onClick={() => setSelectedTab('verified')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition flex items-center gap-1.5 ${
                selectedTab === 'verified'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>직접 검증 ({stats.topPicks})</span>
            </button>
            <button
              onClick={() => setSelectedTab('unverified')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition flex items-center gap-1.5 ${
                selectedTab === 'unverified'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>🔍 확인 필요 ({restaurants.length - stats.topPicks})</span>
            </button>
            <button
              onClick={() => setSelectedTab('requests')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition flex items-center gap-1.5 ${
                selectedTab === 'requests'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>제보 ({stats.pendingCount})</span>
            </button>
            <button
              onClick={() => setSelectedTab('mealTickets')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition flex items-center gap-1.5 ${
                selectedTab === 'mealTickets'
                  ? 'bg-emerald-600 text-white shadow-md font-black'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Ticket className="w-3.5 h-3.5 text-emerald-300" />
              <span>🎫 식권 명단 관리</span>
            </button>
          </div>
        </div>

        {/* ===================== [식권 명단 관리 탭] ===================== */}
        {selectedTab === 'mealTickets' ? (
          <MealTicketManager restaurants={restaurants} />
        ) : selectedTab === 'requests' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <p>일반 사용자가 화면에서 제보한 가격 변동/메뉴 수정 요청 목록입니다. 승인 시 DB에 즉시 반영됩니다.</p>
              <button
                onClick={loadRequests}
                className="flex items-center gap-1 text-slate-300 hover:text-white"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>새로고침</span>
              </button>
            </div>

            {requests.length === 0 ? (
              <div className="py-20 text-center bg-slate-900 border border-slate-800 rounded-2xl">
                <Inbox className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-400">접수된 수정 요청이 없습니다.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requests.map((req) => {
                  const isPending = req.status === 'pending';
                  const isApproved = req.status === 'approved';

                  return (
                    <div
                      key={req.id}
                      className={`p-5 rounded-2xl border transition ${
                        isPending
                          ? 'bg-slate-850 bg-slate-900 border-amber-500/40 shadow-lg'
                          : 'bg-slate-900/60 border-slate-800 opacity-70'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-white">
                              {req.restaurantName}
                            </h3>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isPending
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : isApproved
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-slate-700 text-slate-400'
                              }`}
                            >
                              {isPending ? '대기중' : isApproved ? '승인 완료' : '반려됨'}
                            </span>
                          </div>
                          <p className="text-xs text-amber-300/90 font-medium mt-1">
                            제보 내용: "{req.reason}"
                          </p>
                        </div>
                        <span className="text-[11px] text-slate-500 shrink-0">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* 요청된 메뉴 목록 */}
                      <div className="mt-3.5 pt-3 border-t border-slate-800 space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-400">
                          제보된 메뉴 및 가격:
                        </span>
                        <div className="space-y-1">
                          {req.requestedMenus?.map((m, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-200"
                            >
                              <span>{m.name}</span>
                              <span className="font-bold text-orange-400 tabular-nums">
                                {m.price?.toLocaleString()}원
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 승인 / 반려 액션 버튼 */}
                      {isPending && (
                        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleRejectRequest(req.id)}
                            className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition"
                          >
                            반려
                          </button>
                          <button
                            onClick={() => handleApproveRequest(req.id, req.restaurantName)}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1 active:scale-95"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>승인 및 DB 반영</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* ===================== [식당 DB 목록 탭] ===================== */
          <div className="space-y-4">
            {/* 검색 & 카테고리 필터 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="식당명, 대표 메뉴(육회비빔밥, 콩나물국밥 등), 주소 검색..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg shrink-0 font-medium transition ${
                      selectedCategory === cat
                        ? 'bg-slate-200 text-slate-900 font-bold'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 식당 테이블 목록 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>총 {filteredList.length}곳 등록됨</span>
                <span>'DB 즉시 수정' 버튼으로 메뉴를 추가/삭제/변경해도 관리자 페이지가 그대로 유지됩니다.</span>
              </div>

              <div className="divide-y divide-slate-800/80">
                {filteredList.map((item, idx) => {
                  const budgetMenus = item.menus?.filter((m) => m.price <= 9000) || [];
                  const isVerified = item.verifiedByUser || item.isTopPick;

                  return (
                    <div
                      key={item.id}
                      className="p-4 hover:bg-slate-800/50 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex-1 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-semibold tabular-nums text-slate-500 w-6">
                            #{idx + 1}
                          </span>
                          <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                            {item.name}
                          </h3>

                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium border border-slate-700">
                            {item.category}
                          </span>

                          {isVerified && (
                            <span className="text-[11px] px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-300 font-semibold border border-orange-500/30 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-orange-400" />
                              <span>직접 검증 맛집</span>
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            <span>{item.address}</span>
                          </span>
                          {item.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5 text-slate-500" />
                              <span>{item.phone}</span>
                            </span>
                          )}
                        </div>

                        {/* 메뉴 칩 */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {budgetMenus.length > 0 ? (
                            budgetMenus.map((m) => (
                              <span
                                key={m.id || m.name}
                                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700/80 text-slate-200"
                              >
                                <span className="font-medium">{m.name}</span>
                                <span className="font-bold text-orange-400 tabular-nums">
                                  {m.price.toLocaleString()}원
                                </span>
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-500 italic">
                              등록된 메뉴 없음 (우측 'DB 즉시 수정'으로 메뉴 추가 가능)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 액션 버튼 그룹 (모바일 반응형 최적화) */}
                      <div className="flex items-center gap-1.5 sm:gap-2 w-full md:w-auto justify-end pt-2.5 md:pt-0 border-t md:border-t-0 border-slate-800/80 shrink-0 flex-wrap">
                        {item.needsVerification && (
                          <button
                            onClick={() => handleMarkAsVerified(item)}
                            className="px-2.5 py-1.5 bg-emerald-700/80 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 active:scale-95"
                            title="관리자 현장 확인 완료 상태로 변경"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>검증 전환</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleToggleTopPick(item)}
                          className={`px-2.5 py-1.5 rounded-xl border text-xs font-medium transition flex items-center gap-1 ${
                            isVerified
                              ? 'bg-orange-500/20 border-orange-500/40 text-orange-300'
                              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                          }`}
                          title="TOP 픽 추천 토글"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{isVerified ? '추천해제' : '추천'}</span>
                        </button>

                        <button
                          onClick={() => setEditingRestaurant(item)}
                          className="px-3 py-1.5 sm:px-3.5 sm:py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1 active:scale-95"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>DB 수정</span>
                        </button>

                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="p-1.5 sm:p-2 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 rounded-xl border border-transparent hover:border-rose-900/40 transition"
                          title="식당 삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ===================== [관리자 전용 내부 모달들 - 관리자 페이지 유지] ===================== */}

      {/* 1. 관리자: 식당 메뉴/가격 즉시 수정 모달 */}
      {editingRestaurant && (
        <PriceUpdateModal
          restaurant={editingRestaurant}
          onClose={() => setEditingRestaurant(null)}
          onSave={handleSavePriceUpdate}
        />
      )}

      {/* 2. 관리자: 새 식당 추가 모달 */}
      {showAddModal && (
        <AddRestaurantModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddRestaurant}
        />
      )}

      {/* 3. 관리자: 텔레그램 알림 설정 모달 */}
      {showTelegramModal && (
        <TelegramConfigModal
          onClose={() => setShowTelegramModal(false)}
        />
      )}
    </div>
  );
}
