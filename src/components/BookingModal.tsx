import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Calendar, Clock, MapPin, Phone, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Specialist } from "@/data/specialists";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  specialist: Specialist | null;
}

const BookingModal = ({ open, onOpenChange, specialist }: BookingModalProps) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    description: "",
    location: "",
    phone: "",
    name: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  if (!specialist) return null;

  const handleNext = () => {
    if (step < 3) {
      setStep((step + 1) as 1 | 2 | 3);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep((step - 1) as 1 | 2 | 3);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      date: "",
      time: "",
      description: "",
      location: "",
      phone: "",
      name: "",
    });
    setSubmitted(false);
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    const { error } = await supabase.functions.invoke("send-telegram", {
      body: {
        type: "booking",
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        message: formData.description.trim(),
        meta: {
          specialist: specialist.name,
          service: specialist.specialty,
          date: formData.date,
          time: formData.time,
          location: formData.location,
          price: specialist.price,
        },
      },
    });

    setSubmitting(false);

    if (error) {
      toast({
        title: "Buyurtma yuborilmadi",
        description: "Telegram sozlamalarini tekshiring yoki qayta urinib ko'ring.",
        variant: "destructive",
      });
      return;
    }

    setSubmitted(true);
    toast({ title: "Buyurtma adminga yuborildi", description: "Tez orada siz bilan bog'lanamiz." });
    setTimeout(() => {
      onOpenChange(false);
      resetForm();
    }, 3000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden rounded-xl sm:rounded-2xl">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-5 md:p-6 border-b bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg sm:text-xl font-bold">
                Buyurtma berish
              </DialogTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {specialist.name} - {specialist.specialty}
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Progress */}
          <div className="flex gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-all ${
                  s <= step ? "bg-primary" : "bg-border/50"
                }`}
              />
            ))}
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="p-4 sm:p-5 md:p-6 min-h-[400px] flex flex-col">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center gap-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center"
                >
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </motion.div>
                <div className="text-center">
                  <p className="text-lg font-bold">Buyurtma qabul qilindi!</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Usta 15 minutda sizga aloqaga chiqadi
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`step-${step}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 space-y-4"
              >
                {/* Step 1: Date & Time */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> Sana
                      </label>
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        className="rounded-lg h-10"
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Clock className="h-4 w-4" /> Vaqt
                      </label>
                      <select
                        value={formData.time}
                        onChange={(e) =>
                          setFormData({ ...formData, time: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm"
                      >
                        <option value="">Vaqt tanlang</option>
                        {["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"].map(
                          (t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>
                )}

                {/* Step 2: Location & Description */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> Manzil
                      </label>
                      <Input
                        placeholder="Manzilni kiriting..."
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        className="rounded-lg h-10"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2">Muammo tavsifi</label>
                      <Textarea
                        placeholder="Muammoni batafsil tavsiflang..."
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        className="rounded-lg min-h-[100px] resize-none"
                        maxLength={500}
                      />
                      <p className="text-xs text-muted-foreground text-right mt-1">
                        {formData.description.length}/500
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 3: Contact Info */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold mb-2">To'liq ism</label>
                      <Input
                        placeholder="F.I.O"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="rounded-lg h-10"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Phone className="h-4 w-4" /> Telefon
                      </label>
                      <Input
                        placeholder="+998 90 123 45 67"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="rounded-lg h-10"
                      />
                    </div>

                    {/* Summary */}
                    <div className="mt-6 p-4 rounded-lg bg-secondary/50 border border-border/40">
                      <p className="text-xs font-semibold text-muted-foreground mb-2">
                        BUYURTMA XULASASI
                      </p>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="text-muted-foreground">Usta:</span>{" "}
                          <span className="font-semibold">{specialist.name}</span>
                        </p>
                        <p>
                          <span className="text-muted-foreground">Sana va vaqt:</span>{" "}
                          <span className="font-semibold">
                            {formData.date} {formData.time}
                          </span>
                        </p>
                        <p>
                          <span className="text-muted-foreground">Narx:</span>{" "}
                          <span className="font-semibold">{specialist.price}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t p-4 sm:p-5 md:p-6 flex gap-2">
          {!submitted && step > 1 && (
            <Button
              variant="outline"
              onClick={handlePrev}
              className="rounded-lg"
            >
              ← Orqaga
            </Button>
          )}
          {!submitted && step < 3 && (
            <Button
              onClick={handleNext}
              disabled={
                (step === 1 && (!formData.date || !formData.time)) ||
                (step === 2 && (!formData.location || !formData.description))
              }
              className="flex-1 rounded-lg"
            >
              Keyingi →
            </Button>
          )}
          {!submitted && step === 3 && (
            <Button
              onClick={handleSubmit}
              disabled={!formData.name || !formData.phone || submitting}
              className="flex-1 rounded-lg"
            >
              ✅ Tasdiqlash
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
