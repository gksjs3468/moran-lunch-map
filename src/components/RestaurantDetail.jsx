import React from 'react';
import {
  MapPin,
  Phone,
  Calendar,
  Sparkles,
  Edit3,
  ExternalLink,
  X,
  Trash2,
  CheckCircle2,
  Navigation
} from 'lucide-react';

export default function RestaurantDetail({
  restaurant,
  onClose,
  onOpenPriceModal,
  onDelete,
  budgetLimit = 9000,
  isAdmin = false,
}) {
  if (!restaurant) return null;

  const hasMenus = restaurant.menus && restaurant.menus.length > 0;
  const underBudgetMenus = hasMenus ? restaurant.menus.filter((m) => m.price <= budgetLimit) : [];
  const overBudgetMenus = hasMenus ? restaurant.menus.filter((m) => m.price > budgetLimit) : [];
  const isTopPick = restaurant.verifiedByUser || restaurant.isTopPick;

  return (
    <div className="bg-white rounded-3xl p-5 shadow-xl border border-stone-200/80 flex flex-col h-full overflow-hidden font-sans">
      {/* 상단 액션 및 카테고리 */}
      <div className="flex items-start justify-between pb-3 border-b border-stone-100">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700">
            {restaurant.category}
          </span>
          {isTopPick && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 border border-orange-200/70 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-orange-500" />
              <span>직접 검증 맛집</span>
            </span>
          )}
          {!hasMenus && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-stone-100 text-stone-600 border border-stone-200">
              🏷️ 메뉴 미등록
            </span>
          )}
          {underBudgetMenus.length > 0 && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700">
              {budgetLimit.toLocaleString()}원 이하 {underBudgetMenus.length}종
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              if (confirm(`'${restaurant.name}' 식당을 삭제하시겠습니까?`)) {
                onDelete(restaurant.id);
              }
            }}
            className="p-1.5 text-stone-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition"
            title="식당 삭제"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 식당 헤더 정보 */}
      <div className="pt-3.5 pb-2">
        <h2 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
          <span>{restaurant.name}</span>
        </h2>
        <p className="text-xs text-stone-500 mt-1 leading-relaxed">
          {restaurant.description}
        </p>

        {/* 메뉴 미등록 식당 안내 배너 */}
        {!hasMenus && (
          <div className="mt-3 p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-700 flex items-start gap-2.5">
            <span className="text-base shrink-0">ℹ️</span>
            <div className="leading-tight">
              <span className="font-bold text-stone-900">식당 기본 정보만 등록됨</span>
              <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                네이버 플레이스에 등록된 상호 및 위치 정보입니다. 정확한 점심 메뉴와 가격을 알고 계시다면 아래 <b>[가격 변동 제보 / 수정 요청]</b> 버튼을 통해 제보해주세요!
              </p>
            </div>
          </div>
        )}

        {/* 확인 필요 안내 배너 (메뉴가 있는데 확인 필요 플래그가 있는 경우) */}
        {hasMenus && restaurant.needsVerification && (
          <div className="mt-3 p-3 rounded-2xl bg-amber-50 border border-amber-200/90 text-xs text-amber-900 flex items-start gap-2">
            <span className="text-base shrink-0">⚠️</span>
            <div className="leading-tight">
              <span className="font-bold">현장 확인 필요</span>
              <p className="text-[11px] text-amber-800/90 mt-0.5">
                실제 매장 방문 시 메뉴와 가격을 확인해 보시고, 변경 사항이 있다면 아래 <b>[가격 변동 제보]</b>를 남겨주세요!
              </p>
            </div>
          </div>
        )}

        <div className="mt-3 space-y-1.5 text-xs text-stone-600 bg-stone-50 p-3 rounded-2xl border border-stone-200/60">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span className="truncate font-medium">{restaurant.address}</span>
          </div>
          {restaurant.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <a href={`tel:${restaurant.phone}`} className="hover:underline">
                {restaurant.phone}
              </a>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-stone-400 text-[11px]">
            <Calendar className="w-3 h-3 text-stone-400 shrink-0" />
            <span>가격 검증일: {restaurant.updatedAt || '최근'}</span>
          </div>
        </div>

        {/* 태그 */}
        {restaurant.tags && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {restaurant.tags.map((tag, i) => (
              <span
                key={i}
                className="text-[11px] font-medium bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 메뉴 리스트 또는 메뉴 미등록 안내 (스크롤) */}
      <div className="flex-1 overflow-y-auto pr-1 my-2 space-y-3">
        {!hasMenus ? (
          <div className="py-12 px-4 text-center rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-stone-100 flex items-center justify-center text-xl">
              🍽️
            </div>
            <div>
              <p className="text-sm font-bold text-stone-800">
                등록된 메뉴 및 가격 정보가 없습니다
              </p>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto leading-relaxed">
                네이버 플레이스 기준 식당 상호와 위치 정보만 등록되어 있습니다.
                정확한 메뉴와 가격을 알고 계시면 아래 제보 버튼을 통해 알려주세요!
              </p>
            </div>
            <div className="pt-1">
              <span className="inline-block text-[11px] font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200/60">
                📢 메뉴 제보 대기 중
              </span>
            </div>
          </div>
        ) : (
          <>
            {/* 9천원 이하 추천 점심 메뉴 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span>{budgetLimit.toLocaleString()}원 이하 점심 메뉴</span>
                </h4>
                <span className="text-[11px] text-orange-600 font-bold">
                  {underBudgetMenus.length}개
                </span>
              </div>

              {underBudgetMenus.length === 0 ? (
                <div className="p-3 text-center text-xs text-stone-400 bg-stone-50 rounded-xl">
                  설정된 예산({budgetLimit.toLocaleString()}원) 이하 메뉴가 없습니다.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {underBudgetMenus.map((menu) => (
                    <div
                      key={menu.id || menu.name}
                      className="p-2.5 rounded-xl bg-orange-50/50 hover:bg-orange-50 border border-orange-200/80 flex items-center justify-between transition"
                    >
                      <div className="flex items-center gap-2">
                        {menu.isRecommended && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-orange-500 text-white rounded">
                            추천
                          </span>
                        )}
                        <span className="text-xs font-bold text-stone-900">{menu.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-orange-600 font-bold tabular-nums">
                          {menu.price.toLocaleString()}원
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 9천원 초과 일반 메뉴 */}
            {overBudgetMenus.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-stone-400 mb-1.5">
                  기타 메뉴 ({overBudgetMenus.length})
                </h4>
                <div className="space-y-1">
                  {overBudgetMenus.map((menu) => (
                    <div
                      key={menu.id || menu.name}
                      className="p-2 rounded-xl bg-stone-50 text-stone-500 text-xs flex items-center justify-between"
                    >
                      <span>{menu.name}</span>
                      <span className="font-semibold text-stone-600 tabular-nums">
                        {menu.price.toLocaleString()}원
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 하단 고정 액션 버튼 바 */}
      <div className="pt-3 border-t border-stone-100 flex items-center gap-2 shrink-0">
        <button
          onClick={() => onOpenPriceModal(restaurant)}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5 active:scale-95 ${
            isAdmin
              ? 'bg-orange-600 hover:bg-orange-700 text-white'
              : 'bg-stone-900 hover:bg-stone-800 text-white'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5 text-orange-400" />
          <span>{isAdmin ? '메뉴 / 가격 직접 수정 (DB)' : '가격 변동 제보 / 수정 요청'}</span>
        </button>

        <a
          href={restaurant.naverMapUrl || `https://map.naver.com/p/search/${encodeURIComponent(restaurant.name + ' 모란')}`}
          target="_blank"
          rel="noreferrer"
          className="py-2.5 px-3.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition flex items-center gap-1"
          title="네이버 지도에서 보기"
        >
          <ExternalLink className="w-3.5 h-3.5 text-stone-600" />
          <span>지도</span>
        </a>
      </div>
    </div>
  );
}
