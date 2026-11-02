import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Sparkles, AlertCircle, RefreshCw, KeyRound, ExternalLink } from 'lucide-react';
import { storageService } from '../services/storageService';

// 모란역 중심 기본 좌표
const MORAN_CENTER = { lat: 37.432145, lng: 127.129088 };

export default function NaverMapView({
  restaurants = [],
  selectedRestaurant = null,
  onSelectRestaurant = () => {},
  budgetLimit = 9000,
}) {
  const mapContainerRef = useRef(null);
  const naverMapInstance = useRef(null);
  const markersRef = useRef([]);

  const [clientId, setClientId] = useState(storageService.getNaverClientId());
  const [inputKey, setInputKey] = useState(clientId);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [sdkError, setSdkError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // 지도 마커 겹침 방지 필터: 'verified' (검증 점심 맛집만 깔끔하게) vs 'all' (전체)
  const [mapFilterMode, setMapFilterMode] = useState('verified');

  // 네이버 지도 스크립트 동적 로드
  useEffect(() => {
    if (!clientId) {
      setSdkLoaded(false);
      setSdkError(false);
      return;
    }

    // 이미 존재하는 스크립트 태그가 있다면 제거 후 다시 로드
    const existingScript = document.getElementById('naver-map-script');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = 'naver-map-script';
    script.type = 'text/javascript';
    // NCP 최신 Maps API v3는 ncpKeyId를 표준으로 사용합니다.
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
    script.async = true;

    script.onload = () => {
      if (window.naver && window.naver.maps) {
        setSdkLoaded(true);
        setSdkError(false);
        setErrorMessage('');
      } else {
        setSdkError(true);
        setErrorMessage('네이버 지도 객체(window.naver.maps)가 초기화되지 않았습니다. Web 서비스 URL 등록 여부를 확인해 주세요.');
      }
    };

    script.onerror = (e) => {
      console.error('Failed to load Naver Maps SDK script:', e);
      setSdkError(true);
      setErrorMessage('네이버 지도 스크립트를 불러오지 못했습니다. NCP 콘솔에서 Dynamic Map API 선택 및 서비스 URL(http://localhost, http://localhost:5173 등)을 확인해 주세요.');
      setSdkLoaded(false);
    };

    document.head.appendChild(script);

    return () => {
      // cleanup
    };
  }, [clientId]);

  // 지도 인스턴스 초기화
  useEffect(() => {
    if (!sdkLoaded || !mapContainerRef.current || !window.naver?.maps) return;

    try {
      const mapOptions = {
        center: new window.naver.maps.LatLng(MORAN_CENTER.lat, MORAN_CENTER.lng),
        zoom: 16,
        zoomControl: true,
        zoomControlOptions: {
          position: window.naver.maps.Position.RIGHT_CENTER,
        },
      };

      const map = new window.naver.maps.Map(mapContainerRef.current, mapOptions);
      naverMapInstance.current = map;

      // 모란역 중심 마커
      new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(MORAN_CENTER.lat, MORAN_CENTER.lng),
        map: map,
        icon: {
          content: `
            <div style="transform: translate(-50%, -50%); background-color: #ea580c; color: white; padding: 4px 9px; border-radius: 9999px; font-size: 11px; font-weight: 800; box-shadow: 0 4px 8px rgba(0,0,0,0.3); border: 2px solid white; display: flex; align-items: center; gap: 4px; font-family: -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif;">
              <span>🚇 모란역</span>
            </div>
          `,
          anchor: new window.naver.maps.Point(0, 0),
        },
      });
    } catch (err) {
      console.error('Failed to init naver map', err);
      setSdkError(true);
    }
  }, [sdkLoaded]);

  // 식당 마커 렌더링
  useEffect(() => {
    if (!naverMapInstance.current || !window.naver?.maps) return;

    // 기존 마커 초기화
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const map = naverMapInstance.current;

    // 필터 모드에 따라 표시할 식당 목록 필터링 (선택된 식당은 항상 지도에 유지)
    const targetRestaurants = mapFilterMode === 'verified'
      ? restaurants.filter((r) => (r.menus && r.menus.length > 0) || r.id === selectedRestaurant?.id)
      : restaurants;

    targetRestaurants.forEach((restaurant) => {
      const isSelected = selectedRestaurant?.id === restaurant.id;
      const isTop = restaurant.verifiedByUser || restaurant.isTopPick;
      const hasMenus = restaurant.menus && restaurant.menus.length > 0;
      const budgetMenus = hasMenus ? restaurant.menus.filter((m) => m.price <= budgetLimit) : [];
      const minPrice = budgetMenus.length > 0
        ? Math.min(...budgetMenus.map((m) => m.price))
        : (hasMenus ? Math.min(...restaurant.menus.map((m) => m.price)) : null);
      const hasBudgetMenu = budgetMenus.length > 0;

      // 선택된 식당은 최상단 zIndex 및 독보적 강조 색상
      const zIndex = isSelected ? 100000 : isTop ? 800 : hasMenus ? 200 : 50;

      const themeColor = isSelected
        ? '#ea580c' // 활성 오렌지
        : isTop
        ? '#1c1917' // 검증 맛집 (다크 차콜)
        : hasBudgetMenu
        ? '#059669' // 든든한 에메랄드
        : '#64748b'; // 메뉴 미등록 / 기타 (차분한 슬레이트)

      const priceBadgeHtml = minPrice !== null && isFinite(minPrice)
        ? `<span style="background: rgba(255,255,255,0.22); padding: 1px 5px; border-radius: 6px; font-size: 10px; font-weight: 800; font-family: -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif;">
            ${minPrice.toLocaleString()}원
          </span>`
        : '';

      // transform: translate(-50%, -100%) 로 마커 하단 뾰족침이 정확한 위/경도 좌표에 일치하도록 구현
      // 선택된 식당은 scale(1.18)과 강력한 외곽선으로 최상단에서 돋보이게 처리
      const markerContent = isSelected
        ? `
        <div style="
          position: relative;
          transform: translate(-50%, -100%) scale(1.18);
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          filter: drop-shadow(0 8px 16px rgba(234, 88, 12, 0.45));
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 100000;
          user-select: none;
        ">
          <!-- 선택된 툴팁 본체 (최상단 강조 링) -->
          <div style="
            background: #ea580c;
            color: #ffffff;
            padding: 6px 11px;
            border-radius: 14px;
            font-size: 12px;
            font-weight: 800;
            border: 2.5px solid #ffffff;
            display: flex;
            align-items: center;
            gap: 5px;
            white-space: nowrap;
            font-family: -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif;
            letter-spacing: -0.2px;
            box-shadow: 0 0 0 4px rgba(234, 88, 12, 0.7), 0 4px 12px rgba(0,0,0,0.3);
          ">
            <span style="font-size: 12px;">📍</span>
            <span>${restaurant.name}</span>
            ${priceBadgeHtml}
          </div>

          <!-- 꼬리침 -->
          <div style="
            width: 0;
            height: 0;
            border-left: 7px solid transparent;
            border-right: 7px solid transparent;
            border-top: 8px solid #ea580c;
            margin-top: -1px;
          "></div>

          <!-- 앵커 도트 -->
          <div style="
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #ea580c;
            border: 2px solid #ffffff;
            box-shadow: 0 0 0 2px rgba(234, 88, 12, 0.8);
            margin-top: 1px;
          "></div>
        </div>
      `
        : !hasMenus && mapFilterMode === 'all'
        ? `
        <!-- 메뉴 미등록 식당은 시야를 가리지 않도록 아담한 미니 도트 핀으로 표시 -->
        <div style="
          position: relative;
          transform: translate(-50%, -100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
          transition: transform 0.15s ease;
          user-select: none;
        " title="${restaurant.name}">
          <div style="
            background: #64748b;
            color: #ffffff;
            padding: 3px 6px;
            border-radius: 8px;
            font-size: 10px;
            font-weight: 600;
            border: 1.5px solid #ffffff;
            white-space: nowrap;
            font-family: -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif;
            opacity: 0.85;
          ">
            <span>${restaurant.name}</span>
          </div>
          <div style="
            width: 0;
            height: 0;
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            border-top: 5px solid #64748b;
            margin-top: -1px;
          "></div>
          <div style="
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: #64748b;
            border: 1px solid #ffffff;
            margin-top: 1px;
          "></div>
        </div>
      `
        : `
        <div style="
          position: relative;
          transform: translate(-50%, -100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.25));
          transition: transform 0.2s ease;
          user-select: none;
        ">
          <!-- 툴팁 본체 -->
          <div style="
            background: ${themeColor};
            color: #ffffff;
            padding: 5px 9px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 700;
            border: 2px solid #ffffff;
            display: flex;
            align-items: center;
            gap: 4px;
            white-space: nowrap;
            font-family: -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif;
            letter-spacing: -0.2px;
          ">
            ${isTop ? '<span style="color: #fbbf24; font-size: 11px;">⭐</span>' : restaurant.needsVerification ? '<span style="font-size: 10px; opacity: 0.9;">🔍</span>' : ''}
            <span>${restaurant.name}</span>
            ${priceBadgeHtml}
          </div>

          <!-- 위치를 정확히 가리키는 꼬리침 (화살표 팁) -->
          <div style="
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 7px solid ${themeColor};
            margin-top: -1px;
          "></div>

          <!-- 정확한 지도 좌표 앵커 도트 -->
          <div style="
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: ${themeColor};
            border: 1.5px solid #ffffff;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
            margin-top: 1px;
          "></div>
        </div>
      `;

      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(restaurant.lat, restaurant.lng),
        map: map,
        zIndex: zIndex, // 선택된 마커는 100,000으로 무조건 최상단 노출!
        icon: {
          content: markerContent,
          anchor: new window.naver.maps.Point(0, 0),
        },
      });

      window.naver.maps.Event.addListener(marker, 'click', () => {
        onSelectRestaurant(restaurant);
        map.panTo(new window.naver.maps.LatLng(restaurant.lat, restaurant.lng));
      });

      markersRef.current.push(marker);
    });
  }, [restaurants, selectedRestaurant, budgetLimit, sdkLoaded, mapFilterMode]);

  // 선택된 식당 위치로 지도 이동
  useEffect(() => {
    if (naverMapInstance.current && selectedRestaurant && window.naver?.maps) {
      naverMapInstance.current.panTo(
        new window.naver.maps.LatLng(selectedRestaurant.lat, selectedRestaurant.lng)
      );
    }
  }, [selectedRestaurant]);

  const handleSaveKey = () => {
    if (!inputKey.trim()) {
      alert('네이버 클라우드 플랫폼의 Client ID (ncpKeyId)를 입력해주세요.');
      return;
    }
    storageService.saveNaverClientId(inputKey.trim());
    setClientId(inputKey.trim());
    setShowKeyModal(false);
  };

  return (
    <div className="relative w-full h-full min-h-[350px] flex-1 overflow-hidden bg-stone-100 flex flex-col">
      {/* 지도 상단 오버레이 컨트롤 바 */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
        {/* 마커 겹침 방지 토글 칩: 추천 맛집만 깔끔하게 보기 / 전체 보기 */}
        <div className="bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-lg border border-stone-200/90 pointer-events-auto flex items-center gap-1">
          <button
            onClick={() => setMapFilterMode('verified')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              mapFilterMode === 'verified'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <span>⭐ 추천 맛집</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
              mapFilterMode === 'verified' ? 'bg-orange-700/80 text-white' : 'bg-stone-200 text-stone-700'
            }`}>
              {restaurants.filter((r) => r.menus && r.menus.length > 0).length}
            </span>
          </button>

          <button
            onClick={() => setMapFilterMode('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              mapFilterMode === 'all'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <span>전체 식당</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
              mapFilterMode === 'all' ? 'bg-stone-800 text-white' : 'bg-stone-200 text-stone-700'
            }`}>
              {restaurants.length}
            </span>
          </button>
        </div>

        <div className="pointer-events-auto flex items-center gap-1.5">
          {sdkError && (
            <button
              onClick={() => setShowKeyModal(true)}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-rose-500 text-white rounded-xl shadow-md transition animate-bounce"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>지도 인증 오류</span>
            </button>
          )}
          <button
            onClick={() => setShowKeyModal(true)}
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 bg-white/95 backdrop-blur-md hover:bg-white text-stone-700 rounded-xl shadow-xs border border-stone-200 transition"
          >
            <KeyRound className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden sm:inline">{clientId ? 'API 키' : '지도 연동'}</span>
          </button>
        </div>
      </div>

      {/* 네이버 지도 컨테이너 (SDK 활성화 시) */}
      {clientId && !sdkError ? (
        <div ref={mapContainerRef} className="w-full h-full flex-1" />
      ) : (
        /* 네이버 API 키가 없거나 로드 전일 때 제공되는 친절한 대화형 가상 모란역 지도 */
        <InteractiveMockMap
          restaurants={restaurants}
          selectedRestaurant={selectedRestaurant}
          onSelectRestaurant={onSelectRestaurant}
          budgetLimit={budgetLimit}
          onOpenKeyModal={() => setShowKeyModal(true)}
          mapFilterMode={mapFilterMode}
        />
      )}

      {/* 네이버 지도 API Key 입력 모달 */}
      {showKeyModal && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-green-50 rounded-xl text-green-600">
                <Navigation className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">네이버 지도 API 설정</h3>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              실제 고화질 네이버 지도를 표시하려면 네이버 클라우드 플랫폼(NCP)의 <b>Maps Client ID (ncpKeyId)</b>가 필요합니다.
              입력하지 않아도 내장된 <b>'모란역 인터랙티브 지도'</b>로 모든 기능을 정상적으로 사용할 수 있습니다!
            </p>

            {sdkError && errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-red-800">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>네이버 지도 로드 실패 안내</span>
                </div>
                <p className="leading-relaxed">{errorMessage}</p>
                <div className="mt-2 pt-2 border-t border-red-100 text-[11px] text-red-600">
                  <p><b>체크리스트:</b></p>
                  <p>1. NCP 콘솔의 Application 설정에서 <b>Web Dynamic Map</b> 체크 확인</p>
                  <p>2. 서비스 URL 목록에 <b>http://localhost</b> 및 <b>{window.location.origin}</b> 등록 여부 확인</p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  NCP Client ID (ncpKeyId)
                </label>
                <input
                  type="text"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="예: 7s1g2h..."
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                <p className="font-semibold mb-1">💡 무료 발급 안내 (NCP 콘솔)</p>
                <ol className="list-decimal pl-4 space-y-0.5 text-[11px] text-amber-700">
                  <li>네이버 클라우드 플랫폼 콘솔 접속 (무료)</li>
                  <li>AI·NAVER API &gt; Application 등록 &gt; Web Dynamic Map 체크</li>
                  <li>서비스 URL에 <code>http://localhost:5173</code> 등록</li>
                  <li>발급된 Client ID 복사 후 여기에 입력</li>
                </ol>
                <a
                  href="https://www.ncloud.com/product/applicationService/maps"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-900 underline"
                >
                  NCP 지도 서비스 바로가기 <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
              >
                닫기 (가상지도로 계속)
              </button>
              <button
                type="button"
                onClick={handleSaveKey}
                className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition"
              >
                키 적용하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 네이버 API 키 등록 전에도 모란역 공간감을 완벽히 제공하는 가상 반응형 맵
function InteractiveMockMap({
  restaurants,
  selectedRestaurant,
  onSelectRestaurant,
  budgetLimit,
  onOpenKeyModal,
  mapFilterMode = 'verified',
}) {
  // 모란역 위도 경도 좌표를 2D 가상 캔버스 좌표(%)로 정규화 (실제 모란역 상권 정밀 범위)
  const minLat = 37.4305;
  const maxLat = 37.4375;
  const minLng = 127.1265;
  const maxLng = 127.1345;

  const toPercent = (lat, lng) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = 100 - ((lat - minLat) / (maxLat - minLat)) * 100; // 위도가 높을수록 위쪽(0%)
    return {
      left: `${Math.min(Math.max(x, 8), 92)}%`,
      top: `${Math.min(Math.max(y, 8), 92)}%`,
    };
  };

  const moranPos = toPercent(MORAN_CENTER.lat, MORAN_CENTER.lng);

  // 겹침 방지 필터링 (선택된 식당은 항상 노출)
  const targetRestaurants = mapFilterMode === 'verified'
    ? restaurants.filter((r) => (r.menus && r.menus.length > 0) || r.id === selectedRestaurant?.id)
    : restaurants;

  return (
    <div className="relative w-full h-full flex-1 overflow-hidden select-none bg-[#e8ecf2]">
      {/* 배경 그리드 및 도로망 일러스트레이션 (성남대로, 모란로) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        {/* 성남대로 (세로 중심 대로) */}
        <line x1="42%" y1="0%" x2="42%" y2="100%" stroke="#cbd5e1" strokeWidth="18" />
        <line x1="42%" y1="0%" x2="42%" y2="100%" stroke="#ffffff" strokeWidth="10" />
        {/* 둔촌대로 (가로 대로) */}
        <line x1="0%" y1="52%" x2="100%" y2="52%" stroke="#cbd5e1" strokeWidth="16" />
        <line x1="0%" y1="52%" x2="100%" y2="52%" stroke="#ffffff" strokeWidth="8" />
      </svg>

      {/* 모란역 중심 랜드마크 */}
      <div
        style={{ left: moranPos.left, top: moranPos.top }}
        className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none"
      >
        <div className="w-10 h-10 rounded-full bg-amber-500 border-4 border-white shadow-xl flex items-center justify-center text-white font-extrabold text-sm animate-bounce">
          🚇
        </div>
        <div className="mt-1 px-2.5 py-1 bg-amber-900/90 text-white text-[11px] font-bold rounded-lg shadow-md whitespace-nowrap">
          수도권 8호선/수인분당선 모란역
        </div>
      </div>

      {/* 식당 마커 핀들 (위치 좌표와 툴팁 100% 일치) */}
      {targetRestaurants.map((restaurant) => {
        const pos = toPercent(restaurant.lat, restaurant.lng);
        const isSelected = selectedRestaurant?.id === restaurant.id;
        const isTop = restaurant.verifiedByUser || restaurant.isTopPick;
        const hasMenus = restaurant.menus && restaurant.menus.length > 0;
        const budgetMenus = hasMenus ? restaurant.menus.filter((m) => m.price <= budgetLimit) : [];
        const minPrice = budgetMenus.length > 0
          ? Math.min(...budgetMenus.map((m) => m.price))
          : (hasMenus ? Math.min(...restaurant.menus.map((m) => m.price)) : null);
        const meetsBudget = budgetMenus.length > 0;

        // 선택된 식당은 최상단 z-[9999] 및 강조 스타일 적용
        const zIndexClass = isSelected
          ? 'z-[9999] scale-125'
          : isTop
          ? 'z-30 hover:scale-105'
          : hasMenus
          ? 'z-20 hover:scale-105'
          : 'z-10 hover:scale-105';

        const pinColor = isSelected
          ? 'bg-orange-600 border-white text-white shadow-xl ring-4 ring-orange-400/80'
          : isTop
          ? 'bg-stone-900 border-white text-white'
          : meetsBudget
          ? 'bg-emerald-600 border-white text-white'
          : 'bg-slate-600 border-white text-white opacity-85';

        const arrowColor = isSelected
          ? 'border-t-orange-600'
          : isTop
          ? 'border-t-stone-900'
          : meetsBudget
          ? 'border-t-emerald-600'
          : 'border-t-slate-600';

        // 메뉴 미등록 식당은 시야 방지용 미니 핀 도트로 렌더링 (선택 시에는 풀 뱃지)
        if (!hasMenus && !isSelected && mapFilterMode === 'all') {
          return (
            <button
              key={restaurant.id}
              onClick={() => onSelectRestaurant(restaurant)}
              style={{ left: pos.left, top: pos.top }}
              title={restaurant.name}
              className="absolute -translate-x-1/2 -translate-y-full z-10 group transition-all duration-150 flex flex-col items-center pointer-events-auto hover:z-50 hover:scale-125"
            >
              <div className="px-1.5 py-0.5 rounded-md bg-slate-700 text-white text-[9px] font-semibold border border-white opacity-85 whitespace-nowrap shadow-xs">
                {restaurant.name}
              </div>
              <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-slate-700" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-700 border border-white mt-0.5" />
            </button>
          );
        }

        return (
          <button
            key={restaurant.id}
            onClick={() => onSelectRestaurant(restaurant)}
            style={{ left: pos.left, top: pos.top }}
            className={`absolute -translate-x-1/2 -translate-y-full transition-all duration-200 flex flex-col items-center pointer-events-auto ${zIndexClass}`}
          >
            {/* 툴팁 본체 */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl shadow-lg border-2 text-xs font-bold transition-all whitespace-nowrap ${pinColor}`}
            >
              {isSelected ? (
                <span className="text-[12px]">📍</span>
              ) : isTop ? (
                <span className="text-[11px]">⭐</span>
              ) : restaurant.needsVerification ? (
                <span className="text-[10px]">🔍</span>
              ) : null}
              <span className="tracking-tight">{restaurant.name}</span>
              {minPrice !== null && isFinite(minPrice) && (
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-md font-extrabold tabular-nums">
                  {minPrice.toLocaleString()}원
                </span>
              )}
            </div>

            {/* 마커 꼬리침 (화살표 팁) */}
            <div
              className={`w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] ${arrowColor} -mt-0.5`}
            />

            {/* 정확한 위치 핀 도트 */}
            <div
              className={`w-1.5 h-1.5 rounded-full border border-white shadow-xs mt-0.5 ${
                isSelected ? 'bg-orange-600 ring-2 ring-orange-300' : 'bg-stone-800'
              }`}
            />
          </button>
        );
      })}

      {/* 우측 하단: 안내 뱃지 */}
      <div className="absolute bottom-4 right-4 z-20 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-gray-200 text-xs text-gray-600 max-w-xs space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-gray-800">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>모란역 9,000원 런치맵 실행 중</span>
        </div>
        <p className="text-[11px] text-gray-500 leading-snug">
          상단 '네이버 지도 연동' 버튼에 Client ID를 넣으시면 실제 네이버 지도 타일 및 위성뷰로 전환됩니다.
        </p>
      </div>
    </div>
  );
}
