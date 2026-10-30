import React, { useState, useEffect } from 'react';
import { X, Send, Bell, CheckCircle2, AlertCircle, ExternalLink, KeyRound, Eye, EyeOff } from 'lucide-react';
import { telegramService } from '../services/telegramService';

export default function TelegramConfigModal({ onClose }) {
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [showChatId, setShowChatId] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const config = telegramService.getConfig();
    if (config.botToken) setBotToken(config.botToken);
    if (config.chatId) setChatId(config.chatId);
  }, []);

  const handleSave = () => {
    telegramService.saveConfig(botToken, chatId);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleTest = async () => {
    if (!botToken.trim() || !chatId.trim()) {
      alert('Bot Token과 Chat ID를 모두 입력해주세요.');
      return;
    }
    setIsTesting(true);
    setTestResult(null);

    const res = await telegramService.sendTestMessage(botToken, chatId);
    setIsTesting(false);
    setTestResult(res);
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 font-sans animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl text-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">텔레그램 제보 알림 설정</h3>
              <p className="text-xs text-slate-400">사용자가 가격 제보 시 내 텔레그램으로 알림 수신</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          {/* 가이드 안내 */}
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1.5 leading-relaxed text-slate-300">
            <span className="font-bold text-white flex items-center gap-1">
              <span>💡 1분 만에 봇 생성 & ID 확인하기</span>
            </span>
            <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px]">
              <li>
                텔레그램에서 <b className="text-sky-300">@BotFather</b> 검색 후 <code className="text-white bg-slate-900 px-1 rounded">/newbot</code> 입력하여 <b>Bot Token</b> 받기
              </li>
              <li>
                만든 봇에게 아무 메시지나 한 번 보내기 (대화 시작)
              </li>
              <li>
                <b className="text-sky-300">@userinfobot</b> 검색 후 대화를 시작하여 내 <b>Id (Chat ID 숫자)</b> 확인
              </li>
            </ol>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-300">
                텔레그램 봇 토큰 (Bot Token)
              </label>
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="text-[11px] text-slate-400 hover:text-sky-300 flex items-center gap-1 transition"
              >
                {showToken ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>가리기</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>정보 보기</span>
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                placeholder="봇 토큰 입력 (보안 마스킹)"
                className="w-full px-3 py-2 pr-9 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 tracking-wider font-mono"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-300">
                관리자 채팅 ID (Chat ID)
              </label>
              <button
                type="button"
                onClick={() => setShowChatId(!showChatId)}
                className="text-[11px] text-slate-400 hover:text-sky-300 flex items-center gap-1 transition"
              >
                {showChatId ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>가리기</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>정보 보기</span>
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <input
                type={showChatId ? 'text' : 'password'}
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                placeholder="채팅 ID 입력 (보안 마스킹)"
                className="w-full px-3 py-2 pr-9 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 tracking-wider font-mono"
              />
              <button
                type="button"
                onClick={() => setShowChatId(!showChatId)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showChatId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 테스트 결과 안내 */}
          {testResult && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                testResult.success
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
              }`}
            >
              {testResult.success ? (
                <>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>텔레그램으로 테스트 메시지가 성공적으로 발송되었습니다! 폰을 확인해보세요.</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>발송 실패: {testResult.message}</span>
                </>
              )}
            </div>
          )}

          {savedSuccess && (
            <div className="p-2.5 rounded-xl bg-sky-950/50 border border-sky-500/50 text-xs text-sky-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>텔레그램 설정이 성공적으로 저장되었습니다!</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={handleTest}
              disabled={isTesting}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-700"
            >
              <Send className="w-3.5 h-3.5 text-sky-400" />
              <span>{isTesting ? '발송 중...' : '테스트 발송'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
              >
                닫기
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-md transition"
              >
                설정 저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
