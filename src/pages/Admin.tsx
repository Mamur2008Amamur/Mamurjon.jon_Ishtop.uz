import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
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
  const [filter, setFilter] = useState("all");
  const [tab, setTab] = useState<Tab>("overview");
  const [userSearch, setUserSearch] = useState("");
  const [users, setUsers] = useState(fakeUsers);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { navigate("/auth"); return; }
      setAuthChecking(false);
      fetchData();
    });
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
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
  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()));

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
                { label: "Jami foydalanuvchilar", value: fakeUsers.length, icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
                { label: "Faol mutaxassislar", value: fakeUsers.filter(u => u.role === "specialist" && u.status === "active").length, icon: TrendingUp, color: "text-teal-500", bg: "bg-teal-500/10" },
                { label: "Shikoyatlar", value: fakeAbuseReports.length, icon: Bell, color: "text-red-500", bg: "bg-red-500/10" },
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
            {/* Recent abuse */}
            {fakeAbuseReports.filter(r => r.severity === "high").length > 0 && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <h3 className="font-bold text-foreground">Muhim shikoyatlar</h3>
                </div>
                {fakeAbuseReports.filter(r => r.severity === "high").map(r => (
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
            {fakeAbuseReports.map(r => (
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
            ))}
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
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="" className="max-h-[85vh] max-w-[90vw] rounded-2xl shadow-2xl" />
        </div>
      )}
    </div>
  );
};

export default Admin;
