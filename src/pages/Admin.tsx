import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
<<<<<<< HEAD
import { ArrowLeft, RefreshCw, MapPin, Clock, Loader2, Shield, Users, CheckCircle, AlertCircle, TrendingUp, DollarSign, Ban, Eye, Search, Filter, Bell, FileText, BarChart3, UserX, ChevronDown, X, Phone, Mail, Hash, Briefcase, Send } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { sendTelegramNotification } from "@/utils/telegramBot";

const data = [
  { name: "Dush", users: 120, revenue: 4000 },
  { name: "Sesh", users: 200, revenue: 5000 },
  { name: "Chor", users: 150, revenue: 4500 },
  { name: "Pay", users: 280, revenue: 6000 },
  { name: "Jum", users: 320, revenue: 7500 },
  { name: "Shan", users: 400, revenue: 9000 },
  { name: "Yak", users: 450, revenue: 10500 },
=======
import { ArrowLeft, RefreshCw, MapPin, Clock, Loader2, Shield, Users, CheckCircle, AlertCircle, TrendingUp, DollarSign, Ban, Eye, Search, Filter, Bell, FileText, BarChart3, UserX, ChevronDown } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { motion } from "framer-motion";

const fakeUsers = [
  { id: "u1", name: "Aziz Karimov", email: "aziz@email.com", role: "specialist", status: "active", joined: "2024-01-15", orders: 128, income: "6 400 000" },
  { id: "u2", name: "Dilshod Rahimov", email: "dilshod@email.com", role: "specialist", status: "active", joined: "2024-02-20", orders: 95, income: "5 700 000" },
  { id: "u3", name: "Nodira Umarova", email: "nodira@email.com", role: "client", status: "active", joined: "2024-03-10", orders: 14, income: "0" },
  { id: "u4", name: "Jasur Xolmatov", email: "jasur@email.com", role: "specialist", status: "suspended", joined: "2024-01-05", orders: 76, income: "3 800 000" },
  { id: "u5", name: "Malika Tosheva", email: "malika@email.com", role: "client", status: "active", joined: "2024-04-01", orders: 8, income: "0" },
  { id: "u6", name: "Sardor Aliyev", email: "sardor@email.com", role: "specialist", status: "warning", joined: "2023-12-20", orders: 152, income: "7 600 000" },
];

const fakeAbuseReports = [
  { id: "r1", reporter: "Malika Tosheva", against: "Jasur Xolmatov", reason: "Kelishilgan vaqtda kelmadi", time: "1 soat oldin", severity: "high" },
  { id: "r2", reporter: "Anon foydalanuvchi", against: "Sardor Aliyev", reason: "Narxni oshirib oldi", time: "3 soat oldin", severity: "medium" },
  { id: "r3", reporter: "Nodira Umarova", against: "Noma'lum", reason: "Spam xabarlar", time: "Kecha", severity: "low" },
>>>>>>> 9e3f45b0ee34d0c9b3b0b17417f24ac9ba002cd8
];

const statusColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  in_progress: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
  done: "bg-green-500/10 text-green-600 border-green-500/30",
  cancelled: "bg-red-500/10 text-red-600 border-red-500/30",
};
const statusLabels: Record<string, string> = { new: "Yangi", in_progress: "Jarayonda", done: "Bajarildi", cancelled: "Bekor" };

type Tab = "overview" | "requests" | "users" | "reports" | "income";

const Admin = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [images, setImages] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
<<<<<<< HEAD
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [filter, setFilter] = useState("all");
  const [tab, setTab] = useState<Tab>("overview");
  const [userSearch, setUserSearch] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [testMessage, setTestMessage] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleTestBot = async () => {
    if (!testMessage.trim()) return;
    await sendTelegramNotification(`👨‍💻 <b>Admin Xabari:</b>\n\n${testMessage}`);
    toast({ title: "Xabar yuborildi!", description: "Telegram botga test xabari jo'natildi." });
    setTestMessage("");
  };

=======
  const [filter, setFilter] = useState("all");
  const [tab, setTab] = useState<Tab>("overview");
  const [userSearch, setUserSearch] = useState("");
  const [users, setUsers] = useState(fakeUsers);
  const { toast } = useToast();
  const navigate = useNavigate();

>>>>>>> 9e3f45b0ee34d0c9b3b0b17417f24ac9ba002cd8
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { navigate("/auth"); return; }
      setAuthChecking(false);
      fetchData();
    });
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
<<<<<<< HEAD
    try {
      // Fetch help requests
      const [{ data: reqs }, { data: imgs }, { data: profiles }] = await Promise.all([
        supabase.from("help_requests").select("*").order("created_at", { ascending: false }),
        supabase.from("help_request_images").select("*"),
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      ]);
      
      setRequests(reqs || []);
      setUsers(profiles || []);
      setReports([]); // Hozircha real shikoyatlar bazasi yo'q, bo'sh turadi

      const grouped: Record<string, any[]> = {};
      (imgs || []).forEach((img: any) => {
        if (!grouped[img.help_request_id]) grouped[img.help_request_id] = [];
        grouped[img.help_request_id].push(img);
      });
      setImages(grouped);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast({ title: "Ma'lumotlarni yuklashda xatolik yuz berdi", variant: "destructive" });
    } finally {
      setLoading(false);
    }
=======
    const [{ data: reqs }, { data: imgs }] = await Promise.all([
      supabase.from("help_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("help_request_images").select("*"),
    ]);
    setRequests(reqs || []);
    const grouped: Record<string, any[]> = {};
    (imgs || []).forEach((img: any) => {
      if (!grouped[img.help_request_id]) grouped[img.help_request_id] = [];
      grouped[img.help_request_id].push(img);
    });
    setImages(grouped);
    setLoading(false);
>>>>>>> 9e3f45b0ee34d0c9b3b0b17417f24ac9ba002cd8
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("help_requests").update({ status }).eq("id", id);
    if (error) { toast({ title: "Xatolik", description: error.message, variant: "destructive" }); }
    else { toast({ title: "Status yangilandi ✅" }); setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r)); }
  };

  const toggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "suspended" ? "active" : "suspended" } : u));
    toast({ title: "Foydalanuvchi holati yangilandi ✅" });
  };

  const formatDate = (d: string) => new Date(d).toLocaleString("uz-UZ", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
<<<<<<< HEAD
  const userRequests = (user: any) => requests.filter(r => r.user_id === user?.user_id || r.user_id === user?.id);
  const formatValue = (value: any) => {
    if (value === null || value === undefined || value === "") return "Kiritilmagan";
    if (typeof value === "boolean") return value ? "Ha" : "Yo'q";
    return String(value);
  };
=======
>>>>>>> 9e3f45b0ee34d0c9b3b0b17417f24ac9ba002cd8

  if (authChecking) return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  const stats = {
    total: requests.length,
    new: requests.filter(r => r.status === "new").length,
    in_progress: requests.filter(r => r.status === "in_progress").length,
    done: requests.filter(r => r.status === "done").length,
  };

  const filtered = filter === "all" ? requests : requests.filter(r => r.status === filter);
<<<<<<< HEAD
  const filteredUsers = users.filter(u => 
    (u.full_name || "Foydalanuvchi").toLowerCase().includes(userSearch.toLowerCase()) || 
    (u.phone || "").toLowerCase().includes(userSearch.toLowerCase())
  );
=======
  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()));
>>>>>>> 9e3f45b0ee34d0c9b3b0b17417f24ac9ba002cd8

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "overview", label: "Umumiy", icon: BarChart3 },
    { id: "requests", label: "So'rovlar", icon: FileText },
    { id: "users", label: "Foydalanuvchilar", icon: Users },
    { id: "reports", label: "Shikoyatlar", icon: AlertCircle },
    { id: "income", label: "Daromad", icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/profil")} className="rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="flex items-center gap-2 text-xl font-bold text-foreground">
                <Shield className="h-5 w-5 text-primary" /> Admin Panel
              </h1>
              <p className="text-sm text-muted-foreground">IshTop.uz boshqaruvi</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={fetchData} disabled={loading} className="rounded-xl">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Yangilash
            </Button>
          </div>
        </div>
        {/* Tabs */}
        <div className="container mx-auto px-4 pb-3 flex gap-1 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all ${tab === t.id ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">

        {/* OVERVIEW */}
        {tab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Jami so'rovlar", value: stats.total, icon: FileText, color: "text-foreground", bg: "bg-primary/10" },
                { label: "Yangi", value: stats.new, icon: AlertCircle, color: "text-blue-500", bg: "bg-blue-500/10" },
                { label: "Jarayonda", value: stats.in_progress, icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10" },
                { label: "Bajarildi", value: stats.done, icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
              ].map(s => (
                <div key={s.label} className="rounded-2xl border bg-card p-4 shadow-sm">
                  <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}>
                    <s.icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
<<<<<<< HEAD
                { label: "Jami foydalanuvchilar", value: users.length, icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
                { label: "Mutaxassislar", value: users.filter(u => u.role === "specialist").length || 0, icon: TrendingUp, color: "text-teal-500", bg: "bg-teal-500/10" },
                { label: "Shikoyatlar", value: reports.length, icon: Bell, color: "text-red-500", bg: "bg-red-500/10" },
=======
                { label: "Jami foydalanuvchilar", value: fakeUsers.length, icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
                { label: "Faol mutaxassislar", value: fakeUsers.filter(u => u.role === "specialist" && u.status === "active").length, icon: TrendingUp, color: "text-teal-500", bg: "bg-teal-500/10" },
                { label: "Shikoyatlar", value: fakeAbuseReports.length, icon: Bell, color: "text-red-500", bg: "bg-red-500/10" },
>>>>>>> 9e3f45b0ee34d0c9b3b0b17417f24ac9ba002cd8
              ].map(s => (
                <div key={s.label} className="rounded-2xl border bg-card p-4 shadow-sm">
                  <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}>
                    <s.icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
<<<<<<< HEAD

            {/* Daxshat Charts and Bot Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chart */}
              <div className="lg:col-span-2 rounded-2xl border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-6">Foydalanuvchilar O'sishi</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                      <Area type="monotone" dataKey="users" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Telegram Bot Test Panel */}
              <div className="rounded-2xl border bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6 shadow-sm flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white">
                    <Send className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Telegram Bot</h3>
                    <p className="text-xs text-muted-foreground">Bot orqali boshqaruv</p>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <p className="text-sm font-medium">
                    Saytdagi barcha harakatlar (yangi ustalar, buyurtmalar) Telegramingizga keladi.
                  </p>
                  <div className="p-3 rounded-xl border border-blue-500/20 bg-background/50">
                    <textarea 
                      value={testMessage}
                      onChange={(e) => setTestMessage(e.target.value)}
                      className="w-full bg-transparent outline-none resize-none text-sm placeholder:text-muted-foreground"
                      placeholder="Botga test xabari yozing..."
                      rows={3}
                    />
                  </div>
                  <button 
                    onClick={handleTestBot}
                    className="w-full rounded-xl bg-blue-500 text-white py-2.5 font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-colors flex justify-center items-center gap-2"
                  >
                    <Send className="h-4 w-4" /> Yuborish
                  </button>
                </div>
              </div>
            </div>

            {/* Recent abuse */}
            {reports.length > 0 && (
=======
            {/* Recent abuse */}
            {fakeAbuseReports.filter(r => r.severity === "high").length > 0 && (
>>>>>>> 9e3f45b0ee34d0c9b3b0b17417f24ac9ba002cd8
              <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <h3 className="font-bold text-foreground">Muhim shikoyatlar</h3>
                </div>
<<<<<<< HEAD
                {reports.map(r => (
=======
                {fakeAbuseReports.filter(r => r.severity === "high").map(r => (
>>>>>>> 9e3f45b0ee34d0c9b3b0b17417f24ac9ba002cd8
                  <div key={r.id} className="flex items-center justify-between rounded-xl bg-background/50 p-3 mb-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{r.against} haqida shikoyat</p>
                      <p className="text-xs text-muted-foreground">{r.reason} · {r.time}</p>
                    </div>
                    <Button size="sm" variant="destructive" className="rounded-xl text-xs">Ko'rish</Button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* REQUESTS */}
        {tab === "requests" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {["all", "new", "in_progress", "done", "cancelled"].map(f => (
                <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="rounded-xl">
                  {f === "all" ? "Barchasi" : statusLabels[f]}
                </Button>
              ))}
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-20"><RefreshCw className="h-8 w-8 animate-spin text-primary" /></div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center py-20 text-muted-foreground"><p className="text-lg font-medium">So'rovlar yo'q</p></div>
            ) : (
              <div className="grid gap-4">
                {filtered.map(req => (
                  <div key={req.id} className="rounded-2xl border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusColors[req.status] || statusColors.new}`}>
                            {statusLabels[req.status] || req.status}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />{formatDate(req.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">{req.description}</p>
                        {req.location && <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5 text-primary" />{req.location}</p>}
                        {images[req.id]?.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {images[req.id].map((img: any) => (
                              <button key={img.id} onClick={() => setSelectedImage(img.image_url)} className="h-14 w-14 overflow-hidden rounded-xl border hover:ring-2 ring-primary">
                                <img src={img.image_url} alt="" className="h-full w-full object-cover" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <Select value={req.status} onValueChange={(val) => updateStatus(req.id, val)}>
                        <SelectTrigger className="w-[150px] rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">🆕 Yangi</SelectItem>
                          <SelectItem value="in_progress">⏳ Jarayonda</SelectItem>
                          <SelectItem value="done">✅ Bajarildi</SelectItem>
                          <SelectItem value="cancelled">❌ Bekor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* USERS */}
        {tab === "users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Foydalanuvchi qidirish..."
                className="w-full rounded-xl border bg-background pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 ring-primary/30" />
            </div>
            <div className="rounded-2xl border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b bg-secondary/30">
                    <tr>
                      {["Foydalanuvchi", "Rol", "Holat", "Qo'shildi", "Buyurtmalar", "Daromad", "Amal"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
<<<<<<< HEAD
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map(u => (
                        <tr key={u.id} className="border-b border-border/40 hover:bg-secondary/20 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-sm font-bold text-primary-foreground shadow-sm">
                                {(u.full_name || "F")[0].toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-foreground">{u.full_name || "Foydalanuvchi"}</p>
                                <p className="text-xs text-muted-foreground font-medium">{u.phone || "Telefon raqam yo'q"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="rounded-xl px-3 py-1 text-xs font-bold bg-secondary text-muted-foreground border border-border/50">
                              {u.role === "specialist" ? "Mutaxassis" : "Foydalanuvchi"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`rounded-xl px-3 py-1 text-xs font-bold border ${
                              u.status === "suspended" 
                                ? "bg-red-500/10 text-red-600 border-red-500/20" 
                                : "bg-green-500/10 text-green-600 border-green-500/20"
                            }`}>
                              {u.status === "suspended" ? "Bloklangan" : "Faol"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground font-medium text-xs">
                            {formatDate(u.created_at)}
                          </td>
                          <td className="px-4 py-3 font-bold text-foreground text-center">0</td>
                          <td className="px-4 py-3 text-green-600 font-bold">0 so'm</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => setSelectedUser(u)}
                                className="h-8 w-8 rounded-lg text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="outline" onClick={() => toggleUserStatus(u.id)}
                                className={`h-8 w-8 rounded-lg ${
                                  u.status === "suspended" 
                                    ? "text-green-500 hover:text-green-600 hover:bg-green-50" 
                                    : "text-red-500 hover:text-red-600 hover:bg-red-50"
                                }`}>
                                {u.status === "suspended" ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground font-medium">
                          Hozircha foydalanuvchilar yo'q.
                        </td>
                      </tr>
                    )}
=======
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="border-b border-border/40 hover:bg-secondary/20 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-primary-foreground">
                              {u.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{u.name}</p>
                              <p className="text-xs text-muted-foreground">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${u.role === "specialist" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                            {u.role === "specialist" ? "Mutaxassis" : "Mijoz"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${u.status === "active" ? "bg-green-500/10 text-green-600" : u.status === "suspended" ? "bg-red-500/10 text-red-600" : "bg-yellow-500/10 text-yellow-600"}`}>
                            {u.status === "active" ? "Faol" : u.status === "suspended" ? "Bloklangan" : "Ogohlantirish"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{u.joined}</td>
                        <td className="px-4 py-3 font-semibold text-foreground">{u.orders}</td>
                        <td className="px-4 py-3 text-green-600 font-semibold">{u.income} so'm</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 rounded-lg">
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => toggleUserStatus(u.id)}
                              className={`h-7 w-7 p-0 rounded-lg ${u.status === "suspended" ? "text-green-500" : "text-red-500"}`}>
                              {u.status === "suspended" ? <CheckCircle className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
>>>>>>> 9e3f45b0ee34d0c9b3b0b17417f24ac9ba002cd8
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* REPORTS */}
        {tab === "reports" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h2 className="font-bold text-foreground">Shikoyatlar va noto'g'ri harakatlar</h2>
<<<<<<< HEAD
            {reports.length > 0 ? reports.map(r => (
=======
            {fakeAbuseReports.map(r => (
>>>>>>> 9e3f45b0ee34d0c9b3b0b17417f24ac9ba002cd8
              <div key={r.id} className={`rounded-2xl border p-5 ${r.severity === "high" ? "border-red-500/40 bg-red-500/5" : r.severity === "medium" ? "border-yellow-500/40 bg-yellow-500/5" : "border-border bg-card"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${r.severity === "high" ? "bg-red-500/10" : r.severity === "medium" ? "bg-yellow-500/10" : "bg-secondary"}`}>
                      <AlertCircle className={`h-5 w-5 ${r.severity === "high" ? "text-red-500" : r.severity === "medium" ? "text-yellow-500" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-foreground text-sm">{r.against} haqida shikoyat</p>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${r.severity === "high" ? "bg-red-500/10 text-red-600" : r.severity === "medium" ? "bg-yellow-500/10 text-yellow-600" : "bg-secondary text-muted-foreground"}`}>
                          {r.severity === "high" ? "Yuqori" : r.severity === "medium" ? "O'rta" : "Past"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">Shikoyatchi: {r.reporter}</p>
                      <p className="text-sm text-foreground mt-1">"{r.reason}"</p>
                      <p className="text-xs text-muted-foreground mt-1">{r.time}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="outline" className="rounded-xl text-xs"><Eye className="h-3.5 w-3.5 mr-1" />Ko'rish</Button>
                    <Button size="sm" variant="destructive" className="rounded-xl text-xs"><UserX className="h-3.5 w-3.5 mr-1" />Blok</Button>
                  </div>
                </div>
              </div>
<<<<<<< HEAD
            )) : (
              <div className="rounded-2xl border border-dashed p-10 text-center flex flex-col items-center gap-3 bg-card/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-lg">Shikoyatlar yo'q</p>
                  <p className="text-sm text-muted-foreground">Hozircha hech qanday muammo kuzatilmadi.</p>
                </div>
              </div>
            )}
=======
            ))}
>>>>>>> 9e3f45b0ee34d0c9b3b0b17417f24ac9ba002cd8
          </motion.div>
        )}

        {/* INCOME */}
        {tab === "income" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Jami daromad", value: "23 500 000 so'm", icon: DollarSign, color: "text-green-500", bg: "bg-green-500/10" },
                { label: "Bu oy", value: "4 200 000 so'm", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
                { label: "Komissiya (10%)", value: "2 350 000 so'm", icon: BarChart3, color: "text-purple-500", bg: "bg-purple-500/10" },
              ].map(s => (
                <div key={s.label} className="rounded-2xl border bg-card p-5 shadow-sm">
                  <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}>
                    <s.icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                  <p className="text-xl font-bold text-foreground">{s.value}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border bg-card overflow-hidden">
              <div className="border-b p-4">
                <h3 className="font-bold text-foreground">Mutaxassislar bo'yicha daromad</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b bg-secondary/30">
                    <tr>
                      {["Mutaxassis", "Buyurtmalar", "Jami", "Komissiya", "Holat"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
<<<<<<< HEAD
                    {users.filter(u => u.role === "specialist").length > 0 ? (
                      users.filter(u => u.role === "specialist").map(u => (
                        <tr key={u.id} className="border-b border-border/40 hover:bg-secondary/20 transition-colors">
                          <td className="px-4 py-3 font-bold text-foreground">{u.full_name || "Foydalanuvchi"}</td>
                          <td className="px-4 py-3 text-muted-foreground font-medium">0</td>
                          <td className="px-4 py-3 text-green-600 font-bold">0 so'm</td>
                          <td className="px-4 py-3 text-primary font-bold">0 so'm</td>
                          <td className="px-4 py-3">
                            <span className={`rounded-xl px-3 py-1 text-xs font-bold border ${u.status === "suspended" ? "bg-red-500/10 text-red-600 border-red-500/20" : "bg-green-500/10 text-green-600 border-green-500/20"}`}>
                              {u.status === "suspended" ? "Bloklangan" : "Faol"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground font-medium">
                          Hozircha mutaxassislar yo'q.
                        </td>
                      </tr>
                    )}
=======
                    {fakeUsers.filter(u => u.role === "specialist").map(u => (
                      <tr key={u.id} className="border-b border-border/40 hover:bg-secondary/20">
                        <td className="px-4 py-3 font-semibold text-foreground">{u.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{u.orders}</td>
                        <td className="px-4 py-3 text-green-600 font-semibold">{u.income} so'm</td>
                        <td className="px-4 py-3 text-primary font-semibold">
                          {(parseInt(u.income.replace(/\s/g, "")) * 0.1).toLocaleString()} so'm
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${u.status === "active" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}>
                            {u.status === "active" ? "Faol" : "Bloklangan"}
                          </span>
                        </td>
                      </tr>
                    ))}
>>>>>>> 9e3f45b0ee34d0c9b3b0b17417f24ac9ba002cd8
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </main>

<<<<<<< HEAD
      {selectedUser && (() => {
        const relatedRequests = userRequests(selectedUser);
        const detailRows = [
          { label: "To'liq ism", value: selectedUser.full_name || "Foydalanuvchi", icon: Users },
          { label: "Telefon", value: selectedUser.phone, icon: Phone },
          { label: "Email", value: selectedUser.email, icon: Mail },
          { label: "Rol", value: selectedUser.role === "specialist" ? "Mutaxassis" : "Foydalanuvchi", icon: Shield },
          { label: "Holat", value: selectedUser.status === "suspended" ? "Bloklangan" : "Faol", icon: CheckCircle },
          { label: "Kasb", value: selectedUser.profession, icon: Briefcase },
          { label: "Shahar", value: selectedUser.city, icon: MapPin },
          { label: "Manzil", value: selectedUser.location, icon: MapPin },
          { label: "Profil ID", value: selectedUser.id, icon: Hash },
          { label: "User ID", value: selectedUser.user_id, icon: Hash },
          { label: "Qo'shilgan", value: selectedUser.created_at ? formatDate(selectedUser.created_at) : "", icon: Clock },
          { label: "Yangilangan", value: selectedUser.updated_at ? formatDate(selectedUser.updated_at) : "", icon: RefreshCw },
        ];

        return (
          <div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 18 }}
              onClick={e => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border bg-card shadow-2xl"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-card/95 p-5 backdrop-blur">
                <div className="flex items-center gap-4">
                  {selectedUser.avatar_url ? (
                    <img
                      src={selectedUser.avatar_url}
                      alt={selectedUser.full_name || "Foydalanuvchi"}
                      className="h-14 w-14 rounded-2xl object-cover ring-2 ring-primary/20"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-lg font-bold text-primary-foreground">
                      {(selectedUser.full_name || "F")[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{selectedUser.full_name || "Foydalanuvchi"}</h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedUser.role === "specialist" ? "Mutaxassis" : "Foydalanuvchi"} · {selectedUser.status === "suspended" ? "Bloklangan" : "Faol"}
                    </p>
                  </div>
                </div>
                <Button size="icon" variant="ghost" onClick={() => setSelectedUser(null)} className="rounded-xl">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-5 p-5">
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { label: "Buyurtmalar", value: relatedRequests.length, icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
                    { label: "Daromad", value: "0 so'm", icon: DollarSign, color: "text-green-500", bg: "bg-green-500/10" },
                    { label: "Status", value: selectedUser.status === "suspended" ? "Bloklangan" : "Faol", icon: CheckCircle, color: selectedUser.status === "suspended" ? "text-red-500" : "text-green-500", bg: selectedUser.status === "suspended" ? "bg-red-500/10" : "bg-green-500/10" },
                  ].map(item => (
                    <div key={item.label} className="rounded-2xl border bg-background/40 p-4">
                      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${item.bg}`}>
                        <item.icon className={`h-5 w-5 ${item.color}`} />
                      </div>
                      <p className="text-xl font-bold text-foreground">{item.value}</p>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border bg-background/40 p-4">
                  <h3 className="mb-4 font-bold text-foreground">Foydalanuvchi ma'lumotlari</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    {detailRows.map(row => (
                      <div key={row.label} className="flex items-start gap-3 rounded-xl border border-border/50 bg-card p-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <row.icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{row.label}</p>
                          <p className="break-words text-sm font-semibold text-foreground">{formatValue(row.value)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {selectedUser.bio && (
                    <div className="mt-3 rounded-xl border border-border/50 bg-card p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Bio</p>
                      <p className="mt-1 text-sm text-foreground">{selectedUser.bio}</p>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border bg-background/40 p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="font-bold text-foreground">So'rov va buyurtmalar</h3>
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-muted-foreground">
                      {relatedRequests.length} ta
                    </span>
                  </div>
                  {relatedRequests.length > 0 ? (
                    <div className="space-y-3">
                      {relatedRequests.map(req => (
                        <div key={req.id} className="rounded-xl border bg-card p-4">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${statusColors[req.status] || statusColors.new}`}>
                              {statusLabels[req.status] || req.status}
                            </span>
                            <span className="text-xs text-muted-foreground">{formatDate(req.created_at)}</span>
                          </div>
                          <p className="text-sm text-foreground">{req.description}</p>
                          {req.location && (
                            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5 text-primary" /> {req.location}
                            </p>
                          )}
                          {images[req.id]?.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {images[req.id].map((img: any) => (
                                <button key={img.id} onClick={() => setSelectedImage(img.image_url)} className="h-14 w-14 overflow-hidden rounded-xl border hover:ring-2 ring-primary">
                                  <img src={img.image_url} alt="" className="h-full w-full object-cover" />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                      Bu foydalanuvchida hozircha so'rov yoki buyurtma yo'q.
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border bg-background/40 p-4">
                  <h3 className="mb-3 font-bold text-foreground">Texnik ma'lumotlar</h3>
                  <pre className="max-h-64 overflow-auto rounded-xl bg-secondary/50 p-3 text-xs text-muted-foreground">
                    {JSON.stringify(selectedUser, null, 2)}
                  </pre>
                </div>
              </div>
            </motion.div>
          </div>
        );
      })()}

=======
>>>>>>> 9e3f45b0ee34d0c9b3b0b17417f24ac9ba002cd8
      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="" className="max-h-[85vh] max-w-[90vw] rounded-2xl shadow-2xl" />
        </div>
      )}
    </div>
  );
};

export default Admin;
