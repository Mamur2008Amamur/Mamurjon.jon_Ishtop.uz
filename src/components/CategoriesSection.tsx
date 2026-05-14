<<<<<<< HEAD
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, X, Star, MapPin, CheckCircle, Clock, Users, ArrowRight, Shield, Phone, MessageSquare, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const categories = [
  { image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=85&fit=crop&crop=center", label:"Santexnik",        count:524,  color:"from-blue-600 to-cyan-500",    accent:"#3b82f6", emoji:"🔧", hot:true,
    avgPrice:"50 000 – 200 000 so'm", time:"30 daqiqa", desc:"Quvur, kran, vannaxona, kanalizatsiya va issiqlik tizimlarini ta'mirlash va o'rnatish.",
    skills:["Kran ta'miri","Quvur o'rnatish","Issiqlik tizimi","Vannaxona ta'miri","Kanalizatsiya"],
    topSpecialist:{name:"Abdulloh K.",rating:5.0,orders:1240,img:"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&q=80&fit=crop&crop=faces"} },
  { image:"https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=85&fit=crop&crop=center", label:"Elektrik",         count:389,  color:"from-yellow-500 to-orange-500", accent:"#f59e0b", emoji:"⚡", hot:true,
    avgPrice:"40 000 – 150 000 so'm", time:"20 daqiqa", desc:"Elektr o'rnatish, ta'mirlash, rozitka, kabel tortish, schyotchik almashtirish.",
    skills:["Rozitka o'rnatish","Kabel tortish","Schyotchik","Yorug'lik","Panel ta'miri"],
    topSpecialist:{name:"Sherzod M.",rating:4.9,orders:890,img:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80&fit=crop&crop=faces"} },
  { image:"https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=85&fit=crop&crop=center", label:"Ta'mirchi",        count:612,  color:"from-purple-600 to-indigo-500", accent:"#8b5cf6", emoji:"🔨", hot:false,
    avgPrice:"100 000 – 500 000 so'm",time:"1 soat",    desc:"Kvartira, uy va ofislarni ta'mirlash. Har qanday hajm va murakkablikdagi ishlar.",
    skills:["Devor ishi","Pollar","Shiplar","Eshik/darchalar","Plitka yotqizish"],
    topSpecialist:{name:"Jasur T.",rating:4.8,orders:640,img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&fit=crop&crop=faces"} },
  { image:"https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&q=85&fit=crop&crop=center", label:"Konditsioner",    count:198,  color:"from-teal-500 to-emerald-500",  accent:"#14b8a6", emoji:"❄️", hot:false,
    avgPrice:"80 000 – 250 000 so'm", time:"45 daqiqa", desc:"Konditsioner o'rnatish, xizmat ko'rsatish, ta'mirlash va tozalash.",
    skills:["O'rnatish","Tozalash","Ta'mirlash","Gaz qo'shish","Diagnostika"],
    topSpecialist:{name:"Bobur X.",rating:4.9,orders:520,img:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80&fit=crop&crop=faces"} },
  { image:"https://images.unsplash.com/photo-1527515637462-cff94abb904d?w=600&q=85&fit=crop&crop=center", label:"Tozalovchi",      count:476,  color:"from-green-500 to-lime-500",    accent:"#22c55e", emoji:"🧹", hot:true,
    avgPrice:"80 000 – 300 000 so'm", time:"1-4 soat",  desc:"Kvartira, uy, ofis va yuk mashinalarini chuqur tozalash. Ekologik toza vositalar.",
    skills:["Chuqur tozalash","Oynalar","Gilam","Ofis","Yangi bino"],
    topSpecialist:{name:"Nilufar X.",rating:5.0,orders:2100,img:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80&fit=crop&crop=faces"} },
  { image:"https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=85&fit=crop&crop=center", label:"IT xizmatlar",    count:310,  color:"from-violet-600 to-purple-500",  accent:"#7c3aed", emoji:"💻", hot:false,
    avgPrice:"50 000 – 200 000 so'm", time:"30 daqiqa", desc:"Sayt yaratish, bot, dasturlash, kompyuter ta'miri va sozlash, tarmoq.",
    skills:["Sayt yaratish","Dasturlash","Kompyuter ta'miri","Tarmoq","1C"],
    topSpecialist:{name:"Kamol A.",rating:4.8,orders:380,img:"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&q=80&fit=crop&crop=faces"} },
  { image:"https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&q=85&fit=crop&crop=center", label:"Yetkazib berish", count:254,  color:"from-amber-500 to-yellow-500",  accent:"#f59e0b", emoji:"🚚", hot:false,
    avgPrice:"20 000 – 100 000 so'm", time:"15 daqiqa", desc:"Shahar ichida va shaharlar orasida yuk va xarid yetkazish.",
    skills:["Shahar ichida","Yuk tashish","Ko'chish","Xarid yetkazish","Mebel"],
    topSpecialist:{name:"Sardor B.",rating:4.7,orders:720,img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&fit=crop&crop=faces"} },
  { image:"https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=85&fit=crop&crop=center", label:"O'qituvchi",      count:720,  color:"from-sky-500 to-blue-600",      accent:"#0ea5e9", emoji:"📚", hot:true,
    avgPrice:"50 000 – 150 000 so'm", time:"1 soat",    desc:"Maktab va talabalar uchun dars, repetitor. Matematika, fizika, ingliz va boshqa fanlar.",
    skills:["Matematika","Fizika","Ingliz tili","Kimyo","Tarix"],
    topSpecialist:{name:"Malika R.",rating:5.0,orders:480,img:"https://images.unsplash.com/photo-1494790108755-2616b612b7fd?w=80&q=80&fit=crop&crop=faces"} },
  { image:"https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&q=85&fit=crop&crop=center", label:"Fotograf",        count:195,  color:"from-fuchsia-600 to-pink-500",  accent:"#d946ef", emoji:"📷", hot:false,
    avgPrice:"100 000 – 500 000 so'm",time:"2-6 soat",  desc:"To'y, tug'ilgan kun, korporativ va portret foto/video olish.",
    skills:["To'y surati","Portret","Reklama","Dron","Video"],
    topSpecialist:{name:"Zafar K.",rating:4.9,orders:290,img:"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&q=80&fit=crop&crop=faces"} },
  { image:"https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=600&q=85&fit=crop&crop=center", label:"Avtomaster",      count:367,  color:"from-red-600 to-orange-500",    accent:"#ef4444", emoji:"🚗", hot:false,
    avgPrice:"80 000 – 300 000 so'm", time:"1-3 soat",  desc:"Har qanday avto ta'miri, diagnostika, qo'shimcha jihozlar o'rnatish.",
    skills:["Diagnostika","Motor","Akkumlyator","Shinalar","Konditsioner"],
    topSpecialist:{name:"Ulmas T.",rating:4.8,orders:560,img:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80&fit=crop&crop=faces"} },
  { image:"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=85&fit=crop&crop=center", label:"Oshpaz",           count:143,  color:"from-orange-500 to-red-500",    accent:"#f97316", emoji:"👨‍🍳",hot:false,
    avgPrice:"100 000 – 400 000 so'm",time:"2-8 soat",  desc:"Milliy va xalqaro taomlar, to'y va tadbirlarga oshpazlik xizmati.",
    skills:["Milliy taomlar","Sho'rva","Kabob","Plov","Desert"],
    topSpecialist:{name:"Hamid O.",rating:4.9,orders:340,img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&fit=crop&crop=faces"} },
  { image:"https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=85&fit=crop&crop=center", label:"Go'zallik",        count:289,  color:"from-pink-500 to-rose-500",     accent:"#ec4899", emoji:"💅", hot:true,
    avgPrice:"50 000 – 200 000 so'm", time:"1-3 soat",  desc:"Soch, manikur, pedikur, makiyaj, kosmetik muolajalar va boshqalar.",
    skills:["Soch turmak","Manikur","Pedikur","Makiyaj","Kosmetik"],
    topSpecialist:{name:"Dilnoza A.",rating:5.0,orders:680,img:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80&fit=crop&crop=faces"} },
];

interface CategoryModalProps {
  cat: typeof categories[0];
  onClose: () => void;
}

const CategoryModal = ({ cat, onClose }: CategoryModalProps) => {
  const navigate = useNavigate();
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{background:"rgba(0,0,0,0.75)",backdropFilter:"blur(8px)"}}
      onClick={onClose}>
      <motion.div initial={{opacity:0,y:60,scale:0.96}} animate={{opacity:1,y:0,scale:1}}
        exit={{opacity:0,y:60,scale:0.96}} transition={{type:"spring",damping:24,stiffness:300}}
        onClick={e=>e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-t-3xl sm:rounded-3xl bg-background border shadow-2xl"
        style={{maxHeight:"90vh",overflowY:"auto"}}>

        {/* Hero image */}
        <div className="relative h-48 overflow-hidden">
          <img src={cat.image} alt={cat.label} className="w-full h-full object-cover"/>
          <div className="absolute inset-0" style={{background:`linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.8) 100%)`}}/>
          <button onClick={onClose}
            className="absolute top-4 right-4 h-9 w-9 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white hover:bg-black/70 transition">
            <X className="h-4 w-4"/>
          </button>
          <div className="absolute bottom-4 left-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-3xl">{cat.emoji}</span>
              <h2 className="text-2xl font-bold text-white" style={{fontFamily:"'Sora',sans-serif"}}>{cat.label}</h2>
              {cat.hot && <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><TrendingUp className="h-3 w-3"/>Top</span>}
            </div>
            <p className="text-white/70 text-sm">{cat.count.toLocaleString()} mutaxassis mavjud</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">

          {/* Quick info */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {icon:Clock, label:"Javob vaqti", val:cat.time, color:"text-blue-500", bg:"bg-blue-500/10"},
              {icon:Users, label:"Mutaxassislar", val:`${cat.count}+`, color:"text-purple-500", bg:"bg-purple-500/10"},
              {icon:Shield,label:"Kafolat", val:"100%", color:"text-green-500", bg:"bg-green-500/10"},
            ].map(item=>(
              <div key={item.label} className="rounded-2xl border bg-card p-3 text-center">
                <div className={`h-8 w-8 rounded-xl ${item.bg} flex items-center justify-center mx-auto mb-2`}>
                  <item.icon className={`h-4 w-4 ${item.color}`}/>
                </div>
                <p className="text-sm font-bold text-foreground">{item.val}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-bold text-foreground mb-2 text-sm uppercase tracking-wider text-muted-foreground">Xizmat haqida</h3>
            <p className="text-sm text-foreground leading-relaxed">{cat.desc}</p>
          </div>

          {/* Price */}
          <div className="rounded-2xl border p-4" style={{background:`${cat.accent}08`,borderColor:`${cat.accent}25`}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">O'rtacha narx</p>
                <p className="text-lg font-bold mt-0.5" style={{color:cat.accent}}>{cat.avgPrice}</p>
              </div>
              <div className="text-3xl">{cat.emoji}</div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="font-bold text-foreground mb-3 text-sm uppercase tracking-wider text-muted-foreground">Qanday ishlarni qiladi</h3>
            <div className="flex flex-wrap gap-2">
              {cat.skills.map(s=>(
                <span key={s} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border"
                  style={{background:`${cat.accent}10`,borderColor:`${cat.accent}30`,color:cat.accent}}>
                  <CheckCircle className="h-3 w-3"/> {s}
                </span>
              ))}
            </div>
          </div>

          {/* Top specialist */}
          <div>
            <h3 className="font-bold text-foreground mb-3 text-sm uppercase tracking-wider text-muted-foreground">Top mutaxassis</h3>
            <div className="flex items-center gap-3 rounded-2xl border bg-card p-3">
              <img src={cat.topSpecialist.img} alt={cat.topSpecialist.name}
                className="h-12 w-12 rounded-xl object-cover"
                onError={e=>{(e.target as HTMLImageElement).src=`https://placehold.co/48x48/6366f1/white?text=${cat.topSpecialist.name[0]}`;}}/>
              <div className="flex-1">
                <p className="font-bold text-foreground text-sm">{cat.topSpecialist.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400"/>
                    <span className="text-xs font-bold text-foreground">{cat.topSpecialist.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">{cat.topSpecialist.orders.toLocaleString()} buyurtma</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-green-500"/>
                <span className="text-xs text-green-600 font-medium">Online</span>
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}}
              onClick={()=>{onClose();document.getElementById("mutaxassislar")?.scrollIntoView({behavior:"smooth"});}}
              className="flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white shadow-lg"
              style={{background:`linear-gradient(135deg,${cat.accent},${cat.accent}cc)`,boxShadow:`0 8px 20px ${cat.accent}40`}}>
              <Users className="h-4 w-4"/> Ustalarni ko'rish
            </motion.button>
            <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}}
              onClick={()=>{onClose();document.getElementById("xarita")?.scrollIntoView({behavior:"smooth"});}}
              className="flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold border"
              style={{borderColor:`${cat.accent}40`,color:cat.accent}}>
              <MapPin className="h-4 w-4"/> Xaritada toping
            </motion.button>
          </div>

          <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}}
            onClick={()=>{onClose();navigate("/chat");}}
            className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold border border-border bg-secondary hover:bg-secondary/80 transition">
            <MessageSquare className="h-4 w-4 text-primary"/> Chat orqali so'rang
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

interface Props { embedded?: boolean; }

const CategoriesSection = ({ embedded }: Props) => {
  const [selected, setSelected] = useState<typeof categories[0]|null>(null);

  return (
    <>
      <section id="xizmatlar" className={embedded ? "p-6 md:p-10" : "py-20 md:py-28"}>
        <div className={embedded ? "" : "container mx-auto"}>
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-12">
            <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">Xizmatlar</span>
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Eng mashhur <span className="text-gradient">yo'nalishlar</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              O'zingizga kerakli sohani tanlang — biz sizga eng yaxshi mutaxassisni topamiz
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {categories.map((cat,i)=>(
              <motion.button key={cat.label}
                initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}}
                viewport={{once:true}} transition={{delay:i*0.04}}
                whileHover={{y:-8,scale:1.04}} whileTap={{scale:0.97}}
                onClick={()=>setSelected(cat)}
                className="group relative flex flex-col items-center overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:shadow-xl hover:border-primary/30 cursor-pointer text-left">
                {cat.hot && (
                  <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white shadow">
                    <TrendingUp className="h-2.5 w-2.5"/> Top
                  </div>
                )}
                <div className="relative h-28 w-full overflow-hidden">
                  <img src={cat.image} alt={cat.label} loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={e=>{(e.target as HTMLImageElement).src=`https://placehold.co/300x200/6366f1/white?text=${encodeURIComponent(cat.emoji)}`;}}/>
                  <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-0 transition-all duration-300 group-hover:opacity-50`}/>
                  <div className="absolute inset-0 bg-gradient-to-t from-card/70 via-transparent to-transparent"/>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                      <ChevronRight className="h-5 w-5 text-white"/>
                    </div>
                  </div>
                </div>
                <div className="flex w-full flex-col items-center gap-0.5 px-2 py-3">
                  <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-tight text-center">{cat.label}</span>
                  <span className="text-xs text-muted-foreground">{cat.count.toLocaleString()} mutaxassis</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Category detail modal */}
      <AnimatePresence>
        {selected && <CategoryModal cat={selected} onClose={()=>setSelected(null)}/>}
      </AnimatePresence>
    </>
=======
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, TrendingUp } from "lucide-react";

const categories = [
  { image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=85&fit=crop&crop=center", label: "Santexnik",        count: 524, color: "from-blue-600 to-cyan-500",    emoji: "🔧", hot: true  },
  { image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=85&fit=crop&crop=center", label: "Elektrik",         count: 389, color: "from-yellow-500 to-orange-500", emoji: "⚡", hot: true  },
  { image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=85&fit=crop&crop=center", label: "Ta'mirchi",        count: 612, color: "from-purple-600 to-indigo-500", emoji: "🔨", hot: false },
  { image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&q=85&fit=crop&crop=center", label: "Konditsioner",    count: 198, color: "from-teal-500 to-emerald-500",  emoji: "❄️", hot: false },
  { image: "https://images.unsplash.com/photo-1527515637462-cff94abb904d?w=600&q=85&fit=crop&crop=center", label: "Tozalovchi",      count: 476, color: "from-green-500 to-lime-500",    emoji: "🧹", hot: true  },
  { image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=85&fit=crop&crop=center", label: "IT xizmatlar",    count: 310, color: "from-violet-600 to-purple-500",  emoji: "💻", hot: false },
  { image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&q=85&fit=crop&crop=center", label: "Yetkazib berish", count: 254, color: "from-amber-500 to-yellow-500",  emoji: "🚚", hot: false },
  { image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=85&fit=crop&crop=center", label: "O'qituvchi",      count: 720, color: "from-sky-500 to-blue-600",      emoji: "📚", hot: true  },
  { image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&q=85&fit=crop&crop=center", label: "Fotograf",        count: 195, color: "from-fuchsia-600 to-pink-500",  emoji: "📷", hot: false },
  { image: "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=600&q=85&fit=crop&crop=center", label: "Avtomaster",      count: 367, color: "from-red-600 to-orange-500",    emoji: "🚗", hot: false },
  { image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=85&fit=crop&crop=center", label: "Oshpaz",           count: 143, color: "from-orange-500 to-red-500",     emoji: "👨‍🍳", hot: false },
  { image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=85&fit=crop&crop=center", label: "Go'zallik",        count: 289, color: "from-pink-500 to-rose-500",      emoji: "💅", hot: true  },
];

interface Props { embedded?: boolean; }

const CategoriesSection = ({ embedded }: Props) => {
  const navigate = useNavigate();
  return (
    <section id="xizmatlar" className={embedded ? "p-6 md:p-10" : "py-20 md:py-28"}>
      <div className={embedded ? "" : "container mx-auto"}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">Xizmatlar</span>
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Eng mashhur <span className="text-gradient">yo'nalishlar</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            O'zingizga kerakli sohani tanlang — biz sizga eng yaxshi mutaxassisni topamiz
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((cat, i) => (
            <motion.button key={cat.label}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.04 }}
              whileHover={{ y: -8, scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/auth")}
              className="group relative flex flex-col items-center overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:shadow-xl hover:border-primary/30 cursor-pointer">
              {cat.hot && (
                <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white shadow">
                  <TrendingUp className="h-2.5 w-2.5" /> Top
                </div>
              )}
              <div className="relative h-28 w-full overflow-hidden">
                <img src={cat.image} alt={cat.label} loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-115"
                  onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/300x200/6366f1/white?text=${encodeURIComponent(cat.emoji)}`; }} />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-0 transition-all duration-300 group-hover:opacity-60`} />
                <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <ArrowRight className="h-7 w-7 text-white drop-shadow-lg" />
                </div>
              </div>
              <div className="flex w-full flex-col items-center gap-0.5 px-2 py-3">
                <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-tight text-center">{cat.label}</span>
                <span className="text-xs text-muted-foreground">{cat.count.toLocaleString()} mutaxassis</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
>>>>>>> 9e3f45b0ee34d0c9b3b0b17417f24ac9ba002cd8
  );
};

export default CategoriesSection;
