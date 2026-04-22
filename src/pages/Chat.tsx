import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send, Search, Phone, Video, MoreVertical, ArrowLeft,
  Smile, Paperclip, Mic, MicOff, Camera, X, Check, CheckCheck,
  Settings, Lock, Unlock, Eye, EyeOff, Save, Shield, Bell,
  Volume2, User, ChevronLeft, LogIn, Plus, Edit3, AtSign,
  Hash, Sun, Moon, Copy, Reply, Heart, Trash2, Star,
  MessageSquare, Users, Zap, Sparkles
} from "lucide-react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { db } from "@/lib/firebase";
import { ref, push, onValue, off } from "firebase/database";
import { supabase } from "@/integrations/supabase/client";

/* ═══════════ TYPES ═══════════ */
interface Msg {
  id: string; text: string; type: "text"|"image"|"sticker"|"video";
  sender: string; senderName: string; senderNick: string; senderColor: string; time: number;
}
interface UserProfile {
  uid: string; nick: string; firstName: string; lastName: string;
  color: string; bio: string; phone: string;
  fontSize: number; sound: boolean; appLock: string; blocked: string[];
  theme: "dark"|"cyber"|"ocean"; wallpaper: number;
}

/* ═══════════ CONSTANTS ═══════════ */
const ROOMS = [
  { id:"umumiy",     name:"Umumiy",      full:"Umumiy chat",       emoji:"💬", sub:"Hamma uchun",       g1:"#3b82f6", g2:"#6366f1" },
  { id:"santexnik",  name:"Santexnik",   full:"Santexniklar",      emoji:"🔧", sub:"Quvur & kran",      g1:"#06b6d4", g2:"#3b82f6" },
  { id:"elektrik",   name:"Elektrik",    full:"Elektriklar",       emoji:"⚡", sub:"Elektr xizmati",   g1:"#f59e0b", g2:"#ef4444" },
  { id:"it",         name:"IT",          full:"IT Mutaxassislar",  emoji:"💻", sub:"Dasturlash & IT",  g1:"#8b5cf6", g2:"#ec4899" },
  { id:"tamirchi",   name:"Ta'mir",      full:"Ta'mirchilar",      emoji:"🔨", sub:"Ta'mir ishlari",   g1:"#f97316", g2:"#eab308" },
  { id:"tozalovchi", name:"Toza",        full:"Tozalovchilar",     emoji:"🧹", sub:"Tozalash xizmati", g1:"#10b981", g2:"#06b6d4" },
];

const PALETTE = ["#6366f1","#3b82f6","#06b6d4","#10b981","#f59e0b","#ef4444","#ec4899","#8b5cf6","#f97316","#84cc16","#14b8a6","#a855f7"];
const EMOJIS  = ["😀","😂","🥰","😍","🤩","😎","🥳","🤔","😅","😭","🤣","😇","🙈","🥺","😤","🤯","😴","🫠","🎉","🎊","🔥","💥","⭐","✨","🎁","🏆","👍","👎","❤️","💔","😊","🙏","💪","🤝","👋","✌️","🐶","🐱","🦊","🍕","🍔","🌮","🍜","🍣","☕","🎵","🎮","🚀","💡","🌟","🦋"];

const THEMES: Record<string, Record<string,string>> = {
  dark:  { bg:"#0f1117", sidebar:"#16181d", card:"#1e2028", border:"rgba(255,255,255,0.06)", text:"#f1f5f9", muted:"#64748b", accent:"#6366f1", bubble_me:"#6366f1", bubble_other:"#1e2028", input:"#1e2028" },
  cyber: { bg:"#060b14", sidebar:"#0a1020", card:"#0f1a2e", border:"rgba(0,245,255,0.1)",   text:"#e2f4ff", muted:"#4a7fa5",  accent:"#00f5ff", bubble_me:"#003d5c", bubble_other:"#0a1a2a", input:"#0a1a2a" },
  ocean: { bg:"#070d1a", sidebar:"#0c1525", card:"#111e35", border:"rgba(99,102,241,0.15)", text:"#dde8ff", muted:"#4a5580",  accent:"#818cf8", bubble_me:"#1e2d5a", bubble_other:"#111e35", input:"#111e35" },
};

const WALLPAPERS = [
  { name:"Sof qora",   css:"linear-gradient(135deg,#0f1117 0%,#0f1117 100%)" },
  { name:"Kosmik",     css:"radial-gradient(ellipse at 20% 50%,#1a0533 0%,#0d1117 50%,#020817 100%)" },
  { name:"Neon grid",  css:"linear-gradient(135deg,#060b14 0%,#0a1020 100%)" },
  { name:"Aurora",     css:"radial-gradient(ellipse at 70% 30%,#0c2340 0%,#0d2137 40%,#071525 100%)" },
  { name:"Sunset",     css:"radial-gradient(ellipse at 50% 0%,#2d1b00 0%,#1a0d00 50%,#0d0700 100%)" },
];

const PROF_KEY = "cht_prof_v4";
const LOCK_KEY = "cht_lock_v4";

const mkProf = (): UserProfile => {
  const uid = Math.random().toString(36).slice(2,10);
  const arr = ["Aziz","Dilshod","Nodira","Jasur","Sardor","Malika","Bobur","Kamola","Sherzod","Nilufar"];
  return { uid, nick:arr[Math.floor(Math.random()*arr.length)]+Math.floor(Math.random()*99), firstName:"", lastName:"", color:PALETTE[Math.floor(Math.random()*PALETTE.length)], bio:"", phone:"", fontSize:14, sound:true, appLock:"", blocked:[], theme:"dark", wallpaper:1 };
};
const loadProf = (): UserProfile => {
  try { const s=localStorage.getItem(PROF_KEY); if(s) return JSON.parse(s); } catch {}
  const p=mkProf(); localStorage.setItem(PROF_KEY,JSON.stringify(p)); return p;
};
const storeProf = (p:UserProfile) => localStorage.setItem(PROF_KEY, JSON.stringify(p));
const autoColor = (uid:string) => PALETTE[uid.split("").reduce((a,c)=>a+c.charCodeAt(0),0)%PALETTE.length];
const hm = (ts:number) => new Date(ts).toLocaleTimeString("uz",{hour:"2-digit",minute:"2-digit"});
const dayLabel = (ts:number) => {
  const d=new Date(ts), now=new Date();
  if(d.toDateString()===now.toDateString()) return "Bugun";
  const y=new Date(); y.setDate(y.getDate()-1);
  if(d.toDateString()===y.toDateString()) return "Kecha";
  return d.toLocaleDateString("uz-UZ",{day:"numeric",month:"long"});
};

/* ═══════════ LOCK ═══════════ */
const LockScreen = ({color,onUnlock}:{color:string;onUnlock:()=>void}) => {
  const [p,setP]=useState(""); const [err,setErr]=useState(""); const [show,setShow]=useState(false);
  const go=()=>{ const prof=loadProf(); if(p===prof.appLock){localStorage.setItem(LOCK_KEY,"0");onUnlock();}else{setErr("Noto'g'ri parol");setP("");} };
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8" style={{background:"#0f1117"}}>
      <motion.div initial={{scale:0.5,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:"spring",damping:15}}
        className="h-28 w-28 rounded-3xl flex items-center justify-center shadow-2xl" style={{background:color}}>
        <Lock className="h-14 w-14 text-white"/>
      </motion.div>
      <motion.div initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.1}} className="text-center">
        <h2 className="text-3xl font-bold text-white" style={{fontFamily:"'Sora',sans-serif"}}>IshTop Chat</h2>
        <p className="text-slate-400 mt-2 text-sm">Davom etish uchun parolni kiriting</p>
      </motion.div>
      <motion.div initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.2}} className="w-72 space-y-3">
        <div className="relative">
          <input type={show?"text":"password"} value={p} onChange={e=>setP(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}
            autoFocus placeholder="Parolni kiriting"
            className="w-full rounded-2xl px-5 py-4 text-center text-lg text-white outline-none border transition-all"
            style={{background:"rgba(255,255,255,0.05)",borderColor:err?"#ef4444":"rgba(255,255,255,0.1)",backdropFilter:"blur(20px)"}}/>
          <button onClick={()=>setShow(s=>!s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition">{show ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}</button>
        </div>
        {err&&<motion.p initial={{x:-10}} animate={{x:0}} className="text-red-400 text-sm text-center">{err}</motion.p>}
        <button onClick={go} className="w-full rounded-2xl py-4 text-base font-bold text-white transition-all hover:opacity-90 hover:scale-[1.02] active:scale-95" style={{background:`linear-gradient(135deg,${color},${color}aa)`}}>
          Kirish
        </button>
      </motion.div>
    </div>
  );
};

/* ═══════════ EMOJI PICKER ═══════════ */
const EmojiPicker = ({onPick,onClose,T}:{onPick:(e:string)=>void;onClose:()=>void;T:Record<string,string>}) => (
  <motion.div initial={{opacity:0,y:12,scale:0.92}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:12,scale:0.92}}
    transition={{type:"spring",damping:20}}
    className="absolute bottom-full mb-3 left-0 rounded-2xl shadow-2xl overflow-hidden z-30 w-80"
    style={{background:T.card,border:`1px solid ${T.border}`,backdropFilter:"blur(40px)"}}>
    <div className="flex items-center justify-between px-4 py-3 border-b" style={{borderColor:T.border}}>
      <span className="text-sm font-semibold flex items-center gap-2" style={{color:T.muted}}><Smile className="h-4 w-4"/> Emoji</span>
      <button onClick={onClose} className="h-7 w-7 rounded-lg flex items-center justify-center transition hover:bg-white/10" style={{color:T.muted}}><X className="h-4 w-4"/></button>
    </div>
    <div className="grid grid-cols-8 gap-0.5 p-3 max-h-56 overflow-y-auto">
      {EMOJIS.map((e,i)=>(
        <motion.button key={i} whileHover={{scale:1.3}} whileTap={{scale:0.9}} onClick={()=>{onPick(e);onClose();}}
          className="flex items-center justify-center h-9 w-9 rounded-xl text-xl transition"
          style={{background:"transparent"}}
          onMouseEnter={ev=>(ev.currentTarget.style.background="rgba(255,255,255,0.08)")}
          onMouseLeave={ev=>(ev.currentTarget.style.background="transparent")}>{e}</motion.button>
      ))}
    </div>
  </motion.div>
);

/* ═══════════ MESSAGE BUBBLE ═══════════ */
const Bubble = ({msg,isMine,prevSame,nextSame,T,fontSize,searchQ,onReply,onCopy}:{
  msg:Msg; isMine:boolean; prevSame:boolean; nextSame:boolean;
  T:Record<string,string>; fontSize:number; searchQ:string;
  onReply:(m:Msg)=>void; onCopy:(t:string)=>void;
}) => {
  const [hover,setHover]=useState(false);

  const highlight=(text:string)=>{
    if(!searchQ) return <>{text}</>;
    const parts=text.split(new RegExp(`(${searchQ})`,"gi"));
    return <>{parts.map((p,i)=>p.toLowerCase()===searchQ.toLowerCase()?<mark key={i} style={{background:"rgba(250,204,21,0.3)",color:"#fbbf24",borderRadius:3,padding:"0 2px"}}>{p}</mark>:p)}</>;
  };

  const br_tl = isMine ? (nextSame?"20px":"20px") : (nextSame?"20px":"4px");
  const br_tr = isMine ? (nextSame?"20px":"4px") : "20px";
  const br_bl = isMine ? "20px" : (prevSame?"20px":"20px");
  const br_br = isMine ? (prevSame?"20px":"20px") : "20px";

  return (
    <motion.div
      initial={{opacity:0,y:10,scale:0.96}}
      animate={{opacity:1,y:0,scale:1}}
      transition={{duration:0.2,ease:[0.34,1.56,0.64,1]}}
      className={`flex ${isMine?"justify-end":"justify-start"} ${prevSame?"mt-0.5":"mt-4"} items-end gap-2 group px-2`}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>

      {/* Left avatar */}
      {!isMine && (
        <div className="w-9 shrink-0 self-end mb-0.5">
          <AnimatePresence>
            {!nextSame && (
              <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",damping:15}}
                className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg ring-2"
                style={{background:`linear-gradient(135deg,${msg.senderColor||autoColor(msg.sender)},${msg.senderColor||autoColor(msg.sender)}88)`,ringColor:"rgba(255,255,255,0.1)"}}>
                {(msg.senderNick||"U").slice(0,2).toUpperCase()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Bubble + actions */}
      <div className={`flex flex-col ${isMine?"items-end":"items-start"} max-w-[68%] sm:max-w-[55%]`}>
        {!isMine && !prevSame && (
          <motion.span initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}}
            className="text-xs font-bold mb-1.5 ml-1 flex items-center gap-1.5"
            style={{color:msg.senderColor||autoColor(msg.sender)}}>
            <span style={{fontFamily:"'Sora',sans-serif"}}>@{msg.senderNick||msg.senderName}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 inline-block"/>
          </motion.span>
        )}

        {msg.type==="sticker" ? (
          <motion.div whileHover={{scale:1.15}} className="text-5xl select-none py-1 cursor-pointer">{msg.text}</motion.div>
        ) : msg.type==="image" ? (
          <div className="rounded-2xl overflow-hidden shadow-xl cursor-pointer group/img" onClick={()=>window.open(msg.text,"_blank")}>
            <div className="relative"><img src={msg.text} alt="" className="max-w-[260px] max-h-[260px] object-cover block transition group-hover/img:brightness-90"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover/img:opacity-100 transition flex items-end justify-end p-2">
                <span className="text-white/80 text-xs">{hm(msg.time)}</span>
                {isMine&&<CheckCheck className="h-3.5 w-3.5 ml-1" style={{color:T.accent}}/>}
              </div>
            </div>
          </div>
        ) : msg.type==="video" ? (
          <div className="rounded-2xl overflow-hidden shadow-xl"><video src={msg.text} className="max-w-[260px] max-h-[200px]" controls/></div>
        ) : (
          <div className="relative">
            {/* Glow effect for mine */}
            {isMine && (
              <div className="absolute inset-0 rounded-[18px] blur-md opacity-30 -z-10" style={{background:T.accent}}/>
            )}
            <div style={{
              background: isMine ? `linear-gradient(135deg,${T.accent},${T.accent}cc)` : T.bubble_other,
              borderRadius: `${br_tl} ${br_tr} ${br_br} ${br_bl}`,
              padding:"10px 14px 8px 14px",
              border:`1px solid ${isMine?"transparent":T.border}`,
              backdropFilter:"blur(20px)",
              boxShadow: isMine ? `0 4px 24px ${T.accent}44` : "0 2px 12px rgba(0,0,0,0.3)",
            }}>
              <p className="text-white leading-relaxed break-words" style={{fontSize,fontFamily:"'DM Sans',sans-serif"}}>
                {highlight(msg.text)}
              </p>
              <div className={`flex items-center gap-1 mt-1.5 ${isMine?"justify-end":"justify-start"}`}>
                <span className="text-[11px]" style={{color:"rgba(255,255,255,0.4)"}}>{hm(msg.time)}</span>
                {isMine && <CheckCheck className="h-3 w-3" style={{color:"rgba(255,255,255,0.7)"}}/>}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hover actions */}
      <AnimatePresence>
        {hover && msg.type==="text" && (
          <motion.div initial={{opacity:0,scale:0.8,x:isMine?8:-8}} animate={{opacity:1,scale:1,x:0}} exit={{opacity:0,scale:0.8}}
            transition={{duration:0.15}}
            className={`flex items-center gap-1 ${isMine?"order-first mr-1":"ml-1"}`}>
            {[
              {icon:Reply,  label:"Javob", fn:()=>onReply(msg)},
              {icon:Copy,   label:"Kopya", fn:()=>onCopy(msg.text)},
            ].map((a,i)=>(
              <motion.button key={i} whileHover={{scale:1.15}} whileTap={{scale:0.9}}
                onClick={a.fn} title={a.label}
                className="h-7 w-7 rounded-xl flex items-center justify-center transition"
                style={{background:"rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.5)"}}>
                <a.icon className="h-3.5 w-3.5"/>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ═══════════ SETTINGS PANEL ═══════════ */
const SettingsPanel = ({prof,onSave,onClose,T}:{prof:UserProfile;onSave:(p:UserProfile)=>void;onClose:()=>void;T:Record<string,string>}) => {
  const [p,setP]=useState({...prof});
  const [tab,setTab]=useState<"profile"|"appearance"|"privacy"|"notif">("profile");
  const [np,setNp]=useState(""); const [cp,setCp]=useState(""); const [pe,setPe]=useState("");
  const [showP,setShowP]=useState(false); const [lockForm,setLockForm]=useState(false);

  const setLock=()=>{ if(!np){setPe("Parol kiriting");return;} if(np!==cp){setPe("Mos emas");return;} if(np.length<4){setPe("Kamida 4 belgi");return;} setP(x=>({...x,appLock:np})); setNp(""); setCp(""); setPe(""); setLockForm(false); };
  const save=()=>{ onSave(p); onClose(); };

  const TABS=[{id:"profile",label:"Profil",icon:User},{id:"appearance",label:"Ko'rinish",icon:Sparkles},{id:"privacy",label:"Maxfiylik",icon:Shield},{id:"notif",label:"Bildirishnoma",icon:Bell}] as const;

  return (
    <motion.div initial={{opacity:0,x:"100%"}} animate={{opacity:1,x:0}} exit={{opacity:0,x:"100%"}} transition={{type:"spring",damping:24,stiffness:200}}
      className="absolute inset-0 z-40 flex flex-col" style={{background:T.bg}}>

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b shrink-0" style={{background:T.sidebar,borderColor:T.border}}>
        <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={onClose}
          className="h-9 w-9 rounded-xl flex items-center justify-center transition" style={{background:"rgba(255,255,255,0.06)",color:T.muted}}>
          <ArrowLeft className="h-5 w-5"/>
        </motion.button>
        <div className="flex-1">
          <p className="font-bold text-white text-base" style={{fontFamily:"'Sora',sans-serif"}}>Sozlamalar</p>
          <p className="text-xs" style={{color:T.muted}}>Profilingizni sozlang</p>
        </div>
        <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={save}
          className="rounded-xl px-4 py-2 text-sm font-bold text-white flex items-center gap-2 transition"
          style={{background:`linear-gradient(135deg,${T.accent},${T.accent}aa)`}}>
          <Save className="h-4 w-4"/> Saqlash
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="flex border-b shrink-0 px-2" style={{background:T.sidebar,borderColor:T.border}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id as any)}
            className="flex items-center gap-1.5 px-4 py-3.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all"
            style={tab===t.id?{borderColor:T.accent,color:T.accent}:{borderColor:"transparent",color:T.muted}}>
            <t.icon className="h-3.5 w-3.5"/>{t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* PROFILE */}
        {tab==="profile" && <>
          {/* Avatar card */}
          <div className="rounded-2xl p-5 flex items-center gap-4 border" style={{background:T.card,borderColor:T.border}}>
            <div className="relative">
              <motion.div whileHover={{scale:1.05}} className="h-16 w-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-xl"
                style={{background:`linear-gradient(135deg,${p.color},${p.color}88)`}}>
                {(p.nick||"U").slice(0,2).toUpperCase()}
              </motion.div>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-400 border-2" style={{borderColor:T.card}}/>
            </div>
            <div>
              <p className="font-bold text-white" style={{fontFamily:"'Sora',sans-serif"}}>@{p.nick}</p>
              <p className="text-sm mt-0.5" style={{color:T.muted}}>{p.firstName} {p.lastName}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="h-2 w-2 rounded-full bg-green-400"/>
                <span className="text-xs text-green-400">Online</span>
              </div>
            </div>
          </div>

          {[{l:"Ism",k:"firstName",ph:"Ismingiz"},{l:"Familiya",k:"lastName",ph:"Familiyangiz"},{l:"Telefon",k:"phone",ph:"+998..."},{l:"Bio",k:"bio",ph:"O'zingiz haqida..."}].map(f=>(
            <div key={f.k}>
              <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{color:T.muted}}>{f.l}</label>
              {f.k==="bio"
                ?<textarea value={(p as any)[f.k]||""} onChange={e=>setP(x=>({...x,[f.k]:e.target.value}))} placeholder={f.ph} rows={2}
                  className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none resize-none border transition-all focus:ring-2"
                  style={{background:T.card,borderColor:T.border,fontFamily:"'DM Sans',sans-serif"}}/>
                :<input value={(p as any)[f.k]||""} onChange={e=>setP(x=>({...x,[f.k]:e.target.value}))} placeholder={f.ph}
                  className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none border transition-all"
                  style={{background:T.card,borderColor:T.border,fontFamily:"'DM Sans',sans-serif"}}/>
              }
            </div>
          ))}
          <div>
            <label className="block text-xs font-bold mb-2 uppercase tracking-wider" style={{color:T.muted}}>Username</label>
            <div className="relative">
              <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{color:T.muted}}/>
              <input value={p.nick} onChange={e=>setP(x=>({...x,nick:e.target.value}))} className="w-full rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none border transition-all" style={{background:T.card,borderColor:T.border}}/>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold mb-3 uppercase tracking-wider" style={{color:T.muted}}>Profil rangi</label>
            <div className="flex flex-wrap gap-2.5">
              {PALETTE.map(c=>(
                <motion.button key={c} whileHover={{scale:1.15}} whileTap={{scale:0.95}} onClick={()=>setP(x=>({...x,color:c}))}
                  className="h-9 w-9 rounded-xl transition-all" style={{background:c,boxShadow:p.color===c?`0 0 0 2px ${T.bg}, 0 0 0 4px ${c}`:"none"}}/>
              ))}
            </div>
          </div>
        </>}

        {/* APPEARANCE */}
        {tab==="appearance" && <>
          <div>
            <label className="block text-xs font-bold mb-3 uppercase tracking-wider" style={{color:T.muted}}>Tema</label>
            <div className="grid grid-cols-3 gap-2">
              {(["dark","cyber","ocean"] as const).map(th=>(
                <motion.button key={th} whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={()=>setP(x=>({...x,theme:th}))}
                  className="rounded-xl p-3 border-2 transition-all text-center"
                  style={{background:THEMES[th].bg,borderColor:p.theme===th?T.accent:T.border}}>
                  <div className="h-6 w-full rounded-lg mb-2" style={{background:THEMES[th].accent}}/>
                  <span className="text-xs font-semibold capitalize" style={{color:THEMES[th].text}}>{th}</span>
                  {p.theme===th && <div className="flex justify-center mt-1"><Check className="h-3 w-3" style={{color:T.accent}}/></div>}
                </motion.button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold mb-3 uppercase tracking-wider" style={{color:T.muted}}>Orqa fon</label>
            <div className="grid grid-cols-3 gap-2">
              {WALLPAPERS.map((w,i)=>(
                <motion.button key={i} whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={()=>setP(x=>({...x,wallpaper:i}))}
                  className="rounded-xl h-16 overflow-hidden border-2 relative transition-all"
                  style={{background:w.css,borderColor:p.wallpaper===i?T.accent:T.border}}>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-white/60">{w.name}</span>
                  {p.wallpaper===i && <div className="absolute top-1 right-1 h-5 w-5 rounded-full flex items-center justify-center" style={{background:T.accent}}><Check className="h-3 w-3 text-white"/></div>}
                </motion.button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider" style={{color:T.muted}}>Shrift o'lchami</label>
              <span className="text-sm font-bold" style={{color:T.accent}}>{p.fontSize}px</span>
            </div>
            <input type="range" min="12" max="20" value={p.fontSize} onChange={e=>setP(x=>({...x,fontSize:+e.target.value}))} className="w-full accent-indigo-500"/>
            <div className="mt-3 rounded-xl p-4 border" style={{background:T.card,borderColor:T.border}}>
              <p style={{fontSize:p.fontSize,color:T.text,fontFamily:"'DM Sans',sans-serif"}}>Namuna xabar matni — shu o'lchamda ko'rinadi</p>
            </div>
          </div>
        </>}

        {/* PRIVACY */}
        {tab==="privacy" && <>
          <div className="rounded-2xl border overflow-hidden" style={{borderColor:T.border,background:T.card}}>
            <div className="flex items-center gap-4 px-5 py-4 border-b" style={{borderColor:T.border}}>
              <div className="h-11 w-11 rounded-xl flex items-center justify-center" style={{background:`${T.accent}22`}}>
                <Lock className="h-5 w-5" style={{color:T.accent}}/>
              </div>
              <div className="flex-1">
                <p className="font-bold text-white text-sm" style={{fontFamily:"'Sora',sans-serif"}}>Ilova paroli</p>
                <p className="text-xs mt-0.5" style={{color:T.muted}}>Chatni PIN-kod bilan qulflang</p>
              </div>
              <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.appLock?"bg-green-400/10 text-green-400":"text-slate-400 bg-white/5"}`}>
                {p.appLock?"✓ Yoqilgan":"O'chirilgan"}
              </div>
            </div>
            <div className="px-5 py-4 space-y-3">
              {p.appLock
                ?<motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}} onClick={()=>setP(x=>({...x,appLock:""}))}
                  className="w-full rounded-xl py-3 text-sm font-semibold text-red-400 border transition hover:bg-red-400/5 flex items-center justify-center gap-2"
                  style={{borderColor:"rgba(239,68,68,0.3)"}}>
                  <Unlock className="h-4 w-4"/> Parolni olib tashlash
                </motion.button>
                :<motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}} onClick={()=>setLockForm(s=>!s)}
                  className="w-full rounded-xl py-3 text-sm font-semibold text-white flex items-center justify-center gap-2 transition"
                  style={{background:`linear-gradient(135deg,${T.accent},${T.accent}aa)`}}>
                  <Lock className="h-4 w-4"/> Parol o'rnatish
                </motion.button>
              }
              <AnimatePresence>
                {lockForm && (
                  <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} className="space-y-3 overflow-hidden">
                    {[{l:"Yangi parol",v:np,s:setNp},{l:"Tasdiqlang",v:cp,s:setCp}].map((f,i)=>(
                      <div key={i}>
                        <label className="block text-xs font-bold mb-1.5" style={{color:T.muted}}>{f.l}</label>
                        <div className="relative">
                          <input type={showP?"text":"password"} value={f.v} onChange={e=>f.s(e.target.value)} placeholder="••••••••"
                            className="w-full rounded-xl px-4 py-3 pr-11 text-sm text-white outline-none border transition-all"
                            style={{background:T.bg,borderColor:T.border}}/>
                          <button onClick={()=>setShowP(s=>!s)} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{color:T.muted}}>
                            {showP?<EyeOff className="h-4 w-4"/>:<Eye className="h-4 w-4"/>}
                          </button>
                        </div>
                      </div>
                    ))}
                    {pe&&<p className="text-xs text-red-400">{pe}</p>}
                    <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}} onClick={setLock}
                      className="w-full rounded-xl py-3 text-sm font-bold text-white transition"
                      style={{background:`linear-gradient(135deg,${T.accent},${T.accent}aa)`}}>Saqlash</motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </>}

        {/* NOTIFICATIONS */}
        {tab==="notif" && <>
          <div className="rounded-2xl border overflow-hidden divide-y" style={{borderColor:T.border,background:T.card,divideColor:T.border}}>
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{background:`${T.accent}22`}}><Volume2 className="h-5 w-5" style={{color:T.accent}}/></div>
                <div><p className="font-semibold text-white text-sm">Ovoz</p><p className="text-xs" style={{color:T.muted}}>Xabar ovozi</p></div>
              </div>
              <motion.button whileTap={{scale:0.9}} onClick={()=>setP(x=>({...x,sound:!x.sound}))}
                className="relative h-7 w-13 rounded-full transition-all" style={{background:p.sound?T.accent:"rgba(255,255,255,0.1)",width:52}}>
                <motion.span animate={{x:p.sound?24:2}} transition={{type:"spring",damping:15}} className="absolute top-1 h-5 w-5 rounded-full bg-white shadow-md"/>
              </motion.button>
            </div>
          </div>
          <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}} onClick={()=>Notification.requestPermission()}
            className="w-full rounded-xl py-4 text-sm font-bold text-white flex items-center justify-center gap-2"
            style={{background:`linear-gradient(135deg,${T.accent},${T.accent}aa)`}}>
            <Bell className="h-4 w-4"/> Bildirishnomaga ruxsat berish
          </motion.button>
        </>}
      </div>
    </motion.div>
  );
};

/* ═══════════ MAIN ═══════════ */
const Chat = () => {
  const navigate = useNavigate();
  const [authed,  setAuthed]  = useState<boolean|null>(null);
  const [locked,  setLocked]  = useState(false);
  const [roomId,  setRoomId]  = useState("umumiy");
  const [messages,setMessages]= useState<Msg[]>([]);
  const [input,   setInput]   = useState("");
  const [online,  setOnline]  = useState(true);
  const [sending, setSending] = useState(false);
  const [prof,    setProf]    = useState<UserProfile>(loadProf());
  const [showSide,setShowSide]= useState(false);
  const [showSet, setShowSet] = useState(false);
  const [showEmoji,setShowEmoji]=useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [showSearch,setShowSearch]=useState(false);
  const [replyTo, setReplyTo] = useState<Msg|null>(null);
  const [typing,  setTyping]  = useState(false);
  const [recording,setRecording]=useState(false);
  const [copied,  setCopied]  = useState(false);
  const bottomRef=useRef<HTMLDivElement>(null);
  const inputRef =useRef<HTMLInputElement>(null);
  const imgRef   =useRef<HTMLInputElement>(null);

  const T = THEMES[prof.theme] || THEMES.dark;

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>setAuthed(!!session));
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_,s)=>setAuthed(!!s));
    return ()=>subscription.unsubscribe();
  },[]);

  useEffect(()=>{ const p=loadProf(); if(p.appLock&&localStorage.getItem(LOCK_KEY)!=="0") setLocked(true); },[]);

  useEffect(()=>{
    if(!authed) return;
    const r=ref(db,`rooms/${roomId}/messages`);
    const unsub=onValue(r,snap=>{
      setOnline(true);
      const data=snap.val();
      if(!data){setMessages([]);return;}
      const list=Object.entries(data).map(([id,v]:any)=>({id,...v})).sort((a:any,b:any)=>a.time-b.time);
      setMessages(list as Msg[]);
    },()=>setOnline(false));
    return ()=>off(r,"value",unsub);
  },[roomId,authed]);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[messages]);

  useEffect(()=>{
    if(!messages.length) return;
    const last=messages[messages.length-1];
    if(last.sender!==prof.uid){ setTyping(true); const t=setTimeout(()=>setTyping(false),2500); return ()=>clearTimeout(t); }
  },[messages.length]);

  const sendMsg=async(textOverride?:string,type:"text"|"image"|"sticker"|"video"="text")=>{
    const txt=textOverride||input.trim(); if(!txt||sending) return;
    setSending(true);
    try {
      await push(ref(db,`rooms/${roomId}/messages`),{ text:txt, type, sender:prof.uid, senderName:prof.firstName||prof.nick, senderNick:prof.nick, senderColor:prof.color, time:Date.now(), ...(replyTo?{replyTo:replyTo.id}:{}) });
      setInput(""); setReplyTo(null); inputRef.current?.focus();
    } catch {}
    setSending(false);
  };

  const handleMedia=(e:React.ChangeEvent<HTMLInputElement>)=>{ const file=e.target.files?.[0]; if(!file) return; const isV=file.type.startsWith("video/"); const r=new FileReader(); r.onload=ev=>sendMsg(ev.target?.result as string,isV?"video":"image"); r.readAsDataURL(file); };
  const saveProf_=(p:UserProfile)=>{ setProf(p); storeProf(p); };
  const switchRoom=(id:string)=>{ setRoomId(id); setMessages([]); setShowSide(false); };
  const copyText=(t:string)=>{ navigator.clipboard.writeText(t); setCopied(true); setTimeout(()=>setCopied(false),2000); };

  const filtered=searchQ?messages.filter(m=>m.text.toLowerCase().includes(searchQ.toLowerCase())):messages;
  const grouped:{date:string;msgs:Msg[]}[]=[];
  filtered.forEach(m=>{ if(prof.blocked.includes(m.sender)) return; const d=dayLabel(m.time); const last=grouped[grouped.length-1]; if(last&&last.date===d) last.msgs.push(m); else grouped.push({date:d,msgs:[m]}); });

  const activeRoom=ROOMS.find(r=>r.id===roomId)!;
  const memberCount=[...new Set(messages.map(m=>m.sender))].length;
  const wallBg=WALLPAPERS[prof.wallpaper]?.css||WALLPAPERS[1].css;

  if(locked) return <LockScreen color={prof.color} onUnlock={()=>setLocked(false)}/>;

  if(authed===null) return (
    <div className="h-screen flex items-center justify-center" style={{background:T.bg}}>
      <motion.div animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:"linear"}} className="h-10 w-10 rounded-full border-2 border-t-transparent" style={{borderColor:T.accent}}/>
    </div>
  );

  if(!authed) return (
    <div className="h-screen flex flex-col items-center justify-center gap-8 p-6" style={{background:T.bg}}>
      <motion.div initial={{scale:0.5,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:"spring",damping:12}}
        className="h-28 w-28 rounded-3xl flex items-center justify-center text-6xl shadow-2xl"
        style={{background:`linear-gradient(135deg,${T.accent},${T.accent}66)`}}>💬</motion.div>
      <div className="text-center">
        <h2 className="text-4xl font-bold" style={{color:T.text,fontFamily:"'Sora',sans-serif"}}>IshTop Chat</h2>
        <p className="mt-3 text-base max-w-sm" style={{color:T.muted,fontFamily:"'DM Sans',sans-serif"}}>Mutaxassislar bilan real vaqtda muloqot qiling</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={()=>navigate("/auth")}
          className="flex-1 h-14 rounded-2xl font-bold text-white flex items-center justify-center gap-2 text-base"
          style={{background:`linear-gradient(135deg,${T.accent},${T.accent}88)`}}>
          <LogIn className="h-5 w-5"/> Kirish / Ro'yxat
        </motion.button>
        <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={()=>navigate("/")}
          className="flex-1 h-14 rounded-2xl font-semibold border text-base" style={{borderColor:T.border,color:T.muted,background:"transparent"}}>
          Bosh sahifa
        </motion.button>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex overflow-hidden" style={{background:T.bg,fontFamily:"'DM Sans',sans-serif"}}>

      {/* ════ SIDEBAR ════ */}
      <AnimatePresence>
        {showSide && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setShowSide(false)}
              className="fixed inset-0 z-40 md:hidden" style={{background:"rgba(0,0,0,0.6)",backdropFilter:"blur(4px)"}}/>
            <motion.aside initial={{x:-300}} animate={{x:0}} exit={{x:-300}} transition={{type:"spring",damping:26,stiffness:240}}
              className="fixed md:relative z-50 flex flex-col h-full border-r" style={{width:280,background:T.sidebar,borderColor:T.border}}>

              {/* Profile */}
              <div className="p-5 border-b" style={{borderColor:T.border}}>
                <div className="flex items-center gap-3.5">
                  <motion.button whileHover={{scale:1.05}} onClick={()=>{setShowSide(false);setShowSet(true);}} className="relative shrink-0">
                    <div className="h-12 w-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg text-base"
                      style={{background:`linear-gradient(135deg,${prof.color},${prof.color}88)`}}>
                      {prof.nick.slice(0,2).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2" style={{background:online?"#4ade80":"#94a3b8",borderColor:T.sidebar}}/>
                  </motion.button>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate text-sm" style={{fontFamily:"'Sora',sans-serif"}}>{prof.firstName||prof.nick}</p>
                    <p className="text-xs truncate" style={{color:T.muted}}>@{prof.nick}</p>
                  </div>
                  <button onClick={()=>setShowSide(false)} className="h-8 w-8 rounded-xl flex items-center justify-center transition hover:bg-white/5" style={{color:T.muted}}><X className="h-4 w-4"/></button>
                </div>
              </div>

              {/* Search */}
              <div className="px-4 py-3 border-b" style={{borderColor:T.border}}>
                <div className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 border" style={{background:T.card,borderColor:T.border}}>
                  <Search className="h-4 w-4 shrink-0" style={{color:T.muted}}/>
                  <input placeholder="Guruh qidirish..." className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"/>
                </div>
              </div>

              {/* Rooms */}
              <div className="flex-1 overflow-y-auto py-2">
                <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest" style={{color:T.muted}}>Guruhlar & Kanallar</p>
                {ROOMS.map((r,idx)=>(
                  <motion.button key={r.id} onClick={()=>switchRoom(r.id)} whileHover={{x:2}}
                    className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left transition-all relative"
                    style={{background:roomId===r.id?`${T.accent}15`:"transparent"}}>
                    {roomId===r.id && <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full" style={{background:T.accent}}/>}
                    <div className="h-11 w-11 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-md"
                      style={{background:`linear-gradient(135deg,${r.g1},${r.g2})`}}>
                      {r.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate" style={{color:roomId===r.id?T.accent:"white",fontFamily:"'Sora',sans-serif"}}>{r.full}</p>
                      <p className="text-xs truncate mt-0.5" style={{color:T.muted}}>{r.sub}</p>
                    </div>
                    {roomId===r.id && <div className="h-2 w-2 rounded-full shrink-0 animate-pulse" style={{background:"#4ade80"}}/>}
                  </motion.button>
                ))}
              </div>

              {/* Settings */}
              <div className="border-t p-3" style={{borderColor:T.border}}>
                <motion.button whileHover={{x:2}} onClick={()=>{setShowSide(false);setShowSet(true);}}
                  className="w-full flex items-center gap-3 rounded-xl px-4 py-3 transition" style={{color:T.muted}}
                  onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.04)")}
                  onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                  <Settings className="h-5 w-5"/><span className="text-sm font-medium">Sozlamalar</span>
                </motion.button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ════ CHAT AREA ════ */}
      <div className="flex flex-1 flex-col overflow-hidden relative">

        {/* Settings overlay */}
        <AnimatePresence>
          {showSet && <SettingsPanel prof={prof} onSave={saveProf_} onClose={()=>setShowSet(false)} T={T}/>}
        </AnimatePresence>

        {/* ── TOPBAR ── */}
        <div className="flex items-center gap-3 px-4 py-3 shrink-0 border-b" style={{background:`${T.sidebar}ee`,borderColor:T.border,backdropFilter:"blur(20px)"}}>
          {/* Hamburger */}
          <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={()=>setShowSide(s=>!s)}
            className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition border" style={{background:T.card,borderColor:T.border,color:T.muted}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </motion.button>

          {/* Room avatar */}
          <div className="relative shrink-0">
            <div className="h-10 w-10 rounded-2xl flex items-center justify-center text-lg shadow-lg"
              style={{background:`linear-gradient(135deg,${activeRoom.g1},${activeRoom.g2})`}}>
              {activeRoom.emoji}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2" style={{background:online?"#4ade80":"#94a3b8",borderColor:T.sidebar}}/>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 cursor-pointer" onClick={()=>setShowSide(true)}>
            <p className="font-bold text-white text-sm truncate" style={{fontFamily:"'Sora',sans-serif"}}>{activeRoom.full}</p>
            <div className="flex items-center gap-1.5">
              {online && <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse"/>}
              <p className="text-xs truncate" style={{color:online?"#4ade80":T.muted}}>
                {online?(memberCount>0?`${memberCount} a'zo online`:"Online"):"Offline"}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            {copied && <motion.span initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="text-xs text-green-400 mr-1">Nusxalandi!</motion.span>}
            <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={()=>{setShowSearch(s=>!s);setSearchQ("");}}
              className="h-9 w-9 rounded-xl flex items-center justify-center transition border"
              style={showSearch?{background:T.accent,borderColor:T.accent,color:"white"}:{background:T.card,borderColor:T.border,color:T.muted}}>
              <Search className="h-4 w-4"/>
            </motion.button>
            <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} className="h-9 w-9 rounded-xl flex items-center justify-center transition border" style={{background:T.card,borderColor:T.border,color:T.muted}}>
              <Phone className="h-4 w-4"/>
            </motion.button>
            <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={()=>setShowSet(true)}
              className="h-9 w-9 rounded-xl flex items-center justify-center transition border" style={{background:T.card,borderColor:T.border,color:T.muted}}>
              <MoreVertical className="h-4 w-4"/>
            </motion.button>
          </div>
        </div>

        {/* ── SEARCH BAR ── */}
        <AnimatePresence>
          {showSearch && (
            <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}
              className="border-b shrink-0 overflow-hidden" style={{background:T.sidebar,borderColor:T.border}}>
              <div className="flex items-center gap-3 mx-4 my-3 rounded-xl px-4 py-2.5 border" style={{background:T.card,borderColor:T.border}}>
                <Search className="h-4 w-4 shrink-0" style={{color:T.muted}}/>
                <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Xabarlarda qidirish..." autoFocus
                  className="flex-1 bg-transparent text-sm text-white outline-none" style={{fontFamily:"'DM Sans',sans-serif"}}/>
                {searchQ&&<button onClick={()=>setSearchQ("")} style={{color:T.muted}}><X className="h-3.5 w-3.5"/></button>}
              </div>
              {searchQ&&<p className="text-xs px-5 pb-3" style={{color:T.muted}}>{filtered.length} ta natija topildi</p>}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── ROOM CHIPS (mobile + desktop) ── */}
        <div className="flex gap-2 px-4 py-2.5 overflow-x-auto scrollbar-hide shrink-0 border-b" style={{background:`${T.sidebar}88`,borderColor:T.border,backdropFilter:"blur(12px)"}}>
          {ROOMS.map(r=>(
            <motion.button key={r.id} whileHover={{scale:1.04}} whileTap={{scale:0.96}} onClick={()=>switchRoom(r.id)}
              className="shrink-0 flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap"
              style={roomId===r.id
                ?{background:`linear-gradient(135deg,${r.g1},${r.g2})`,borderColor:"transparent",color:"white",boxShadow:`0 4px 15px ${r.g1}66`}
                :{background:"transparent",borderColor:T.border,color:T.muted}}>
              <span className="text-sm">{r.emoji}</span> {r.name}
            </motion.button>
          ))}
        </div>

        {/* ── MESSAGES ── */}
        <div className="flex-1 overflow-y-auto py-4 relative" style={{background:wallBg}}>
          {/* Noise overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")"}}/>

          {messages.length===0 && (
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="flex flex-col items-center justify-center h-full gap-5 text-center px-6">
              <div className="h-24 w-24 rounded-3xl flex items-center justify-center text-5xl shadow-2xl"
                style={{background:`linear-gradient(135deg,${activeRoom.g1},${activeRoom.g2})`,boxShadow:`0 20px 60px ${activeRoom.g1}66`}}>
                {activeRoom.emoji}
              </div>
              <div>
                <p className="font-bold text-white text-xl" style={{fontFamily:"'Sora',sans-serif"}}>{activeRoom.full}</p>
                <p className="mt-2 text-sm" style={{color:T.muted}}>{activeRoom.sub} — birinchi xabarni yuboring 👋</p>
              </div>
              <div className="flex gap-2 mt-2">
                {["👋","🔥","💬"].map(e=>(
                  <motion.button key={e} whileHover={{scale:1.2,rotate:10}} whileTap={{scale:0.8}} onClick={()=>sendMsg(e,"sticker")}
                    className="h-10 w-10 rounded-xl flex items-center justify-center text-xl border transition"
                    style={{background:T.card,borderColor:T.border}}>{e}</motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {grouped.map(group=>(
            <div key={group.date}>
              {/* Date pill */}
              <div className="flex justify-center my-5">
                <motion.span initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}}
                  className="text-xs px-4 py-1.5 rounded-full font-medium border"
                  style={{background:`${T.card}cc`,color:T.muted,borderColor:T.border,backdropFilter:"blur(20px)"}}>
                  {group.date}
                </motion.span>
              </div>
              {group.msgs.map((msg,i)=>(
                <Bubble key={msg.id} msg={msg} isMine={msg.sender===prof.uid}
                  prevSame={i>0&&group.msgs[i-1].sender===msg.sender}
                  nextSame={i<group.msgs.length-1&&group.msgs[i+1].sender===msg.sender}
                  T={T} fontSize={prof.fontSize} searchQ={searchQ}
                  onReply={setReplyTo} onCopy={copyText}/>
              ))}
            </div>
          ))}

          {/* Typing */}
          <AnimatePresence>
            {typing && (
              <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}}
                className="flex items-end gap-2 mt-3 px-4">
                <div className="h-8 w-8 rounded-full flex items-center justify-center text-sm" style={{background:T.card}}>💬</div>
                <div className="rounded-2xl rounded-bl-sm px-4 py-3 border" style={{background:T.bubble_other,borderColor:T.border}}>
                  <div className="flex gap-1.5 items-center">
                    {[0,1,2].map(i=>(
                      <motion.div key={i} animate={{y:[0,-5,0]}} transition={{duration:0.6,repeat:Infinity,delay:i*0.15}}
                        className="h-2 w-2 rounded-full" style={{background:T.muted}}/>
                    ))}
                  </div>
                </div>
                <span className="text-xs" style={{color:T.muted}}>yozmoqda...</span>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} className="h-4"/>
        </div>

        {/* ── REPLY PREVIEW ── */}
        <AnimatePresence>
          {replyTo && (
            <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}
              className="flex items-center gap-3 px-4 py-3 border-t shrink-0" style={{background:T.sidebar,borderColor:T.border}}>
              <div className="w-1 h-10 rounded-full shrink-0" style={{background:T.accent}}/>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate" style={{color:T.accent}}>↩ @{replyTo.senderNick||replyTo.senderName}</p>
                <p className="text-xs truncate mt-0.5" style={{color:T.muted}}>{replyTo.text}</p>
              </div>
              <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={()=>setReplyTo(null)}
                className="h-7 w-7 rounded-xl flex items-center justify-center border transition"
                style={{background:T.card,borderColor:T.border,color:T.muted}}><X className="h-3.5 w-3.5"/></motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── INPUT BAR ── */}
        <div className="px-4 py-3 shrink-0 border-t relative" style={{background:`${T.sidebar}ee`,borderColor:T.border,backdropFilter:"blur(20px)"}}>
          <AnimatePresence>
            {showEmoji && <EmojiPicker T={T} onPick={e=>{setInput(i=>i+e);inputRef.current?.focus();}} onClose={()=>setShowEmoji(false)}/>}
          </AnimatePresence>

          <div className="flex items-end gap-2 max-w-5xl mx-auto">
            {/* Attach */}
            <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={()=>imgRef.current?.click()}
              className="h-11 w-11 shrink-0 rounded-2xl flex items-center justify-center border transition"
              style={{background:T.card,borderColor:T.border,color:T.muted}}>
              <Paperclip className="h-5 w-5"/>
            </motion.button>
            <input ref={imgRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleMedia}/>

            {/* Input box */}
            <div className="flex-1 flex items-end rounded-2xl border overflow-hidden transition-all"
              style={{background:T.input,borderColor:T.border,boxShadow:`0 0 0 0 ${T.accent}`}}
              onFocus={e=>(e.currentTarget.style.boxShadow=`0 0 0 2px ${T.accent}44`)}
              onBlur={e=>(e.currentTarget.style.boxShadow=`0 0 0 0 ${T.accent}`)}>
              <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMsg();}}}
                placeholder={`${activeRoom.name} guruhiga yozing...`}
                className="flex-1 bg-transparent text-white text-sm outline-none px-4 py-3.5"
                style={{fontSize:prof.fontSize,fontFamily:"'DM Sans',sans-serif",color:T.text,"::placeholder":{color:T.muted}}}/>
              <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={()=>setShowEmoji(s=>!s)}
                className="px-3 self-center shrink-0 transition"
                style={{color:showEmoji?T.accent:T.muted}}>
                <Smile className="h-5 w-5"/>
              </motion.button>
            </div>

            {/* Send / Mic */}
            <AnimatePresence mode="wait">
              {input.trim() ? (
                <motion.button key="send" initial={{scale:0,rotate:-45}} animate={{scale:1,rotate:0}} exit={{scale:0,rotate:45}}
                  transition={{type:"spring",damping:15}} whileHover={{scale:1.1}} whileTap={{scale:0.9}}
                  onClick={()=>sendMsg()} disabled={sending}
                  className="h-11 w-11 shrink-0 rounded-2xl flex items-center justify-center shadow-xl transition"
                  style={{background:`linear-gradient(135deg,${T.accent},${T.accent}aa)`,boxShadow:`0 8px 24px ${T.accent}55`}}>
                  <Send className="h-5 w-5 text-white" style={{transform:"translateX(1px)"}}/>
                </motion.button>
              ) : (
                <motion.button key="mic" initial={{scale:0}} animate={{scale:1}} exit={{scale:0}}
                  transition={{type:"spring",damping:15}} whileHover={{scale:1.1}} whileTap={{scale:0.9}}
                  onClick={()=>{ setRecording(r=>!r); if(recording) sendMsg("🎤 Ovozli xabar","sticker"); }}
                  className="h-11 w-11 shrink-0 rounded-2xl flex items-center justify-center shadow-xl transition-all"
                  style={recording
                    ?{background:"linear-gradient(135deg,#ef4444,#dc2626)",boxShadow:"0 8px 24px rgba(239,68,68,0.5)"}
                    :{background:T.card,borderColor:T.border,border:`1px solid ${T.border}`,color:T.muted}}>
                  {recording
                    ?<motion.div animate={{scale:[1,1.2,1]}} transition={{repeat:Infinity,duration:0.8}}><MicOff className="h-5 w-5 text-white"/></motion.div>
                    :<Mic className="h-5 w-5"/>}
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className={`h-1.5 w-1.5 rounded-full ${online?"bg-green-400 animate-pulse":"bg-slate-500"}`}/>
            <p className="text-[11px]" style={{color:T.muted}}>
              <span style={{color:prof.color,fontWeight:600}}>@{prof.nick}</span> · Firebase 🔥 real-time · {online?"Ulangan":"Uzilgan"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
