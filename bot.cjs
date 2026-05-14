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
const ADMIN_ID = env.TELEGRAM_ADMIN_CHAT_ID;
const SUPABASE_URL = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
const SUPABASE_KEY =
  env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY;
const GROQ_API_KEY = env.GROQ_API_KEY || env.VITE_GROQ_API_KEY;
const SITE_URL = env.SITE_URL || "https://ishtop.uz";

if (!BOT_TOKEN) {
  console.error(".env faylida TELEGRAM_BOT_TOKEN topilmadi.");
  process.exit(1);
}

const USERS_FILE = path.join(__dirname, "users.json");
let registeredUsers = new Set();
let lastUpdateId = 0;

try {
  if (fs.existsSync(USERS_FILE)) {
    const data = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
    registeredUsers = new Set(Array.isArray(data) ? data : []);
  }
} catch {
  registeredUsers = new Set();
}

function saveUsers() {
  fs.writeFileSync(USERS_FILE, JSON.stringify([...registeredUsers], null, 2));
}

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

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function normalize(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/['`]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function serviceByKey(key) {
  return services.find((service) => service.key === key) || services[0];
}

function serviceFromText(text) {
  const q = normalize(text);
  return services.find(
    (service) =>
      normalize(service.label) === q ||
      q.includes(service.key) ||
      service.terms.some((term) => q.includes(normalize(term))),
  );
}

async function api(method, body = {}) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!data.ok) console.error("Telegram API error:", method, data.description || data);
    return data;
  } catch (error) {
    console.error("Telegram API network error:", method, error.message);
    return { ok: false, description: error.message };
  }
}

function replyKeyboard() {
  return {
    keyboard: [
      ["🚀 Boshlash", "🔧 Xizmatlar"],
      ["🔎 Usta topish", "💰 Narxlar"],
      ["❓ Yordam", "📞 Aloqa"],
      ["🌐 Saytga o'tish"],
    ],
    resize_keyboard: true,
    is_persistent: true,
  };
}

function mainInlineMenu() {
  return {
    inline_keyboard: [
      [{ text: "🤖 AI yordamchi", callback_data: "menu_ai" }],
      [
        { text: "🔧 Xizmatlar", callback_data: "menu_services" },
        { text: "🔎 Usta topish", callback_data: "menu_find" },
      ],
      [
        { text: "💰 Narxlar", callback_data: "menu_prices" },
        { text: "📞 Aloqa", callback_data: "menu_contact" },
      ],
      [{ text: "🌐 Saytga o'tish", url: SITE_URL }],
    ],
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
  rows.push([{ text: "⬅️ Orqaga", callback_data: "menu_main" }]);
  return { inline_keyboard: rows };
}

function backMenu(to = "menu_main") {
  return { inline_keyboard: [[{ text: "⬅️ Orqaga", callback_data: to }]] };
}

function welcomeText(firstName = "") {
  const name = firstName ? `, ${escapeHtml(firstName)}` : "";
  return `🚀 <b>IshTop.uz rasmiy botiga xush kelibsiz${name}!</b>

Men sizga usta topish, xizmat tanlash, narxlarni bilish va admin bilan bog'lanishda yordam beraman.

Pastdagi menyudan tanlang yoki savolingizni yozing.`;
}

function pricesText() {
  return `💰 <b>IshTop.uz narxlari</b>

${services.map((service) => `<b>${escapeHtml(service.label)}:</b> ${escapeHtml(service.price)}`).join("\n")}

Narx ish hajmi, hudud va kelishuvga qarab o'zgarishi mumkin.`;
}

function contactText() {
  return `📞 <b>Aloqa</b>

Admin: @juliqian
Kanal: @ishtop_uz
Sayt: ${escapeHtml(SITE_URL)}

Adminga xabar yuborish uchun:
<code>#admin xabaringiz</code>`;
}

function helpText() {
  return `❓ <b>Yordam</b>

Muammo bo'lsa quyidagilardan birini qiling:

1. <b>Usta topish</b> tugmasini bosing.
2. Muammoni yozing, men yo'naltiraman.
3. Adminga yuborish uchun <code>#admin</code> bilan xabar yozing.
4. Saytdan rasm va manzil bilan so'rov yuboring: ${escapeHtml(SITE_URL)}/yordam`;
}

function siteText() {
  return `🌐 <b>IshTop.uz sayti</b>

Xizmatlar, mutaxassislar, buyurtma va profil uchun saytga o'ting:
${escapeHtml(SITE_URL)}`;
}

function localAiReply(text) {
  const q = normalize(text);
  if (q.includes("narx") || q.includes("qancha")) return pricesText().replace(/<[^>]+>/g, "");
  if (q.includes("aloqa") || q.includes("admin")) return "Admin: @juliqian. Adminga xabar yuborish uchun #admin deb yozing.";
  if (q.includes("usta") || q.includes("top")) return "Usta topish uchun 'Usta topish' tugmasini bosing va yo'nalishni tanlang.";
  if (q.includes("xizmat")) return `Xizmatlar: ${services.map((service) => service.label).join(", ")}.`;
  if (q.includes("sayt")) return `Sayt: ${SITE_URL}`;
  return "Men IshTop.uz bo'yicha yordam beraman: usta topish, narxlar, xizmatlar, buyurtma yoki aloqa haqida so'rang.";
}

async function askAI(prompt) {
  if (!GROQ_API_KEY) return localAiReply(prompt);

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
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
              "Siz IshTop.uz platformasining rasmiy AI yordamchisiz. Faqat IshTop.uz, xizmatlar, usta topish, narxlar, buyurtma va aloqa haqida o'zbek tilida qisqa, foydali javob bering. Boshqa mavzuda javob bermang.",
          },
          { role: "user", content: String(prompt).slice(0, 1200) },
        ],
      }),
    });

    if (!response.ok) return localAiReply(prompt);
    const data = await response.json();
    return data?.choices?.[0]?.message?.content || localAiReply(prompt);
  } catch (error) {
    console.error("AI error:", error.message);
    return localAiReply(prompt);
  }
}

function matchesService(profile, service) {
  const haystack = normalize(`${profile.profession || ""} ${profile.bio || ""} ${profile.full_name || ""}`);
  return service.terms.some((term) => haystack.includes(normalize(term)));
}

async function findWorkers(serviceKey) {
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

    if (!response.ok) return [];

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
        price: `${service.price.split(" - ")[0]} dan`,
      }));

    return workers;
  } catch (error) {
    console.error("Supabase query error:", error.message);
    return [];
  }
}

function workersText(service, workers) {
  if (!workers.length) {
    return `🔎 <b>${escapeHtml(service.label)} bo'yicha real mutaxassis topilmadi</b>

Hozircha bu yo'nalishda bazada tasdiqlangan mutaxassis yo'q.

Yangi mutaxassis qo'shilsa, shu yerda avtomatik chiqadi.`;
  }

  const body = workers
    .slice(0, 5)
    .map((worker, index) => {
      const phone = worker.phone ? `\n📞 Telefon: ${escapeHtml(worker.phone)}` : "";
      return `${index + 1}. <b>${escapeHtml(worker.full_name)}</b>
🔧 Kasb: ${escapeHtml(worker.profession)}
📍 Hudud: ${escapeHtml(worker.location)}
⭐ Reyting: ${escapeHtml(worker.rating)}
💰 Narx: ${escapeHtml(worker.price)}${phone}`;
    })
    .join("\n\n");

  return `🔎 <b>${escapeHtml(service.label)} bo'yicha topilgan mutaxassislar</b>

${body}

Buyurtma berish yoki ko'proq mutaxassis ko'rish uchun saytga o'ting.`;
}

async function sendHtml(chatId, text, replyMarkup = mainInlineMenu()) {
  return api("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    reply_markup: replyMarkup,
    disable_web_page_preview: true,
  });
}

async function sendHome(chatId, text) {
  await api("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    reply_markup: replyKeyboard(),
    disable_web_page_preview: true,
  });

  return sendHtml(chatId, "👇 <b>Tezkor tanlash:</b>", mainInlineMenu());
}

async function editOrSend(chatId, messageId, text, replyMarkup = mainInlineMenu()) {
  const edited = await api("editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: "HTML",
    reply_markup: replyMarkup,
    disable_web_page_preview: true,
  });

  if (!edited.ok) return sendHtml(chatId, text, replyMarkup);
  return edited;
}

async function forwardToAdmin(message) {
  if (!ADMIN_ID) return false;

  const from = message.from || {};
  const text = String(message.text || "").replace(/^#?admin\b/i, "").trim();
  const username = from.username ? `@${from.username}` : "username yo'q";

  await api("sendMessage", {
    chat_id: ADMIN_ID,
    text: `<b>Botdan yangi xabar</b>

Ism: ${escapeHtml(from.first_name || "Foydalanuvchi")}
Username: ${escapeHtml(username)}
Chat ID: <code>${escapeHtml(message.chat?.id)}</code>

Xabar:
${escapeHtml(text || message.text || "")}`,
    parse_mode: "HTML",
  });

  return true;
}

async function handleCallback(callback) {
  const { message, data, id } = callback;
  const chatId = message.chat.id;
  const messageId = message.message_id;

  try {
    if (data === "menu_main") await editOrSend(chatId, messageId, welcomeText(message.chat.first_name));
    else if (data === "menu_ai") await editOrSend(chatId, messageId, "🤖 <b>AI yordamchi</b>\n\nIshTop.uz bo'yicha savolingizni yozing.", backMenu());
    else if (data === "menu_services" || data === "menu_find") await editOrSend(chatId, messageId, "🔧 <b>Yo'nalishni tanlang:</b>", servicesMenu());
    else if (data === "menu_prices") await editOrSend(chatId, messageId, pricesText(), backMenu());
    else if (data === "menu_contact") await editOrSend(chatId, messageId, contactText(), backMenu());
    else if (data === "menu_help") await editOrSend(chatId, messageId, helpText(), backMenu());
    else if (String(data).startsWith("spec_")) {
      const key = String(data).replace("spec_", "");
      const service = serviceByKey(key);
      const workers = await findWorkers(key);
      await editOrSend(chatId, messageId, workersText(service, workers), {
        inline_keyboard: [
          [{ text: "🌐 Saytda ko'rish", url: `${SITE_URL}/#mutaxassislar` }],
          [{ text: "🔁 Boshqa yo'nalish", callback_data: "menu_services" }],
          [{ text: "⬅️ Menyu", callback_data: "menu_main" }],
        ],
      });
    }
  } finally {
    await api("answerCallbackQuery", { callback_query_id: id }).catch(() => {});
  }
}

async function handleMessage(message) {
  if (!message.text) return;

  const { chat, text, from } = message;
  const chatId = chat.id;
  const firstName = from?.first_name || "Foydalanuvchi";
  const q = normalize(text);

  if (!registeredUsers.has(chatId)) {
    registeredUsers.add(chatId);
    saveUsers();
  }

  if (text.startsWith("#admin") || q.startsWith("admin ")) {
    const sent = await forwardToAdmin(message);
    await sendHtml(
      chatId,
      sent ? "✅ Xabaringiz adminga yuborildi. Tez orada javob beramiz." : "⚠️ Admin chat ID sozlanmagan. @juliqian ga yozing.",
      backMenu(),
    );
    return;
  }

  const selectedService = serviceFromText(text);

  if (text === "/start" || q === "start" || q.includes("boshlash") || q === "menu") {
    await sendHome(chatId, welcomeText(firstName));
  } else if (text === "/xizmatlar" || q.includes("xizmatlar") || q === "xizmat") {
    await sendHtml(chatId, "🔧 <b>Yo'nalishni tanlang:</b>", servicesMenu());
  } else if (text === "/usta" || q.includes("usta topish") || q === "usta") {
    await sendHtml(chatId, "🔎 <b>Qaysi mutaxassis kerak?</b>", servicesMenu());
  } else if (selectedService) {
    await api("sendChatAction", { chat_id: chatId, action: "typing" });
    const workers = await findWorkers(selectedService.key);
    await sendHtml(chatId, workersText(selectedService, workers), {
      inline_keyboard: [
        [{ text: "🌐 Saytda ko'rish", url: `${SITE_URL}/#mutaxassislar` }],
        [{ text: "🔁 Boshqa yo'nalish", callback_data: "menu_services" }],
      ],
    });
  } else if (text === "/narxlar" || q.includes("narx")) {
    await sendHtml(chatId, pricesText(), mainInlineMenu());
  } else if (text === "/yordam" || q.includes("yordam")) {
    await sendHtml(chatId, helpText(), mainInlineMenu());
  } else if (text === "/aloqa" || q.includes("aloqa")) {
    await sendHtml(chatId, contactText(), mainInlineMenu());
  } else if (text === "/sayt" || q.includes("saytga") || q.includes("sayt")) {
    await sendHtml(chatId, siteText(), {
      inline_keyboard: [
        [{ text: "🌐 Saytga o'tish", url: SITE_URL }],
        [{ text: "⬅️ Menyu", callback_data: "menu_main" }],
      ],
    });
  } else if (text === "/ai" || q.includes("ai yordamchi")) {
    await sendHtml(chatId, "🤖 Savolingizni yozing. Men faqat IshTop.uz bo'yicha javob beraman.", backMenu());
  } else {
    await api("sendChatAction", { chat_id: chatId, action: "typing" });
    const aiResponse = await askAI(text);
    await sendHtml(chatId, `🤖 <b>IshTop AI:</b>\n\n${escapeHtml(aiResponse)}`, {
      inline_keyboard: [
        [{ text: "🔎 Usta topish", callback_data: "menu_find" }],
        [{ text: "⬅️ Menyu", callback_data: "menu_main" }],
      ],
    });
  }
}

async function poll() {
  const updates = await api("getUpdates", { offset: lastUpdateId + 1, timeout: 25, allowed_updates: ["message", "callback_query"] });

  if (updates.ok && Array.isArray(updates.result)) {
    for (const update of updates.result) {
      lastUpdateId = update.update_id;
      try {
        if (update.callback_query) await handleCallback(update.callback_query);
        else if (update.message) await handleMessage(update.message);
      } catch (error) {
        console.error("Update handler error:", error);
      }
    }
  }

  setTimeout(poll, updates.ok ? 250 : 2500);
}

async function setCommands() {
  await api("setMyCommands", {
    commands: [
      { command: "start", description: "Botni boshlash" },
      { command: "xizmatlar", description: "Barcha xizmatlar" },
      { command: "usta", description: "Usta topish" },
      { command: "narxlar", description: "Narxlar ro'yxati" },
      { command: "yordam", description: "Yordam olish" },
      { command: "aloqa", description: "Biz bilan bog'lanish" },
      { command: "sayt", description: "Veb-saytga o'tish" },
      { command: "ai", description: "AI yordamchi" },
    ],
  });
}

async function start() {
  console.log("IshTop.uz Telegram bot ishga tushmoqda...");
  await api("deleteWebhook", { drop_pending_updates: true });
  await setCommands();

  const botInfo = await api("getMe");
  if (!botInfo.ok) {
    console.error("Bot token yoki internet ulanishida muammo:", botInfo.description);
    process.exit(1);
  }

  console.log(`Bot tayyor: @${botInfo.result.username}`);
  console.log("Polling rejimi yoqildi. Telegramda /start yuboring.");
  poll();
}

start();
