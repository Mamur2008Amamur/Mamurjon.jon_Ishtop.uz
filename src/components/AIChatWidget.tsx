<<<<<<< HEAD
import { useRef, useState, useEffect } from "react";
import { MessageCircle, X, Send, Bot, RotateCcw, Sparkles, Minimize2, Maximize2, Volume2, VolumeX, Zap, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface Message { id: string; role: "user" | "assistant"; content: string; time: Date; }

const QUICK = [
  "Santexnik topish",
  "Admin Panel",
  "Ro'yxatdan o'tish",
  "Qanday ishlaydi?",
];

const SYSTEM = `Sen IshTop.uz platformasining AI yordamchisisisan. FAQAT shu platforma haqida gapirasan.
Agar boshqa mavzuda so'rasa: "Men faqat IshTop.uz platformasi bo'yicha yordam bera olaman 😊" de.

IshTop.uz haqida ma'lumot:
- O'zbekistondagi №1 usta topish platformasi
- 12,500+ tasdiqlangan mutaxassis
- 48,000+ bajarilgan buyurtma
- 4.9 o'rtacha reyting, 98% mijozlar mamnun
- Xizmatlar: Santexnik (50K-200K so'm), Elektrik (40K-150K), Ta'mirchi (100K-500K), Tozalovchi (80K-300K), Fotograf (100K-500K), IT xizmat (50K-200K), Avtomaster, O'qituvchi, Konditsioner, Oshpaz, Yetkazib berish, Go'zallik
- To'lov: Payme, Click, Humo, UzCard, naqd
- Qanday ishlaydi: 1) Xizmat tanlang, 2) Usta tanlang, 3) Bog'laning, 4) Baholang
- Sayt: ishtop.uz | Chat: /chat | Profil: /profil | Admin panel: /admin

Agar foydalanuvchi "Admin panel", "Admin" kabi so'rov yuborsa:
"Admin panelga kirish uchun ushbu ssilkaga o'ting: /admin" deb javob ber.

Qisqa, do'stona, emojili javob ber. O'zbek tilida gapir.`;

const Dots = () => (
  <div className="flex items-center gap-1 px-1">
    {[0,1,2].map(i => (
      <motion.div key={i} className="h-1.5 w-1.5 rounded-full bg-indigo-400"
        animate={{ scale: [1,1.5,1], opacity: [0.4,1,0.4] }}
        transition={{ duration:0.8, delay:i*0.2, repeat:Infinity }} />
    ))}
  </div>
);

const playPop = (f=880, d=0.07) => {
  try {
    const c = new (window.AudioContext||(window as any).webkitAudioContext)();
    const o = c.createOscillator(); const g = c.createGain();
    o.connect(g); g.connect(c.destination); o.type="sine"; o.frequency.value=f;
    g.gain.setValueAtTime(0,c.currentTime); g.gain.linearRampToValueAtTime(0.07,c.currentTime+0.01);
    g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+d);
    o.start(); o.stop(c.currentTime+d+0.05);
  } catch {}
};

const AIChatWidget = () => {
  const [open,     setOpen]    = useState(false);
  const [mini,     setMini]    = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input,    setInput]   = useState("");
  const [loading,  setLoading] = useState(false);
  const [sound,    setSound]   = useState(true);
  const [unread,   setUnread]  = useState(0);
  const [typing,   setTyping]  = useState("");
  const [error,    setError]   = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[messages,typing]);
  useEffect(()=>{ if(!open && messages.length>0) setUnread(u=>u+1); if(open) setUnread(0); },[messages.length]);

  const send = async (text?: string) => {
    const txt = (text||input).trim();
    if(!txt||loading) return;
    setInput(""); setError("");
    if(sound) playPop(880,0.07);

    const userMsg: Message = { id:Date.now().toString(), role:"user", content:txt, time:new Date() };
    const history = [...messages, userMsg];
    setMessages(history);
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      let reply = "Kechirasiz, hozir javob bera olmayapman. Qayta urinib ko'ring. 🙏";

      if (apiKey) {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            temperature: 0.55,
            max_tokens: 420,
            messages: [{ role: "system", content: SYSTEM }, ...history.slice(-8).map(m => ({ role: m.role, content: m.content }))],
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          reply = data?.choices?.[0]?.message?.content || reply;
        } else {
          console.error("Groq API Error:", await response.text());
        }
      } else {
        const { data, error } = await supabase.functions.invoke("chat", {
          body: {
            messages: history.slice(-8).map(m => ({ role: m.role, content: m.content })),
          },
        });
        if (error) throw error;
        reply = data?.reply || reply;
      }

      /* typewriter */
      let shown = "";
      setTyping("");
      for(let i=0; i<reply.length; i++){
        shown += reply[i];
        setTyping(shown);
        await new Promise(r=>setTimeout(r, 10));
      }
      setTyping("");
      if(sound){ playPop(660,0.05); setTimeout(()=>playPop(880,0.04),70); }
      const botMsg: Message = { id:(Date.now()+1).toString(), role:"assistant", content:reply, time:new Date() };
      setMessages(prev=>[...prev, botMsg]);
    } catch(e: any) {
      console.error(e);
      setError("Tarmoq xatosi. Iltimos internet aloqasini tekshiring.");
    }
    setLoading(false);
    inputRef.current?.focus();
  };

  const reset = () => { setMessages([]); setTyping(""); setError(""); };
  const hm = (d:Date) => d.toLocaleTimeString("uz",{hour:"2-digit",minute:"2-digit"});

  return (
    <>
      {/* FAB */}
      <AnimatePresence>
        {!open && (
          <motion.button key="fab"
            initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0,opacity:0}}
            whileHover={{scale:1.1}} whileTap={{scale:0.95}}
            onClick={()=>{setOpen(true);setUnread(0);if(sound) playPop(523,0.12);}}
            className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full shadow-2xl flex items-center justify-center"
            style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",boxShadow:"0 8px 32px rgba(99,102,241,0.5)"}}>
            <motion.div animate={{rotate:[0,-10,10,-5,5,0]}} transition={{duration:2,repeat:Infinity,repeatDelay:4}}>
              <MessageCircle className="h-7 w-7 text-white"/>
            </motion.div>
            {unread > 0 && (
              <motion.div initial={{scale:0}} animate={{scale:1}}
                className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                {unread>9?"9+":unread}
              </motion.div>
            )}
            <motion.div className="absolute inset-0 rounded-full border-2 border-indigo-400"
              animate={{scale:[1,1.5,1.8],opacity:[0.5,0.2,0]}}
              transition={{duration:2,repeat:Infinity,repeatDelay:1}}/>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div key="panel"
            initial={{opacity:0,y:30,scale:0.9}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:30,scale:0.9}}
            transition={{type:"spring",damping:20,stiffness:300}}
            className="fixed bottom-6 right-6 z-50 w-[370px] max-w-[calc(100vw-16px)] overflow-hidden rounded-3xl shadow-2xl flex flex-col"
            style={{height:mini?"auto":540,border:"1px solid rgba(99,102,241,0.25)",background:"rgba(13,15,22,0.98)",backdropFilter:"blur(40px)"}}>

            {/* Header */}
            <div className="relative flex items-center gap-3 px-4 py-3 shrink-0 overflow-hidden"
              style={{background:"linear-gradient(135deg,rgba(99,102,241,0.95),rgba(139,92,246,0.95))"}}>
              <motion.div className="absolute inset-0 opacity-30"
                animate={{backgroundPosition:["0% 50%","100% 50%","0% 50%"]}}
                transition={{duration:5,repeat:Infinity}}
                style={{backgroundImage:"linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)",backgroundSize:"200% 100%"}}/>

              <div className="relative z-10 h-10 w-10 shrink-0 rounded-2xl flex items-center justify-center bg-white/20">
                <Bot className="h-5 w-5 text-white"/>
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-400 border-2 border-white/50 animate-pulse"/>
              </div>
              <div className="relative z-10 flex-1 min-w-0">
                <p className="font-bold text-white text-sm leading-tight" style={{fontFamily:"'Sora',sans-serif"}}>IshTop AI</p>
                <p className="text-[11px] text-white/70 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 inline-block animate-pulse"/>
                  {loading?"Yozmoqda...":"Doim yordam beraman"}
                </p>
              </div>
              <div className="relative z-10 flex items-center gap-0.5">
                <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={()=>setSound(s=>!s)}
                  className="h-8 w-8 rounded-xl flex items-center justify-center hover:bg-white/20 transition">
                  {sound ? <Volume2 className="h-4 w-4 text-white/70"/> : <VolumeX className="h-4 w-4 text-white/50"/>}
                </motion.button>
                <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={()=>setMini(m=>!m)}
                  className="h-8 w-8 rounded-xl flex items-center justify-center hover:bg-white/20 transition">
                  {mini?<Maximize2 className="h-4 w-4 text-white/70"/>:<Minimize2 className="h-4 w-4 text-white/70"/>}
                </motion.button>
                <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={reset}
                  className="h-8 w-8 rounded-xl flex items-center justify-center hover:bg-white/20 transition">
                  <RotateCcw className="h-4 w-4 text-white/70"/>
                </motion.button>
                <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={()=>setOpen(false)}
                  className="h-8 w-8 rounded-xl flex items-center justify-center hover:bg-white/20 transition">
                  <X className="h-4 w-4 text-white"/>
                </motion.button>
              </div>
            </div>

            {!mini && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">

                  {messages.length === 0 && (
                    <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
                      className="flex flex-col items-center gap-4 py-4 text-center">
                      <motion.div animate={{y:[0,-8,0]}} transition={{duration:3,repeat:Infinity}}
                        className="h-16 w-16 rounded-2xl flex items-center justify-center"
                        style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",boxShadow:"0 12px 40px rgba(99,102,241,0.4)"}}>
                        <Sparkles className="h-8 w-8 text-white"/>
                      </motion.div>
                      <div>
                        <p className="font-bold text-white text-base" style={{fontFamily:"'Sora',sans-serif"}}>Salom! Men IshTop AI 👋</p>
                        <p className="mt-1.5 text-xs max-w-[260px]" style={{color:"rgba(255,255,255,0.45)"}}>
                          IshTop.uz platformasi bo'yicha savol bering. Usta topish, narxlar va boshqa ma'lumotlar!
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 w-full">
                        {QUICK.map(q=>(
                          <motion.button key={q} whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={()=>send(q)}
                            className="rounded-xl px-3 py-2.5 text-left text-xs font-medium transition-all"
                            style={{background:"rgba(99,102,241,0.12)",border:"1px solid rgba(99,102,241,0.2)",color:"rgba(255,255,255,0.75)"}}>
                            <Zap className="inline h-3 w-3 text-indigo-400 mr-1"/>{q}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {messages.map(m=>(
                    <motion.div key={m.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
                      className={`flex gap-2.5 ${m.role==="user"?"justify-end":"justify-start"}`}>
                      {m.role==="assistant" && (
                        <div className="h-7 w-7 rounded-xl flex items-center justify-center shrink-0 mt-1"
                          style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)"}}>
                          <Bot className="h-3.5 w-3.5 text-white"/>
                        </div>
                      )}
                      <div className={`max-w-[80%] flex flex-col ${m.role==="user"?"items-end":"items-start"}`}>
                        <div className="rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words"
                          style={m.role==="user"
                            ?{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"white",borderBottomRightRadius:4,boxShadow:"0 4px 12px rgba(99,102,241,0.3)"}
                            :{background:"rgba(255,255,255,0.07)",color:"rgba(255,255,255,0.9)",borderBottomLeftRadius:4,border:"1px solid rgba(255,255,255,0.07)"}}>
                          {m.content}
                        </div>
                        <span className="mt-1 text-[10px] px-1" style={{color:"rgba(255,255,255,0.28)"}}>{hm(m.time)}</span>
                      </div>
                    </motion.div>
                  ))}

                  {loading && !typing && (
                    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="flex gap-2.5 justify-start">
                      <div className="h-7 w-7 rounded-xl flex items-center justify-center shrink-0"
                        style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)"}}>
                        <Bot className="h-3.5 w-3.5 text-white"/>
                      </div>
                      <div className="rounded-2xl px-4 py-3"
                        style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.07)"}}>
                        <Dots/>
                      </div>
                    </motion.div>
                  )}

                  {typing && (
                    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="flex gap-2.5 justify-start">
                      <div className="h-7 w-7 rounded-xl flex items-center justify-center shrink-0"
                        style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)"}}>
                        <Bot className="h-3.5 w-3.5 text-white"/>
                      </div>
                      <div className="max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap"
                        style={{background:"rgba(255,255,255,0.07)",color:"rgba(255,255,255,0.9)",border:"1px solid rgba(255,255,255,0.07)",borderBottomLeftRadius:4}}>
                        {typing}
                        <motion.span animate={{opacity:[1,0,1]}} transition={{duration:0.6,repeat:Infinity}}
                          className="inline-block w-0.5 h-3.5 bg-indigo-400 ml-0.5 align-middle"/>
                      </div>
                    </motion.div>
                  )}

                  {error && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}}
                      className="rounded-xl px-4 py-3 text-xs text-red-400 text-center"
                      style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)"}}>
                      ⚠️ {error}
                    </motion.div>
                  )}

                  <div ref={bottomRef}/>
                </div>

                {/* Quick chips — visible after first message */}
                {messages.length > 0 && (
                  <div className="flex gap-1.5 px-4 pb-2 overflow-x-auto scrollbar-hide">
                    {QUICK.map(q=>(
                      <button key={q} onClick={()=>send(q)}
                        className="shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium whitespace-nowrap transition"
                        style={{background:"rgba(99,102,241,0.1)",border:"1px solid rgba(99,102,241,0.2)",color:"rgba(255,255,255,0.65)"}}>
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div className="p-3 border-t" style={{borderColor:"rgba(255,255,255,0.06)"}}>
                  <div className="flex items-center gap-2 rounded-2xl px-3.5 py-2.5 transition-all"
                    style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.09)"}}>
                    <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)}
                      onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
                      placeholder="Savol bering..." disabled={loading}
                      className="flex-1 bg-transparent text-sm outline-none placeholder:text-white/25"
                      style={{color:"rgba(255,255,255,0.9)",fontFamily:"'DM Sans',sans-serif"}}/>
                    <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={()=>send()}
                      disabled={!input.trim()||loading}
                      className="h-8 w-8 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-30"
                      style={{background:input.trim()&&!loading?"linear-gradient(135deg,#6366f1,#8b5cf6)":"rgba(255,255,255,0.08)"}}>
                      <Send className="h-3.5 w-3.5"/>
                    </motion.button>
                  </div>
                  <p className="text-center text-[10px] mt-2" style={{color:"rgba(255,255,255,0.18)"}}>
                    IshTop AI · Groq llama-3.3 · Faqat IshTop.uz bo'yicha
                  </p>
                </div>
              </>
            )}
=======
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
>>>>>>> 9e3f45b0ee34d0c9b3b0b17417f24ac9ba002cd8
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatWidget;
