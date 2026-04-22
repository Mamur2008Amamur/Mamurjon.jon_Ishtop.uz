import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send, Bot, RotateCcw, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message { id: string; role: "user" | "assistant"; content: string; }

const reply = (q: string): string => {
  const lq = q.toLowerCase();
  if (lq.includes("salom") || lq.includes("assalom") || lq.includes("hi") || lq.includes("hello"))
    return "Salom! 👋 Men IshTop.uz AI yordamchisiman.\nSizga usta topish, narxlar yoki platforma haqida yordam bera olaman!";
  if (lq.includes("santexnik"))
    return "🔧 Santexnik xizmati:\n• Narx: 50 000 – 200 000 so'm\n• Toshkentda 245+ tasdiqlangan usta\n• 5 daqiqada yaqin santexnikni toping!\n\nXaritadan topish uchun «Xarita» bo'limiga o'ting 📍";
  if (lq.includes("elektrik"))
    return "⚡ Elektrik xizmati:\n• Narx: 40 000 – 150 000 so'm\n• 189+ tasdiqlangan elektrik\n• Rozitka, kabel, schyotchik o'rnatish\n\nMutaxassislar bo'limidan tanlang 👆";
  if (lq.includes("ta'mir") || lq.includes("tamir"))
    return "🔨 Ta'mir xizmati:\n• Narx: 100 000 – 500 000 so'm\n• Kvartira, uy, ofis ta'miri\n• 312+ tajribali usta\n\nKafolat beriladi ✅";
  if (lq.includes("tozal"))
    return "🧹 Tozalash xizmati:\n• Narx: 80 000 – 300 000 so'm\n• Chuqur tozalash, ofis, kvartira\n• 476+ tozalovchi mutaxassis";
  if (lq.includes("it") || lq.includes("dastur") || lq.includes("kompyuter"))
    return "💻 IT xizmati:\n• Narx: 50 000 – 200 000 so'm\n• Sayt yaratish, bot, dastur\n• Kompyuter ta'miri va sozlash\n• 210+ IT mutaxassis";
  if (lq.includes("fotograf"))
    return "📷 Fotograf xizmati:\n• Narx: 100 000 – 500 000 so'm\n• To'y, tug'ilgan kun, korporativ\n• 95+ professional fotograf";
  if (lq.includes("avto") || lq.includes("mashina"))
    return "🚗 Avtomaster xizmati:\n• Narx: 80 000 – 300 000 so'm\n• Har qanday avto ta'miri\n• 167+ avtomaster";
  if (lq.includes("narx") || lq.includes("pul") || lq.includes("qancha"))
    return "💰 Taxminiy narxlar:\n• Santexnik: 50K–200K so'm\n• Elektrik: 40K–150K so'm\n• Ta'mirchi: 100K–500K so'm\n• Tozalovchi: 80K–300K so'm\n• Fotograf: 100K–500K so'm\n\nAniq narx uchun usta bilan bog'laning!";
  if (lq.includes("to'lov") || lq.includes("tolov") || lq.includes("pay"))
    return "💳 To'lov usullari:\n• Payme 📱\n• Click 📱\n• Humo/UzCard 💳\n• Naqd pul 💵\n\nBarcha to'lovlar xavfsiz!";
  if (lq.includes("qanday") || lq.includes("ishlaydi"))
    return "📱 IshTop.uz 4 qadamda:\n\n1️⃣ Xizmat turini tanlang\n2️⃣ Mutaxassisni tanlang\n3️⃣ Bog'laning (call/chat)\n4️⃣ Ish tugagach baholang\n\nJuda oson! 😊";
  if (lq.includes("xarita") || lq.includes("qaerda") || lq.includes("yaqin"))
    return "🗺️ Xaritada topish:\nSaytning «Xarita» bo'limiga o'ting!\nO'zbekiston bo'ylab 10+ viloyatda mutaxassislar bor:\n• Toshkent, Samarqand\n• Namangan, Andijon\n• Buxoro, Farg'ona va boshqalar";
  if (lq.includes("chat") || lq.includes("yozish") || lq.includes("xabar"))
    return "💬 Chat xizmati:\nYuqori o'ngdagi 💬 tugmasini bosing!\nMutaxassislar bilan real vaqtda:\n• Umumiy chat\n• Santexniklar xonasi\n• Elektriklar xonasi\n• IT mutaxassislar va boshqalar";
  if (lq.includes("ro'yxat") || lq.includes("royxat") || lq.includes("kirish") || lq.includes("login"))
    return "👤 Ro'yxatdan o'tish:\nYuqori o'ngdagi «Kirish» tugmasini bosing!\n\n✅ Bepul ro'yxatdan o'ting\n✅ Profil to'ldiring\n✅ Xizmat buyurtma bering!";
  if (lq.includes("rahmat") || lq.includes("raxmat") || lq.includes("tashakkur"))
    return "Arzimaydi! 😊 Yana savollaringiz bo'lsa bexijolat so'rang!\n\nIshTop.uz — sizning ishonchli xizmat platformangiz! 🚀";
  if (lq.includes("yordam") || lq.includes("muammo") || lq.includes("xato"))
    return "🆘 Muammo bormi?\n«Yordam» bo'limiga o'ting!\nU yerda:\n• Rasm yuklash\n• Xaritada joy tanlash\n• So'rov yuborish\n\nAdminlar 24/7 javob beradi!";
  return "Savolingizni tushundim! 😊\n\nMen faqat IshTop.uz platformasi haqida yordam bera olaman:\n• Usta topish\n• Narxlar\n• To'lov usullari\n• Platforma haqida\n\nNima haqida bilmoqchisiz?";
};

const SUGGESTIONS = ["Santexnik narxi?", "Qanday ishlaydi?", "Xaritada usta topish", "To'lov usullari", "Elektrik kerak", "Chat ochish"];

const AIChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Message[]>([
    { id: "0", role: "assistant", content: "Salom! 👋 Men IshTop.uz AI yordamchisiman.\n\nUsta topish, narxlar yoki platforma haqida so'rang! 🚀" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scroll = () => setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

  const send = () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
    setMsgs(p => [...p, userMsg]);
    setInput(""); setLoading(true); scroll();
    setTimeout(() => {
      setMsgs(p => [...p, { id: Date.now().toString(), role: "assistant", content: reply(userMsg.content) }]);
      setLoading(false); scroll();
    }, 600 + Math.random() * 400);
  };

  const reset = () => setMsgs([{ id: "0", role: "assistant", content: "Salom! 👋 Qanday yordam bera olaman? 🚀" }]);

  return (
    <>
      <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(p => !p)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-2xl text-primary-foreground">
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X className="h-6 w-6" /></motion.div>
            : <motion.div key="c" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><MessageCircle className="h-6 w-6" /></motion.div>
          }
        </AnimatePresence>
        {!open && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[9px] font-bold text-white animate-pulse">AI</span>}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, scale: 0.85, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }} transition={{ type: "spring", duration: 0.4 }}
            className="fixed bottom-24 right-6 z-50 flex flex-col w-[340px] sm:w-[380px] h-[500px] rounded-2xl border bg-card shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 border-b bg-gradient-to-r from-primary/10 to-accent/5 p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-foreground text-sm">IshTop AI Yordamchi</p>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-green-600 font-medium">Doimo online</span>
                </div>
              </div>
              <button onClick={reset} title="Tozalash" className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary transition">
                <RotateCcw className="h-4 w-4" />
              </button>
              <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary transition">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-secondary/10">
              {msgs.map(m => (
                <div key={m.id} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "assistant" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                    m.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card border rounded-bl-sm text-foreground"
                  }`}>{m.content}</div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2 items-center">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="rounded-2xl rounded-bl-sm bg-card border px-4 py-3 shadow-sm">
                    <div className="flex gap-1.5">
                      {[0,1,2].map(i => <div key={i} className="h-2 w-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {msgs.length <= 1 && (
              <div className="px-3 py-2 flex flex-wrap gap-1.5 border-t bg-card">
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => setInput(s)}
                    className="rounded-full border bg-secondary px-3 py-1 text-xs text-muted-foreground hover:border-primary/40 hover:text-primary transition">
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="border-t bg-card p-3">
              <div className="flex gap-2">
                <input value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && send()}
                  placeholder="Savol bering..."
                  className="flex-1 rounded-xl border bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 ring-primary/30 transition" />
                <Button onClick={send} disabled={!input.trim() || loading} size="icon" className="rounded-xl h-10 w-10 shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-center text-xs text-muted-foreground mt-1.5">IshTop.uz · AI Yordamchi 🤖</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatWidget;
