import { Button } from "@/components/ui/button";
import { Search, ArrowRight, Sparkles, MapPin, Users, Star, CheckCircle, Zap, Shield, TrendingUp, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const quickTags = [
  { label: "Santexnik", icon: "🔧" },
  { label: "Elektrik",  icon: "⚡" },
  { label: "Tozalovchi",icon: "🧹" },
  { label: "IT xizmat", icon: "💻" },
  { label: "Ta'mirchi", icon: "🔨" },
  { label: "O'qituvchi",icon: "📚" },
];

const stats = [
  { value: "12 500+", label: "Mutaxassislar",   icon: Users },
  { value: "48 000+", label: "Bajarilgan ishlar",icon: CheckCircle },
  { value: "4.9",     label: "O'rtacha reyting", icon: Star },
  { value: "98%",     label: "Mijozlar mamnun",  icon: TrendingUp },
];

/* Telefon mockup ichida ko'rsatiladigan xizmatlar — YANGI RASMLAR */
const phoneCards = [
  { img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&q=80&fit=crop", label: "Abdulloh K.", role: "Santexnik",  rating: "5.0", price: "80 000", badge: "🟢 Online" },
  { img: "https://images.unsplash.com/photo-1574269910231-bc508a30a2f3?w=300&q=80&fit=crop", label: "Sherzod M.",  role: "Elektrik",   rating: "4.9", price: "70 000", badge: "🟢 Online" },
  { img: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=300&q=80&fit=crop", label: "Nilufar X.",  role: "Tozalovchi", rating: "5.0", price: "50 000", badge: "🟡 Band"  },
];

const HeroSection = () => {
  const [query,      setQuery]      = useState("");
  const [startOpen,  setStartOpen]  = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <section id="hero" className="relative overflow-hidden pt-20 pb-0">
        {/* BG blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-[5%]  top-[10%] h-80 w-80 rounded-full bg-primary/12 blur-3xl animate-pulse" />
          <div className="absolute right-[5%] top-[15%] h-72 w-72 rounded-full bg-accent/10  blur-3xl animate-pulse" style={{ animationDelay: "1.2s" }} />
          <div className="absolute left-1/2 bottom-0 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/6 blur-3xl" />
        </div>

        <div className="container mx-auto px-4">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="flex justify-center mb-6 pt-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-5 py-2 text-sm font-semibold text-primary backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              O'zbekistondagi #1 xizmat platformasi
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">Yangi</span>
            </div>
          </motion.div>

          {/* Two column layout */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* LEFT — Text */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
              <h1 className="font-display text-5xl font-bold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl">
                Kerakli ustani
                <span className="block text-gradient leading-tight">bir zumda toping</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground leading-relaxed">
                12 500+ tekshirilgan mutaxassis. Real sharhlar. Kafolatlangan xizmat. Toshkent va butun O'zbekiston bo'ylab.
              </p>

              {/* Search */}
              <div className="mt-7 max-w-xl">
                <div className="relative flex items-center rounded-2xl border-2 border-border/60 bg-card/95 shadow-2xl backdrop-blur-xl overflow-hidden focus-within:border-primary/60 transition-all duration-300">
                  <div className="flex items-center gap-3 flex-1 px-4">
                    <Search className="h-5 w-5 shrink-0 text-primary" />
                    <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && document.getElementById("mutaxassislar")?.scrollIntoView({ behavior: "smooth" })}
                      placeholder="Qanday xizmat kerak? (masalan: santexnik...)"
                      className="h-14 flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm md:text-base font-medium" />
                    {query && (
                      <button onClick={() => setQuery("")} className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary hover:bg-muted transition">
                        <X className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                  <Button
                    onClick={() => document.getElementById("mutaxassislar")?.scrollIntoView({ behavior: "smooth" })}
                    className="h-full rounded-none rounded-r-2xl px-6 text-base font-bold shadow-none border-0 min-w-[120px]">
                    <Search className="h-4 w-4 mr-2" /> Topish
                  </Button>
                </div>
                {/* Popular searches */}
                <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                  <span className="text-xs text-muted-foreground font-medium">Mashhur:</span>
                  {["Santexnik", "Elektrik", "Ta'mirchi"].map(t => (
                    <button key={t} onClick={() => setQuery(t)}
                      className="text-xs text-primary hover:underline font-semibold">{t}</button>
                  ))}
                </div>
              </div>

              {/* Quick tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {quickTags.map(tag => (
                  <motion.button key={tag.label} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setQuery(tag.label)}
                    className="flex items-center gap-1.5 rounded-full border bg-card/80 px-3.5 py-1.5 text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-foreground transition-all">
                    {tag.icon} {tag.label}
                  </motion.button>
                ))}
              </div>

              {/* CTA buttons */}
              <div className="mt-7 flex flex-wrap gap-3">
                <Button size="lg" onClick={() => setStartOpen(true)}
                  className="h-13 rounded-2xl px-7 text-base font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all gap-2">
                  <Zap className="h-5 w-5" /> Hoziroq boshlang <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline"
                  onClick={() => document.getElementById("xarita")?.scrollIntoView({ behavior: "smooth" })}
                  className="h-13 rounded-2xl px-7 text-base font-semibold gap-2 hover:scale-105 transition-all">
                  <MapPin className="h-5 w-5" /> Xaritada toping
                </Button>
              </div>

              {/* Trust badges */}
              <div className="mt-6 flex items-center gap-4 flex-wrap">
                {[
                  { icon: Shield, text: "Kafolatlangan" },
                  { icon: Zap,    text: "5 daqiqada" },
                  { icon: Star,   text: "4.9 reyting" },
                ].map(f => (
                  <div key={f.text} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <f.icon className="h-4 w-4 text-primary" /> {f.text}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* RIGHT — Phone mockup */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Glow */}
                <div className="absolute inset-0 -z-10 rounded-[3rem] bg-primary/20 blur-3xl scale-75 translate-y-8" />

                {/* Phone frame */}
                <div className="relative w-[280px] rounded-[3rem] border-[6px] border-foreground/10 bg-background shadow-2xl overflow-hidden">
                  {/* Notch */}
                  <div className="flex justify-center pt-3 pb-1">
                    <div className="h-5 w-24 rounded-full bg-foreground/10" />
                  </div>

                  {/* App header */}
                  <div className="bg-primary px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-primary-foreground font-bold text-sm">IshTop.uz</p>
                      <p className="text-primary-foreground/70 text-xs">Usta toping</p>
                    </div>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                      <Search className="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>

                  {/* Search bar */}
                  <div className="px-3 pt-3 pb-2">
                    <div className="flex items-center gap-2 rounded-xl bg-secondary px-3 py-2">
                      <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-xs text-muted-foreground">Xizmat qidiring...</span>
                    </div>
                  </div>

                  {/* Yaqin ustalar label */}
                  <div className="px-4 py-1">
                    <p className="text-xs font-bold text-foreground">📍 Yaqin mutaxassislar</p>
                  </div>

                  {/* Specialist cards */}
                  <div className="px-3 pb-3 space-y-2">
                    {phoneCards.map((c, i) => (
                      <motion.div key={c.label}
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.15 }}
                        className="flex items-center gap-2.5 rounded-xl border bg-card p-2 shadow-sm">
                        <img src={c.img} alt={c.label}
                          className="h-10 w-10 rounded-xl object-cover shrink-0"
                          onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/40x40/6366f1/white?text=${c.label[0]}`; }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-foreground text-xs truncate">{c.label}</p>
                            <span className="text-xs ml-1 shrink-0">{c.badge}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{c.role}</p>
                          <div className="flex items-center justify-between mt-0.5">
                            <div className="flex items-center gap-0.5">
                              <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                              <span className="text-xs font-bold text-foreground">{c.rating}</span>
                            </div>
                            <span className="text-xs font-bold text-primary">{c.price} so'm</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Bottom nav */}
                  <div className="border-t bg-card flex justify-around py-2 px-4">
                    {["🏠","🔍","💬","👤"].map((icon, i) => (
                      <button key={i} className={`flex flex-col items-center p-1.5 rounded-lg ${i === 0 ? "text-primary" : "text-muted-foreground"}`}>
                        <span style={{ fontSize: 16 }}>{icon}</span>
                      </button>
                    ))}
                  </div>

                  {/* Home indicator */}
                  <div className="flex justify-center py-2">
                    <div className="h-1 w-16 rounded-full bg-foreground/20" />
                  </div>
                </div>

                {/* Floating badges */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
                  className="absolute -right-8 top-16 rounded-2xl border bg-card/95 backdrop-blur shadow-xl p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-500/10">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">Tasdiqlandi!</p>
                      <p className="text-xs text-muted-foreground">Buyurtma #2847</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}
                  className="absolute -left-8 bottom-24 rounded-2xl border bg-card/95 backdrop-blur shadow-xl p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10">
                      <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">4.9 reyting</p>
                      <p className="text-xs text-muted-foreground">12 500+ usta</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="mx-auto mt-14 max-w-4xl">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {stats.map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.08 }}
                  className="group rounded-2xl border bg-card/80 backdrop-blur-sm p-5 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                  <s.icon className="mx-auto mb-2 h-5 w-5 text-primary" />
                  <p className="text-2xl font-bold text-foreground md:text-3xl">{s.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground font-medium">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* "Hoziroq boshlang" Modal */}
      <AnimatePresence>
        {startOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setStartOpen(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }} transition={{ type: "spring", duration: 0.5 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md overflow-hidden rounded-3xl bg-background border shadow-2xl">

              <div className="relative bg-gradient-to-br from-primary via-primary/80 to-accent p-8 text-center text-primary-foreground overflow-hidden">
                <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                <button onClick={() => setStartOpen(false)} className="absolute right-4 top-4 rounded-full bg-white/20 p-2 hover:bg-white/30 transition">
                  <X className="h-4 w-4" />
                </button>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}
                  className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-3xl">⚡</motion.div>
                <h3 className="text-2xl font-bold">Boshlang!</h3>
                <p className="mt-1 text-sm opacity-80">Nima qilmoqchisiz?</p>
              </div>

              <div className="p-5 grid gap-3">
                {[
                  { emoji: "🔍", title: "Mutaxassis topish",  desc: "Yaqin atrofdagi eng yaxshi ustani toping",   action: () => { setStartOpen(false); document.getElementById("mutaxassislar")?.scrollIntoView({ behavior: "smooth" }); }, color: "border-primary/20 hover:border-primary hover:bg-primary/5" },
                  { emoji: "💼", title: "Mutaxassis bo'lish", desc: "Ro'yxatdan o'ting va buyurtmalar oling",     action: () => { setStartOpen(false); navigate("/auth?role=specialist"); }, color: "border-accent/20 hover:border-accent hover:bg-accent/5" },
                  { emoji: "💬", title: "Chat ochish",        desc: "Mutaxassis bilan to'g'ridan-to'g'ri suhbat", action: () => { setStartOpen(false); navigate("/chat"); }, color: "border-emerald-500/20 hover:border-emerald-500 hover:bg-emerald-500/5" },
                  { emoji: "🗺️", title: "Xaritada ko'rish",  desc: "Eng yaqin mutaxassisni xaritada toping",     action: () => { setStartOpen(false); document.getElementById("xarita")?.scrollIntoView({ behavior: "smooth" }); }, color: "border-blue-500/20 hover:border-blue-500 hover:bg-blue-500/5" },
                ].map(opt => (
                  <motion.button key={opt.title} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={opt.action}
                    className={`group flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all ${opt.color}`}>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-2xl group-hover:scale-110 transition-transform">
                      {opt.emoji}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-foreground text-sm">{opt.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                ))}
              </div>

              <div className="border-t px-5 pb-5 pt-3 text-center">
                <p className="text-xs text-muted-foreground">
                  Akkauntingiz bormi?{" "}
                  <button onClick={() => { setStartOpen(false); navigate("/auth"); }} className="font-bold text-primary hover:underline">Kirish</button>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HeroSection;
