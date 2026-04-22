import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Send, CheckCircle, ImagePlus, Wrench, Shield, Clock, Sparkles } from "lucide-react";
import LeafletMapPicker from "@/components/LeafletMapPicker";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  embedded?: boolean;
}

const features = [
  { icon: Wrench, title: "Professional ustalar", desc: "Tajribali va sertifikatlangan" },
  { icon: Shield, title: "Kafolat", desc: "Barcha ishlar kafolatli" },
  { icon: Clock, title: "Tezkor javob", desc: "30 daqiqa ichida usta topiladi" },
];

const YordamSection = ({ embedded }: Props) => {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newImages = Array.from(files).slice(0, 5 - images.length).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages].slice(0, 5));
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const copy = [...prev];
      URL.revokeObjectURL(copy[index].preview);
      copy.splice(index, 1);
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast({ title: "Muammoni tavsiflang", variant: "destructive" });
      return;
    }
    setLoading(true);

    try {
      // Create help request
      const locationStr = locationCoords
        ? `${location} (${locationCoords.lat.toFixed(6)}, ${locationCoords.lng.toFixed(6)})`
        : location || null;

      const { data: helpRequest, error: helpError } = await supabase
        .from("help_requests")
        .insert({
          description: description.trim(),
          location: locationStr,
          user_id: crypto.randomUUID(),
        })
        .select()
        .single();

      if (helpError) throw helpError;

      // Upload images
      if (images.length > 0 && helpRequest) {
        for (const img of images) {
          const ext = img.file.name.split(".").pop() || "jpg";
          const path = `${helpRequest.id}/${crypto.randomUUID()}.${ext}`;

          const { error: uploadError } = await supabase.storage
            .from("help-images")
            .upload(path, img.file);

          if (!uploadError) {
            const { data: urlData } = supabase.storage
              .from("help-images")
              .getPublicUrl(path);

            await supabase.from("help_request_images").insert({
              help_request_id: helpRequest.id,
              image_url: urlData.publicUrl,
            });
          }
        }
      }

      setSent(true);
      toast({ title: "So'rovingiz yuborildi! ✅", description: "Tez orada usta topiladi." });

      setTimeout(() => {
        setSent(false);
        setDescription("");
        setLocation("");
        setLocationCoords(null);
        setImages([]);
      }, 4000);
    } catch (error) {
      console.error("Error submitting help request:", error);
      toast({ title: "Xatolik yuz berdi", description: "Iltimos qaytadan urinib ko'ring", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={embedded ? "p-6 md:p-10" : "py-16 md:py-24"}>
      <div className={embedded ? "" : "container mx-auto px-4"}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-destructive/10 px-5 py-2 text-sm font-semibold text-destructive">
            <Sparkles className="h-4 w-4" />
            Yordam kerakmi?
          </span>
          <h2 className="font-display text-4xl font-bold text-foreground md:text-5xl lg:text-6xl mt-4">
            Muammoni <span className="text-gradient">hal qiling</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Buzilgan yoki nosoz narsaning rasmini tashlang — biz sizga eng yaqin va eng mos ustani topamiz
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-3xl mb-10 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {features.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-2xl border bg-card/50 backdrop-blur-sm p-4 transition-all hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{f.title}</p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onSubmit={handleSubmit}
          className="mx-auto max-w-3xl space-y-6 rounded-3xl border-2 border-border/50 bg-card/80 backdrop-blur-xl p-6 md:p-10 shadow-2xl shadow-primary/5"
        >
          {/* Image upload */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <ImagePlus className="h-4 w-4 text-primary" />
              Rasmlar (5 tagacha)
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleFiles(e.dataTransfer.files); }}
              className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border bg-secondary/20 p-8 transition-all hover:border-primary/50 hover:bg-secondary/40 hover:shadow-inner"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 shadow-lg"
              >
                <ImagePlus className="h-8 w-8 text-primary" />
              </motion.div>
              <div className="text-center">
                <p className="text-base font-semibold text-foreground">Rasm yuklash uchun bosing</p>
                <p className="text-sm text-muted-foreground mt-1">yoki shu yerga tashlang • JPG, PNG, WEBP</p>
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />

            <AnimatePresence>
              {images.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex flex-wrap gap-3 pt-2">
                  {images.map((img, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="relative h-28 w-28 overflow-hidden rounded-2xl border-2 border-border shadow-md group"
                    >
                      <img src={img.preview} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Wrench className="h-4 w-4 text-primary" />
              Muammo tavsifi
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Masalan: Oshxonada kran oqyapti, suvni to'xtatib bo'lmaydi. Kran turi — sharli kran, 3 yildan beri ishlatilgan..."
              className="min-h-[120px] rounded-2xl text-base resize-none border-2 focus:border-primary/50 transition-colors"
              maxLength={1000}
            />
            <p className="mt-1 text-xs text-muted-foreground text-right">{description.length}/1000</p>
          </div>

          {/* Location */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
              <span>📍</span>
              Manzil
            </label>
            <LeafletMapPicker
              value={location}
              onChange={(val, lat, lng) => {
                setLocation(val);
                if (lat && lng) setLocationCoords({ lat, lng });
              }}
            />
          </div>

          {/* Submit */}
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center gap-3 py-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10"
                >
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </motion.div>
                <p className="text-lg font-bold text-foreground">So'rov yuborildi!</p>
                <p className="text-sm text-muted-foreground">Tez orada usta topiladi</p>
              </motion.div>
            ) : (
              <motion.div key="button">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl py-4 h-auto text-lg font-bold glow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="inline-block"
                      >
                        ⏳
                      </motion.span>
                      Yuborilmoqda...
                    </span>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" /> Usta topish
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>
      </div>
    </section>
  );
};

export default YordamSection;
