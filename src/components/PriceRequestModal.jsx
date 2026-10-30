import React, { useState } from 'react';
import {
  Send,
  Plus,
  Trash2,
  X,
  AlertCircle,
  Sparkles,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';

export default function PriceRequestModal({ restaurant, onClose, onSubmitRequest }) {
  if (!restaurant) return null;

  const [menus, setMenus] = useState(
    restaurant.menus ? JSON.parse(JSON.stringify(restaurant.menus)) : []
  );
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // 메뉴 가격 변경
  const handlePriceChange = (index, newPrice) => {
    const updated = [...menus];
    updated[index].price = parseInt(newPrice) || 0;
    setMenus(updated);
  };

  // 메뉴 이름 변경
  const handleNameChange = (index, newName) => {
    const updated = [...menus];
    updated[index].name = newName;
    setMenus(updated);
  };

  // 새 메뉴 추가
  const handleAddMenu = () => {
    setMenus([
      ...menus,
      {
        id: `m-new-${Date.now()}`,
        name: '',
        price: 9000,
        isRecommended: false,
        updatedDate: new Date().toISOString().split('T')[0]
      }
    ]);
  };

  // 메뉴 삭제
  const handleRemoveMenu = (index) => {
    setMenus(menus.filter((_, i) => i !== index));
  };

  // 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('어떤 내용이 변경되었는지 제보 사유를 간단히 입력해 주세요. (예: 가격 인상, 신메뉴 추가 등)');
      return;
    }

    setIsSubmitting(true);
    await onSubmitRequest({
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      requestedMenus: menus.filter((m) => m.name.trim() !== ''),
      reason: reason.trim()
    });
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 font-sans animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-5 max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* 헤더 */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full">
                사용자 제보
              </span>
              <h3 className="text-base font-black text-stone-900">
                메뉴 / 가격 수정 요청
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              <b>'{restaurant.name}'</b>의 변동된 가격이나 메뉴를 관리자에게 제보합니다.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-12 px-4 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-black text-stone-900">
                수정 요청이 정상 접수되었습니다!
              </h4>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                관리자가 내용을 확인한 뒤 식당 정보에 즉시 반영합니다.<br />
                모란역 직장인들을 위한 소중한 제보 감사합니다!
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-stone-900 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              확인
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden mt-3 space-y-3.5">
            {/* 제보 사유 입력 */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                제보 내용 / 변경 사유 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="예: 콩나물국밥이 9,500원으로 올랐어요 / 신메뉴 추가"
                required
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/40 focus:outline-none"
              />
            </div>

            {/* 변경 요청 메뉴 리스트 */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700">
                  변경할 메뉴 및 가격 목록
                </span>
                <button
                  type="button"
                  onClick={handleAddMenu}
                  className="text-[11px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>새 메뉴 추가</span>
                </button>
              </div>

              {menus.map((menu, idx) => (
                <div
                  key={menu.id || idx}
                  className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 border border-stone-200/70"
                >
                  <input
                    type="text"
                    value={menu.name}
                    onChange={(e) => handleNameChange(idx, e.target.value)}
                    placeholder="메뉴명"
                    className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                  <div className="flex items-center gap-1 w-32 shrink-0">
                    <input
                      type="number"
                      step="500"
                      value={menu.price}
                      onChange={(e) => handlePriceChange(idx, e.target.value)}
                      className="w-full px-2 py-1.5 text-xs bg-white border border-stone-200 rounded-lg text-right font-bold tabular-nums focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                    <span className="text-xs text-stone-500 shrink-0">원</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMenu(idx)}
                    className="p-1.5 text-stone-400 hover:text-rose-500 rounded-lg transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* 안내 문구 */}
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 text-[11px] text-stone-500 flex items-start gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
              <span>
                일반 사용자가 제출한 수정 요청은 관리자(Admin)의 검토 및 승인을 거쳐 전체 사용자 데이터베이스에 반영됩니다.
              </span>
            </div>

            {/* 하단 버튼 */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? '접수 중...' : '수정 요청 접수'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
