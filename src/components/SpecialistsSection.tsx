import { useState } from "react";
import { Star, MapPin, CheckCircle, Phone, X, CreditCard, MessageSquare, ExternalLink, Award, Clock, Users, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import PaymentModal from "@/components/PaymentModal";
import RatingModal from "@/components/RatingModal";
import { useNavigate } from "react-router-dom";

/* 
  portrait = mutaxassisning o'z rasmi
  workImg  = ish jarayoni rasmi
  Ikkalasi ham BOSHQA rasmlar (saytda boshqa joylarda ishlatilmagan)
*/
const specialists = [
  {
    name: "Abdulloh Toshmatov", role: "Bosh santexnik", rating: 5.0, reviews: 312,
    city: "Toshkent", verified: true, phone: "+998901234567", telegram: "abdulloh_uz",
    portrait: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=85&fit=crop&crop=faces",
    workImg:  "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&q=85&fit=crop&crop=center",
    color: "from-blue-600 to-cyan-500", badge: "⭐ Top #1", price: "80 000", exp: "12 yil",
    orders: 1240, bio: "Professional santexnik, har qanday murakkab ishlarni tez va sifatli hal qilaman.",
    skills: ["Kran ta'miri", "Quvur o'rnatish", "Issiqlik tizimi", "Vannaxona"],
    reviewsList: [
      { user: "Bobur T.", text: "Juda tez va sifatli ishladi!", stars: 5 },
      { user: "Malika R.", text: "Narxi ham mos, tavsiya qilaman.", stars: 5 },
      { user: "Sherzod K.", text: "Ikkinchi marta ham chaqirdim!", stars: 5 },
    ]
  },
  {
    name: "Sherzod Mirzayev", role: "Elektrik usta", rating: 4.9, reviews: 241,
    city: "Samarqand", verified: true, phone: "+998937654321", telegram: "sherzod_el",
    portrait: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=85&fit=crop&crop=faces",
    workImg:  "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=400&q=85&fit=crop&crop=center",
    color: "from-yellow-500 to-orange-500", badge: "🔥 Mashhur", price: "70 000", exp: "8 yil",
    orders: 890, bio: "Elektr o'rnatish va ta'mirlash mutaxassisi. Xavfsiz va tezkor xizmat.",
    skills: ["Rozitka", "Kabel tortish", "Schyotchik", "Yorug'lik"],
    reviewsList: [
      { user: "Jasur N.", text: "Professionallik yuqori!", stars: 5 },
      { user: "Nodira X.", text: "Vaqtida keldi, yaxshi ishladi.", stars: 5 },
      { user: "Anvar S.", text: "Narxi adolatli, sifat a'lo.", stars: 4 },
    ]
  },
  {
    name: "Nilufar Xolmatova", role: "Tozalash ustasi", rating: 5.0, reviews: 487,
    city: "Toshkent", verified: true, phone: "+998941112233", telegram: "nilufar_clean",
    portrait: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=85&fit=crop&crop=faces",
    workImg:  "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&q=85&fit=crop&crop=center",
    color: "from-green-500 to-emerald-500", badge: "💎 Premium", price: "50 000", exp: "6 yil",
    orders: 2100, bio: "Kvartira va ofislarni chuqur tozalash. Ekologik toza vositalar ishlataman.",
    skills: ["Chuqur tozalash", "Oynalar", "Pollar", "Hojatxona"],
    reviewsList: [
      { user: "Zulfiya M.", text: "Uy yangiday bo'lib ketdi!", stars: 5 },
      { user: "Kamol B.", text: "Juda puxta ishladi!", stars: 5 },
      { user: "Dilnoza A.", text: "Har haftada chaqiraman!", stars: 5 },
    ]
  },
  {
    name: "Jasurbek Rahimov", role: "IT dasturchi", rating: 4.9, reviews: 156,
    city: "Toshkent", verified: true, phone: "+998905556677", telegram: "jasurbek_dev",
    portrait: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=85&fit=crop&crop=faces",
    workImg:  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=85&fit=crop&crop=center",
    color: "from-violet-600 to-purple-500", badge: "🚀 Pro", price: "120 000", exp: "10 yil",
    orders: 430, bio: "Veb-sayt, mobil ilova va dasturiy ta'minot ishlab chiqish. React, Node.js mutaxassisi.",
    skills: ["Veb sayt", "Mobil ilova", "Bot yaratish", "Dizayn"],
    reviewsList: [
      { user: "Rustam K.", text: "Saytimni bir kunda tayyor qildi!", stars: 5 },
      { user: "Feruza T.", text: "Zo'r mutaxassis!", stars: 5 },
      { user: "Mansur A.", text: "Bot juda yaxshi chiqdi.", stars: 5 },
    ]
  },
  {
    name: "Murod Hamidov", role: "Ta'mir ustasi", rating: 4.8, reviews: 398,
    city: "Namangan", verified: true, phone: "+998912223344", telegram: "murod_tamir",
    portrait: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=85&fit=crop&crop=faces",
    workImg:  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=85&fit=crop&crop=center",
    color: "from-amber-500 to-orange-500", badge: "", price: "65 000", exp: "9 yil",
    orders: 760, bio: "Kvartira va uy ta'miri bo'yicha tajribali usta. Har qanday ta'mir ishlari.",
    skills: ["Devor qoplash", "Polni yotqizish", "Bo'yash", "Gips"],
    reviewsList: [
      { user: "Hamid Y.", text: "Uyimizni yangiladi!", stars: 5 },
      { user: "Shahnoza N.", text: "Vaqtida tugatdi.", stars: 4 },
      { user: "Behruz M.", text: "Narxi boshqalardan arzon!", stars: 5 },
    ]
  },
  {
    name: "Zulfiya Nazarova", role: "O'qituvchi", rating: 5.0, reviews: 203,
    city: "Buxoro", verified: true, phone: "+998933334455", telegram: "zulfiya_teach",
    portrait: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=85&fit=crop&crop=faces",
    workImg:  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&q=85&fit=crop&crop=center",
    color: "from-sky-500 to-blue-600", badge: "🎓 Top", price: "60 000", exp: "7 yil",
    orders: 580, bio: "Matematika, fizika va ingliz tili o'qituvchisi. Olimpiada g'oliblarini tayyorlaganman.",
    skills: ["Matematika", "Fizika", "Ingliz tili", "Kimyo"],
    reviewsList: [
      { user: "Aziz T.", text: "Farzandim olimpiadada 1-o'rin!", stars: 5 },
      { user: "Mohira S.", text: "Juda yaxshi tushuntiradi.", stars: 5 },
      { user: "Ulmas R.", text: "Ingliz tilim yaxshilandi.", stars: 5 },
    ]
  },
];

interface Props { embedded?: boolean; }

const SpecialistProfileModal = ({ s, onClose, onPayment, onRating, navigate }: any) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    onClick={onClose}>
    <motion.div initial={{ opacity: 0, scale: 0.92, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 24 }} transition={{ type: "spring", duration: 0.45 }}
      onClick={e => e.stopPropagation()}
      className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-background border shadow-2xl">

      {/* Split header: portrait left + work right */}
      <div className="relative h-52 overflow-hidden rounded-t-3xl grid grid-cols-2">
        <div className="relative overflow-hidden">
          <img src={s.portrait} alt={s.name} className="h-full w-full object-cover object-top"
            onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/250x208/6366f1/white?text=${s.name[0]}`; }} />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
          <div className="absolute bottom-2 left-2 rounded-md bg-black/50 backdrop-blur px-2 py-0.5 text-xs text-white font-medium">👤 Mutaxassis</div>
        </div>
        <div className="relative overflow-hidden">
          <img src={s.workImg} alt="Ish jarayoni" className="h-full w-full object-cover"
            onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/250x208/10b981/white?text=Ish`; }} />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20" />
          <div className="absolute bottom-2 right-2 rounded-md bg-black/50 backdrop-blur px-2 py-0.5 text-xs text-white font-medium">🔧 Ish</div>
        </div>
        <button onClick={onClose}
          className="absolute top-3 right-3 rounded-full bg-black/50 backdrop-blur p-2 hover:bg-black/70 transition z-10">
          <X className="h-4 w-4 text-white" />
        </button>
        {s.badge && (
          <div className="absolute top-3 left-3 rounded-full bg-background/90 backdrop-blur border px-3 py-1 text-xs font-bold text-foreground z-10">
            {s.badge}
          </div>
        )}
      </div>

      <div className="p-5 space-y-4">
        {/* Name & info */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground">{s.name}</h2>
              {s.verified && <CheckCircle className="h-5 w-5 text-primary shrink-0" />}
            </div>
            <p className="text-muted-foreground text-sm">{s.role}</p>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-foreground text-sm">{s.rating}</span>
                <span className="text-xs text-muted-foreground">({s.reviews} sharh)</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {s.city}
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-bold text-primary">{s.price}</p>
            <p className="text-xs text-muted-foreground">so'm/soat</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Award, label: "Tajriba", value: s.exp },
            { icon: Users, label: "Buyurtma", value: s.orders.toLocaleString() },
            { icon: Clock, label: "Javob", value: "~15 min" },
          ].map(st => (
            <div key={st.label} className="rounded-xl border bg-secondary/30 p-3 text-center">
              <st.icon className="h-4 w-4 text-primary mx-auto mb-1" />
              <p className="font-bold text-foreground text-sm">{st.value}</p>
              <p className="text-xs text-muted-foreground">{st.label}</p>
            </div>
          ))}
        </div>

        {/* Bio */}
        <p className="text-sm text-muted-foreground leading-relaxed bg-secondary/20 rounded-xl p-3 border">{s.bio}</p>

        {/* Skills */}
        <div>
          <p className="font-semibold text-foreground text-sm mb-2">Ko'nikmalar</p>
          <div className="flex flex-wrap gap-2">
            {s.skills.map((sk: string) => (
              <span key={sk} className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary">{sk}</span>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button className="rounded-xl gap-2 h-10 font-semibold" onClick={() => window.open(`tel:${s.phone}`)}>
            <Phone className="h-4 w-4" /> Qo'ng'iroq
          </Button>
          <Button variant="outline" className="rounded-xl gap-2 h-10" onClick={() => window.open(`https://t.me/${s.telegram}`, "_blank")}>
            <ExternalLink className="h-4 w-4 text-blue-500" /> Telegram
          </Button>
          <Button variant="outline" className="rounded-xl gap-2 h-10" onClick={onPayment}>
            <CreditCard className="h-4 w-4 text-primary" /> To'lov
          </Button>
          <Button variant="outline" className="rounded-xl gap-2 h-10" onClick={() => { onClose(); navigate("/chat"); }}>
            <MessageSquare className="h-4 w-4 text-emerald-500" /> Chat
          </Button>
        </div>

        {/* Reviews */}
        <div>
          <p className="font-bold text-foreground mb-3 flex items-center gap-2 text-sm">
            <MessageSquare className="h-4 w-4 text-primary" /> Mijozlar fikri
          </p>
          <div className="space-y-2">
            {s.reviewsList.map((r: any, i: number) => (
              <div key={i} className="rounded-xl border bg-secondary/20 p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{r.user[0]}</div>
                    <span className="font-semibold text-sm text-foreground">{r.user}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(r.stars)].map((_, j) => <Star key={j} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground ml-9 italic">"{r.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

const SpecialistsSection = ({ embedded }: Props) => {
  const [profileOpen, setProfileOpen] = useState<typeof specialists[0] | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [ratingOpen,  setRatingOpen]  = useState(false);
  const [activeSpec,  setActiveSpec]  = useState<typeof specialists[0] | null>(null);
  const navigate = useNavigate();

  return (
    <>
      <section id="mutaxassislar" className={embedded ? "p-6 md:p-10" : "py-20 md:py-28 bg-secondary/20"}>
        <div className={embedded ? "" : "container mx-auto"}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="mb-3 inline-block rounded-full bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">Mutaxassislar</span>
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Ishonchli <span className="text-gradient">mutaxassislar</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Kartochkani bosib to'liq profil va sharhlarni ko'ring
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {specialists.map((s, i) => (
              <motion.div key={s.name}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                whileHover={{ y: -5 }}
                onClick={() => { setActiveSpec(s); setProfileOpen(s); }}
                className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer">

                {/* Split image: portrait + work */}
                <div className="relative h-44 grid grid-cols-2 overflow-hidden">
                  <div className="relative overflow-hidden">
                    <img src={s.portrait} alt={s.name}
                      className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/200x176/6366f1/white?text=${s.name[0]}`; }} />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30" />
                  </div>
                  <div className="relative overflow-hidden">
                    <img src={s.workImg} alt="Ish"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/200x176/10b981/white?text=Ish`; }} />
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/30" />
                  </div>

                  {/* Gradient bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent pointer-events-none" />

                  {s.badge && (
                    <div className="absolute top-2 left-2 rounded-full bg-background/85 backdrop-blur border px-2.5 py-0.5 text-xs font-bold text-foreground">
                      {s.badge}
                    </div>
                  )}
                  {s.verified && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-primary/90 px-2 py-0.5 text-xs font-bold text-primary-foreground">
                      <CheckCircle className="h-3 w-3" /> Tasdiqlangan
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/25 pointer-events-none">
                    <div className="flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold text-foreground shadow-lg">
                      Profilni ko'rish <ChevronRight className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  {/* Name overlay */}
                  <div className="absolute bottom-2 left-3">
                    <h3 className="font-bold text-white text-base drop-shadow-lg leading-tight">{s.name}</h3>
                    <p className="text-white/75 text-xs">{s.role}</p>
                  </div>
                </div>

                {/* Card bottom */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-foreground text-sm">{s.rating}</span>
                        <span className="text-xs text-muted-foreground">({s.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {s.city}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Award className="h-3.5 w-3.5 text-primary" /> {s.exp}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground">Soatiga</p>
                      <p className="font-bold text-primary">{s.price} so'm</p>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                      Batafsil <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {profileOpen && (
          <SpecialistProfileModal s={profileOpen} onClose={() => setProfileOpen(null)}
            onPayment={() => setPaymentOpen(true)} onRating={() => setRatingOpen(true)} navigate={navigate} />
        )}
      </AnimatePresence>

      <PaymentModal open={paymentOpen} onClose={() => setPaymentOpen(false)}
        specialist={activeSpec?.name} service={`${activeSpec?.role} xizmati`} amount="150 000" />
      <RatingModal open={ratingOpen} onClose={() => setRatingOpen(false)}
        specialist={activeSpec?.name} service={`${activeSpec?.role} xizmati`} />
    </>
  );
};

export default SpecialistsSection;
