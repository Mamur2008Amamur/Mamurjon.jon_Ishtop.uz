import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { homeSections, renderHomeSectionContent, type HomeSectionKey } from "@/components/homeSections";

const SectionsGrid = () => {
  const [activeDialog, setActiveDialog] = useState<HomeSectionKey | null>(null);

  return (
    <section id="home-menu" className="py-10 md:py-14">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            Bosh sahifa
          </span>
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Kerakli <span className="text-gradient">bo'limni tanlang</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Pastdagi bloklar aniq ko'rinadi va bosilganda yangi oynada ochiladi.
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {homeSections.map((section, i) => (
            <motion.button
              key={section.key}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6, scale: 1.01 }}
              onClick={() => setActiveDialog(section.key)}
              className="group relative flex items-start gap-5 rounded-3xl border bg-card p-6 text-left shadow-sm transition-all hover:shadow-xl hover:glow-sm"
            >
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${section.colorClass} text-primary-foreground shadow-lg transition-transform group-hover:scale-110`}>
                <section.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {section.navLabel}
                </div>
                <h3 className="mt-2 font-display text-xl font-bold text-foreground">{section.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{section.desc}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Ochish <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <Dialog open={!!activeDialog} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="max-h-[85vh] max-w-5xl overflow-y-auto border-0 bg-background p-0">
          {activeDialog ? renderHomeSectionContent(activeDialog) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default SectionsGrid;
