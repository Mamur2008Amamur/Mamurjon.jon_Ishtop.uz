import { useState } from "react";
import { Bell, X, Check, CheckCheck, MessageSquare, CreditCard, Star, AlertTriangle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const initialNotifs = [
  { id: 1, type: "order", icon: CheckCheck, color: "text-green-500 bg-green-500/10", title: "Buyurtma tasdiqlandi", desc: "Aziz Karimov sizning buyurtmangizni qabul qildi", time: "2 daqiqa oldin", read: false },
  { id: 2, type: "payment", icon: CreditCard, color: "text-blue-500 bg-blue-500/10", title: "To'lov tasdiqlandi", desc: "150 000 so'm muvaffaqiyatli o'tkazildi", time: "15 daqiqa oldin", read: false },
  { id: 3, type: "message", icon: MessageSquare, color: "text-purple-500 bg-purple-500/10", title: "Yangi xabar", desc: "Nodira Umarova: Ertaga kelaman 🙂", time: "1 soat oldin", read: false },
  { id: 4, type: "review", icon: Star, color: "text-amber-500 bg-amber-500/10", title: "Yangi baho", desc: "Jasur Xolmatovga 5 yulduz berdingiz", time: "2 soat oldin", read: true },
  { id: 5, type: "warning", icon: AlertTriangle, color: "text-red-500 bg-red-500/10", title: "Diqqat", desc: "Profilingizni to'ldiring — 70% bajarildi", time: "Kecha", read: true },
  { id: 6, type: "info", icon: Info, color: "text-teal-500 bg-teal-500/10", title: "Yangilik", desc: "IshTop.uz da yangi xizmatlar qo'shildi!", time: "2 kun oldin", read: true },
];

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState(initialNotifs);

  const unread = notifs.filter(n => !n.read).length;

  const markRead = (id: number) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAll = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const remove = (id: number) => setNotifs(prev => prev.filter(n => n.id !== id));

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border bg-card hover:bg-secondary transition-colors">
        <Bell className="h-4 w-4 text-foreground" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }} transition={{ duration: 0.15 }}
              className="absolute right-0 top-11 z-50 w-80 rounded-2xl border bg-card shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between border-b p-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-foreground">Bildirishnomalar</h3>
                  {unread > 0 && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">{unread}</span>}
                </div>
                {unread > 0 && (
                  <button onClick={markAll} className="text-xs text-primary hover:underline font-semibold">
                    Barchasini o'qildi
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifs.length === 0 ? (
                  <div className="py-10 text-center text-muted-foreground text-sm">Bildirishnoma yo'q</div>
                ) : notifs.map(n => (
                  <motion.div key={n.id} layout
                    className={`group flex items-start gap-3 border-b border-border/40 p-4 hover:bg-secondary/40 transition-colors ${!n.read ? "bg-primary/3" : ""}`}>
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${n.color}`}>
                      <n.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0" onClick={() => markRead(n.id)}>
                      <div className="flex items-start justify-between gap-1">
                        <p className={`text-sm font-semibold ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>{n.title}</p>
                        {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.desc}</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">{n.time}</p>
                    </div>
                    <button onClick={() => remove(n.id)}
                      className="shrink-0 opacity-0 group-hover:opacity-100 rounded-lg p-1 text-muted-foreground hover:text-foreground transition-all">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </motion.div>
                ))}
              </div>

              <div className="border-t p-3">
                <Button variant="ghost" size="sm" className="w-full rounded-xl text-xs text-muted-foreground">
                  Barcha bildirishnomalar
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
