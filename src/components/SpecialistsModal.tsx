import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Star, MapPin, Clock, CheckCircle2, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Specialist, getSpecialistsByCategory } from "@/data/specialists";
import SpecialistProfileModal from "@/components/SpecialistProfileModal";
import BookingModal from "@/components/BookingModal";

interface SpecialistsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  specialty: string;
  location?: { lat: number; lng: number };
}

const SpecialistsModal = ({ open, onOpenChange, specialty, location }: SpecialistsModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSpecialists, setFilteredSpecialists] = useState<Specialist[]>([]);
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  // Specialty o'zgarsa yoki modal ochilsa data update qil
  useEffect(() => {
    if (open) {
      const specialists = getSpecialistsByCategory(specialty);
      setFilteredSpecialists(specialists);
      setSearchQuery("");
    }
  }, [open, specialty]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const all = getSpecialistsByCategory(specialty);
    if (!query.trim()) {
      setFilteredSpecialists(all);
    } else {
      setFilteredSpecialists(
        all.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl sm:max-w-3xl lg:max-w-4xl p-0 overflow-hidden rounded-xl sm:rounded-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-5 md:p-6 border-b sticky top-0 bg-card/95 backdrop-blur-sm z-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <DialogTitle className="text-base sm:text-lg md:text-2xl font-bold">
                {specialty}
              </DialogTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {filteredSpecialists.length} ta professional
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        {/* Search bar */}
        <div className="p-3 sm:p-4 md:p-5 border-b sticky top-[72px] bg-card/95 backdrop-blur-sm z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Usta qidirish..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 rounded-lg sm:rounded-xl h-9 sm:h-10"
            />
          </div>
        </div>

        {/* Specialists list */}
        <div className="overflow-y-auto flex-1 p-3 sm:p-4 md:p-5 space-y-2 sm:space-y-3">
          {filteredSpecialists.length > 0 ? (
            filteredSpecialists.map((specialist, index) => (
              <motion.div
                key={specialist.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                className="group p-3 sm:p-4 rounded-lg sm:rounded-xl border border-border/60 hover:border-primary/40 hover:bg-secondary/30 transition-all hover:shadow-md"
              >
                <div className="flex gap-3 sm:gap-4">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <img
                      src={specialist.image}
                      alt={specialist.name}
                      className="h-12 sm:h-14 md:h-16 w-12 sm:w-14 md:w-16 rounded-full object-cover border-2 border-primary/20"
                    />
                    {specialist.verified && (
                      <CheckCircle2 className="absolute -bottom-1 -right-1 h-5 sm:h-6 w-5 sm:w-6 bg-green-500 text-white rounded-full" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <p className="font-bold text-sm sm:text-base text-foreground truncate">
                          {specialist.name}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {specialist.specialty}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 bg-yellow-500/10 px-2 py-1 rounded-lg">
                        <Star className="h-3.5 sm:h-4 w-3.5 sm:w-4 fill-yellow-500 text-yellow-500" />
                        <span className="text-xs sm:text-sm font-bold">{specialist.rating}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mt-2 mb-2">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Star className="h-3 w-3" />
                        <span>{specialist.reviews} sharh</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{specialist.responseTime}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>{specialist.completedJobs}+ ishlar</span>
                      </div>
                      <div className="text-muted-foreground">
                        <span className="font-semibold">{specialist.price}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedSpecialist(specialist);
                          setProfileOpen(true);
                        }}
                        className="h-7 sm:h-8 text-xs sm:text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Profil
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedSpecialist(specialist);
                          setBookingOpen(true);
                        }}
                        className="h-7 sm:h-8 text-xs sm:text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Buyurtma berish
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="text-3xl mb-2">🔍</div>
              <p className="text-sm text-muted-foreground">Specialists topilmadi</p>
            </div>
          )}
        </div>
      </DialogContent>

      {/* Profile Modal */}
      <SpecialistProfileModal
        open={profileOpen}
        onOpenChange={setProfileOpen}
        specialist={selectedSpecialist}
        onBooking={() => {
          setProfileOpen(false);
          setBookingOpen(true);
        }}
      />

      {/* Booking Modal */}
      <BookingModal
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        specialist={selectedSpecialist}
      />
    </Dialog>
  );
};

export default SpecialistsModal;
