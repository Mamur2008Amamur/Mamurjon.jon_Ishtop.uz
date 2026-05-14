<<<<<<< HEAD
// @ts-nocheck - Deno runtime
=======
>>>>>>> 9e3f45b0ee34d0c9b3b0b17417f24ac9ba002cd8
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
<<<<<<< HEAD
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Sen IshTop.uz platformasining rasmiy AI yordamchisisan.

Faqat IshTop.uz, usta topish, xizmatlar, narxlar, buyurtma, aloqa va platformadan foydalanish haqida javob ber.
Agar savol boshqa mavzuda bo'lsa, qisqa ayt: "Kechirasiz, men faqat IshTop.uz platformasi bo'yicha yordam bera olaman."

IshTop.uz:
- O'zbekistonda ishonchli usta va mutaxassis topish platformasi.
- Xizmatlar: santexnik, elektrik, ta'mirchi, tozalovchi, IT xizmat, repetitor, avtomaster, fotograf, konditsioner.
- Taxminiy narxlar: santexnik 50 000 - 200 000 so'm, elektrik 40 000 - 150 000 so'm, ta'mir 100 000 - 500 000 so'm, tozalash 80 000 - 300 000 so'm, IT xizmat 50 000 - 200 000 so'm.
- Ishlash tartibi: xizmat tanlash, mutaxassis tanlash, bog'lanish yoki buyurtma berish, xizmatdan keyin baholash.
- Sayt: https://ishtop.uz

Javoblaring qisqa, aniq, samimiy va o'zbek tilida bo'lsin.`;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function cleanMessages(messages: unknown[]) {
  return (Array.isArray(messages) ? messages : [])
    .filter((message) => message && typeof message === "object")
    .map((message: any) => ({
      role: message.role === "assistant" ? "assistant" : "user",
      content: String(message.content || "").slice(0, 1200),
    }))
    .filter((message) => message.content.trim())
    .slice(-8);
}

async function askGroq(messages: any[]) {
  const key = Deno.env.get("GROQ_API_KEY");
  if (!key) return null;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0.55,
      max_tokens: 420,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Groq error:", response.status, text);
    return null;
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || null;
}

async function askLovable(messages: any[]) {
  const key = Deno.env.get("LOVABLE_API_KEY");
  if (!key) return null;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      stream: false,
      temperature: 0.55,
      max_tokens: 420,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Lovable AI error:", response.status, text);
    return null;
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || null;
}
=======
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Sen IshTop.uz platformasining AI yordamchisisan. Sening vazifang FAQAT IshTop.uz platformasi haqida gaplashish.

IshTop.uz — bu O'zbekistondagi ish, xizmat va usta topish uchun platforma. Bu yerda foydalanuvchilar:
- Santexnik, elektrik, ta'mirchi, tozalovchi va boshqa ustalarni topishi mumkin
- Yordam so'rovlari yaratishi mumkin (rasm yuklash, joylashuvni xaritadan tanlash)
- Mutaxassislar bilan bog'lanishi mumkin
- IT xizmatlar, dars berish, ish topish xizmatlaridan foydalanishi mumkin

Narxlar (taxminiy):
• Santexnik: 50,000 - 200,000 so'm
• Elektrik: 40,000 - 150,000 so'm  
• Ta'mirchi: 100,000 - 500,000 so'm
• Tozalash: 80,000 - 300,000 so'm

Platforma bo'limlari:
- Bosh sahifa — barcha bo'limlar shu yerdan ochiladi
- Xizmatlar — barcha xizmat turlari
- Mutaxassislar — eng yaxshi ustalar ro'yxati
- Qanday ishlaydi — platforma qanday ishlashi
- Aloqa — biz bilan bog'lanish
- Yordam — muammo haqida so'rov yuborish (rasm + xarita)

MUHIM QOIDALAR:
1. FAQAT IshTop.uz platformasi, O'zbekistondagi xizmatlar va ustalar haqida gapir
2. Agar foydalanuvchi boshqa mavzuda (masalan, dasturlash, matematika, tarix, siyosat, o'yinlar) savol bersa, DOIM javob ber: "Kechirasiz, men faqat IshTop.uz platformasi haqida yordam bera olaman. Sizga usta topish, xizmatlar yoki platforma haqida savol berishingiz mumkin 😊"
3. Har doim o'zbek tilida javob ber
4. Qisqa, aniq va do'stona javob ber
5. Emoji ishlatishni unutma`;
>>>>>>> 9e3f45b0ee34d0c9b3b0b17417f24ac9ba002cd8

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
<<<<<<< HEAD
    const body = await req.json();
    const messages = cleanMessages(body?.messages || []);

    if (!messages.length) {
      return json({
        reply:
          "Salom! IshTop.uz bo'yicha savol bering: usta topish, narxlar, buyurtma yoki xizmatlar haqida yordam beraman.",
      });
    }

    const reply =
      (await askGroq(messages)) ||
      (await askLovable(messages)) ||
      "AI xizmati hozir sozlanmoqda. Xizmatlar, narxlar yoki usta topish bo'yicha savolingiz bo'lsa, Telegram bot yoki aloqa formasi orqali yozing.";

    return json({ reply });
  } catch (e) {
    console.error("chat error:", e);
    return json({ error: e instanceof Error ? e.message : "Noma'lum xato" }, 500);
=======
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Juda ko'p so'rov, biroz kuting." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI xizmati vaqtincha to'xtatilgan." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", status, t);
      return new Response(JSON.stringify({ error: "AI xizmati xatosi" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Noma'lum xato" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
>>>>>>> 9e3f45b0ee34d0c9b3b0b17417f24ac9ba002cd8
  }
});
