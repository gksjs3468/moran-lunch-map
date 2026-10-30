import React, { useState } from 'react';
import { Shield, Lock, User, X, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  if (!isOpen) return null;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  // 기본 관리자 계정 (환경 변수가 설정되어 있으면 우선 적용)
  const EXPECTED_USER = import.meta.env.VITE_ADMIN_ID || 'admin';
  const EXPECTED_PASS = import.meta.env.VITE_ADMIN_PASSWORD || 'admin1234';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (username.trim() === EXPECTED_USER && password === EXPECTED_PASS) {
      sessionStorage.setItem('moran_admin_authenticated', 'true');
      onLoginSuccess();
      onClose();
    } else {
      setError('아이디 또는 비밀번호가 일치하지 않습니다.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 font-sans animate-in fade-in duration-200">
      <div
        className={`bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-stone-200/90 text-stone-800 transition-all ${
          shake ? 'animate-bounce' : ''
        }`}
      >
        {/* 상단 닫기 및 아이콘 */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-inner">
            <Shield className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 타이틀 */}
        <div>
          <h3 className="text-lg font-black text-stone-900 tracking-tight">
            관리자 로그인
          </h3>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            식당 DB 및 제보 승인 관리를 위해 관리자 계정으로 로그인해 주세요.
          </p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              관리자 아이디
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="아이디 입력"
                required
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/40 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              비밀번호
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 입력"
                required
                className="w-full pl-9 pr-9 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500/40 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 flex items-center gap-1.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 로그인 버튼 */}
          <button
            type="submit"
            className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5 active:scale-98 mt-2"
          >
            <span>로그인하기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
