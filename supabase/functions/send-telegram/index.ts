// @ts-nocheck - Deno runtime
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") || "";
const ADMIN_CHAT_ID = Deno.env.get("TELEGRAM_ADMIN_CHAT_ID") || "";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function short(value: unknown, max = 2600) {
  const text = String(value ?? "").trim();
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

function field(label: string, value: unknown) {
  const text = String(value ?? "").trim();
  return text ? `<b>${label}:</b> ${escapeHtml(text)}` : "";
}

function buildTelegramText(payload: any) {
  const type = payload.type || "message";
  const name = payload.name || "Sayt foydalanuvchisi";
  const email = payload.email || "";
  const phone = payload.phone || "";
  const message = short(payload.message || payload.description || "");
  const meta = payload.meta || {};
  const time = new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" });

  const titles: Record<string, string> = {
    contact: "Yangi aloqa xabari",
    booking: "Yangi buyurtma",
    help: "Yangi yordam so'rovi",
    message: "Yangi xabar",
  };

  const lines = [
    `<b>${titles[type] || titles.message}</b>`,
    "",
    field("Ism", name),
    field("Telefon", phone),
    field("Email", email),
    field("Usta", meta.specialist),
    field("Xizmat", meta.service),
    field("Sana", meta.date),
    field("Vaqt", meta.time),
    field("Manzil", meta.location),
    field("Narx", meta.price),
    field("Rasmlar", meta.imagesCount ? `${meta.imagesCount} ta` : ""),
    "",
    message ? `<b>Xabar:</b>\n${escapeHtml(message)}` : "",
    "",
    `<b>Vaqt:</b> ${escapeHtml(time)}`,
  ];

  return lines.filter(Boolean).join("\n");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const payload = await req.json();

    if (!payload?.message && !payload?.description) {
      return json({ error: "Xabar matni kerak" }, 400);
    }

    if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
      return json({ error: "Telegram token yoki admin chat ID sozlanmagan" }, 500);
    }

    const telegramText = buildTelegramText(payload);
    const telegramResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: ADMIN_CHAT_ID,
        text: telegramText,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    const result = await telegramResponse.json();
    if (!result.ok) {
      console.error("Telegram send error:", result);
      return json({ error: "Telegram ga yuborishda xatolik", details: result }, 500);
    }

    return json({ success: true, message: "Xabar Telegram ga yuborildi" });
  } catch (e) {
    console.error("send-telegram error:", e);
    return json({ error: e instanceof Error ? e.message : "Noma'lum xato" }, 500);
  }
});
