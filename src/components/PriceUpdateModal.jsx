import React, { useState } from 'react';
import { X, Plus, Trash2, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react';

export default function PriceUpdateModal({ restaurant, onClose, onSave }) {
  const [menus, setMenus] = useState(
    restaurant.menus ? JSON.parse(JSON.stringify(restaurant.menus)) : []
  );
  const [newMenuName, setNewMenuName] = useState('');
  const [newMenuPrice, setNewMenuPrice] = useState('');
  const [comment, setComment] = useState('');
  const [visitedDate, setVisitedDate] = useState(new Date().toISOString().split('T')[0]);

  // 메뉴 가격 수정 핸들러
  const handlePriceChange = (id, newPrice) => {
    const numeric = parseInt(newPrice, 10) || 0;
    setMenus((prev) =>
      prev.map((m) => (m.id === id ? { ...m, price: numeric, updatedDate: visitedDate } : m))
    );
  };

  // 메뉴 삭제
  const handleDeleteMenu = (id) => {
    setMenus((prev) => prev.filter((m) => m.id !== id));
  };

  // 새 메뉴 추가
  const handleAddMenu = (e) => {
    e.preventDefault();
    if (!newMenuName.trim()) return;
    const priceNum = parseInt(newMenuPrice, 10) || 0;
    if (priceNum <= 0) {
      alert('올바른 가격을 입력해주세요.');
      return;
    }

    const newItem = {
      id: `m-${Date.now()}`,
      name: newMenuName.trim(),
      price: priceNum,
      isRecommended: priceNum <= 9000,
      updatedDate: visitedDate,
    };

    setMenus((prev) => [...prev, newItem]);
    setNewMenuName('');
    setNewMenuPrice('');
  };

  // 저장 제출
  const handleSubmit = (e) => {
    e.preventDefault();
    if (menus.length === 0) {
      alert('최소 1개 이상의 메뉴가 필요합니다.');
      return;
    }

    const updatedRestaurant = {
      ...restaurant,
      menus,
      avgPrice: Math.round(menus.reduce((acc, cur) => acc + cur.price, 0) / menus.length),
      updatedAt: visitedDate,
    };

    const changeSummary = comment.trim() || `실제 확인 가격 업데이트 (${visitedDate})`;
    onSave(updatedRestaurant, changeSummary);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 my-8">
        {/* 헤더 */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 실제 가격 제보 & 수정
            </div>
            <h2 className="text-xl font-bold text-gray-900">{restaurant.name}</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              포털에 표기된 가격과 현장 가격이 다를 경우 수정하여 동료들에게 최신 정보를 제공해주세요!
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 확인 일자 및 코멘트 */}
        <div className="py-4 space-y-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" /> 확인/방문 일자
              </label>
              <input
                type="date"
                value={visitedDate}
                onChange={(e) => setVisitedDate(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                변동 메모 (선택)
              </label>
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="예: 500원 인상됨 / 점심특선 확인"
                className="w-full text-xs px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 기존 메뉴 목록 수정 */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              등록된 메뉴 및 실제 가격 수정
            </label>
            <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
              {menus.map((menu) => {
                const isUnder9k = menu.price <= 9000;
                return (
                  <div
                    key={menu.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition ${
                      isUnder9k
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <span className="text-xs font-semibold text-gray-900 block truncate">
                        {menu.name}
                      </span>
                      {isUnder9k ? (
                        <span className="text-[10px] text-emerald-700 font-bold">
                          ✨ 9천원 예산 통과!
                        </span>
                      ) : (
                        <span className="text-[10px] text-red-500 font-semibold">
                          ⚠️ 9천원 초과
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <input
                          type="number"
                          step="500"
                          value={menu.price}
                          onChange={(e) => handlePriceChange(menu.id, e.target.value)}
                          className="w-24 text-right pr-6 py-1.5 text-xs font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                        <span className="absolute right-2 top-1.5 text-xs text-gray-400">원</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteMenu(menu.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="메뉴 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 새 메뉴 추가 폼 */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-gray-200">
            <span className="text-xs font-bold text-gray-700 block mb-2">
              ➕ 새로운 9,000원 메뉴 추가
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="메뉴 이름 (예: 김치찌개)"
                value={newMenuName}
                onChange={(e) => setNewMenuName(e.target.value)}
                className="flex-1 text-xs px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              />
              <input
                type="number"
                step="500"
                placeholder="가격 (원)"
                value={newMenuPrice}
                onChange={(e) => setNewMenuPrice(e.target.value)}
                className="w-24 text-xs px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              />
              <button
                type="button"
                onClick={handleAddMenu}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> 추가
              </button>
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" /> 실제 가격 DB에 저장
          </button>
        </div>
      </div>
    </div>
  );
}
