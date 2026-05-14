import TelegramBot from 'node-telegram-bot-api';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load variables from .env explicitly since this is a separate script
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const token = process.env.VITE_TELEGRAM_BOT_TOKEN;
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!token) {
  console.error("❌ XATOLIK: .env faylida VITE_TELEGRAM_BOT_TOKEN yo'q!");
  console.error("Iltimos, BotFather'dan bot token oling va .env fayliga yozing.");
  process.exit(1);
}

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ XATOLIK: .env faylida Supabase kalitlari yo'q!");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });
const supabase = createClient(supabaseUrl, supabaseKey);

console.log("🚀 Telegram Admin Bot ishga tushdi...");
console.log("Telegramga kiring va botingizga /start deb yozing.");

// Bosh menyu tugmalari
const inlineKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [{ text: '📊 Statistika', callback_data: 'stats' }, { text: '👥 Foydalanuvchilar', callback_data: 'users' }],
      [{ text: '👨‍🔧 Ustalar', callback_data: 'specialists' }, { text: '📝 Buyurtmalar', callback_data: 'orders' }],
      [{ text: '⚠️ Shikoyatlar', callback_data: 'reports' }, { text: '⚙️ Boshqaruv', callback_data: 'settings' }]
    ]
  }
};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "👋 Assalomu alaykum! <b>IshTop.uz Admin Botiga</b> xush kelibsiz.\n\nQuyidagi bosiladigan (inline) tugmalardan birini tanlang:", { ...inlineKeyboard, parse_mode: 'HTML' });
});

// Handle button clicks
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;
  
  // Acknowledge the callback
  bot.answerCallbackQuery(query.id);

  try {
    if (data === 'stats') {
      bot.sendMessage(chatId, "Hisoblanmoqda... ⏳");
      const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: reqCount } = await supabase.from('help_requests').select('*', { count: 'exact', head: true });
      
      const statsText = `📈 <b>IshTop.uz Statistikasi:</b>\n\n👥 <b>Jami foydalanuvchilar:</b> ${userCount || 0} ta\n📝 <b>Jami buyurtmalar:</b> ${reqCount || 0} ta\n💰 <b>Umumiy daromad:</b> ~ 0 so'm`;
      bot.sendMessage(chatId, statsText, { parse_mode: 'HTML' });
    } 
    else if (data === 'users') {
      const { data: users } = await supabase.from('profiles').select('*').limit(5).order('created_at', { ascending: false });
      if (!users || users.length === 0) return bot.sendMessage(chatId, "Hozircha foydalanuvchilar yo'q.", inlineKeyboard);
      
      let res = "🆕 <b>Oxirgi qo'shilganlar:</b>\n\n";
      users.forEach(u => {
        const role = u.role === 'specialist' ? 'Mutaxassis 👨‍🔧' : 'Mijoz 👤';
        res += `🔹 <b>${u.full_name || 'Ismsiz'}</b> (${role})\n📱 Tel: ${u.phone || 'Kiritilmagan'}\n\n`;
      });
      bot.sendMessage(chatId, res, { parse_mode: 'HTML', ...inlineKeyboard });
    }
    else if (data === 'specialists') {
      const { data: ustalar } = await supabase.from('profiles').select('*').eq('role', 'specialist').limit(5).order('created_at', { ascending: false });
      if (!ustalar || ustalar.length === 0) return bot.sendMessage(chatId, "Hozircha ustalar yo'q.", inlineKeyboard);
      
      let res = "🛠 <b>Oxirgi qo'shilgan ustalar:</b>\n\n";
      ustalar.forEach(u => {
        res += `👨‍🔧 <b>${u.full_name || 'Ismsiz'}</b>\n💼 Kasb: ${u.profession || 'Kiritilmagan'}\n📍 Manzil: ${u.city || 'Noma\'lum'}\n\n`;
      });
      bot.sendMessage(chatId, res, { parse_mode: 'HTML', ...inlineKeyboard });
    }
    else if (data === 'orders') {
      const { data: reqs } = await supabase.from('help_requests').select('*').limit(3).order('created_at', { ascending: false });
      if (!reqs || reqs.length === 0) return bot.sendMessage(chatId, "Hozircha buyurtmalar yo'q.", inlineKeyboard);

      let res = "📦 <b>Oxirgi 3 ta buyurtma:</b>\n\n";
      reqs.forEach(r => {
        const status = r.status === 'new' ? 'Yangi 🆕' : r.status === 'done' ? 'Bajarildi ✅' : 'Jarayonda ⏳';
        res += `📌 <b>Status:</b> ${status}\n📝 <b>Ta'rif:</b> ${r.description}\n📍 <b>Manzil:</b> ${r.location || 'Yo\'q'}\n\n`;
      });
      bot.sendMessage(chatId, res, { parse_mode: 'HTML', ...inlineKeyboard });
    }
    else if (data === 'reports') {
      bot.sendMessage(chatId, "🎉 Hozircha hech qanday shikoyat kelib tushmagan!", inlineKeyboard);
    }
    else if (data === 'settings') {
      bot.sendMessage(chatId, "⚙️ <b>Boshqaruv menyusi:</b>\n\nBu yerda sayt sozlamalarini va foydalanuvchilarni bloklash imkoniyatini qo'shish mumkin.", { parse_mode: 'HTML', ...inlineKeyboard });
    }
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, "Xatolik yuz berdi. Baza bilan ulanishni tekshiring.", inlineKeyboard);
  }
});
