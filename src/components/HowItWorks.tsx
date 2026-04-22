import { Search, UserCheck, MessageSquare, Star } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Search,
    title: "Xizmatni tanlang",
    desc: "Sizga kerak bo'lgan xizmat turini tanlang yoki qidiruvdan foydalaning",
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: UserCheck,
    title: "Usta tanlang",
    desc: "Reyting, sharhlar va tajriba bo'yicha eng yaxshi mutaxassisni tanlang",
    color: "from-purple-500 to-indigo-400",
  },
  {
    icon: MessageSquare,
    title: "Bog'laning",
    desc: "Usta bilan to'g'ridan-to'g'ri bog'laning va buyurtma bering",
    color: "from-emerald-500 to-teal-400",
  },
  {
    icon: Star,
    title: "Baholang",
    desc: "Ish tugagach, ustani baholang va boshqalarga yordam bering",
    color: "from-amber-400 to-orange-500",
  },
];

interface Props {
  embedded?: boolean;
}

const HowItWorks = ({ embedded }: Props) => (
  <section className={embedded ? "p-6 md:p-10" : "py-20 md:py-28"}>
    <div className={embedded ? "" : "container mx-auto"}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
          Qanday ishlaydi
        </span>
        <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
          Faqat <span className="text-gradient">4 qadamda</span> boshlang
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          Tez, oson va ishonchli — hech qanday murakkab jarayon yo'q
        </p>
      </motion.div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative"
          >
            <div className="relative flex flex-col items-center text-center rounded-2xl border bg-card p-7 transition-all hover:shadow-xl hover:glow-sm">
              <div className="absolute -top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-foreground font-display text-sm font-bold text-background">
                {i + 1}
              </div>
              <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-lg transition-transform group-hover:scale-110`}>
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-display text-lg font-bold text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
