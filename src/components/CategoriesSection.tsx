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
  );
};

export default CategoriesSection;
