import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send as SendIcon, ExternalLink, Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const TELEGRAM_BOT_URL = "https://t.me/ishtop_sayt_bot";

interface QuickAction {
  emoji: string;
  label: string;
  command: string;
}

const quickActions: QuickAction[] = [
  { emoji: "🔧", label: "Xizmatlar", command: "/xizmatlar" },
  { emoji: "🔎", label: "Usta topish", command: "/usta" },
  { emoji: "💰", label: "Narxlar", command: "/narxlar" },
  { emoji: "❓", label: "Yordam", command: "/yordam" },
  { emoji: "📞", label: "Aloqa", command: "/aloqa" },
];

const TelegramWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const { toast } = useToast();

  // Stop pulse after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenTelegram = () => {
    window.open(TELEGRAM_BOT_URL, "_blank", "noopener,noreferrer");
    toast({
      title: "Telegram ochilmoqda... 🚀",
      description: "Bot bilan suhbat boshlang!",
    });
  };

  return (
    <>
      {/* Floating Telegram Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="mb-4 w-80 overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl"
              style={{
                backdropFilter: "blur(20px)",
                boxShadow: "0 25px 50px -12px rgba(0, 136, 204, 0.25), 0 0 0 1px rgba(0, 136, 204, 0.1)",
              }}
            >
              {/* Header */}
              <div
                className="relative overflow-hidden p-5"
                style={{
                  background: "linear-gradient(135deg, #0088cc 0%, #00a8e8 50%, #0077b6 100%)",
                }}
              >
                {/* Decorative circles */}
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
                <div className="absolute -left-4 bottom-0 h-16 w-16 rounded-full bg-white/5" />
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                      <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">IshTop Bot</h3>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-xs text-white/80">Online • 24/7</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white/90 transition-colors hover:bg-white/30"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Welcome message */}
                <div className="rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 p-4 border border-blue-100 dark:border-blue-800/30">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                      <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Salom! 👋</p>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        Men IshTop.uz rasmiy Telegram botiman. Usta topish, narxlarni bilish va xizmatlar haqida ma'lumot olish uchun menga yozing!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Tez buyruqlar
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {quickActions.map((action) => (
                      <motion.button
                        key={action.command}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleOpenTelegram}
                        className="flex items-center gap-1.5 rounded-full border border-border/60 bg-secondary/50 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary hover:border-primary/30"
                      >
                        <span>{action.emoji}</span>
                        <span>{action.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: "⚡", text: "Tez javob" },
                    { icon: "🔒", text: "Xavfsiz" },
                    { icon: "🆓", text: "Bepul" },
                  ].map((item) => (
                    <div
                      key={item.text}
                      className="flex flex-col items-center gap-1 rounded-lg bg-secondary/30 p-2"
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-[10px] font-medium text-muted-foreground">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  onClick={handleOpenTelegram}
                  className="w-full gap-2 rounded-xl py-3 h-auto text-sm font-semibold"
                  style={{
                    background: "linear-gradient(135deg, #0088cc 0%, #00a8e8 100%)",
                  }}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                  Telegram da ochish
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>

                <p className="text-center text-[10px] text-muted-foreground">
                  Telegram ilovasida ochiladi • <Sparkles className="inline h-3 w-3" /> 24/7 xizmat
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FAB Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-shadow hover:shadow-xl"
          style={{
            background: "linear-gradient(135deg, #0088cc 0%, #00a8e8 100%)",
          }}
        >
          {/* Pulse ring */}
          {showPulse && !isOpen && (
            <>
              <span
                className="absolute inset-0 animate-ping rounded-full opacity-30"
                style={{ background: "#0088cc" }}
              />
              <span
                className="absolute -inset-1 animate-pulse rounded-full opacity-20"
                style={{ background: "#0088cc" }}
              />
            </>
          )}

          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="telegram"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Notification badge */}
          {!isOpen && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-background"
            >
              1
            </motion.span>
          )}
        </motion.button>


      </div>
    </>
  );
};

export default TelegramWidget;
