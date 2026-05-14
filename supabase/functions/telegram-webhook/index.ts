// @ts-nocheck - Deno runtime
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") || "";
const ADMIN_ID = Deno.env.get("TELEGRAM_ADMIN_CHAT_ID") || "";
const SITE_URL = Deno.env.get("SITE_URL") || "https://ishtop.uz";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || Deno.env.get("VITE_SUPABASE_URL") || "";
const SUPABASE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ||
  Deno.env.get("SUPABASE_ANON_KEY") ||
  Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY") ||
  "";

const services = [
  { key: "santexnik", label: "Santexnik", terms: ["santexnik", "quvur", "kran"], price: "50 000 - 200 000 so'm" },
  { key: "elektrik", label: "Elektrik", terms: ["elektrik", "elektr", "tok"], price: "40 000 - 150 000 so'm" },
  { key: "tamirchi", label: "Ta'mirchi", terms: ["tamir", "ta'mir", "usta"], price: "100 000 - 500 000 so'm" },
  { key: "tozalovchi", label: "Tozalovchi", terms: ["tozalash", "tozalovchi", "clean"], price: "80 000 - 300 000 so'm" },
  { key: "it", label: "IT xizmat", terms: ["it", "dastur", "kompyuter", "bot", "sayt"], price: "50 000 - 200 000 so'm" },
  { key: "oqituvchi", label: "O'qituvchi", terms: ["oqituvchi", "o'qituvchi", "repetitor", "dars"], price: "50 000 - 150 000 so'm" },
  { key: "avtomaster", label: "Avtomaster", terms: ["avto", "mashina", "avtomaster"], price: "80 000 - 300 000 so'm" },
  { key: "fotograf", label: "Fotograf", terms: ["foto", "fotograf", "video"], price: "100 000 - 500 000 so'm" },
];

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

function normalize(value: unknown) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/['`]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function serviceByKey(key: string) {
  return services.find((service) => service.key === key) || services[0];
}

async function api(method: string, body = {}) {
  if (!BOT_TOKEN) throw new Error("TELEGRAM_BOT_TOKEN is not configured");

  const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!data.ok) console.error("Telegram API error:", method, data);
  return data;
}

function mainMenu() {
  return {
    inline_keyboard: [
      [{ text: "AI yordamchi", callback_data: "menu_ai" }],
      [
        { text: "Xizmatlar", callback_data: "menu_services" },
        { text: "Usta topish", callback_data: "menu_find" },
      ],
      [
        { text: "Narxlar", callback_data: "menu_prices" },
        { text: "Aloqa", callback_data: "menu_contact" },
      ],
      [
        { text: "Saytga o'tish", url: SITE_URL },
        { text: "Admin Panel 📊", callback_data: "menu_admin" }
      ],
    ],
  };
}

function adminMenu() {
  return {
    inline_keyboard: [
      [{ text: "📊 Statistika", callback_data: "admin_stats" }, { text: "👥 Foydalanuvchilar", callback_data: "admin_users" }],
      [{ text: "👨‍🔧 Ustalar", callback_data: "admin_specs" }, { text: "📝 Buyurtmalar", callback_data: "admin_orders" }],
      [{ text: "Orqaga", callback_data: "menu_main" }]
    ]
  };
}

function servicesMenu() {
  const rows = [];
  for (let i = 0; i < services.length; i += 2) {
    rows.push(
      services.slice(i, i + 2).map((service) => ({
        text: service.label,
        callback_data: `spec_${service.key}`,
      })),
    );
  }
  rows.push([{ text: "Orqaga", callback_data: "menu_main" }]);
  return { inline_keyboard: rows };
}

function backMenu(to = "menu_main") {
  return { inline_keyboard: [[{ text: "Orqaga", callback_data: to }]] };
}

function welcomeText(firstName = "") {
  const name = firstName ? `, ${escapeHtml(firstName)}` : "";
  return `<b>IshTop.uz rasmiy botiga xush kelibsiz${name}!</b>

Bu bot orqali xizmat tanlaysiz, narxlarni ko'rasiz, usta topasiz va admin bilan bog'lanasiz.

Kerakli bo'limni tanlang:`;
}

function pricesText() {
  return `<b>IshTop.uz narxlari</b>

${services.map((service) => `<b>${escapeHtml(service.label)}:</b> ${escapeHtml(service.price)}`).join("\n")}

Narxlar ish hajmi, hudud va kelishuvga qarab o'zgarishi mumkin.`;
}

function contactText() {
  return `<b>Aloqa</b>

Admin: @juliqian
Kanal: @ishtop_uz
Sayt: ${escapeHtml(SITE_URL)}

Adminga xabar yuborish uchun matn boshiga <b>#admin</b> yozing.`;
}

function helpText() {
  return `<b>Yordam kerakmi?</b>

1. Muammoni rasm va manzil bilan yuborish: ${escapeHtml(SITE_URL)}/yordam
2. Bot orqali adminga yozish: <b>#admin</b> so'zidan keyin xabaringizni yozing.
3. Usta topish uchun "Usta topish" tugmasini bosing.`;
}

function siteText() {
  return `<b>IshTop.uz sayti</b>

Xizmatlar, mutaxassislar va buyurtmalar uchun saytga o'ting: ${escapeHtml(SITE_URL)}`;
}

function localAiReply(text: string) {
  const q = normalize(text);
  if (q.includes("narx") || q.includes("qancha")) return pricesText().replace(/<[^>]+>/g, "");
  if (q.includes("aloqa") || q.includes("admin")) return "Admin bilan bog'lanish: @juliqian. Botda #admin deb xabar yozsangiz ham bo'ladi.";
  if (q.includes("usta") || q.includes("top")) return "Usta topish uchun /usta buyrug'ini bosing, keyin yo'nalishni tanlang.";
  if (q.includes("xizmat")) return `Xizmatlar: ${services.map((s) => s.label).join(", ")}.`;
  return "Men IshTop.uz bo'yicha yordam beraman: usta topish, narxlar, xizmatlar, buyurtma yoki aloqa haqida so'rang.";
}

async function askAI(prompt: string) {
  const key = Deno.env.get("GROQ_API_KEY");
  if (!key) return localAiReply(prompt);

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.45,
        max_tokens: 360,
        messages: [
          {
            role: "system",
            content:
              "Siz IshTop.uz platformasining rasmiy yordamchisiz. Faqat IshTop.uz, xizmatlar, usta topish, narxlar, buyurtma va aloqa haqida o'zbek tilida qisqa javob bering.",
          },
          { role: "user", content: prompt.slice(0, 1200) },
        ],
      }),
    });

    if (!response.ok) return localAiReply(prompt);
    const data = await response.json();
    return data?.choices?.[0]?.message?.content || localAiReply(prompt);
  } catch (error) {
    console.error("AI error:", error);
    return localAiReply(prompt);
  }
}

function matchesService(profile: any, service: any) {
  const haystack = normalize(`${profile.profession || ""} ${profile.bio || ""} ${profile.full_name || ""}`);
  return service.terms.some((term: string) => haystack.includes(normalize(term)));
}

async function findWorkers(serviceKey: string) {
  const service = serviceByKey(serviceKey);

  if (!SUPABASE_URL || !SUPABASE_KEY) return [];

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?select=*&limit=50&order=created_at.desc`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      console.error("Profiles query error:", response.status, await response.text());
      return [];
    }

    const rows = await response.json();
    const workers = (Array.isArray(rows) ? rows : [])
      .filter((profile) => profile.full_name && matchesService(profile, service))
      .slice(0, 5)
      .map((profile) => ({
        full_name: profile.full_name,
        profession: profile.profession || service.label,
        location: profile.location || profile.city || "O'zbekiston",
        phone: profile.phone || "",
        rating: "4.9",
        price: service.price.split(" - ")[0] + " dan",
      }));

    return workers;
  } catch (error) {
    console.error("Profiles query failed:", error);
    return [];
  }
}

function workersText(service: any, workers: any[]) {
  if (!workers.length) {
    return `<b>${escapeHtml(service.label)} bo'yicha real mutaxassis topilmadi</b>

Hozircha bu yo'nalishda bazada tasdiqlangan mutaxassis yo'q.

Yangi mutaxassis qo'shilsa, shu yerda avtomatik chiqadi.`;
  }

  const body = workers
    .slice(0, 5)
    .map((worker, index) => {
      const phone = worker.phone ? `\nTelefon: ${escapeHtml(worker.phone)}` : "";
      return `${index + 1}. <b>${escapeHtml(worker.full_name)}</b>
Kasb: ${escapeHtml(worker.profession)}
Hudud: ${escapeHtml(worker.location)}
Reyting: ${escapeHtml(worker.rating)} | Narx: ${escapeHtml(worker.price)}${phone}`;
    })
    .join("\n\n");

  return `<b>${escapeHtml(service.label)} bo'yicha topilgan mutaxassislar</b>

${body}

Buyurtma berish yoki to'liq profil ko'rish uchun saytga o'ting.`;
}

async function sendMenu(chatId: number | string, text: string, reply_markup = mainMenu()) {
  return api("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    reply_markup,
    disable_web_page_preview: true,
  });
}

async function editMenu(chatId: number | string, messageId: number, text: string, reply_markup = mainMenu()) {
  return api("editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: "HTML",
    reply_markup,
    disable_web_page_preview: true,
  });
}

async function forwardToAdmin(message: any) {
  if (!ADMIN_ID) return false;

  const from = message.from || {};
  const text = String(message.text || "").replace(/^#?admin\b/i, "").trim();
  const username = from.username ? `@${from.username}` : "username yo'q";
  const adminText = `<b>Botdan yangi xabar</b>

Ism: ${escapeHtml(from.first_name || "Foydalanuvchi")}
Username: ${escapeHtml(username)}
Chat ID: <code>${escapeHtml(message.chat?.id)}</code>

Xabar:
${escapeHtml(text || message.text || "")}`;

  await api("sendMessage", {
    chat_id: ADMIN_ID,
    text: adminText,
    parse_mode: "HTML",
  });
  return true;
}

async function handleCallback(callback: any) {
  const { message, data, id } = callback;
  const chatId = message.chat.id;
  const messageId = message.message_id;

  try {
    if (data === "menu_main") await editMenu(chatId, messageId, welcomeText(message.chat.first_name));
    else if (data === "menu_ai") await editMenu(chatId, messageId, "<b>AI yordamchi</b>\n\nIshTop.uz bo'yicha savolingizni shu chatga yozing.", backMenu());
    else if (data === "menu_services" || data === "menu_find") await editMenu(chatId, messageId, "<b>Yo'nalishni tanlang:</b>", servicesMenu());
    else if (data === "menu_prices") await editMenu(chatId, messageId, pricesText(), backMenu());
    else if (data === "menu_contact") await editMenu(chatId, messageId, contactText(), backMenu());
    else if (data === "menu_help") await editMenu(chatId, messageId, helpText(), backMenu());
    else if (data === "menu_admin") {
      await editMenu(chatId, messageId, "<b>Admin Panelga xush kelibsiz!</b>\n\nQuyidagi bo'limlardan birini tanlang:", adminMenu());
    }
    else if (data === "admin_stats") {
      const statsText = `📈 <b>Umumiy statistika:</b>\n\nJami xizmatlar va buyurtmalarni nazorat qilish bo'limi.`;
      await editMenu(chatId, messageId, statsText, backMenu("menu_admin"));
    }
    else if (data === "admin_users") {
      await editMenu(chatId, messageId, "👥 <b>Foydalanuvchilar:</b>\n\nOxirgi qo'shilgan foydalanuvchilar ro'yxati bu yerda ko'rinadi.", backMenu("menu_admin"));
    }
    else if (data === "admin_specs") {
      await editMenu(chatId, messageId, "👨‍🔧 <b>Ustalar ro'yxati:</b>\n\nPlatformaga qo'shilgan oxirgi ustalar.", backMenu("menu_admin"));
    }
    else if (data === "admin_orders") {
      await editMenu(chatId, messageId, "📝 <b>Buyurtmalar:</b>\n\nSayt orqali tushgan oxirgi buyurtmalar.", backMenu("menu_admin"));
    }
    else if (String(data).startsWith("spec_")) {
      const key = String(data).replace("spec_", "");
      const service = serviceByKey(key);
      const workers = await findWorkers(key);
      await editMenu(chatId, messageId, workersText(service, workers), {
        inline_keyboard: [
          [{ text: "Saytda ko'rish", url: `${SITE_URL}/#mutaxassislar` }],
          [{ text: "Boshqa yo'nalish", callback_data: "menu_services" }],
        ],
      });
    }
  } finally {
    await api("answerCallbackQuery", { callback_query_id: id }).catch(() => {});
  }
}

async function handleMessage(message: any) {
  const chatId = message.chat.id;
  const text = String(message.text || "").trim();
  const q = normalize(text);
  const firstName = message.from?.first_name || "";

  if (!text) return;

  if (text.startsWith("#admin") || text.toLowerCase().startsWith("admin ")) {
    const sent = await forwardToAdmin(message);
    await sendMenu(
      chatId,
      sent
        ? "Xabaringiz adminga yuborildi. Tez orada javob beramiz."
        : "Admin chat ID sozlanmagan. Iltimos @juliqian ga yozing.",
      backMenu(),
    );
    return;
  }

  if (text === "/start" || q === "start" || q.includes("boshlash") || q === "menu") await sendMenu(chatId, welcomeText(firstName));
  else if (text === "/xizmatlar" || q.includes("xizmatlar")) await sendMenu(chatId, "<b>Yo'nalishni tanlang:</b>", servicesMenu());
  else if (text === "/usta" || q.includes("usta topish")) await sendMenu(chatId, "<b>Qaysi mutaxassis kerak?</b>", servicesMenu());
  else if (text === "/narxlar" || q.includes("narx")) await sendMenu(chatId, pricesText(), mainMenu());
  else if (text === "/yordam" || q.includes("yordam")) await sendMenu(chatId, helpText(), mainMenu());
  else if (text === "/aloqa" || q.includes("aloqa")) await sendMenu(chatId, contactText(), mainMenu());
  else if (text === "/sayt" || q.includes("saytga") || q.includes("sayt")) {
    await sendMenu(chatId, siteText(), { inline_keyboard: [[{ text: "Saytga o'tish", url: SITE_URL }], [{ text: "Menyu", callback_data: "menu_main" }]] });
  } else {
    await api("sendChatAction", { chat_id: chatId, action: "typing" }).catch(() => {});
    const answer = await askAI(text);
    await sendMenu(chatId, `<b>IshTop AI:</b>\n\n${escapeHtml(answer)}`, {
      inline_keyboard: [
        [{ text: "Usta topish", callback_data: "menu_find" }],
        [{ text: "Menyu", callback_data: "menu_main" }],
      ],
    });
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    if (!BOT_TOKEN) return json({ error: "TELEGRAM_BOT_TOKEN is not configured" }, 500);

    const body = await req.json();
    if (body.callback_query) await handleCallback(body.callback_query);
    else if (body.message) await handleMessage(body.message);

    return json({ ok: true });
  } catch (error) {
    console.error("telegram-webhook error:", error);
    return json({ error: error instanceof Error ? error.message : "Noma'lum xato" }, 500);
  }
});
