import { useState } from "react";
import { Star, X, CheckCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface RatingModalProps {
  open: boolean;
  onClose: () => void;
  specialist?: string;
  service?: string;
}

const tags = ["Vaqtida keldi", "Sifatli ish", "Muloqot yaxshi", "Narxi mos", "Takror chaqiraman", "Professional"];

const RatingModal = ({ open, onClose, specialist = "Aziz Karimov", service = "Santexnik xizmati" }: RatingModalProps) => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const labels = ["", "Yomon", "Qoniqarli", "Yaxshi", "Juda yaxshi", "Zo'r!"];

  const toggleTag = (t: string) => setSelectedTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const handleSubmit = () => {
    if (!rating) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1800);
  };

  const handleClose = () => {
    setRating(0); setHovered(0); setComment(""); setSelectedTags([]); setDone(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={handleClose}>
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: "spring", duration: 0.4 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-background border shadow-2xl overflow-hidden">

            {!done ? (
              <>
                <div className="flex items-center justify-between border-b p-5">
                  <div>
                    <h3 className="font-bold text-foreground">Baho bering</h3>
                    <p className="text-sm text-muted-foreground">{specialist} · {service}</p>
                  </div>
                  <button onClick={handleClose} className="rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  {/* Stars */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {[1, 2, 3, 4, 5].map(i => (
                        <motion.button key={i} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                          onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(0)}
                          onClick={() => setRating(i)}>
                          <Star className={`h-10 w-10 transition-colors ${i <= (hovered || rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                        </motion.button>
                      ))}
                    </div>
                    <AnimatePresence mode="wait">
                      {(hovered || rating) > 0 && (
                        <motion.p key={hovered || rating} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="text-sm font-semibold text-amber-500">
                          {labels[hovered || rating]}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Tags */}
                  {rating > 0 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <p className="text-sm font-semibold text-foreground mb-2">Nima yoqdi?</p>
                      <div className="flex flex-wrap gap-2">
                        {tags.map(t => (
                          <button key={t} onClick={() => toggleTag(t)}
                            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${selectedTags.includes(t) ? "border-primary bg-primary/10 text-primary" : "hover:border-primary/40 text-muted-foreground"}`}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Comment */}
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-2 block">Izoh <span className="text-muted-foreground font-normal">(ixtiyoriy)</span></label>
                    <textarea value={comment} onChange={e => setComment(e.target.value)}
                      placeholder="Xizmat haqida fikringizni yozing..."
                      rows={3}
                      className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 ring-primary/30 resize-none" />
                  </div>

                  <Button onClick={handleSubmit} disabled={!rating || loading} className="w-full rounded-2xl h-12 text-base font-bold">
                    {loading ? <><Loader2 className="h-5 w-5 animate-spin mr-2" />Yuborilmoqda...</> : "Bahoni yuborish"}
                  </Button>
                </div>
              </>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-8 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}
                  className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </motion.div>
                <h3 className="text-xl font-bold text-foreground">Rahmat!</h3>
                <p className="mt-2 text-muted-foreground text-sm">Sizning bahoyingiz saqlandi. Bu mutaxassisga yordam beradi!</p>
                <div className="flex items-center justify-center gap-1 mt-3">
                  {[1,2,3,4,5].map(i => <Star key={i} className={`h-6 w-6 ${i <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />)}
                </div>
                <Button onClick={handleClose} className="mt-5 w-full rounded-2xl h-12">Yopish</Button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RatingModal;
