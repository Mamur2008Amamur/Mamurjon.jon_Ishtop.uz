import { useState } from "react";
import { X, CreditCard, Banknote, Smartphone, CheckCircle, Loader2, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  specialist?: string;
  service?: string;
  amount?: string;
}

const paymentMethods = [
  { id: "card", icon: CreditCard, label: "Karta orqali", desc: "Visa, MasterCard, Humo, UzCard", color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "payme", icon: Smartphone, label: "Payme", desc: "Payme hamyon orqali to'lash", color: "text-blue-400", bg: "bg-blue-400/10" },
  { id: "click", icon: Smartphone, label: "Click", desc: "Click ilovasi orqali to'lash", color: "text-green-500", bg: "bg-green-500/10" },
  { id: "cash", icon: Banknote, label: "Naqd pul", desc: "Ustaga yuzma-yuz to'lash", color: "text-amber-500", bg: "bg-amber-500/10" },
];

const PaymentModal = ({ open, onClose, specialist = "Aziz Karimov", service = "Santexnik xizmati", amount = "150 000" }: PaymentModalProps) => {
  const [method, setMethod] = useState("");
  const [step, setStep] = useState<"select" | "card" | "confirm" | "success">("select");
  const [loading, setLoading] = useState(false);
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const formatCard = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };

  const handlePay = () => {
    if (method === "card") { setStep("card"); return; }
    setStep("confirm");
  };

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("success"); }, 2000);
  };

  const handleClose = () => {
    setStep("select"); setMethod(""); setCardNum(""); setExpiry(""); setCvv("");
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

            {/* Header */}
            <div className="bg-gradient-to-br from-primary to-accent p-6 text-primary-foreground">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">To'lov</p>
                  <h3 className="text-xl font-bold">{service}</h3>
                  <p className="text-sm opacity-80 mt-0.5">{specialist}</p>
                </div>
                <button onClick={handleClose} className="rounded-full bg-white/20 p-2 hover:bg-white/30">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 rounded-2xl bg-white/20 px-5 py-3">
                <p className="text-sm opacity-80">Jami summa</p>
                <p className="text-3xl font-bold">{amount} so'm</p>
              </div>
            </div>

            <div className="p-6">
              {/* Step: select method */}
              {step === "select" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="mb-4 font-semibold text-foreground">To'lov usulini tanlang</p>
                  <div className="space-y-3">
                    {paymentMethods.map(m => (
                      <button key={m.id} onClick={() => setMethod(m.id)}
                        className={`w-full flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${method === m.id ? "border-primary bg-primary/5 shadow-md" : "hover:border-primary/40"}`}>
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${m.bg}`}>
                          <m.icon className={`h-5 w-5 ${m.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground text-sm">{m.label}</p>
                          <p className="text-xs text-muted-foreground">{m.desc}</p>
                        </div>
                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${method === m.id ? "border-primary" : "border-muted"}`}>
                          {method === m.id && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                        </div>
                      </button>
                    ))}
                  </div>
                  <Button onClick={handlePay} disabled={!method} className="mt-5 w-full rounded-2xl h-12 text-base font-bold">
                    Davom etish
                  </Button>
                </motion.div>
              )}

              {/* Step: card input */}
              {step === "card" && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <div className="flex items-center gap-2 mb-5">
                    <button onClick={() => setStep("select")} className="text-muted-foreground hover:text-foreground text-sm">← Orqaga</button>
                    <p className="font-semibold text-foreground">Karta ma'lumotlari</p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Karta raqami</label>
                      <input value={cardNum} onChange={e => setCardNum(formatCard(e.target.value))}
                        placeholder="0000 0000 0000 0000"
                        className="w-full rounded-xl border bg-background px-4 py-3 text-foreground outline-none focus:ring-2 ring-primary/30 font-mono tracking-widest" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Muddati</label>
                        <input value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))}
                          placeholder="MM/YY"
                          className="w-full rounded-xl border bg-background px-4 py-3 text-foreground outline-none focus:ring-2 ring-primary/30 font-mono" />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">CVV</label>
                        <input value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                          placeholder="***" type="password"
                          className="w-full rounded-xl border bg-background px-4 py-3 text-foreground outline-none focus:ring-2 ring-primary/30 font-mono" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Lock className="h-3.5 w-3.5" /> Ma'lumotlaringiz xavfsiz SSL orqali himoyalangan
                  </div>
                  <Button onClick={() => setStep("confirm")} disabled={cardNum.length < 19 || expiry.length < 5 || cvv.length < 3}
                    className="mt-5 w-full rounded-2xl h-12 text-base font-bold">
                    Tasdiqlash
                  </Button>
                </motion.div>
              )}

              {/* Step: confirm */}
              {step === "confirm" && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <p className="font-semibold text-foreground mb-4">Tasdiqlash</p>
                  <div className="rounded-2xl border bg-secondary/30 p-4 space-y-3 mb-5">
                    {[["Xizmat", service], ["Mutaxassis", specialist], ["To'lov usuli", paymentMethods.find(m => m.id === method)?.label || ""], ["Summa", `${amount} so'm`]].map(([k, v]) => (
                      <div key={k} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{k}</span>
                        <span className="font-semibold text-foreground">{v}</span>
                      </div>
                    ))}
                  </div>
                  <Button onClick={handleConfirm} disabled={loading} className="w-full rounded-2xl h-12 text-base font-bold">
                    {loading ? <><Loader2 className="h-5 w-5 animate-spin mr-2" />To'lanmoqda...</> : `${amount} so'm to'lash`}
                  </Button>
                </motion.div>
              )}

              {/* Step: success */}
              {step === "success" && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}
                    className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
                    <CheckCircle className="h-10 w-10 text-green-500" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-foreground">To'lov muvaffaqiyatli!</h3>
                  <p className="mt-2 text-muted-foreground text-sm">
                    {amount} so'm {specialist} ga muvaffaqiyatli o'tkazildi
                  </p>
                  <div className="mt-4 rounded-2xl bg-secondary/30 p-4">
                    <p className="text-xs text-muted-foreground">Tranzaksiya ID</p>
                    <p className="font-mono font-bold text-foreground text-sm">#TXN{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
                  </div>
                  <Button onClick={handleClose} className="mt-5 w-full rounded-2xl h-12">Yopish</Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
