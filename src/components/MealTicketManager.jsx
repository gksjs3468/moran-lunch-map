import React, { useState, useEffect, useMemo } from 'react';
import {
  Ticket,
  Plus,
  Trash2,
  Edit3,
  Search,
  Download,
  RotateCcw,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building,
  User,
  Utensils,
  ChevronDown,
  X,
  History,
  Layers,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';
import { storageService } from '../services/storageService';

export default function MealTicketManager({ restaurants = [] }) {
  const [members, setMembers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('전체');
  const [statusFilter, setStatusFilter] = useState('전체'); // '전체' | '여유' | '부족' | '소진'

  // 모달 상태들
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [useTargetMember, setUseTargetMember] = useState(null);
  const [rechargeTarget, setRechargeTarget] = useState(null); // null = bulk, or member object
  const [showLogsModal, setShowLogsModal] = useState(false);

  // 1장 사용 팝업 입력 상태
  const [selectedRestaurantName, setSelectedRestaurantName] = useState('');
  const [useMemoText, setUseMemoText] = useState('');

  // 충전 팝업 입력 상태
  const [rechargeAmount, setRechargeAmount] = useState(20);

  // 신규 등록 폼 상태
  const [newName, setNewName] = useState('');
  const [newDept, setNewDept] = useState('개발팀');
  const [newTotalCount, setNewTotalCount] = useState(20);
  const [newPrice, setNewPrice] = useState(9000);
  const [newMemo, setNewMemo] = useState('11월 정기 지급');

  // 데이터 로드
  const loadData = async () => {
    const memList = await storageService.fetchMealTicketsFromDb();
    setMembers(memList || []);
    const logList = await storageService.fetchMealLogsFromDb();
    setLogs(logList || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  // 전체 부서 목록 추출
  const departments = useMemo(() => {
    const set = new Set(members.map((m) => m.department).filter(Boolean));
    return ['전체', ...Array.from(set)];
  }, [members]);

  // 통계 집계
  const stats = useMemo(() => {
    const totalMembers = members.length;
    const totalIssued = members.reduce((acc, m) => acc + (m.totalCount || 0), 0);
    const totalUsed = members.reduce((acc, m) => acc + (m.usedCount || 0), 0);
    const totalRemaining = members.reduce((acc, m) => acc + (m.remainingCount || 0), 0);
    const totalValue = members.reduce(
      (acc, m) => acc + (m.remainingCount || 0) * (m.pricePerTicket || 9000),
      0
    );
    const exhaustedCount = members.filter((m) => (m.remainingCount || 0) <= 0).length;
    const warningCount = members.filter(
      (m) => (m.remainingCount || 0) > 0 && (m.remainingCount || 0) <= 2
    ).length;

    return {
      totalMembers,
      totalIssued,
      totalUsed,
      totalRemaining,
      totalValue,
      exhaustedCount,
      warningCount,
    };
  }, [members]);

  // 필터링된 명단
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      // 부서 필터
      const matchDept = selectedDept === '전체' || m.department === selectedDept;

      // 검색어 필터 (이름, 부서, 메모)
      const q = search.trim().toLowerCase();
      const matchSearch =
        q === '' ||
        m.name.toLowerCase().includes(q) ||
        (m.department && m.department.toLowerCase().includes(q)) ||
        (m.memo && m.memo.toLowerCase().includes(q)) ||
        (m.recentRestaurant && m.recentRestaurant.toLowerCase().includes(q));

      // 상태 필터 (여유 3장 이상 / 부족 1~2장 / 소진 0장)
      let matchStatus = true;
      const rem = m.remainingCount || 0;
      if (statusFilter === '여유') matchStatus = rem >= 3;
      if (statusFilter === '부족') matchStatus = rem > 0 && rem <= 2;
      if (statusFilter === '소진') matchStatus = rem <= 0;

      return matchDept && matchSearch && matchStatus;
    });
  }, [members, selectedDept, search, statusFilter]);

  // 1장 사용 처리
  const handleConfirmUseTicket = () => {
    if (!useTargetMember) return;
    if (useTargetMember.remainingCount <= 0) {
      alert('잔여 식권이 없습니다. 먼저 식권을 충전해주세요.');
      return;
    }

    const restName = selectedRestaurantName.trim() || '미지정 식당';
    const nowStr = new Date().toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const updated = members.map((m) => {
      if (m.id === useTargetMember.id) {
        const used = (m.usedCount || 0) + 1;
        const total = m.totalCount || 0;
        return {
          ...m,
          usedCount: used,
          remainingCount: Math.max(0, total - used),
          recentRestaurant: restName,
          recentUseDate: nowStr,
        };
      }
      return m;
    });

    setMembers(updated);
    storageService.saveMealTickets(updated);

    // 로그 추가
    const newLogs = storageService.addMealLog({
      memberId: useTargetMember.id,
      memberName: useTargetMember.name,
      department: useTargetMember.department,
      restaurantName: restName,
      count: 1,
      memo: useMemoText.trim() || '식권 1장 사용',
    });
    setLogs(newLogs);

    // 모달 닫기
    setUseTargetMember(null);
    setSelectedRestaurantName('');
    setUseMemoText('');
  };

  // 1장 취소/환불 복구 (실수로 사용 처리했을 때)
  const handleRollbackTicket = (member) => {
    if ((member.usedCount || 0) <= 0) {
      alert('사용 내역이 없어 취소할 수 없습니다.');
      return;
    }

    if (!confirm(`${member.name} 님의 식권 1장을 복구(사용 취소)하시겠습니까?`)) {
      return;
    }

    const updated = members.map((m) => {
      if (m.id === member.id) {
        const used = Math.max(0, (m.usedCount || 0) - 1);
        const total = m.totalCount || 0;
        return {
          ...m,
          usedCount: used,
          remainingCount: total - used,
        };
      }
      return m;
    });

    setMembers(updated);
    storageService.saveMealTickets(updated);

    // 복구 로그 추가
    const newLogs = storageService.addMealLog({
      memberId: member.id,
      memberName: member.name,
      department: member.department,
      restaurantName: '사용 취소/복구',
      count: -1,
      memo: '식권 1장 사용 취소 복원',
    });
    setLogs(newLogs);
  };

  // 신규 인원 등록
  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }

    const total = parseInt(newTotalCount, 10) || 0;
    const price = parseInt(newPrice, 10) || 9000;
    const newEntry = {
      id: `ticket-${Date.now()}`,
      name: newName.trim(),
      department: newDept.trim() || '미지정',
      totalCount: total,
      usedCount: 0,
      remainingCount: total,
      pricePerTicket: price,
      recentRestaurant: '-',
      recentUseDate: '-',
      memo: newMemo.trim() || '신규 등록',
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [newEntry, ...members];
    setMembers(updated);
    storageService.saveMealTickets(updated);

    // 폼 초기화
    setNewName('');
    setNewMemo('11월 정기 지급');
    setShowAddModal(false);
  };

  // 인원 정보 수정 저장
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingMember) return;

    const total = parseInt(editingMember.totalCount, 10) || 0;
    const used = parseInt(editingMember.usedCount, 10) || 0;
    const remaining = Math.max(0, total - used);

    const updated = members.map((m) => {
      if (m.id === editingMember.id) {
        return {
          ...editingMember,
          totalCount: total,
          usedCount: used,
          remainingCount: remaining,
        };
      }
      return m;
    });

    setMembers(updated);
    storageService.saveMealTickets(updated);
    setEditingMember(null);
  };

  // 인원 삭제
  const handleDeleteMember = (member) => {
    if (confirm(`'${member.name} (${member.department})' 님을 명단에서 삭제하시겠습니까?`)) {
      const updated = members.filter((m) => m.id !== member.id);
      setMembers(updated);
      storageService.saveMealTickets(updated);
    }
  };

  // 식권 충전 (개별 또는 전원 일괄)
  const handleExecuteRecharge = () => {
    const amount = parseInt(rechargeAmount, 10);
    if (!amount || amount <= 0) {
      alert('유효한 충전 수량을 입력해주세요.');
      return;
    }

    if (rechargeTarget) {
      // 개별 충전
      const updated = members.map((m) => {
        if (m.id === rechargeTarget.id) {
          const total = (m.totalCount || 0) + amount;
          const used = m.usedCount || 0;
          return {
            ...m,
            totalCount: total,
            remainingCount: total - used,
            memo: `${amount}장 추가 충전 (${new Date().toLocaleDateString()})`,
          };
        }
        return m;
      });
      setMembers(updated);
      storageService.saveMealTickets(updated);

      storageService.addMealLog({
        memberId: rechargeTarget.id,
        memberName: rechargeTarget.name,
        department: rechargeTarget.department,
        restaurantName: '식권 충전',
        count: amount,
        memo: `개별 식권 ${amount}장 충전 지급`,
      });
    } else {
      // 전원 일괄 충전
      if (!confirm(`전체 구성원(${members.length}명)에게 식권 ${amount}장씩 일괄 지급하시겠습니까?`)) {
        return;
      }
      const updated = members.map((m) => {
        const total = (m.totalCount || 0) + amount;
        const used = m.usedCount || 0;
        return {
          ...m,
          totalCount: total,
          remainingCount: total - used,
          memo: `정기 ${amount}장 일괄 지급`,
        };
      });
      setMembers(updated);
      storageService.saveMealTickets(updated);

      storageService.addMealLog({
        memberId: 'all',
        memberName: '전체 구성원',
        department: '전체',
        restaurantName: '일괄 지급',
        count: amount,
        memo: `전원 식권 ${amount}장 일괄 지급`,
      });
    }

    setRechargeTarget(null);
  };

  // CSV 다운로드 (엑셀 호환 UTF-8 BOM 포함)
  const handleDownloadCsv = () => {
    const headers = [
      '사원명',
      '부서',
      '총지급수량',
      '사용수량',
      '잔여수량',
      '식권단가',
      '잔여금액',
      '최근사용식당',
      '최근사용일시',
      '메모',
      '등록일',
    ];

    const rows = members.map((m) => [
      `"${m.name}"`,
      `"${m.department || ''}"`,
      m.totalCount || 0,
      m.usedCount || 0,
      m.remainingCount || 0,
      m.pricePerTicket || 9000,
      (m.remainingCount || 0) * (m.pricePerTicket || 9000),
      `"${m.recentRestaurant || '-'}"`,
      `"${m.recentUseDate || '-'}"`,
      `"${(m.memo || '').replace(/"/g, '""')}"`,
      `"${m.createdAt || ''}"`,
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `모란_식권명단_현황_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 모란 점심 맛집 추천 리스트 (상단 칩)
  const recommendedRestaurants = useMemo(() => {
    const verified = restaurants.filter((r) => r.verifiedByUser || r.isTopPick);
    return verified.slice(0, 10);
  }, [restaurants]);

  return (
    <div className="space-y-5 text-slate-100 font-sans">
      {/* 1. 통계 KPI 카드 그리드 */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-4">
        {/* 총 인원 */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 sm:p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-medium text-slate-400">총 관리 인원</span>
            <User className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="mt-1 sm:mt-2 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-3xl font-extrabold text-white tabular-nums">
              {stats.totalMembers}
            </span>
            <span className="text-[11px] sm:text-xs text-slate-400">명</span>
          </div>
        </div>

        {/* 잔여 식권 총합 */}
        <div className="bg-slate-800/80 border border-emerald-500/30 rounded-2xl p-3 sm:p-4 flex flex-col justify-between bg-gradient-to-br from-emerald-500/10 to-transparent">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-medium text-emerald-300">총 잔여 식권</span>
            <Ticket className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-1 sm:mt-2 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-3xl font-extrabold text-emerald-400 tabular-nums">
              {stats.totalRemaining}
            </span>
            <span className="text-[10px] sm:text-xs text-emerald-300/80">
              / 총 {stats.totalIssued}장
            </span>
          </div>
        </div>

        {/* 이번 달 총 사용 */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 sm:p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-medium text-slate-400">총 사용 식권</span>
            <Utensils className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="mt-1 sm:mt-2 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-3xl font-extrabold text-orange-400 tabular-nums">
              {stats.totalUsed}
            </span>
            <span className="text-[11px] sm:text-xs text-slate-400">장 완료</span>
          </div>
        </div>

        {/* 잔여 식권 총 예산 */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 sm:p-4 flex flex-col justify-between">
          <span className="text-[11px] sm:text-xs font-medium text-slate-400">잔여 식대 총액</span>
          <div className="mt-1 sm:mt-2 flex items-baseline gap-1">
            <span className="text-lg sm:text-2xl font-extrabold text-white tabular-nums">
              {stats.totalValue.toLocaleString()}
            </span>
            <span className="text-[11px] sm:text-xs text-slate-400">원</span>
          </div>
        </div>

        {/* 식권 소진/경고 인원 카드 */}
        <div
          onClick={() => setStatusFilter(stats.exhaustedCount > 0 ? '소진' : '부족')}
          className={`cursor-pointer col-span-2 lg:col-span-1 border rounded-2xl p-3 sm:p-4 flex flex-col justify-between transition ${
            stats.exhaustedCount > 0
              ? 'bg-rose-950/40 border-rose-500/50 hover:bg-rose-900/40'
              : stats.warningCount > 0
              ? 'bg-amber-950/40 border-amber-500/50 hover:bg-amber-900/40'
              : 'bg-slate-800/80 border-slate-700/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-amber-300">소진 & 충전 필요</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="mt-1 sm:mt-2 flex items-baseline gap-1.5">
            <span
              className={`text-xl sm:text-3xl font-extrabold tabular-nums ${
                stats.exhaustedCount > 0 ? 'text-rose-400' : 'text-amber-400'
              }`}
            >
              {stats.exhaustedCount + stats.warningCount}
            </span>
            <span className="text-[11px] sm:text-xs text-amber-300/80">
              명 (소진 {stats.exhaustedCount} / 부족 {stats.warningCount})
            </span>
          </div>
        </div>
      </div>

      {/* 2. 상단 액션 바: 검색, 필터, 버튼들 */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/70 p-3 sm:p-4 rounded-2xl border border-slate-800">
        {/* 검색 & 부서/상태 필터 */}
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* 검색창 */}
          <div className="relative flex-1 min-w-[180px] sm:min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="사원명, 부서명, 메모 검색..."
              className="w-full pl-9 pr-7 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* 부서 필터 */}
          <div className="relative">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="appearance-none pl-3 pr-7 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === '전체' ? '🏢 전체 부서' : `부서: ${dept}`}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
          </div>

          {/* 상태 필터 칩 */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700/80 text-xs">
            {['전체', '여유', '부족', '소진'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  statusFilter === st
                    ? st === '소진'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : st === '부족'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* 우측 버튼 그룹 */}
        <div className="flex items-center gap-2 shrink-0">
          {/* 사용 이력 모달 버튼 */}
          <button
            onClick={() => setShowLogsModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-xl text-xs sm:text-sm font-bold border border-slate-700 transition"
            title="식권 사용 기록 보기"
          >
            <History className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400" />
            <span className="hidden sm:inline">사용 기록</span>
            <span className="sm:hidden">기록</span>
            {logs.length > 0 && (
              <span className="bg-slate-700 text-orange-300 text-[10px] px-1.5 py-0.2 rounded-full">
                {logs.length}
              </span>
            )}
          </button>

          {/* 전원 일괄 충전 */}
          <button
            onClick={() => {
              setRechargeTarget(null); // null = bulk
              setRechargeAmount(20);
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-600/90 hover:bg-amber-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-amber-600/20 transition active:scale-95"
            title="전체 인원에게 식권 일괄 지급"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-200" />
            <span className="hidden sm:inline">전원 일괄 충전</span>
            <span className="sm:hidden">일괄충전</span>
          </button>

          {/* 새 인원 추가 */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-orange-600/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>인원 추가</span>
          </button>

          {/* CSV 다운로드 */}
          <button
            onClick={handleDownloadCsv}
            className="p-2 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition"
            title="식권 명단 엑셀(CSV) 다운로드"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. 식권 명단 테이블 / 카드 리스트 */}
      {filteredMembers.length === 0 ? (
        <div className="py-20 text-center bg-slate-900/60 border border-slate-800 rounded-3xl">
          <Ticket className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-base font-bold text-slate-300">등록되거나 검색된 식권 명단이 없습니다.</p>
          <p className="text-xs text-slate-500 mt-1">상단의 [+ 인원 추가] 버튼으로 사원을 등록해보세요.</p>
        </div>
      ) : (
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          {/* 데스크톱 테이블 */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-850/80 text-slate-400 font-bold">
                  <th className="py-3.5 px-4">사원명</th>
                  <th className="py-3.5 px-3">부서</th>
                  <th className="py-3.5 px-3 text-center">총 지급</th>
                  <th className="py-3.5 px-3 text-center">사용 수</th>
                  <th className="py-3.5 px-4 text-center">잔여 식권</th>
                  <th className="py-3.5 px-4">최근 사용 (식당 / 일시)</th>
                  <th className="py-3.5 px-3">메모 / 비고</th>
                  <th className="py-3.5 px-4 text-right">식권 빠른 관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredMembers.map((member) => {
                  const rem = member.remainingCount || 0;
                  const isExhausted = rem <= 0;
                  const isLow = rem > 0 && rem <= 2;

                  return (
                    <tr
                      key={member.id}
                      className="hover:bg-slate-800/40 transition group"
                    >
                      {/* 사원명 */}
                      <td className="py-3 px-4 font-bold text-white text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center font-black text-xs">
                            {member.name.slice(0, 1)}
                          </div>
                          <span>{member.name}</span>
                        </div>
                      </td>

                      {/* 부서 */}
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 font-semibold border border-slate-700/80">
                          {member.department || '미지정'}
                        </span>
                      </td>

                      {/* 총 지급 */}
                      <td className="py-3 px-3 text-center font-bold text-slate-400 tabular-nums">
                        {member.totalCount || 0}장
                      </td>

                      {/* 사용 수량 */}
                      <td className="py-3 px-3 text-center font-bold text-slate-300 tabular-nums">
                        {member.usedCount || 0}장
                      </td>

                      {/* 잔여 식권 배지 */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black tabular-nums border ${
                            isExhausted
                              ? 'bg-rose-500/15 text-rose-400 border-rose-500/40 animate-pulse'
                              : isLow
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                              : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
                          }`}
                        >
                          <Ticket className="w-3 h-3" />
                          <span>{rem}장 잔여</span>
                          {isExhausted && <span className="text-[10px] ml-0.5">(소진)</span>}
                        </span>
                      </td>

                      {/* 최근 사용 정보 */}
                      <td className="py-3 px-4 text-slate-300">
                        {member.recentRestaurant && member.recentRestaurant !== '-' ? (
                          <div>
                            <span className="font-bold text-white flex items-center gap-1">
                              <Utensils className="w-3 h-3 text-orange-400" />
                              {member.recentRestaurant}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {member.recentUseDate}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px]">미사용</span>
                        )}
                      </td>

                      {/* 비고 */}
                      <td className="py-3 px-3 text-slate-400 text-[11px] max-w-[150px] truncate">
                        {member.memo || '-'}
                      </td>

                      {/* 액션 버튼들 */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 식권 1장 사용 버튼 */}
                          <button
                            onClick={() => {
                              setUseTargetMember(member);
                              setSelectedRestaurantName(
                                recommendedRestaurants[0]?.name || '모란역 식당'
                              );
                              setUseMemoText('');
                            }}
                            disabled={isExhausted}
                            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-bold transition active:scale-95 ${
                              isExhausted
                                ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700/50'
                                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-xs'
                            }`}
                            title="식권 1장 즉시 사용 처리"
                          >
                            <Utensils className="w-3.5 h-3.5" />
                            <span>1장 사용</span>
                          </button>

                          {/* 1장 복구/취소 */}
                          <button
                            onClick={() => handleRollbackTicket(member)}
                            disabled={(member.usedCount || 0) <= 0}
                            className="p-1.5 bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white rounded-xl border border-slate-700 transition disabled:opacity-30 disabled:cursor-not-allowed"
                            title="실수 취소: 1장 복원(+1)"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>

                          {/* 개별 충전 */}
                          <button
                            onClick={() => {
                              setRechargeTarget(member);
                              setRechargeAmount(10);
                            }}
                            className="p-1.5 bg-slate-800 hover:bg-slate-750 text-emerald-400 hover:text-emerald-300 rounded-xl border border-slate-700 transition"
                            title="식권 추가 충전"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>

                          {/* 수정 */}
                          <button
                            onClick={() => setEditingMember(member)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white rounded-xl border border-slate-700 transition"
                            title="사원 정보 및 수량 수정"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* 삭제 */}
                          <button
                            onClick={() => handleDeleteMember(member)}
                            className="p-1.5 bg-slate-800 hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 rounded-xl border border-slate-700 transition"
                            title="명단에서 삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 모바일 전용 카드 리스트 */}
          <div className="lg:hidden divide-y divide-slate-800">
            {filteredMembers.map((member) => {
              const rem = member.remainingCount || 0;
              const isExhausted = rem <= 0;
              const isLow = rem > 0 && rem <= 2;

              return (
                <div key={member.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center font-black text-sm">
                        {member.name.slice(0, 1)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-sm">{member.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                            {member.department}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{member.memo || '-'}</p>
                      </div>
                    </div>

                    {/* 잔여 배지 */}
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black tabular-nums border ${
                        isExhausted
                          ? 'bg-rose-500/15 text-rose-400 border-rose-500/40'
                          : isLow
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
                      }`}
                    >
                      <Ticket className="w-3 h-3" />
                      <span>{rem}장 잔여</span>
                    </span>
                  </div>

                  {/* 수량 게이지 */}
                  <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/70 text-xs flex items-center justify-between">
                    <span className="text-slate-400">
                      총 <b className="text-white">{member.totalCount}</b>장 지급
                    </span>
                    <span className="text-slate-400">
                      사용 <b className="text-orange-400">{member.usedCount}</b>장
                    </span>
                    <span className="text-slate-400">
                      잔여 <b className={isExhausted ? 'text-rose-400' : 'text-emerald-400'}>{rem}</b>장
                    </span>
                  </div>

                  {/* 최근 사용 식당 */}
                  {member.recentRestaurant && member.recentRestaurant !== '-' && (
                    <div className="text-[11px] text-slate-400 flex items-center justify-between">
                      <span className="flex items-center gap-1 text-slate-300">
                        <Utensils className="w-3 h-3 text-orange-400" />
                        최근: <b>{member.recentRestaurant}</b>
                      </span>
                      <span>{member.recentUseDate}</span>
                    </div>
                  )}

                  {/* 액션 버튼들 */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        setUseTargetMember(member);
                        setSelectedRestaurantName(
                          recommendedRestaurants[0]?.name || '모란역 식당'
                        );
                        setUseMemoText('');
                      }}
                      disabled={isExhausted}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                        isExhausted
                          ? 'bg-slate-800 text-slate-600'
                          : 'bg-orange-500 hover:bg-orange-600 text-white'
                      }`}
                    >
                      <Utensils className="w-3.5 h-3.5" />
                      <span>식권 1장 사용</span>
                    </button>

                    <button
                      onClick={() => handleRollbackTicket(member)}
                      disabled={(member.usedCount || 0) <= 0}
                      className="px-3 py-2 bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-700 text-xs font-bold disabled:opacity-40"
                    >
                      취소
                    </button>

                    <button
                      onClick={() => {
                        setRechargeTarget(member);
                        setRechargeAmount(10);
                      }}
                      className="px-3 py-2 bg-slate-800 text-emerald-400 hover:text-emerald-300 rounded-xl border border-slate-700 text-xs font-bold"
                    >
                      충전
                    </button>

                    <button
                      onClick={() => setEditingMember(member)}
                      className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-xl border border-slate-700"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteMember(member)}
                      className="p-2 bg-slate-800 text-slate-500 hover:text-rose-400 rounded-xl border border-slate-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================== [모달 1: 식권 1장 사용 처리 팝업] ===================== */}
      {useTargetMember && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">식권 1장 사용</h3>
                  <p className="text-xs text-slate-400">
                    {useTargetMember.name} ({useTargetMember.department}) • 잔여 {useTargetMember.remainingCount}장
                  </p>
                </div>
              </div>
              <button
                onClick={() => setUseTargetMember(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* 추천 맛집 빠른 선택 */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  식사한 식당 선택 (모란 점심 맛집)
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-800/60 rounded-xl border border-slate-700/80 mb-2">
                  {recommendedRestaurants.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRestaurantName(r.name)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-bold transition ${
                        selectedRestaurantName === r.name
                          ? 'bg-orange-500 text-white shadow-xs'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {r.name}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={selectedRestaurantName}
                  onChange={(e) => setSelectedRestaurantName(e.target.value)}
                  placeholder="또는 식당명 직접 입력..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* 사용 메모 */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  식사 메모 (메뉴 등 선택사항)
                </label>
                <input
                  type="text"
                  value={useMemoText}
                  onChange={(e) => setUseMemoText(e.target.value)}
                  placeholder="예: 장터순대국 1그릇, 점심 회식 등"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 text-xs text-amber-200">
                💡 식권 1장(9,000원 상당)이 차감되며, 사용 이력에 자동으로 영구 기록됩니다.
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setUseTargetMember(null)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-bold transition"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleConfirmUseTicket}
                  className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 transition active:scale-95"
                >
                  사용 확인 (-1장)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== [모달 2: 충전 팝업 (개별 or 전원 일괄)] ===================== */}
      {rechargeTarget !== undefined && rechargeTarget !== false && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-sm w-full p-5 sm:p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {rechargeTarget ? `${rechargeTarget.name} 식권 충전` : '전원 일괄 식권 충전'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {rechargeTarget
                      ? `${rechargeTarget.department} • 현재 잔여 ${rechargeTarget.remainingCount}장`
                      : `전체 ${members.length}명에게 동시에 추가 지급`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRechargeTarget(undefined)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">충전 장수 선택</label>
                <div className="grid grid-cols-4 gap-1.5 mb-2.5">
                  {[5, 10, 15, 20].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setRechargeAmount(amt)}
                      className={`py-2 rounded-xl text-xs font-bold transition border ${
                        rechargeAmount === amt
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      +{amt}장
                    </button>
                  ))}
                </div>

                <input
                  type="number"
                  min="1"
                  max="100"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRechargeTarget(undefined)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-bold transition"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleExecuteRecharge}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition active:scale-95"
                >
                  +{rechargeAmount}장 충전하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== [모달 3: 새 사원 추가] ===================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">식권 관리 인원 추가</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  사원 / 구성원 이름 <span className="text-orange-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="예: 홍길동"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">부서명</label>
                  <input
                    type="text"
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    placeholder="예: 개발팀"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">초기 식권 수량</label>
                  <input
                    type="number"
                    min="1"
                    value={newTotalCount}
                    onChange={(e) => setNewTotalCount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">식권 1장 기준 단가 (원)</label>
                <input
                  type="number"
                  step="500"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">비고 / 메모</label>
                <input
                  type="text"
                  value={newMemo}
                  onChange={(e) => setNewMemo(e.target.value)}
                  placeholder="예: 11월 정기 지급, 인턴, 외근 등"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-bold transition"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 transition active:scale-95"
                >
                  등록 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== [모달 4: 사원 정보 수정] ===================== */}
      {editingMember && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-white">사원 정보 및 수량 수정</h3>
              <button
                onClick={() => setEditingMember(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">이름</label>
                  <input
                    type="text"
                    required
                    value={editingMember.name}
                    onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">부서</label>
                  <input
                    type="text"
                    value={editingMember.department}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, department: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">총 지급 수량</label>
                  <input
                    type="number"
                    value={editingMember.totalCount}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, totalCount: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">사용 수량</label>
                  <input
                    type="number"
                    value={editingMember.usedCount}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, usedCount: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">메모 / 상태</label>
                <input
                  type="text"
                  value={editingMember.memo || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, memo: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20"
                >
                  수정 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== [모달 5: 사용 내역 (로그) 모달] ===================== */}
      {showLogsModal && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl text-slate-100 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">식권 사용 & 충전 기록</h3>
                  <p className="text-xs text-slate-400">총 {logs.length}건의 최근 거래 로그</p>
                </div>
              </div>
              <button
                onClick={() => setShowLogsModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 no-scrollbar">
              {logs.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  아직 기록된 사용 내역이 없습니다.
                </div>
              ) : (
                logs.map((log) => {
                  const isCancel = log.count < 0;
                  const isRecharge = log.restaurantName === '식권 충전' || log.restaurantName === '일괄 지급';

                  return (
                    <div
                      key={log.id}
                      className="p-3 rounded-2xl bg-slate-800/70 border border-slate-750 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isRecharge
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : isCancel
                              ? 'bg-rose-500/20 text-rose-400'
                              : 'bg-orange-500/20 text-orange-400'
                          }`}
                        >
                          {isRecharge ? (
                            <Plus className="w-4 h-4" />
                          ) : isCancel ? (
                            <RotateCcw className="w-4 h-4" />
                          ) : (
                            <Utensils className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white">{log.memberName}</span>
                            <span className="text-[10px] text-slate-400">({log.department})</span>
                            <span className="font-semibold text-slate-200">
                              {log.restaurantName}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{log.memo || '-'}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`font-black text-xs tabular-nums ${
                            isRecharge
                              ? 'text-emerald-400'
                              : isCancel
                              ? 'text-rose-400'
                              : 'text-orange-400'
                          }`}
                        >
                          {isRecharge ? `+${log.count}장` : isCancel ? `복구 (+1장)` : `-1장`}
                        </span>
                        <span className="block text-[10px] text-slate-500 mt-0.5">
                          {log.usedAt}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 shrink-0 text-right">
              <button
                onClick={() => setShowLogsModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl text-xs font-bold"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
