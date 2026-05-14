// Telegram Bot Webhook Setup Script
// Run: node setup-telegram-webhook.cjs

const fs = require("fs");
const path = require("path");

function readEnv() {
  const envPath = path.join(__dirname, ".env");
  const file = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
  const values = {};

  for (const line of file.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\r\n]+)"?\s*$/i);
    if (match) values[match[1]] = match[2];
  }

  return { ...values, ...process.env };
}

const env = readEnv();
const BOT_TOKEN = env.TELEGRAM_BOT_TOKEN;
const SUPABASE_URL = env.SUPABASE_URL || env.VITE_SUPABASE_URL || "";
const SUPABASE_PROJECT_ID =
  env.SUPABASE_PROJECT_ID || SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
const WEBHOOK_URL =
  env.TELEGRAM_WEBHOOK_URL ||
  (SUPABASE_PROJECT_ID
    ? `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/telegram-webhook`
    : "");

async function setupWebhook() {
  if (!BOT_TOKEN || !WEBHOOK_URL) {
    console.error("TELEGRAM_BOT_TOKEN yoki Supabase webhook URL topilmadi.");
    console.error(".env ichida TELEGRAM_BOT_TOKEN va VITE_SUPABASE_URL borligini tekshiring.");
    process.exit(1);
  }

  console.log("Telegram Bot Webhook Setup");
  console.log("================================");
  console.log(`Bot token: ${BOT_TOKEN.substring(0, 10)}...`);
  console.log(`Webhook URL: ${WEBHOOK_URL}`);
  console.log("");

  try {
    console.log("Bot ma'lumotlarini olish...");
    const botInfoRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`);
    const botInfo = await botInfoRes.json();

    if (!botInfo.ok) {
      console.error("Bot topilmadi:", botInfo.description);
      return;
    }

    console.log(`Bot topildi: @${botInfo.result.username} (${botInfo.result.first_name})`);
    console.log(`Bot ID: ${botInfo.result.id}`);

    console.log("\nWebhook o'rnatilmoqda...");
    const webhookRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: WEBHOOK_URL,
        allowed_updates: ["message", "callback_query"],
        drop_pending_updates: true,
      }),
    });
    const webhookResult = await webhookRes.json();

    if (webhookResult.ok) {
      console.log("Webhook muvaffaqiyatli o'rnatildi.");
    } else {
      console.log("Webhook xatosi:", webhookResult.description);
      console.log("Supabase Edge Function deploy qilinganini tekshiring:");
      console.log("npx supabase functions deploy telegram-webhook");
      console.log("npx supabase functions deploy send-telegram");
    }

    console.log("\nBot buyruqlari o'rnatilmoqda...");
    const commandsRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setMyCommands`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        commands: [
          { command: "start", description: "Botni boshlash" },
          { command: "ai", description: "AI yordamchidan so'rash" },
          { command: "xizmatlar", description: "Barcha xizmatlar" },
          { command: "usta", description: "Usta topish" },
          { command: "narxlar", description: "Narxlar ro'yxati" },
          { command: "yordam", description: "Yordam olish" },
          { command: "aloqa", description: "Biz bilan bog'lanish" },
          { command: "sayt", description: "Veb-saytga o'tish" },
        ],
      }),
    });
    const commandsResult = await commandsRes.json();

    if (commandsResult.ok) console.log("Bot buyruqlari o'rnatildi.");
    else console.log("Buyruqlar xatosi:", commandsResult.description);

    console.log("\nWebhook holati:");
    const infoRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`);
    const info = await infoRes.json();

    if (info.ok) {
      console.log(`URL: ${info.result.url || "O'rnatilmagan"}`);
      console.log(`Pending updates: ${info.result.pending_update_count}`);
      console.log(`Last error: ${info.result.last_error_message || "Yo'q"}`);
    }

    console.log("\n================================");
    console.log("Setup tugadi.");
    console.log("Supabase Secrets ichida quyidagilar bo'lishi kerak:");
    console.log("TELEGRAM_BOT_TOKEN, TELEGRAM_ADMIN_CHAT_ID, GROQ_API_KEY (ixtiyoriy)");
    console.log(`Telegramda @${botInfo.result.username} ni ochib /start bosing.`);
  } catch (error) {
    console.error("Xatolik:", error.message);
  }
}

setupWebhook();
