<<<<<<< HEAD
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, CheckCircle, Star, TrendingUp, Briefcase, MessageCircle, Shield, Zap, Clock, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

function useCountUp(target: number, duration = 2200, start = false) {
  const [count, setCount] = useState(0);
  useEffect(()=>{
    if(!start) return;
    let t0: number|null = null;
    const step = (ts: number) => {
      if(!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(e * target));
      if(p < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

const StatCard = ({ icon:Icon, label, value, suffix="", color, bg, delay, desc }: {
  icon:any; label:string; value:number; suffix?:string; color:string; bg:string; delay:number; desc?:string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once:true, margin:"-50px" });
  const count = useCountUp(value, 2200, inView);

  return (
    <motion.div ref={ref}
      initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}}
      transition={{duration:0.6,delay}}
      className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-default">
      <div className={`absolute -top-8 -right-8 h-28 w-28 rounded-full ${bg} blur-3xl opacity-40 group-hover:opacity-80 transition-opacity duration-500`}/>
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${bg} group-hover:scale-110 transition-transform`}>
        <Icon className={`h-6 w-6 ${color}`}/>
      </div>
      <p className="text-3xl font-bold text-foreground tabular-nums">
        {suffix==="/5 ★" ? (count/10).toFixed(1) : count.toLocaleString()}{suffix!=="/5 ★"?suffix:""}
        {suffix==="/5 ★" && <span className="text-amber-400 ml-1">★</span>}
      </p>
      <p className="mt-1 text-sm font-semibold text-foreground">{label}</p>
      {desc && <p className="mt-1 text-xs text-muted-foreground">{desc}</p>}
    </motion.div>
  );
};

const StatsSection = () => {
  const [live, setLive] = useState({ users:0, requests:0, messages:0 });

  useEffect(()=>{
    Promise.all([
      supabase.from("profiles").select("*",{count:"exact",head:true}),
      supabase.from("help_requests").select("*",{count:"exact",head:true}),
      supabase.from("contact_messages").select("*",{count:"exact",head:true}),
    ]).then(([{count:p},{count:r},{count:m}])=>{
      setLive({ users:(p||0)+12500, requests:r||0, messages:m||0 });
    });
  },[]);

  const cards = [
    { icon:Users,         label:"Ro'yxatdan o'tgan",   value:live.users,    suffix:"+",     desc:"Faol foydalanuvchilar",      color:"text-primary",      bg:"bg-primary/10",      delay:0 },
    { icon:CheckCircle,   label:"Bajarilgan ishlar",    value:48200,          suffix:"+",     desc:"Muvaffaqiyatli buyurtmalar",  color:"text-emerald-500",  bg:"bg-emerald-500/10",  delay:0.08 },
    { icon:Star,          label:"O'rtacha reyting",     value:49,             suffix:"/5 ★",  desc:"Mijozlar bahosi",            color:"text-amber-500",    bg:"bg-amber-500/10",    delay:0.16 },
    { icon:TrendingUp,    label:"Mijozlar mamnun",      value:98,             suffix:"%",     desc:"Qaytib keluvchilar",         color:"text-blue-500",     bg:"bg-blue-500/10",     delay:0.24 },
    { icon:Briefcase,     label:"Faol so'rovlar",       value:live.requests,  suffix:"",      desc:"Hozirda jarayonda",          color:"text-violet-500",   bg:"bg-violet-500/10",   delay:0.32 },
    { icon:MessageCircle, label:"Aloqa xabarlari",      value:live.messages,  suffix:"",      desc:"Qabul qilingan",             color:"text-rose-500",     bg:"bg-rose-500/10",     delay:0.40 },
    { icon:Shield,        label:"Tasdiqlangan ustalar", value:3240,           suffix:"+",     desc:"ID tekshirilgan",            color:"text-teal-500",     bg:"bg-teal-500/10",     delay:0.48 },
    { icon:Clock,         label:"O'rtacha javob",       value:5,              suffix:" min",  desc:"Birinchi javob vaqti",       color:"text-orange-500",   bg:"bg-orange-500/10",   delay:0.56 },
  ];

  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, {once:true});

  return (
    <section className="py-20 relative overflow-hidden">
      {/* BG decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary/5 blur-3xl"/>
        <div className="absolute right-1/4 top-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-accent/5 blur-3xl"/>
      </div>

      <div className="container mx-auto px-4">
        <motion.div ref={headerRef}
          initial={{opacity:0,y:20}} animate={headerInView?{opacity:1,y:0}:{}}
          transition={{duration:0.6}} className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-5 py-2 text-sm font-semibold text-primary mb-4">
            <TrendingUp className="h-4 w-4"/>
            Platforma statistikasi
            <span className="flex items-center gap-1 text-emerald-500 font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"/>
              Jonli
            </span>
          </div>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">Raqamlar bizni tavsiflab beradi</h2>
          <p className="mt-3 text-muted-foreground">Real vaqtda Supabase dan yangilanib turadigan ma'lumotlar</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {cards.map(c=><StatCard key={c.label} {...c}/>)}
        </div>
      </div>
    </section>
  );
};

=======
const StatsSection = () => null;
>>>>>>> 9e3f45b0ee34d0c9b3b0b17417f24ac9ba002cd8
export default StatsSection;
