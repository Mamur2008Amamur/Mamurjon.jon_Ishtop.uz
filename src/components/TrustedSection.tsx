import { motion } from "framer-motion";
import { ShieldCheck, Zap, Clock, ThumbsUp } from "lucide-react";

const whyUs = [
  { icon: ShieldCheck, title: "100% Kafolat",  desc: "Har bir xizmat kafolatlangan va tekshirilgan", color: "text-green-500", bg: "bg-green-500/10" },
  { icon: Zap,         title: "5 daqiqada",    desc: "Yaqin mutaxassisni tezda topasiz",             color: "text-amber-500", bg: "bg-amber-500/10" },
  { icon: Clock,       title: "24/7 Online",   desc: "Istalgan vaqt xizmat buyurtma bering",         color: "text-blue-500",  bg: "bg-blue-500/10"  },
  { icon: ThumbsUp,    title: "98% Mamnun",    desc: "Mijozlarimizning 98% mamnun",                  color: "text-primary",   bg: "bg-primary/10"   },
];

const TrustedSection = () => (
  <section className="py-14 md:py-16 bg-gradient-to-b from-background to-secondary/20">
    <div className="container mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {whyUs.map((w, i) => (
          <motion.div key={w.title}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className="group flex flex-col items-center text-center rounded-2xl border bg-card p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
            <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-2xl ${w.bg} group-hover:scale-110 transition-transform`}>
              <w.icon className={`h-6 w-6 ${w.color}`} />
            </div>
            <p className="font-bold text-foreground text-sm">{w.title}</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{w.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default TrustedSection;
