import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mail, MessageSquare, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  embedded?: boolean;
}

const ContactSection = ({ embedded }: Props) => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({ title: "Iltimos barcha maydonlarni to'ldiring", variant: "destructive" });
      return;
    }
    setLoading(true);

    const { error } = await supabase.from("contact_messages").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    });

    if (error) {
      toast({ title: "Xatolik yuz berdi", description: "Qaytadan urinib ko'ring", variant: "destructive" });
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
    toast({ title: "Xabaringiz yuborildi! ✉️", description: "Tez orada siz bilan bog'lanamiz." });
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section className={embedded ? "p-6 md:p-10" : "py-20 md:py-28 bg-secondary/50"}>
      <div className={embedded ? "" : "container mx-auto"}>
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col justify-center">
            <span className="mb-3 inline-block w-fit rounded-full bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">Aloqa</span>
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Biz bilan <span className="text-gradient">bog'laning</span>
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Savollaringiz bormi? Bizga xabar yuboring — jamoamiz tez orada javob beradi.
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-4 rounded-xl border bg-card p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Mail className="h-5 w-5" /></div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Email</p>
                  <p className="text-sm text-muted-foreground">info@ishtop.uz</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-xl border bg-card p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><MessageSquare className="h-5 w-5" /></div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Telegram</p>
                  <p className="text-sm text-muted-foreground">@ishtop_uz</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
            <form onSubmit={handleSubmit} className="rounded-2xl border bg-card p-7 shadow-xl glow-lg">
              <h3 className="mb-5 font-display text-xl font-bold text-foreground">Xabar yuborish</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Ismingiz</label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ism Familiya" className="rounded-xl" maxLength={100} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" className="rounded-xl" maxLength={255} />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Xabar</label>
                  <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Xabaringizni yozing..." className="min-h-[100px] rounded-xl" maxLength={1000} />
                </div>
              </div>
              <Button type="submit" disabled={loading || sent} className="mt-5 w-full rounded-xl py-3 h-auto text-base font-semibold glow-sm">
                {sent ? (<><CheckCircle className="mr-2 h-5 w-5" /> Yuborildi!</>) : loading ? "Yuborilmoqda..." : (<><Send className="mr-2 h-5 w-5" /> Yuborish</>)}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
