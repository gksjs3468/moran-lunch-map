import React, { useState } from 'react';
import { Sparkles, Dice5, X, CheckCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LunchRoulette({ restaurants, budgetLimit, onClose, onSelect }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);

  // 9,000원 이하 메뉴가 있는 식당만 후보로 추림
  const candidates = restaurants.filter((r) =>
    r.menus.some((m) => m.price <= budgetLimit)
  );

  const handleSpin = () => {
    if (candidates.length === 0) return;
    setIsSpinning(true);
    setWinner(null);

    let count = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * candidates.length);
      setWinner(candidates[randomIndex]);
      count++;

      if (count > 20) {
        clearInterval(interval);
        const finalWinner = candidates[Math.floor(Math.random() * candidates.length)];
        setWinner(finalWinner);
        setIsSpinning(false);

        // 컨페티 팡파레 발사!
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {
          console.error(e);
        }
      }
    }, 80);
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> 오늘의 9천원 점심 결정기
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl hover:bg-gray-100 text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-lg font-extrabold text-gray-900 mb-1">
          오늘 뭐 먹을지 고민되시나요?
        </h3>
        <p className="text-xs text-gray-500 mb-6">
          모란역 9,000원 이하 검증 맛집 {candidates.length}곳 중 추천!
        </p>

        {/* 룰렛 결과 카드 */}
        <div className="min-h-36 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-emerald-50/60 to-slate-50 rounded-2xl border-2 border-dashed border-emerald-300 mb-6">
          {winner ? (
            <div className="animate-in fade-in zoom-in-95 duration-200">
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                {winner.category}
              </span>
              <h4 className="text-xl font-black text-gray-900 mt-1 mb-1">
                {winner.name}
              </h4>
              <p className="text-xs text-emerald-800 font-semibold">
                대표 가성비 메뉴: {winner.menus.find((m) => m.price <= budgetLimit)?.name} (
                {winner.menus.find((m) => m.price <= budgetLimit)?.price.toLocaleString()}원)
              </p>
            </div>
          ) : (
            <div className="text-gray-400 flex flex-col items-center gap-2">
              <Dice5 className="w-8 h-8 text-emerald-500" />
              <span className="text-xs font-medium">아래 버튼을 눌러 돌려보세요!</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <button
            onClick={handleSpin}
            disabled={isSpinning || candidates.length === 0}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-bold rounded-2xl shadow-md transition flex items-center justify-center gap-2 text-sm"
          >
            <Dice5 className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? '추첨 중...' : '점심 메뉴 뽑기!'}</span>
          </button>

          {winner && !isSpinning && (
            <button
              onClick={() => {
                onSelect(winner);
                onClose();
              }}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl transition text-xs flex items-center justify-center gap-1"
            >
              <span>이 식당 위치 확인하기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
