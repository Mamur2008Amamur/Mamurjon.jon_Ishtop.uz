import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  UserCheck, UserX, FolderOpen, TrendingUp, Eye, LogIn,
  BarChart3, Activity, Clock, Repeat, ArrowUpRight, ArrowDownRight,
  LineChart as LineChartIcon, Zap, Users, DollarSign, Target
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

/* ──────────── RING CHART ──────────── */
const Ring = ({ pct, color, size=100 }: { pct:number; color:string; size?:number }) => {
  const r = size * 0.38;
  const circ = 2 * Math.PI * r;
  const ref = useRef<SVGCircleElement>(null);
  const inView = useInView(ref as any, { once:true });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{transform:"rotate(-90deg)"}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={size*0.09}/>
      <circle ref={ref} cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
        strokeWidth={size*0.09} strokeLinecap="round"
        strokeDasharray={`${inView?(pct/100)*circ:0} ${circ}`}
        style={{transition:"stroke-dasharray 1.8s cubic-bezier(0.34,1.56,0.64,1)"}}/>
    </svg>
  );
};

/* ──────────── ANIMATED BAR ──────────── */
const Bar = ({ pct, color, height=8 }: { pct:number; color:string; height?:number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as any, { once:true });
  return (
    <div ref={ref} className="w-full overflow-hidden rounded-full" style={{height,background:"rgba(255,255,255,0.06)"}}>
      <div className="h-full rounded-full transition-all duration-[1400ms] ease-out"
        style={{width:inView?`${pct}%`:"0%",background:color}}/>
    </div>
  );
};

/* ──────────── LINE CHART (SVG trading style) ──────────── */
const TradingLineChart = ({ data, color, gradient, label }: {
  data: number[]; color: string; gradient: [string,string]; label: string;
}) => {
  const ref = useRef<SVGPathElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef as any, { once:true });
  const [pathLen, setPathLen] = useState(0);

  const W = 380, H = 110;
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v,i)=>[
    (i/(data.length-1))*W,
    H - ((v-min)/(max-min||1))*(H-20) - 10
  ] as [number,number]);

  // Smooth bezier
  const path = pts.reduce((acc,[x,y],i,arr)=>{
    if(i===0) return `M${x},${y}`;
    const [px,py]=arr[i-1];
    const cx=(px+x)/2;
    return `${acc} C${cx},${py} ${cx},${y} ${x},${y}`;
  },"");

  const area = `${path} L${W},${H} L0,${H} Z`;

  useEffect(()=>{
    if(ref.current) setPathLen(ref.current.getTotalLength());
  },[path]);

  return (
    <div ref={wrapRef} className="relative">
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{height:H,overflow:"visible"}}>
        <defs>
          <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={gradient[0]} stopOpacity="0.25"/>
            <stop offset="100%" stopColor={gradient[1]} stopOpacity="0.01"/>
          </linearGradient>
          <filter id="glow-line">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        {/* Area fill */}
        <path d={area} fill={`url(#grad-${label})`}/>
        {/* Line */}
        <path ref={ref} d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"
          filter="url(#glow-line)"
          strokeDasharray={pathLen}
          strokeDashoffset={inView ? 0 : pathLen}
          style={{transition:`stroke-dashoffset 2s cubic-bezier(0.4,0,0.2,1) ${0.2}s`}}/>
        {/* Current dot */}
        {pts.length > 0 && (
          <motion.circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="5" fill={color}
            initial={{scale:0}} animate={inView?{scale:1}:{}} transition={{delay:2.1,type:"spring"}}/>
        )}
        {/* Hover grid lines */}
        {[0,25,50,75,100].map(pct=>(
          <line key={pct} x1="0" y1={H*(1-pct/100)*0.9+5} x2={W} y2={H*(1-pct/100)*0.9+5}
            stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
        ))}
      </svg>
    </div>
  );
};

/* ──────────── MINI SPARKLINE ──────────── */
const Sparkline = ({ data, color }: { data:number[]; color:string }) => {
  const W=80, H=32;
  const min=Math.min(...data), max=Math.max(...data);
  const pts = data.map((v,i)=>[(i/(data.length-1))*W, H-((v-min)/(max-min||1))*H*0.8-4] as [number,number]);
  const path = pts.reduce((acc,[x,y],i,arr)=>{
    if(i===0) return `M${x},${y}`;
    const [px,py]=arr[i-1]; const cx=(px+x)/2;
    return `${acc} C${cx},${py} ${cx},${y} ${x},${y}`;
  },"");
  return (
    <svg width={W} height={H}>
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="3" fill={color}/>
    </svg>
  );
};

/* ──────────── LIVE DOT ──────────── */
const LiveDot = () => (
  <span className="relative flex h-2.5 w-2.5">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"/>
    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"/>
  </span>
);

/* ──────────── MONTH BAR CHART ──────────── */
const MonthBarChart = ({ data, color }: { data:{month:string;val:number}[]; color:string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as any, { once:true });
  const max = Math.max(...data.map(d=>d.val));
  return (
    <div ref={ref} className="flex items-end gap-1.5 h-24">
      {data.map((d,i)=>(
        <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full rounded-t-md overflow-hidden" style={{height:80}}>
            <div className="w-full rounded-t-md transition-all duration-[1200ms] ease-out"
              style={{
                height:inView?`${(d.val/max)*100}%`:"0%",
                background:`linear-gradient(to top, ${color}cc, ${color}66)`,
                marginTop:"auto",
                transitionDelay:`${i*0.06}s`,
              }}/>
          </div>
          <span className="text-[9px] text-center" style={{color:"rgba(255,255,255,0.3)"}}>{d.month}</span>
        </div>
      ))}
    </div>
  );
};

const AnalyticsSection = () => {
  const [data, setData] = useState({
    registered:12500, totalVisits:48200, activeProjects:245,
    completedProjects:48000, newToday:0, cancelledProjects:120,
  });
  const [tab, setTab] = useState<"traffic"|"projects"|"users"|"income">("traffic");

  useEffect(()=>{
    const fetch = async () => {
      const [{ count:profiles },{ data:reqs }] = await Promise.all([
        supabase.from("profiles").select("*",{count:"exact",head:true}),
        supabase.from("help_requests").select("status,created_at"),
      ]);
      const reqs_ = reqs||[];
      const today = new Date().toDateString();
      setData({
        registered:(profiles||0)+12500,
        totalVisits:(profiles||0)*4+48200,
        activeProjects:reqs_.filter(r=>r.status==="in_progress").length+245,
        completedProjects:reqs_.filter(r=>r.status==="done").length+48000,
        newToday:reqs_.filter(r=>new Date(r.created_at).toDateString()===today).length,
        cancelledProjects:reqs_.filter(r=>r.status==="cancelled").length+120,
      });
    };
    fetch();
  },[]);

  const notReg = Math.round(data.totalVisits*0.62);
  const regPct = data.totalVisits?Math.round((data.registered/data.totalVisits)*100):38;
  const compPct = 91;

  // Trading chart data
  const visitData   = [820,950,880,1120,1050,1380,1250,1620,1480,1850,1720,2100];
  const orderData   = [120,145,132,188,175,210,195,242,228,270,255,312];
  const incomeData  = [3.2,3.8,3.5,4.6,4.2,5.1,4.8,5.8,5.5,6.4,6.1,7.4];
  const userGrowth  = [480,530,510,620,595,740,710,850,820,960,930,1080];

  const monthData = [
    {month:"Yan",val:820},{month:"Fev",val:950},{month:"Mar",val:1120},
    {month:"Apr",val:1050},{month:"May",val:1380},{month:"Iyn",val:1620},
    {month:"Iyl",val:1480},{month:"Avg",val:1850},{month:"Sen",val:1720},
    {month:"Okt",val:2100},{month:"Noy",val:1980},{month:"Dek",val:2350},
  ];

  const TABS = [
    {id:"traffic" as const,  label:"Trafik",       icon:Eye},
    {id:"projects" as const, label:"Loyihalar",     icon:FolderOpen},
    {id:"users" as const,    label:"Foydalanuvchilar",icon:Users},
    {id:"income" as const,   label:"Daromad",       icon:DollarSign},
  ];

  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef as any, {once:true});

  return (
    <section className="py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* ── Header ── */}
        <motion.div ref={headerRef}
          initial={{opacity:0,y:20}} animate={headerInView?{opacity:1,y:0}:{}} transition={{duration:0.6}}
          className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-5 py-2 text-sm font-semibold text-primary mb-4">
            <Activity className="h-4 w-4"/> <LiveDot/> Real vaqtda tahlil
          </div>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">Platforma integratsiya ko'rsatkichlari</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Qancha foydalanuvchi kirgan, qancha kirmagan va loyihalardagi faollik
          </p>
        </motion.div>

        {/* ── Top KPI cards ── */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          {[
            {icon:LogIn,   label:"Ro'yxatdan o'tganlar", value:data.registered.toLocaleString(), change:"+8.4%",up:true,  color:"#6366f1", pct:regPct,       spark:userGrowth},
            {icon:UserX,   label:"Ro'yxatsiz tashriflar", value:notReg.toLocaleString(),         change:"-3.2%",up:false, color:"#ef4444", pct:100-regPct,   spark:[...userGrowth].reverse()},
            {icon:FolderOpen,label:"Faol loyihalar",       value:data.activeProjects.toLocaleString(),change:"+12.1%",up:true,color:"#10b981",pct:compPct,    spark:orderData},
            {icon:Target,  label:"Bugun yangi",           value:data.newToday.toLocaleString(),  change:"+5.7%", up:true, color:"#f59e0b", pct:75,            spark:visitData.slice(-6)},
          ].map((c,i)=>(
            <motion.div key={c.label}
              initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}}
              className="group rounded-2xl border bg-card p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all overflow-hidden relative">
              <div className="absolute -top-8 -right-8 h-28 w-28 rounded-full blur-2xl opacity-15 group-hover:opacity-35 transition-opacity"
                style={{background:c.color}}/>
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{background:`${c.color}18`}}>
                  <c.icon className="h-5 w-5" style={{color:c.color}}/>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`flex items-center gap-0.5 text-xs font-bold ${c.up?"text-emerald-500":"text-red-500"}`}>
                    {c.up?<ArrowUpRight className="h-3 w-3"/>:<ArrowDownRight className="h-3 w-3"/>}{c.change}
                  </span>
                  <Sparkline data={c.spark} color={c.color}/>
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{c.value}</p>
              <p className="text-xs font-semibold text-muted-foreground mt-0.5 mb-3">{c.label}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1"><Bar pct={c.pct} color={c.color} height={6}/></div>
                <span className="text-xs font-bold" style={{color:c.color}}>{c.pct}%</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Main chart panel ── */}
        <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
          className="rounded-3xl border bg-card shadow-sm overflow-hidden mb-6">

          {/* Tab bar */}
          <div className="flex items-center gap-1 border-b p-4 overflow-x-auto">
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all ${tab===t.id?"bg-primary text-primary-foreground shadow":"text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
                <t.icon className="h-4 w-4"/> {t.label}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
              <LiveDot/> Jonli
            </div>
          </div>

          <AnimatePresence mode="wait">

            {/* TRAFFIC */}
            {tab==="traffic" && (
              <motion.div key="traffic" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-foreground text-lg">Sayt trafigi</h3>
                    <p className="text-sm text-muted-foreground">Oylik tashriflar dinamikasi</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">2 350</p>
                    <p className="text-xs text-emerald-500 flex items-center gap-1 justify-end">
                      <ArrowUpRight className="h-3 w-3"/> +18.7% o'tgan oyga
                    </p>
                  </div>
                </div>
                <TradingLineChart data={visitData} color="#6366f1" gradient={["#6366f1","#6366f100"]} label="traffic"/>
                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                  {[
                    {label:"Organik",pct:44,color:"#6366f1"},
                    {label:"To'g'ridan",pct:28,color:"#10b981"},
                    {label:"Ijtimoiy",pct:18,color:"#f59e0b"},
                    {label:"Havolalar",pct:10,color:"#ec4899"},
                  ].map(r=>(
                    <div key={r.label} className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{r.label}</span>
                        <span className="font-bold text-foreground">{r.pct}%</span>
                      </div>
                      <Bar pct={r.pct} color={r.color} height={6}/>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* PROJECTS */}
            {tab==="projects" && (
              <motion.div key="projects" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-foreground text-lg">Buyurtmalar oqimi</h3>
                    <p className="text-sm text-muted-foreground">Oylik buyurtmalar va holatlari</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">312</p>
                    <p className="text-xs text-emerald-500 flex items-center gap-1 justify-end">
                      <ArrowUpRight className="h-3 w-3"/> +22.4% o'tgan oyga
                    </p>
                  </div>
                </div>
                <TradingLineChart data={orderData} color="#10b981" gradient={["#10b981","#10b98100"]} label="projects"/>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {[
                    {label:"Bajarilgan",   value:data.completedProjects, color:"#10b981", pct:compPct},
                    {label:"Jarayonda",    value:data.activeProjects,    color:"#6366f1", pct:6},
                    {label:"Bekor",        value:data.cancelledProjects, color:"#ef4444", pct:3},
                    {label:"Bugun yangi",  value:data.newToday,          color:"#f59e0b", pct:1},
                  ].map(r=>(
                    <div key={r.label} className="flex items-center gap-3">
                      <div className="h-9 w-9 shrink-0 rounded-xl flex items-center justify-center text-xs font-bold"
                        style={{background:`${r.color}18`,color:r.color}}>
                        {r.value>999?`${(r.value/1000).toFixed(0)}K`:r.value}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{r.label}</span>
                          <span className="font-bold" style={{color:r.color}}>{r.pct}%</span>
                        </div>
                        <Bar pct={r.pct} color={r.color} height={5}/>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* USERS */}
            {tab==="users" && (
              <motion.div key="users" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-foreground text-lg">Foydalanuvchilar o'sishi</h3>
                    <p className="text-sm text-muted-foreground">Yangi va faol foydalanuvchilar</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">1 080</p>
                    <p className="text-xs text-emerald-500 flex items-center gap-1 justify-end">
                      <ArrowUpRight className="h-3 w-3"/> +16.1% o'tgan oyga
                    </p>
                  </div>
                </div>
                <TradingLineChart data={userGrowth} color="#8b5cf6" gradient={["#8b5cf6","#8b5cf600"]} label="users"/>
                <div className="mt-6 grid grid-cols-3 gap-4">
                  {[
                    {icon:UserCheck, label:"Faol",         value:Math.round(data.registered*0.72).toLocaleString(), color:"#6366f1", pct:72},
                    {icon:Repeat,    label:"Qaytib kelgan", value:Math.round(data.registered*0.54).toLocaleString(), color:"#10b981", pct:54},
                    {icon:Clock,     label:"Sessiya",       value:"8 min",                                            color:"#f59e0b", pct:68,isText:true},
                  ].map((c,i)=>(
                    <div key={c.label} className="rounded-2xl border bg-background p-4 space-y-3">
                      <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{background:`${c.color}18`}}>
                        <c.icon className="h-4 w-4" style={{color:c.color}}/>
                      </div>
                      <p className="text-xl font-bold text-foreground">{c.value}</p>
                      <p className="text-xs text-muted-foreground">{c.label}</p>
                      <Bar pct={c.pct} color={c.color} height={5}/>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* INCOME */}
            {tab==="income" && (
              <motion.div key="income" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-foreground text-lg">Daromad dinamikasi</h3>
                    <p className="text-sm text-muted-foreground">Oylik daromad (mln so'm)</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">7.4M</p>
                    <p className="text-xs text-emerald-500 flex items-center gap-1 justify-end">
                      <ArrowUpRight className="h-3 w-3"/> +21.3% o'tgan oyga
                    </p>
                  </div>
                </div>
                <TradingLineChart data={incomeData} color="#f59e0b" gradient={["#f59e0b","#f59e0b00"]} label="income"/>
                <div className="mt-6 grid grid-cols-3 gap-4">
                  {[
                    {label:"Jami daromad",    value:"23.5M",  color:"#10b981"},
                    {label:"Bu oy",           value:"7.4M",   color:"#6366f1"},
                    {label:"Komissiya (10%)", value:"2.35M",  color:"#f59e0b"},
                  ].map(s=>(
                    <div key={s.label} className="rounded-2xl border bg-background p-4 text-center">
                      <p className="text-xl font-bold mt-1" style={{color:s.color}}>{s.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>

        {/* ── Monthly bar chart ── */}
        <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:0.1}}
          className="rounded-3xl border bg-card shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary"/> Oylik tashriflar (2025)
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">Har oyda necha kishi tashrif buyurgan</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Jami</p>
              <p className="text-2xl font-bold text-foreground">
                {monthData.reduce((a,d)=>a+d.val,0).toLocaleString()}
              </p>
            </div>
          </div>
          <MonthBarChart data={monthData} color="#6366f1"/>
        </motion.div>

        {/* ── Donut + breakdown grid ── */}
        <div className="grid gap-6 md:grid-cols-2">

          {/* Donut */}
          <motion.div initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true}}
            className="rounded-3xl border bg-card shadow-sm p-6">
            <h3 className="font-bold text-foreground text-lg mb-6 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary"/> Trafik taqsimoti
            </h3>
            <div className="flex items-center gap-6">
              <div className="relative shrink-0">
                <Ring pct={regPct} color="#6366f1" size={140}/>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-3xl font-bold text-foreground">{regPct}%</p>
                  <p className="text-xs text-muted-foreground">Kirishdi</p>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                {[
                  {label:"Ro'yxatdan o'tgan", pct:regPct,      color:"#6366f1"},
                  {label:"Mehmon tashrif",    pct:100-regPct,  color:"rgba(255,255,255,0.1)"},
                  {label:"Bajarilgan ishlar", pct:compPct,     color:"#10b981"},
                  {label:"Mamnun mijozlar",   pct:98,          color:"#f59e0b"},
                ].map(r=>(
                  <div key={r.label} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full" style={{background:r.color}}/>
                        {r.label}
                      </span>
                      <span className="font-bold text-foreground">{r.pct}%</span>
                    </div>
                    <Bar pct={r.pct} color={r.color} height={5}/>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right stats */}
          <motion.div initial={{opacity:0,x:20}} whileInView={{opacity:1,x:0}} viewport={{once:true}}
            className="rounded-3xl border bg-card shadow-sm p-6">
            <h3 className="font-bold text-foreground text-lg mb-6 flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary"/> Tezkor ko'rsatkichlar
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                {icon:Users,    label:"Jami foydalanuvchilar", value:data.registered.toLocaleString()+"+", color:"#6366f1"},
                {icon:FolderOpen,label:"Faol loyihalar",       value:data.activeProjects+"",              color:"#10b981"},
                {icon:UserCheck,label:"Tasdiqlangan ustalar",  value:"3 240+",                            color:"#f59e0b"},
                {icon:TrendingUp,label:"Bu hafta o'sish",      value:"+18.7%",                            color:"#ec4899"},
                {icon:Clock,    label:"O'rt. javob",           value:"5 min",                             color:"#8b5cf6"},
                {icon:Eye,      label:"Bugungi tashriflar",    value:Math.round(data.totalVisits/365)+"", color:"#06b6d4"},
              ].map((s,i)=>(
                <motion.div key={s.label} initial={{opacity:0,scale:0.9}} whileInView={{opacity:1,scale:1}}
                  viewport={{once:true}} transition={{delay:i*0.08}}
                  className="rounded-2xl border bg-background p-3 space-y-2">
                  <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{background:`${s.color}15`}}>
                    <s.icon className="h-4 w-4" style={{color:s.color}}/>
                  </div>
                  <p className="text-lg font-bold text-foreground">{s.value}</p>
                  <p className="text-[11px] text-muted-foreground leading-tight">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsSection;
