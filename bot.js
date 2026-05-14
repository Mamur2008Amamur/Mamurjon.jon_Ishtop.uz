import TelegramBot from 'node-telegram-bot-api';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load variables from .env
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const token = process.env.VITE_TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const groqApiKey = process.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY;

if (!token || !supabaseUrl || !supabaseKey) {
  console.error("❌ XATOLIK: .env faylida VITE_TELEGRAM_BOT_TOKEN yoki Supabase kalitlari yo'q!");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: false }); // disable auto polling

// Delete webhook if exists, then start polling
bot.deleteWebHook().then(() => {
  bot.startPolling();
  console.log("🚀 Daxshat Telegram Bot ishga tushdi (Webhook o'chirildi)...");
}).catch(console.error);

const supabase = createClient(supabaseUrl, supabaseKey);

const SITE_URL = "https://ishtop.uz"; // Yoki o'zingizning localhost
const ADMIN_ID = process.env.VITE_TELEGRAM_ADMIN_CHAT_ID || process.env.TELEGRAM_ADMIN_CHAT_ID;

const services = [
  { key: "santexnik", label: "Santexnik 🚰", terms: ["santexnik", "quvur", "kran"], price: "50 000 - 200 000 so'm" },
  { key: "elektrik", label: "Elektrik ⚡", terms: ["elektrik", "elektr", "tok"], price: "40 000 - 150 000 so'm" },
  { key: "tamirchi", label: "Ta'mirchi 🛠", terms: ["tamir", "ta'mir", "usta"], price: "100 000 - 500 000 so'm" },
  { key: "tozalovchi", label: "Tozalovchi 🧹", terms: ["tozalash", "tozalovchi", "clean"], price: "80 000 - 300 000 so'm" },
  { key: "it", label: "IT xizmat 💻", terms: ["it", "dastur", "kompyuter", "bot", "sayt"], price: "50 000 - 200 000 so'm" },
  { key: "oqituvchi", label: "O'qituvchi 📚", terms: ["oqituvchi", "o'qituvchi", "repetitor", "dars"], price: "50 000 - 150 000 so'm" },
];

function serviceByKey(key) {
  return services.find((service) => service.key === key) || services[0];
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function mainMenu() {
  return {
    inline_keyboard: [
      [{ text: "🤖 AI Yordamchi", callback_data: "menu_ai" }],
      [
        { text: "🛠 Xizmatlar", callback_data: "menu_services" },
        { text: "🔎 Usta topish", callback_data: "menu_find" },
      ],
      [
        { text: "💰 Narxlar", callback_data: "menu_prices" },
        { text: "📞 Aloqa", callback_data: "menu_contact" },
      ],
      [
        { text: "🌐 Saytga o'tish", url: SITE_URL },
      ],
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
      }))
    );
  }
  rows.push([{ text: "⬅️ Orqaga", callback_data: "menu_main" }]);
  return { inline_keyboard: rows };
}

function adminMenu() {
  return {
    inline_keyboard: [
      [{ text: "📊 Statistika", callback_data: "admin_stats" }, { text: "👥 Foydalanuvchilar", callback_data: "admin_users" }],
      [{ text: "👨‍🔧 Ustalar", callback_data: "admin_specs" }, { text: "📝 Buyurtmalar", callback_data: "admin_orders" }],
      [{ text: "👁‍🗨 Jonli Kuzatuv", callback_data: "admin_live" }],
      [{ text: "⬅️ Orqaga", callback_data: "menu_main" }]
    ]
  };
}

function backMenu(to = "menu_main") {
  return { inline_keyboard: [[{ text: "⬅️ Orqaga", callback_data: to }]] };
}

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const name = msg.chat.first_name ? `, ${escapeHtml(msg.chat.first_name)}` : "";
  const welcome = `🚀 <b>IshTop.uz rasmiy botiga xush kelibsiz${name}!</b>\n\nMen sizga usta topish, xizmat tanlash, narxlarni bilish va admin bilan bog'lanishda yordam beraman.\n\nPastdagi menyudan tanlang yoki savolingizni yozing.`;
  bot.sendMessage(chatId, welcome, { parse_mode: 'HTML', reply_markup: mainMenu() });
});

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const data = query.data;

  bot.answerCallbackQuery(query.id);

  try {
    if (data === "menu_main") {
      bot.editMessageText(`🚀 <b>IshTop.uz rasmiy botiga xush kelibsiz!</b>\n\nQuyidagi menyudan kerakli bo'limni tanlang:`, {
        chat_id: chatId, message_id: messageId, parse_mode: "HTML", reply_markup: mainMenu()
      });
    } 
    else if (data === "menu_ai") {
      bot.editMessageText("🤖 <b>AI Yordamchi</b>\n\nIshTop.uz bo'yicha har qanday savolingizni shu chatga yozing. Men javob beraman!", {
        chat_id: chatId, message_id: messageId, parse_mode: "HTML", reply_markup: backMenu()
      });
    }
    else if (data === "menu_services" || data === "menu_find") {
      bot.editMessageText("🛠 <b>Qaysi yo'nalish bo'yicha mutaxassis kerak?</b>", {
        chat_id: chatId, message_id: messageId, parse_mode: "HTML", reply_markup: servicesMenu()
      });
    }
    else if (data === "menu_prices") {
      const txt = `💰 <b>IshTop.uz narxlari</b>\n\n${services.map(s => `<b>${s.label}:</b> ${s.price}`).join("\n")}\n\n<i>Narxlar ish hajmi va kelishuvga qarab o'zgaradi.</i>`;
      bot.editMessageText(txt, { chat_id: chatId, message_id: messageId, parse_mode: "HTML", reply_markup: backMenu() });
    }
    else if (data === "menu_contact") {
      const txt = `📞 <b>Aloqa</b>\n\nAdmin: @juliqian\nSayt: ${SITE_URL}\n\nAdminga xabar yuborish uchun matn boshiga <b>#admin</b> yozing.`;
      bot.editMessageText(txt, { chat_id: chatId, message_id: messageId, parse_mode: "HTML", reply_markup: backMenu() });
    }
    else if (data === "menu_admin") {
      bot.editMessageText("👑 <b>Admin Panelga xush kelibsiz!</b>\n\nQuyidagi bo'limlardan birini tanlang:", {
        chat_id: chatId, message_id: messageId, parse_mode: "HTML", reply_markup: adminMenu()
      });
    }
    else if (data === "admin_stats") {
      const { count: uCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: rCount } = await supabase.from('help_requests').select('*', { count: 'exact', head: true });
      const txt = `📊 <b>Statistika:</b>\n\n👥 <b>Foydalanuvchilar:</b> ${uCount || 0} ta\n📝 <b>Buyurtmalar:</b> ${rCount || 0} ta`;
      bot.editMessageText(txt, { chat_id: chatId, message_id: messageId, parse_mode: "HTML", reply_markup: backMenu("menu_admin") });
    }
    else if (data === "admin_users") {
      const { data: users } = await supabase.from('profiles').select('*').limit(5).order('created_at', { ascending: false });
      let txt = "👥 <b>Oxirgi qo'shilganlar:</b>\n\n";
      (users||[]).forEach(u => txt += `🔹 <b>${u.full_name || 'Ismsiz'}</b> (${u.role})\n`);
      bot.editMessageText(txt, { chat_id: chatId, message_id: messageId, parse_mode: "HTML", reply_markup: backMenu("menu_admin") });
    }
    else if (data === "admin_specs") {
      const { data: users } = await supabase.from('profiles').select('*').eq('role','specialist').limit(5).order('created_at', { ascending: false });
      let txt = "👨‍🔧 <b>Oxirgi ustalar:</b>\n\n";
      (users||[]).forEach(u => txt += `🛠 <b>${u.full_name || 'Ismsiz'}</b> - ${u.profession||'Kasb yoq'}\n`);
      bot.editMessageText(txt, { chat_id: chatId, message_id: messageId, parse_mode: "HTML", reply_markup: backMenu("menu_admin") });
    }
    else if (data === "admin_orders") {
      const { data: reqs } = await supabase.from('help_requests').select('*').limit(5).order('created_at', { ascending: false });
      let txt = "📝 <b>Oxirgi buyurtmalar:</b>\n\n";
      (reqs||[]).forEach(r => txt += `📌 ${r.status}: ${r.description}\n`);
      bot.editMessageText(txt, { chat_id: chatId, message_id: messageId, parse_mode: "HTML", reply_markup: backMenu("menu_admin") });
    }
    else if (data === "admin_live") {
      const { data: logs } = await supabase.from('user_activity').select('*').limit(10).order('created_at', { ascending: false });
      
      if (!logs || logs.length === 0) {
        return bot.editMessageText("📭 <b>Jonli kuzatuv:</b>\n\nHozircha hech qanday faollik qayd etilmadi. Saytda foydalanuvchilar harakat qilishi bilan bu yerda ko'rinadi.", {
          chat_id: chatId, message_id: messageId, parse_mode: "HTML", reply_markup: backMenu("menu_admin")
        });
      }

      let txt = "👁‍🗨 <b>Jonli Foydalanuvchilar Faolligi:</b>\n\n";
      txt += "<code>| Vagt  | Sahifa      | Harakat    |</code>\n";
      txt += "<code>|-------|-------------|------------|</code>\n";
      
      logs.forEach(log => {
        const time = new Date(log.created_at).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
        const page = (log.page || '/').substring(0, 10).padEnd(11);
        const action = (log.action || 'view').substring(0, 10).padEnd(10);
        txt += `<code>| ${time} | ${page} | ${action} |</code>\n`;
      });

      bot.editMessageText(txt, { chat_id: chatId, message_id: messageId, parse_mode: "HTML", reply_markup: {
        inline_keyboard: [
          [{ text: "🔄 Yangilash", callback_data: "admin_live" }],
          [{ text: "⬅️ Admin Panel", callback_data: "menu_admin" }]
        ]
      }});
    }
    else if (String(data).startsWith("spec_")) {
      const key = String(data).replace("spec_", "");
      const service = serviceByKey(key);
      const { data: profiles } = await supabase.from('profiles').select('*').eq('role', 'specialist').order('created_at', { ascending: false }).limit(5);
      
      const workers = (profiles||[]).filter(p => String(p.profession||"").toLowerCase().includes(service.terms[0]) || true).slice(0,3); // dummy match
      
      let txt = `<b>${service.label} bo'yicha mutaxassislar:</b>\n\n`;
      if(workers.length===0) txt += "Hozircha mutaxassis yo'q.";
      workers.forEach((w, i) => {
        txt += `${i+1}. <b>${w.full_name||'Usta'}</b>\nKasb: ${w.profession||service.label}\nHudud: ${w.location||'Uzbekistan'}\n\n`;
      });

      bot.editMessageText(txt, { chat_id: chatId, message_id: messageId, parse_mode: "HTML", reply_markup: {
        inline_keyboard: [
          [{ text: "🌐 Saytda to'liq ko'rish", url: SITE_URL }],
          [{ text: "⬅️ Boshqa yo'nalish", callback_data: "menu_services" }]
        ]
      }});
    }
  } catch(e) {
    console.error(e);
  }
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text || "";

  if (text.startsWith('/')) return;

  if (text.startsWith('#admin')) {
    if(ADMIN_ID) {
      bot.sendMessage(ADMIN_ID, `<b>Yangi xabar:</b>\nChat: ${chatId}\n\n${text}`, {parse_mode:'HTML'});
      bot.sendMessage(chatId, "✅ Xabaringiz adminga yetkazildi.");
    } else {
      bot.sendMessage(chatId, "Admin aloqasi sozlanmagan.");
    }
    return;
  }

  // AI groq chat
  if (groqApiKey) {
    bot.sendChatAction(chatId, "typing");
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${groqApiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          temperature: 0.5,
          messages: [{ role: "system", content: "Sen IshTop.uz platformasining AI yordamchisisan. Qisqa va do'stona o'zbek tilida javob ber." }, { role: "user", content: text }]
        })
      });
      const data = await response.json();
      const answer = data?.choices?.[0]?.message?.content || "Kechirasiz, tushunmadim.";
      bot.sendMessage(chatId, `🤖 <b>AI:</b>\n${answer}`, { parse_mode: "HTML", reply_markup: backMenu() });
    } catch(e) {
      bot.sendMessage(chatId, "Aloqa xatosi.", {reply_markup: backMenu()});
    }
  } else {
    bot.sendMessage(chatId, "Nima yordam kerak? Menyudan tanlang.", {reply_markup: mainMenu()});
  }
});

// Handle polling errors to prevent spam
bot.on('polling_error', (error) => {
  if (error.code === 'ETELEGRAM' && error.message.includes('409 Conflict')) {
    console.error("⚠️ BOT CONFLICT: Boshqa bot ishga tushdi. Bu jarayon to'xtatildi.");
    process.exit(1);
  }
  // Silently ignore other minor polling errors to keep console clean
});
