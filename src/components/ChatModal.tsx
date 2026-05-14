import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, Phone, MoreVertical, Smile } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Specialist } from "@/data/specialists";

interface ChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  specialist: Specialist | null;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "specialist";
  timestamp: Date;
}

const ChatModal = ({ open, onOpenChange, specialist }: ChatModalProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
  };

  if (!specialist) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl max-h-[90vh] flex flex-col border-0 shadow-2xl">
        {/* Header - Professional */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="relative">
              <img
                src={specialist.image}
                alt={specialist.name}
                className="h-12 w-12 rounded-full object-cover ring-2 ring-white/30"
              />
              <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-green-400 rounded-full ring-2 ring-white" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm">{specialist.name}</p>
              <p className="text-xs text-white/80">Online ✓</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
              title="Qo'ng'iroq"
            >
              <Phone className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
            <button
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-background via-background to-background/50">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                } items-end gap-2`}
              >
                {msg.sender === "specialist" && (
                  <img
                    src={specialist.image}
                    alt=""
                    className="h-7 w-7 rounded-full object-cover"
                  />
                )}

                <div
                  className={`max-w-xs px-4 py-2.5 rounded-2xl shadow-sm ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-secondary/80 text-foreground rounded-bl-none border border-border/40"
                  }`}
                >
                  <p className="text-sm break-words leading-relaxed">
                    {msg.text}
                  </p>
                  <p className="text-xs opacity-60 mt-1">
                    {msg.timestamp.toLocaleTimeString("uz-UZ", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {msg.sender === "user" && (
                  <div className="text-xs text-muted-foreground">✓✓</div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {messages.length === 0 && (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Hali haqiqiy xabar yo'q. Yozilgan xabarlar shu yerda ko'rinadi.
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t bg-card/50 backdrop-blur-sm p-3 sm:p-4">
          <div className="flex gap-2 items-end">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
            >
              <Smile className="h-5 w-5" />
            </Button>

            <Input
              placeholder="Xabar yozing..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="rounded-full h-9 px-4 text-sm bg-secondary/50 border-border/40 focus:bg-secondary transition-colors"
            />

            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              size="icon"
              className={`h-9 w-9 rounded-full shrink-0 transition-all ${
                newMessage.trim()
                  ? "bg-primary hover:bg-primary/90"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatModal;
