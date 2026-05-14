import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Star, MapPin, Clock, CheckCircle2, MessageCircle, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { Specialist } from "@/data/specialists";
import { useState } from "react";
import ChatModal from "@/components/ChatModal";

interface SpecialistProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  specialist: Specialist | null;
  onBooking: () => void;
}

const SpecialistProfileModal = ({
  open,
  onOpenChange,
  specialist,
  onBooking,
}: SpecialistProfileModalProps) => {
  const [chatOpen, setChatOpen] = useState(false);
  if (!specialist) return null;

  const reviews = [
    { name: "Alisher", rating: 5, text: "Juda professional va tezkor usta! Tavsiya qilaman." },
    { name: "Feruza", rating: 5, text: "Barcha ishni to'liq qildi, narxi ham oqilona." },
    { name: "Davlat", rating: 4, text: "Yaxshi ish, lekin biroz vaqt ortga qoldi." },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-xl sm:rounded-2xl max-h-[90vh] flex flex-col">
        {/* Header with avatar */}
        <div className="relative h-32 sm:h-40 md:h-48 bg-gradient-to-r from-primary/20 to-accent/20 p-4 sm:p-5 md:p-6">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-3 right-3 p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-end gap-4">
            <motion.img
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              src={specialist.image}
              alt={specialist.name}
              className="h-24 sm:h-28 md:h-32 w-24 sm:w-28 md:w-32 rounded-2xl border-4 border-card object-cover"
            />
            <div className="mb-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                {specialist.name}
              </h2>
              <p className="text-sm text-muted-foreground">{specialist.specialty}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-5 md:p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="text-center p-3 rounded-lg bg-card border border-border/40">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span className="font-bold text-lg">{specialist.rating}</span>
              </div>
              <p className="text-xs text-muted-foreground">Rating</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-card border border-border/40">
              <p className="font-bold text-lg">{specialist.reviews}</p>
              <p className="text-xs text-muted-foreground">Sharh</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-card border border-border/40">
              <p className="font-bold text-lg">{specialist.completedJobs}+</p>
              <p className="text-xs text-muted-foreground">Ishlar</p>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              <Clock className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Javob vaqti</p>
                <p className="font-semibold text-sm">{specialist.responseTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              <MapPin className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Joylashuvı</p>
                <p className="font-semibold text-sm">Toshkent shahar</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              <span className="text-xl">💰</span>
              <div>
                <p className="text-xs text-muted-foreground">Narx</p>
                <p className="font-semibold text-sm">{specialist.price}</p>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h4 className="font-bold text-sm mb-2">Haqida</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {specialist.completedJobs}+ ta buyurtmani muvaffaqiyatli bajargan {specialist.specialty}. 
              Barcha ish sifatli va garantiyali. Vaqt va pul tejash uchun eng yaxshi variant!
            </p>
          </div>

          {/* Reviews */}
          <div>
            <h4 className="font-bold text-sm mb-3">Sharh va Baholashlar</h4>
            <div className="space-y-2">
              {reviews.map((review, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-3 rounded-lg border border-border/40 bg-card/50"
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-semibold text-sm">{review.name}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: review.rating }).map((_, j) => (
                        <Star
                          key={j}
                          className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{review.text}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg h-9 text-xs sm:text-sm"
            >
              <Phone className="h-4 w-4 mr-1" /> Qo'ng'iroq
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setChatOpen(true)}
              className="rounded-lg h-9 text-xs sm:text-sm"
            >
              <MessageCircle className="h-4 w-4 mr-1" /> Chat
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 sm:p-5 md:p-6 bg-card sticky bottom-0">
          <Button
            onClick={onBooking}
            size="lg"
            className="w-full rounded-lg h-10 text-sm font-bold"
          >
            ✅ Buyurtma berish
          </Button>
        </div>
      </DialogContent>

      {/* Chat Modal */}
      <ChatModal
        open={chatOpen}
        onOpenChange={setChatOpen}
        specialist={specialist}
      />
    </Dialog>
  );
};

export default SpecialistProfileModal;
