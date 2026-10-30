/**
 * 텔레그램 봇 알림 서비스
 * 사용자가 '가격 변동 제보 / 수정 요청'을 제출하면
 * 관리자의 텔레그램으로 즉시 알림 메시지를 전송합니다.
 */

const TELEGRAM_CONFIG_KEY = 'moran_telegram_config_v1';

export const telegramService = {
  // 설정 가져오기 (환경 변수 우선, 없으면 localStorage)
  getConfig: () => {
    try {
      const saved = localStorage.getItem(TELEGRAM_CONFIG_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}

    return {
      botToken: import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '',
      chatId: import.meta.env.VITE_TELEGRAM_CHAT_ID || '',
    };
  },

  // 설정 저장
  saveConfig: (botToken, chatId) => {
    const config = { botToken: botToken.trim(), chatId: chatId.trim() };
    localStorage.setItem(TELEGRAM_CONFIG_KEY, JSON.stringify(config));
    return config;
  },

  // 설정 여부 확인
  isConfigured: () => {
    const { botToken, chatId } = telegramService.getConfig();
    return Boolean(botToken && chatId);
  },

  // 제보 알림 메시지 발송
  sendPriceReport: async ({ restaurantName, reason, requestedMenus }) => {
    const { botToken, chatId } = telegramService.getConfig();
    if (!botToken || !chatId) {
      console.warn('Telegram bot not configured yet.');
      return { success: false, message: '텔레그램 설정 미등록' };
    }

    const menuListText = requestedMenus && requestedMenus.length > 0
      ? requestedMenus.map((m) => `  • ${m.name} : ${m.price ? m.price.toLocaleString() + '원' : '가격 미정'}`).join('\n')
      : '  (입력된 메뉴 없음)';

    const nowStr = new Date().toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const text = `🔔 *[모란 점심 로드] 새 가격 제보 도착!*\n\n` +
      `🍽️ *식당명:* ${restaurantName}\n` +
      `💬 *제보 내용:* "${reason || '가격 변동 제보'}"\n\n` +
      `📋 *제보된 메뉴/가격 목록:*\n${menuListText}\n\n` +
      `⏰ *접수 일시:* ${nowStr}\n\n` +
      `👉 관리자 페이지에서 확인 후 반영해주세요.`;

    try {
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'Markdown'
        })
      });

      const data = await res.json();
      if (data.ok) {
        return { success: true };
      } else {
        console.error('Telegram API error:', data);
        return { success: false, message: data.description };
      }
    } catch (err) {
      console.error('Failed to send telegram message:', err);
      return { success: false, message: err.message };
    }
  },

  // 테스트 메시지 전송
  sendTestMessage: async (botToken, chatId) => {
    const text = `✅ *[모란 점심 로드] 텔레그램 알림 연동 성공!*\n\n` +
      `축하합니다! 이제 사용자가 가격 변동 제보를 보내면 이 채팅방으로 즉시 알림이 전달됩니다. 🚀`;

    try {
      const url = `https://api.telegram.org/bot${botToken.trim()}/sendMessage`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId.trim(),
          text: text,
          parse_mode: 'Markdown'
        })
      });

      const data = await res.json();
      return data.ok
        ? { success: true }
        : { success: false, message: data.description };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }
};
