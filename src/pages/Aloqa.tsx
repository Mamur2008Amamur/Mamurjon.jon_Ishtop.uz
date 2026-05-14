import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import { Phone, MapPin, Clock, Globe } from "lucide-react";
import { motion } from "framer-motion";

const infoCards = [
  { icon: Phone, title: "Telefon", desc: "+998 90 123 45 67", color: "bg-primary/10 text-primary" },
  { icon: MapPin, title: "Manzil", desc: "Toshkent, O'zbekiston", color: "bg-accent/10 text-accent" },
  { icon: Clock, title: "Ish vaqti", desc: "Dush-Shan: 9:00 - 18:00", color: "bg-success/10 text-success" },
  { icon: Globe, title: "Veb-sayt", desc: "ishtop.uz", color: "bg-primary/10 text-primary" },
];

const Aloqa = () => (
  <div className="min-h-screen">
    <Navbar />
    <div className="pt-20 pb-10">
      <div className="container mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="mb-3 inline-block rounded-full bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">Aloqa</span>
          <h1 className="font-display text-4xl font-bold text-foreground md:text-5xl">
            Biz bilan <span className="text-gradient">bog'laning</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Savollaringiz bormi? Bizga xabar yuboring — jamoamiz tez orada javob beradi.
          </p>
        </motion.div>

        <div className="mx-auto max-w-6xl grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-14">
          {infoCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border bg-card p-6 text-center shadow-md hover:shadow-lg transition-shadow"
            >
              <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}>
                <card.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display font-bold text-foreground">{card.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        <ContactSection embedded />
      </div>
    </div>
    <Footer />
  </div>
);

export default Aloqa;
