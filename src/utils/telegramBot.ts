export const sendTelegramNotification = async (message: string) => {
  // Use environment variables for the token and chat ID. 
  // Make sure to add VITE_TELEGRAM_BOT_TOKEN and VITE_TELEGRAM_CHAT_ID to your .env file
  const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn("Telegram bot token yoki chat ID topilmadi. .env faylni tekshiring. Xabar kutilmoqda:", message);
    // As a fallback for demo purposes, if keys aren't set, we just log it
    // In production, you might want to show a toast to the admin.
    return;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      console.error("Telegram xatosi:", await response.text());
    } else {
      console.log("Telegramga xabar yuborildi:", message);
    }
  } catch (error) {
    console.error("Telegram API tarmog'i xatosi:", error);
  }
};
