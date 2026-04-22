import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({ title: "Xatolik", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Muvaffaqiyatli kirildi! ✅" });
        navigate("/profil");
      }
    } else {
      if (!fullName.trim()) {
        toast({ title: "Ismingizni kiriting", variant: "destructive" });
        setLoading(false);
        return;
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName }, emailRedirectTo: window.location.origin },
      });
      if (error) {
        toast({ title: "Xatolik", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Ro'yxatdan o'tdingiz! 🎉", description: "Email manzilingizni tasdiqlang." });
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      {/* Top bar */}
      <div className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="rounded-xl">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground shadow-lg">
            IT
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            IshTop<span className="text-primary">.uz</span>
          </h1>
        </div>

        {/* Card */}
        <div className="rounded-2xl border bg-card p-6 shadow-xl sm:p-8">
          <h2 className="mb-1 text-center font-display text-xl font-bold text-foreground">
            {isLogin ? "Tizimga kirish" : "Ro'yxatdan o'tish"}
          </h2>
          <p className="mb-6 text-center text-sm text-muted-foreground">
            {isLogin ? "Hisobingizga kirish uchun ma'lumotlaringizni kiriting" : "Yangi hisob yarating va xizmatlardan foydalaning"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">To'liq ism</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ismingiz" className="rounded-xl pl-10" />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="rounded-xl pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pw">Parol</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="pw" type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="rounded-xl pl-10 pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full rounded-xl glow-sm">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? "Kirish" : "Ro'yxatdan o'tish"}
            </Button>
          </form>

          <div className="mt-5 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-primary hover:underline">
              {isLogin ? "Hisobingiz yo'qmi? Ro'yxatdan o'ting" : "Hisobingiz bormi? Tizimga kiring"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
