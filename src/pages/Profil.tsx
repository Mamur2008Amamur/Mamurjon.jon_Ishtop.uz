import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, User, Mail, Phone, MapPin, Save, LogOut, Loader2,
<<<<<<< HEAD
  Shield, Calendar, Camera, ExternalLink, Sparkles, ChevronRight, Lock, Palette,
  UserCheck, FileText, Home, BarChart2, Copy,
  Moon, Sun, BellRing, Globe2, Smartphone,
  CheckCircle2, Settings, LayoutDashboard, KeyRound, EyeOff, Eye, MessageSquare
} from "lucide-react";
=======
  Shield, Calendar, Edit3, Camera, Star, Briefcase, Award,
  Globe, MessageSquare, Heart, Clock, CheckCircle2, Zap,
  TrendingUp, Target, Bell, Settings, HelpCircle, Share2,
  ExternalLink, Sparkles, ChevronRight, Lock, Palette,
  UserCheck, FileText, Home, BarChart2, Copy
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";
>>>>>>> 9e3f45b0ee34d0c9b3b0b17417f24ac9ba002cd8
import ThemeToggle from "@/components/ThemeToggle";
import type { User as SupaUser } from "@supabase/supabase-js";

interface Profile {
  full_name: string | null;
  phone: string | null;
  city: string | null;
  bio: string | null;
  avatar_url: string | null;
}

<<<<<<< HEAD
type Tab = "profil" | "xavfsizlik" | "sozlamalar";

const COVER_IMG = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop";

const Profil = () => {
  const [user, setUser] = useState<SupaUser | null>(null);
  const [profile, setProfile] = useState<Profile>({ full_name: "", phone: "", city: "", bio: "", avatar_url: null });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState<Tab>("profil");
  
  // Settings state
  const [darkTheme, setDarkTheme] = useState(() => document.documentElement.classList.contains("dark"));
  const [notifPush, setNotifPush] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [language, setLanguage] = useState("uz");

  // Password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);

=======
type Tab = "profil" | "faoliyat" | "sozlamalar";

const COVER_IMGS = [
  "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&fit=crop",
  "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800&q=80&fit=crop",
];

const Profil = () => {
  const [user,     setUser]     = useState<SupaUser | null>(null);
  const [profile,  setProfile]  = useState<Profile>({ full_name: "", phone: "", city: "", bio: "", avatar_url: null });
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [editing,  setEditing]  = useState(false);
  const [uploading,setUploading]= useState(false);
  const [tab,      setTab]      = useState<Tab>("profil");
  const [helpCount,setHelpCount]= useState(0);
  const [coverIdx, setCoverIdx] = useState(0);
>>>>>>> 9e3f45b0ee34d0c9b3b0b17417f24ac9ba002cd8
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
<<<<<<< HEAD
    let isMounted = true;
    const timeoutId = setTimeout(async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;
        if (!session) { navigate("/auth"); return; }
        setUser(session.user);
        loadProfile(session.user.id);
      } catch (err) {
        if (isMounted) setLoading(false);
      }
    }, 100);
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => {
      if (!isMounted) return;
      if (!s) navigate("/auth");
      else setUser(s.user);
    });
    
    return () => { 
      isMounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    if (darkTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkTheme]);

=======
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { navigate("/auth"); return; }
      setUser(session.user);
      loadProfile(session.user.id);
      loadHelpCount(session.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => {
      if (!s) navigate("/auth");
      else setUser(s.user);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

>>>>>>> 9e3f45b0ee34d0c9b3b0b17417f24ac9ba002cd8
  const loadProfile = async (uid: string) => {
    const { data } = await supabase.from("profiles").select("*").eq("user_id", uid).maybeSingle();
    if (data) setProfile({ full_name: data.full_name, phone: data.phone, city: data.city, bio: data.bio, avatar_url: data.avatar_url });
    setLoading(false);
  };
<<<<<<< HEAD

=======
  const loadHelpCount = async (uid: string) => {
    const { count } = await supabase.from("help_requests").select("*", { count: "exact", head: true }).eq("user_id", uid);
    setHelpCount(count || 0);
  };
>>>>>>> 9e3f45b0ee34d0c9b3b0b17417f24ac9ba002cd8
  const uploadAvatar = async (file: File) => {
    if (!user) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `avatars/${user.id}.${ext}`;
    const { error } = await supabase.storage.from("help-images").upload(path, file, { upsert: true });
    if (error) { toast({ title: "Xatolik", description: error.message, variant: "destructive" }); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("help-images").getPublicUrl(path);
    const url = `${publicUrl}?t=${Date.now()}`;
    await supabase.from("profiles").update({ avatar_url: url }).eq("user_id", user.id);
    setProfile(p => ({ ...p, avatar_url: url }));
    toast({ title: "Rasm yuklandi ✅" });
    setUploading(false);
  };
<<<<<<< HEAD

=======
>>>>>>> 9e3f45b0ee34d0c9b3b0b17417f24ac9ba002cd8
  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: profile.full_name, phone: profile.phone, city: profile.city, bio: profile.bio,
    }).eq("user_id", user.id);
    if (error) toast({ title: "Xatolik", description: error.message, variant: "destructive" });
<<<<<<< HEAD
    else toast({ title: "Profil saqlandi ✅", description: "Ma'lumotlaringiz muvaffaqiyatli yangilandi." });
    setSaving(false);
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: "Xatolik", description: "Parollar mos tushmadi!", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Xatolik", description: "Parol kamida 6 ta belgidan iborat bo'lishi kerak.", variant: "destructive" });
      return;
    }
    setSavingPwd(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({ title: "Xatolik yuz berdi", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Parol yangilandi ✅", description: "Yangi parol muvaffaqiyatli o'rnatildi." });
      setNewPassword("");
      setConfirmPassword("");
    }
    setSavingPwd(false);
  };

  const handleLogout = async () => { await supabase.auth.signOut(); navigate("/"); };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
=======
    else { toast({ title: "Profil saqlandi ✅" }); setEditing(false); }
    setSaving(false);
  };
  const handleLogout = async () => { await supabase.auth.signOut(); navigate("/"); };
  const copyLink = () => { navigator.clipboard.writeText(`${window.location.origin}/profil`); toast({ title: "Havola nusxalandi ✅" }); };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>
      </div>
>>>>>>> 9e3f45b0ee34d0c9b3b0b17417f24ac9ba002cd8
    </div>
  );

  const initials = profile.full_name
    ? profile.full_name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || "??";
<<<<<<< HEAD
  const since = user?.created_at ? new Date(user.created_at).toLocaleDateString("uz-UZ", { year: "numeric", month: "long" }) : "";

  return (
    <div className="min-h-screen bg-muted/30">
      {/* ── TOP NAV ── */}
      <nav className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-xl px-4 lg:px-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-xl bg-secondary/50 hover:bg-secondary" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="font-display text-lg font-bold">Shaxsiy Kabinet</span>
        </div>
        <ThemeToggle />
      </nav>

      <div className="container mx-auto px-4 py-8 lg:px-8 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* ── LEFT SIDEBAR (USER CARD & NAV) ── */}
          <div className="w-full lg:w-[320px] shrink-0 space-y-6">
            
            {/* User Card */}
            <div className="rounded-3xl border bg-card overflow-hidden shadow-sm">
              <div className="h-28 relative">
                <img src={COVER_IMG} alt="cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              
              <div className="px-6 pb-6 relative">
                <div className="flex justify-between items-end -mt-12 mb-4">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => fileRef.current?.click()}
                    className="relative h-24 w-24 rounded-2xl border-4 border-card bg-gradient-to-br from-primary to-accent shadow-xl overflow-hidden group">
                    {profile.avatar_url
                      ? <img src={profile.avatar_url} alt="avatar" className="h-full w-full object-cover" />
                      : <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-primary-foreground">{initials}</div>
                    }
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      {uploading ? <Loader2 className="h-6 w-6 animate-spin text-white" /> : <Camera className="h-6 w-6 text-white" />}
                    </div>
                  </motion.button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadAvatar(f); }} />
                  
                  <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-600 mb-2">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Faol
                  </span>
                </div>

                <h1 className="text-xl font-bold text-foreground">{profile.full_name || "Foydalanuvchi"}</h1>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>Ro'yxatdan o'tgan: {since}</span>
                  </div>
                  {profile.city && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{profile.city}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar Navigation */}
            <div className="rounded-3xl border bg-card p-3 shadow-sm flex flex-col gap-1">
              {[
                { id: "profil", icon: User, label: "Asosiy ma'lumotlar" },
                { id: "xavfsizlik", icon: Shield, label: "Xavfsizlik va Parol" },
                { id: "sozlamalar", icon: Settings, label: "Sozlamalar" },
              ].map(t => (
                <button key={t.id} onClick={() => setTab(t.id as Tab)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-semibold text-sm ${
                    tab === t.id ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}>
                  <t.icon className="h-5 w-5" />
                  {t.label}
                </button>
              ))}
              
              <div className="h-px bg-border my-2 mx-2" />
              
              <button onClick={() => navigate("/chat")}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-semibold text-sm text-blue-500 hover:bg-blue-500/10">
                <MessageSquare className="h-5 w-5" /> Xabarlar (Chat)
              </button>
              
              <button onClick={() => navigate("/admin")}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-semibold text-sm text-purple-500 hover:bg-purple-500/10">
                <LayoutDashboard className="h-5 w-5" /> Admin Panel
              </button>
              <button onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-semibold text-sm text-red-500 hover:bg-red-500/10">
                <LogOut className="h-5 w-5" /> Chiqish
              </button>
            </div>
          </div>

          {/* ── RIGHT MAIN CONTENT ── */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              
              {/* === PROFIL MA'LUMOTLARI === */}
              {tab === "profil" && (
                <motion.div key="profil" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="rounded-3xl border bg-card p-6 lg:p-8 shadow-sm">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                      <User className="h-6 w-6 text-primary" /> Shaxsiy ma'lumotlar
                    </h2>
                    <p className="text-muted-foreground mt-1 text-sm">Saytdagi asosiy ko'rinishingizni sozlang.</p>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold">To'liq ism</Label>
                      <Input value={profile.full_name || ""} onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))}
                        className="h-12 rounded-xl bg-secondary/50 border-transparent focus:border-primary focus:bg-background transition-all" placeholder="Ismingizni kiriting" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-bold flex items-center gap-1"><Lock className="h-3.5 w-3.5" /> Email (O'zgartirib bo'lmaydi)</Label>
                      <Input value={user?.email || ""} disabled
                        className="h-12 rounded-xl opacity-70 bg-secondary/50 border-transparent" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-bold">Telefon raqam</Label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input value={profile.phone || ""} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                          className="h-12 rounded-xl bg-secondary/50 border-transparent pl-11 focus:border-primary focus:bg-background transition-all" placeholder="+998 90 123 45 67" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-bold">Shahar / Viloyat</Label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input value={profile.city || ""} onChange={e => setProfile(p => ({ ...p, city: e.target.value }))}
                          className="h-12 rounded-xl bg-secondary/50 border-transparent pl-11 focus:border-primary focus:bg-background transition-all" placeholder="Masalan: Toshkent" />
                      </div>
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <Label className="text-sm font-bold">O'zingiz haqingizda (Bio)</Label>
                      <Textarea value={profile.bio || ""} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                        className="min-h-[120px] rounded-xl bg-secondary/50 border-transparent p-4 resize-none focus:border-primary focus:bg-background transition-all" placeholder="Tajribangiz va xizmatlaringiz haqida qisqacha..." />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <Button onClick={saveProfile} disabled={saving} size="lg" className="rounded-xl px-8 font-bold gap-2 shadow-lg shadow-primary/20">
                      {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />} Saqlash
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* === XAVFSIZLIK VA PAROL === */}
              {tab === "xavfsizlik" && (
                <motion.div key="xavfsizlik" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-6">
                  
                  <div className="rounded-3xl border bg-card p-6 lg:p-8 shadow-sm">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <KeyRound className="h-6 w-6 text-primary" /> Parolni almashtirish
                      </h2>
                      <p className="text-muted-foreground mt-1 text-sm">Hisobingiz xavfsizligini ta'minlash uchun kuchli paroldan foydalaning.</p>
                    </div>

                    <form onSubmit={changePassword} className="space-y-5 max-w-md">
                      <div className="space-y-2">
                        <Label className="text-sm font-bold">Yangi parol</Label>
                        <div className="relative">
                          <Input type={showPwd ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={6}
                            className="h-12 rounded-xl bg-secondary/50 border-transparent pr-12 focus:border-primary focus:bg-background transition-all" placeholder="••••••••" />
                          <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-bold">Parolni tasdiqlang</Label>
                        <Input type={showPwd ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={6}
                          className="h-12 rounded-xl bg-secondary/50 border-transparent focus:border-primary focus:bg-background transition-all" placeholder="••••••••" />
                      </div>

                      <Button type="submit" disabled={savingPwd || !newPassword || !confirmPassword} className="w-full h-12 rounded-xl font-bold gap-2">
                        {savingPwd ? <Loader2 className="h-5 w-5 animate-spin" /> : <Shield className="h-5 w-5" />} Parolni yangilash
                      </Button>
                    </form>
                  </div>
                </motion.div>
              )}

              {/* === SOZLAMALAR === */}
              {tab === "sozlamalar" && (
                <motion.div key="sozlamalar" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-6">
                  
                  <div className="mb-2">
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                      <Settings className="h-6 w-6 text-primary" /> Sozlamalar
                    </h2>
                    <p className="text-muted-foreground mt-1 text-sm">Ilova ko'rinishi va xabarnomalarni o'zingizga moslashtiring.</p>
                  </div>

                  {/* Ko'rinish (Mavzu) */}
                  <div className="rounded-3xl border bg-card p-6 shadow-sm">
                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                      <Palette className="h-5 w-5 text-primary" /> Ko'rinish
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button onClick={() => setDarkTheme(false)}
                        className={`flex-1 flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${!darkTheme ? "border-primary bg-primary/5" : "border-transparent bg-secondary/50 hover:bg-secondary"}`}>
                        <div className="h-12 w-12 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center">
                          <Sun className="h-6 w-6" />
                        </div>
                        <span className="font-bold text-sm">Yorug' mavzu</span>
                      </button>
                      <button onClick={() => setDarkTheme(true)}
                        className={`flex-1 flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${darkTheme ? "border-primary bg-primary/5" : "border-transparent bg-secondary/50 hover:bg-secondary"}`}>
                        <div className="h-12 w-12 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                          <Moon className="h-6 w-6" />
                        </div>
                        <span className="font-bold text-sm">Tungi mavzu</span>
                      </button>
                    </div>
                  </div>

                  {/* Bildirishnomalar */}
                  <div className="rounded-3xl border bg-card p-6 shadow-sm">
                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                      <BellRing className="h-5 w-5 text-primary" /> Bildirishnomalar
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                            <Smartphone className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-foreground">Push xabarnomalar</p>
                            <p className="text-xs text-muted-foreground">Brauzer orqali xabarlar olish</p>
                          </div>
                        </div>
                        <button onClick={() => { setNotifPush(!notifPush); toast({ title: notifPush ? "Push o'chirildi" : "Push yoqildi" }); }}
                          className={`relative h-7 w-12 rounded-full transition-colors ${notifPush ? "bg-primary" : "bg-muted"}`}>
                          <motion.div animate={{ x: notifPush ? 20 : 2 }} className="absolute top-1 left-0 h-5 w-5 rounded-full bg-white shadow-sm" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center">
                            <Mail className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-foreground">Email xabarnomalar</p>
                            <p className="text-xs text-muted-foreground">Pochtaga xatlar yuborish</p>
                          </div>
                        </div>
                        <button onClick={() => { setNotifEmail(!notifEmail); toast({ title: notifEmail ? "Email o'chirildi" : "Email yoqildi" }); }}
                          className={`relative h-7 w-12 rounded-full transition-colors ${notifEmail ? "bg-primary" : "bg-muted"}`}>
                          <motion.div animate={{ x: notifEmail ? 20 : 2 }} className="absolute top-1 left-0 h-5 w-5 rounded-full bg-white shadow-sm" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Til */}
                  <div className="rounded-3xl border bg-card p-6 shadow-sm">
                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                      <Globe2 className="h-5 w-5 text-primary" /> Til (Tez orada)
                    </h3>
                    <div className="flex gap-3">
                      <button onClick={() => setLanguage("uz")}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${language === "uz" ? "bg-primary text-primary-foreground shadow-md" : "bg-secondary text-muted-foreground hover:bg-secondary/70"}`}>
                        🇺🇿 O'zbekcha
                      </button>
                      <button onClick={() => toast({ title: "Rus tili tez orada qo'shiladi!" })}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all bg-secondary text-muted-foreground hover:bg-secondary/70 opacity-60`}>
                        🇷🇺 Русский
                      </button>
                    </div>
                  </div>

                </motion.div>
              )}

            </AnimatePresence>
          </div>

=======
  const completion = [profile.full_name, profile.phone, profile.city, profile.bio, profile.avatar_url].filter(Boolean).length * 20;
  const since = user?.created_at ? new Date(user.created_at).toLocaleDateString("uz-UZ", { year: "numeric", month: "long" }) : "";

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "profil",     label: "Profil",     icon: User },
    { id: "faoliyat",   label: "Faoliyat",   icon: BarChart2 },
    { id: "sozlamalar", label: "Sozlamalar", icon: Settings },
  ];

  const weekData = [
    { d: "Du", v: 2 }, { d: "Se", v: 4 }, { d: "Ch", v: 3 },
    { d: "Pa", v: 6 }, { d: "Ju", v: 5 }, { d: "Sh", v: 8 }, { d: "Ya", v: Math.max(2, helpCount) },
  ];

  return (
    <div className="min-h-screen bg-background">

      {/* ── TOP NAV ── */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b bg-background/80 backdrop-blur-xl px-4 h-14">
        <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => navigate("/")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <span className="font-bold text-foreground text-base">Profil</span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="rounded-xl" onClick={copyLink}><Share2 className="h-4 w-4" /></Button>
          <ThemeToggle />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-0 sm:px-4 pt-14 pb-8">

        {/* ── COVER + AVATAR ── */}
        <div className="relative">
          {/* Cover */}
          <div className="relative h-44 sm:h-52 overflow-hidden sm:rounded-b-none">
            <img src={COVER_IMGS[coverIdx]} alt="cover"
              className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            {/* Change cover btn */}
            <button onClick={() => setCoverIdx(i => (i + 1) % COVER_IMGS.length)}
              className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur px-3 py-1.5 text-xs text-white font-medium hover:bg-black/60 transition">
              <Camera className="h-3.5 w-3.5" /> Fon
            </button>
          </div>

          {/* Avatar */}
          <div className="absolute -bottom-12 left-4 sm:left-6">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => fileRef.current?.click()}
              className="relative h-24 w-24 rounded-2xl border-4 border-background bg-gradient-to-br from-primary to-accent shadow-2xl overflow-hidden group">
              {profile.avatar_url
                ? <img src={profile.avatar_url} alt="avatar" className="h-full w-full object-cover" />
                : <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-primary-foreground">{initials}</div>
              }
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                {uploading ? <Loader2 className="h-6 w-6 animate-spin text-white" /> : <Camera className="h-6 w-6 text-white" />}
              </div>
              <div className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-background bg-green-500" />
            </motion.button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadAvatar(f); }} />
          </div>

          {/* Edit btn top right */}
          <div className="absolute -bottom-10 right-4 sm:right-6">
            <Button size="sm" variant={editing ? "default" : "outline"}
              className="rounded-xl gap-1.5 h-9 px-4 font-semibold"
              onClick={() => editing ? saveProfile() : setEditing(true)}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" />
                : editing ? <><Save className="h-4 w-4" /> Saqlash</>
                : <><Edit3 className="h-4 w-4" /> Tahrirlash</>}
            </Button>
          </div>
        </div>

        {/* ── NAME & META ── */}
        <div className="px-4 sm:px-6 mt-16">
          <h1 className="text-2xl font-bold text-foreground">{profile.full_name || "Foydalanuvchi"}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{user?.email}</p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {profile.city && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 text-primary" /> {profile.city}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 text-primary" /> {since}dan beri
            </span>
            <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3 w-3" /> Faol
            </span>
            <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-semibold text-green-600">
              <Shield className="h-3 w-3" /> Tasdiqlangan
            </span>
          </div>
          {profile.bio && (
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed border-l-2 border-primary/30 pl-3">{profile.bio}</p>
          )}
        </div>

        {/* ── STATS ROW ── */}
        <div className="px-4 sm:px-6 mt-5 grid grid-cols-4 gap-2">
          {[
            { icon: Star,      label: "Reyting",   value: "5.0", color: "text-amber-500",  bg: "bg-amber-500/10" },
            { icon: Briefcase, label: "So'rovlar", value: helpCount, color: "text-blue-500",   bg: "bg-blue-500/10" },
            { icon: Award,     label: "Daraja",    value: "Pro",  color: "text-purple-500", bg: "bg-purple-500/10" },
            { icon: Heart,     label: "Sevimli",   value: "12",   color: "text-red-500",    bg: "bg-red-500/10" },
          ].map(s => (
            <motion.div key={s.label} whileHover={{ y: -3 }}
              className="flex flex-col items-center gap-1 rounded-2xl border bg-card p-3 cursor-default shadow-sm">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.bg}`}>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <span className="text-lg font-bold text-foreground">{s.value}</span>
              <span className="text-[10px] text-muted-foreground text-center">{s.label}</span>
            </motion.div>
          ))}
        </div>

        {/* ── PROGRESS BAR ── */}
        <div className="px-4 sm:px-6 mt-4">
          <div className="rounded-2xl border bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">Profil to'liqligi</span>
              <span className="text-sm font-bold text-primary">{completion}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${completion}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent" />
            </div>
            {completion < 100 && (
              <p className="mt-2 text-xs text-muted-foreground">
                {!profile.avatar_url && "📸 Rasm · "}
                {!profile.phone && "📱 Telefon · "}
                {!profile.bio && "✍️ Bio · "}
                {!profile.city && "📍 Shahar"} qo'shing
              </p>
            )}
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="px-4 sm:px-6 mt-5">
          <div className="flex gap-1 rounded-2xl border bg-card p-1">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all ${tab === t.id ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
                <t.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── TAB CONTENT ── */}
        <div className="px-4 sm:px-6 mt-4">
          <AnimatePresence mode="wait">

            {/* PROFIL TAB */}
            {tab === "profil" && (
              <motion.div key="profil" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                className="space-y-4">

                <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
                  <div className="px-5 py-4 border-b flex items-center justify-between">
                    <h3 className="font-bold text-foreground">Shaxsiy ma'lumotlar</h3>
                    {editing && <button onClick={() => setEditing(false)} className="text-xs text-muted-foreground hover:text-foreground">Bekor</button>}
                  </div>
                  <div className="p-5 space-y-4">
                    {[
                      { icon: User,  label: "To'liq ism", key: "full_name", placeholder: "Ismingiz", type: "input" },
                      { icon: Mail,  label: "Email",       key: "email",     placeholder: user?.email || "", type: "disabled" },
                      { icon: Phone, label: "Telefon",     key: "phone",     placeholder: "+998 90 123 45 67", type: "input" },
                      { icon: MapPin,label: "Shahar",      key: "city",      placeholder: "Toshkent", type: "input" },
                    ].map(f => (
                      <div key={f.key} className="space-y-1.5">
                        <Label className="flex items-center gap-2 text-sm font-semibold">
                          <f.icon className="h-4 w-4 text-primary" />{f.label}
                        </Label>
                        <Input
                          value={f.key === "email" ? (user?.email || "") : ((profile as any)[f.key] || "")}
                          onChange={f.type !== "disabled" ? e => setProfile(p => ({ ...p, [f.key]: e.target.value })) : undefined}
                          disabled={!editing || f.type === "disabled"}
                          className="rounded-xl h-11"
                          placeholder={f.placeholder}
                        />
                      </div>
                    ))}
                    <div className="space-y-1.5">
                      <Label className="flex items-center gap-2 text-sm font-semibold">
                        <Globe className="h-4 w-4 text-primary" /> Bio
                      </Label>
                      <Textarea
                        value={profile.bio || ""} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                        disabled={!editing} className="rounded-xl min-h-[90px] resize-none"
                        placeholder="O'zingiz haqingizda yozing..." />
                    </div>
                    {editing && (
                      <Button onClick={saveProfile} disabled={saving} className="w-full rounded-xl h-11 font-bold gap-2">
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Saqlash
                      </Button>
                    )}
                  </div>
                </div>

                {/* Quick links */}
                <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
                  {[
                    { icon: MessageSquare, label: "Chat",        desc: "Mutaxassislar bilan",  action: () => navigate("/chat"),   color: "text-blue-500",   bg: "bg-blue-500/10" },
                    { icon: HelpCircle,    label: "Yordam",      desc: "Muammo bildirish",     action: () => navigate("/yordam"), color: "text-green-500",  bg: "bg-green-500/10" },
                    { icon: Shield,        label: "Admin panel", desc: "Boshqaruv paneli",     action: () => navigate("/admin"),  color: "text-purple-500", bg: "bg-purple-500/10" },
                    { icon: Home,          label: "Bosh sahifa", desc: "IshTop.uz",            action: () => navigate("/"),       color: "text-primary",    bg: "bg-primary/10" },
                  ].map((item, i, arr) => (
                    <button key={item.label} onClick={item.action}
                      className={`w-full flex items-center gap-4 px-5 py-3.5 hover:bg-secondary/50 transition-colors ${i < arr.length - 1 ? "border-b" : ""}`}>
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.bg}`}>
                        <item.icon className={`h-5 w-5 ${item.color}`} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-foreground text-sm">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* FAOLIYAT TAB */}
            {tab === "faoliyat" && (
              <motion.div key="faoliyat" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                className="space-y-4">

                {/* Chart */}
                <div className="rounded-2xl border bg-card p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-foreground flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" /> Haftalik faollik
                    </h3>
                    <span className="text-xs bg-primary/10 text-primary font-semibold px-2.5 py-1 rounded-full">7 kun</span>
                  </div>
                  <ResponsiveContainer width="100%" height={160}>
                    <AreaChart data={weekData}>
                      <defs>
                        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="d" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
                      <Area type="monotone" dataKey="v" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#g1)" dot={{ fill: "hsl(var(--primary))", r: 3 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Badges */}
                <div className="rounded-2xl border bg-card p-5 shadow-sm">
                  <h3 className="font-bold text-foreground flex items-center gap-2 mb-4">
                    <Award className="h-4 w-4 text-primary" /> Yutuqlar
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { emoji: "🌟", title: "Birinchi qadam", unlocked: true },
                      { emoji: "📸", title: "Fotogenik",      unlocked: !!profile.avatar_url },
                      { emoji: "✍️", title: "Yozuvchi",       unlocked: !!profile.bio },
                      { emoji: "📱", title: "Aloqador",       unlocked: !!profile.phone },
                      { emoji: "🏙️", title: "Mahalliy",       unlocked: !!profile.city },
                      { emoji: "💬", title: "Faol",           unlocked: helpCount > 0 },
                    ].map(b => (
                      <motion.div key={b.title} whileHover={{ scale: 1.04 }}
                        className={`flex flex-col items-center gap-2 rounded-2xl border p-3 text-center transition-all ${b.unlocked ? "bg-primary/5 border-primary/20" : "opacity-40 grayscale"}`}>
                        <span style={{ fontSize: 28 }}>{b.emoji}</span>
                        <span className="text-xs font-semibold text-foreground leading-tight">{b.title}</span>
                        {b.unlocked && <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Level system */}
                <div className="rounded-2xl border bg-card p-5 shadow-sm">
                  <h3 className="font-bold text-foreground flex items-center gap-2 mb-4">
                    <Zap className="h-4 w-4 text-primary" /> Daraja tizimi
                  </h3>
                  <div className="space-y-2">
                    {[
                      { level: "Yangi",     range: "0–5",    color: "from-gray-400 to-gray-500",     min: 0,   max: 5 },
                      { level: "Faol",      range: "5–20",   color: "from-blue-400 to-blue-600",     min: 5,   max: 20 },
                      { level: "Tajribali", range: "20–50",  color: "from-purple-400 to-purple-600", min: 20,  max: 50 },
                      { level: "Ekspert",   range: "50–100", color: "from-amber-400 to-amber-600",   min: 50,  max: 100 },
                      { level: "Legenda",   range: "100+",   color: "from-red-400 to-red-600",       min: 100, max: 9999 },
                    ].map((lvl, i) => {
                      const current = helpCount >= lvl.min && helpCount < lvl.max;
                      return (
                        <div key={lvl.level} className={`flex items-center gap-3 rounded-xl p-3 transition-all ${current ? "bg-primary/5 border border-primary/20" : "opacity-50"}`}>
                          <div className={`h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br ${lvl.color} flex items-center justify-center text-white text-sm font-bold`}>{i + 1}</div>
                          <div className="flex-1">
                            <p className="font-semibold text-foreground text-sm">{lvl.level}</p>
                            <p className="text-xs text-muted-foreground">{lvl.range} so'rov</p>
                          </div>
                          {current && <span className="rounded-full bg-primary text-primary-foreground text-xs px-2.5 py-0.5 font-bold">Hozirgi</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* SOZLAMALAR TAB */}
            {tab === "sozlamalar" && (
              <motion.div key="sozlamalar" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                className="space-y-4">

                {/* Settings groups */}
                {[
                  {
                    title: "Hisob",
                    items: [
                      { icon: UserCheck, label: "Profilni tahrirlash",  desc: "Ma'lumotlarni yangilash",   action: () => { setTab("profil"); setEditing(true); }, color: "text-primary bg-primary/10" },
                      { icon: Lock,      label: "Parol o'zgartirish",   desc: "Hisobni himoyalash",        action: () => {},                                     color: "text-blue-500 bg-blue-500/10" },
                      { icon: Bell,      label: "Bildirishnomalar",     desc: "Push va email",             action: () => {},                                     color: "text-amber-500 bg-amber-500/10" },
                    ]
                  },
                  {
                    title: "Ilova",
                    items: [
                      { icon: Palette,       label: "Mavzu",           desc: "Qoʻng'ir/Yorug'",          action: () => {},                                     color: "text-purple-500 bg-purple-500/10" },
                      { icon: Globe,         label: "Til",             desc: "O'zbek",                    action: () => {},                                     color: "text-green-500 bg-green-500/10" },
                      { icon: Copy,          label: "Havolani ulash",  desc: "Profilni ulashing",         action: copyLink,                                     color: "text-teal-500 bg-teal-500/10" },
                      { icon: ExternalLink,  label: "Bosh sahifa",     desc: "IshTop.uz",                 action: () => navigate("/"),                          color: "text-orange-500 bg-orange-500/10" },
                    ]
                  },
                ].map(group => (
                  <div key={group.title} className="rounded-2xl border bg-card overflow-hidden shadow-sm">
                    <div className="px-5 py-3 border-b">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{group.title}</p>
                    </div>
                    {group.items.map((item, i, arr) => (
                      <button key={item.label} onClick={item.action}
                        className={`w-full flex items-center gap-4 px-5 py-3.5 hover:bg-secondary/50 transition-colors ${i < arr.length - 1 ? "border-b" : ""}`}>
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.color.split(" ")[1]}`}>
                          <item.icon className={`h-4.5 w-4.5 ${item.color.split(" ")[0]}`} style={{ width: 18, height: 18 }} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-semibold text-foreground text-sm">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </button>
                    ))}
                  </div>
                ))}

                {/* Logout */}
                <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-red-500/5 transition-colors">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
                      <LogOut className="h-4.5 w-4.5 text-red-500" style={{ width: 18, height: 18 }} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-red-500 text-sm">Chiqish</p>
                      <p className="text-xs text-muted-foreground">Hisobdan chiqish</p>
                    </div>
                  </button>
                </div>

                {/* App version */}
                <div className="text-center py-4">
                  <p className="text-xs text-muted-foreground">IshTop.uz · Versiya 1.0.0</p>
                  <p className="text-xs text-muted-foreground">O'zbekiston uchun yaratilgan 🇺🇿</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
>>>>>>> 9e3f45b0ee34d0c9b3b0b17417f24ac9ba002cd8
        </div>
      </div>
    </div>
  );
};

export default Profil;
