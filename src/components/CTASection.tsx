import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, X, User, Briefcase, CheckCircle2, Star, TrendingUp, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const benefits = [
  { icon: TrendingUp, text: "Kuniga 50+ yangi buyurtma" },
  { icon: Star, text: "Reyting va sharhlar tizimi" },
  { icon: Shield, text: "To'lovlar kafolatlangan" },
  { icon: CheckCircle2, text: "Bepul ro'yxatdan o'tish" },
];

const CTASection = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <section className="py-20 md:py-28">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-glow to-primary p-10 text-center text-primary-foreground shadow-2xl md:p-16"
          >
            <div className="absolute top-0 left-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-0 right-0 h-60 w-60 rounded-full bg-accent/20 blur-3xl" />

            <div className="relative">
              <Sparkles className="mx-auto mb-4 h-10 w-10 text-accent" />
              <h2 className="font-display text-3xl font-bold md:text-4xl lg:text-5xl">
                Mutaxassis sifatida ro'yxatdan o'ting
              </h2>
              <p className="mx-auto mt-4 max-w-md text-primary-foreground/80 text-lg">
                Minglab mijozlar sizni kutmoqda. Bepul ro'yxatdan o'ting va hozirdanoq buyurtmalar oling!
              </p>

              {/* Benefits grid */}
              <div className="mx-auto mt-8 grid max-w-lg grid-cols-2 gap-3 text-left">
                {benefits.map((b) => (
                  <div key={b.text} className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3">
                    <b.icon className="h-5 w-5 shrink-0 text-accent" />
                    <span className="text-sm font-medium text-primary-foreground">{b.text}</span>
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                variant="secondary"
                onClick={() => setOpen(true)}
                className="mt-8 rounded-xl px-8 text-base font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Hozir boshlash
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md overflow-hidden rounded-3xl bg-background shadow-2xl border"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-br from-primary to-glow p-8 text-center text-primary-foreground">
                <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                <button
                  onClick={() => setOpen(false)}
                  className="absolute right-4 top-4 rounded-full bg-white/20 p-1.5 hover:bg-white/30 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                <Sparkles className="mx-auto mb-3 h-8 w-8 text-accent" />
                <h3 className="text-2xl font-bold">Qanday ro'yxatdan o'tasiz?</h3>
                <p className="mt-2 text-sm text-primary-foreground/80">
                  O'zingizga mos variantni tanlang
                </p>
              </div>

              {/* Options */}
              <div className="p-6 space-y-4">
                {/* Mutaxassis */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setOpen(false); navigate("/auth?role=specialist"); }}
                  className="group w-full flex items-center gap-4 rounded-2xl border-2 border-primary/20 bg-primary/5 p-5 text-left hover:border-primary hover:bg-primary/10 transition-all"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Briefcase className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-foreground text-base">Mutaxassis sifatida</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Xizmat ko'rsating va daromad oling
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {["Bepul", "Tez", "Ishonchli"].map((tag) => (
                        <span key={tag} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>

                {/* Mijoz */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setOpen(false); navigate("/auth?role=client"); }}
                  className="group w-full flex items-center gap-4 rounded-2xl border-2 border-accent/20 bg-accent/5 p-5 text-left hover:border-accent hover:bg-accent/10 transition-all"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent/10 group-hover:bg-accent/20 transition-colors">
                    <User className="h-7 w-7 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-foreground text-base">Mijoz sifatida</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Mutaxassis toping va buyurtma bering
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {["Tez topish", "Arzon", "Kafolat"].map((tag) => (
                        <span key={tag} className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>

                <p className="text-center text-xs text-muted-foreground pt-2">
                  Allaqachon akkauntingiz bormi?{" "}
                  <button
                    onClick={() => { setOpen(false); navigate("/auth"); }}
                    className="font-semibold text-primary hover:underline"
                  >
                    Kirish
                  </button>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CTASection;
