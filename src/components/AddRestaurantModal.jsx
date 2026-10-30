import React, { useState } from 'react';
import { X, Plus, MapPin, DollarSign, Tag, Navigation } from 'lucide-react';
import { CATEGORIES } from '../data/initialRestaurants';

export default function AddRestaurantModal({ onClose, onAdd }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('한식');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');
  // 기본 모란역 근방 랜덤 살짝 오프셋 좌표
  const [lat, setLat] = useState((37.432 + (Math.random() - 0.5) * 0.003).toFixed(6));
  const [lng, setLng] = useState((127.129 + (Math.random() - 0.5) * 0.003).toFixed(6));

  const [menus, setMenus] = useState([
    { id: 'm-init-1', name: '', price: 8000 },
  ]);

  const handleMenuChange = (id, field, value) => {
    setMenus((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: field === 'price' ? parseInt(value, 10) || 0 : value } : m))
    );
  };

  const handleAddMenuRow = () => {
    setMenus((prev) => [...prev, { id: `m-${Date.now()}`, name: '', price: 8000 }]);
  };

  const handleRemoveMenuRow = (id) => {
    if (menus.length === 1) return;
    setMenus((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('식당 이름을 입력해주세요.');
      return;
    }

    const validMenus = menus
      .filter((m) => m.name.trim() !== '')
      .map((m) => ({
        ...m,
        updatedDate: new Date().toISOString().split('T')[0],
      }));

    if (validMenus.length === 0) {
      alert('최소 1개 이상의 대표 메뉴 이름을 입력해주세요.');
      return;
    }

    const newRest = {
      name: name.trim(),
      category,
      address: address.trim() || '모란역 인근',
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      phone: phone.trim() || '031-',
      naverMapUrl: `https://map.naver.com/p/search/${encodeURIComponent(name.trim())}`,
      budgetFriendly: validMenus.some((m) => m.price <= 9000),
      avgPrice: Math.round(validMenus.reduce((acc, c) => acc + c.price, 0) / validMenus.length),
      rating: 4.5,
      tags: tags
        ? tags.split(',').map((t) => t.trim()).filter(Boolean)
        : ['9천원이하', '모란역점심'],
      description: description.trim() || '동료가 직접 등록한 가성비 맛집',
      menus: validMenus,
    };

    onAdd(newRest);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">새로운 모란역 식당 등록</h2>
            <p className="text-xs text-gray-500">모란역 9,000원 맵에 우리만의 비밀 맛집을 추가합니다.</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-gray-700 block mb-1">식당 이름 *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 모란 백반집"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">카테고리</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {CATEGORIES.filter((c) => c !== '전체').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">주소</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="예: 경기 성남시 중원구 둔촌대로..."
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-gray-700 block mb-1">위도 (모란역 부근 자동할당)</label>
              <input
                type="number"
                step="0.000001"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">경도</label>
              <input
                type="number"
                step="0.000001"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-gray-700">대표 메뉴 및 가격 (9,000원 이하 권장)</label>
              <button
                type="button"
                onClick={handleAddMenuRow}
                className="text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> 메뉴 추가
              </button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {menus.map((m, idx) => (
                <div key={m.id} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder={`메뉴 ${idx + 1}`}
                    value={m.name}
                    onChange={(e) => handleMenuChange(m.id, 'name', e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <input
                    type="number"
                    step="500"
                    placeholder="가격"
                    value={m.price}
                    onChange={(e) => handleMenuChange(m.id, 'price', e.target.value)}
                    className="w-24 px-3 py-1.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-right"
                  />
                  {menus.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMenuRow(m.id)}
                      className="text-gray-400 hover:text-red-500 px-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">태그 (쉼표로 구분)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="예: 순대국, 든든함, 가성비"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">식당 한줄 평 / 팁</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="점심시간 웨이팅 여부나 추천 메뉴를 적어주세요."
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
            />
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md"
            >
              식당 등록 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
