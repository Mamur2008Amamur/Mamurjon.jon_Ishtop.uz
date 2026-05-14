import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Award, Database, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProfileRow {
  id: string;
  full_name?: string | null;
  city?: string | null;
  created_at?: string;
}

const Leaderboard = () => {
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);

  useEffect(() => {
    supabase.from("profiles").select("id,full_name,city,created_at").order("created_at", { ascending: true }).then(({ data }) => {
      setProfiles((data || []) as ProfileRow[]);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pb-16 pt-24">
        <div className="mb-8 rounded-2xl border bg-card p-6 shadow-sm">
          <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            <Trophy className="h-4 w-4" /> Reyting
          </p>
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Haqiqiy foydalanuvchilar ro'yxati</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">Fake ball yoki sun'iy odamlar yo'q. Hozircha faqat real profillar ko'rsatiladi.</p>
        </div>

        {profiles.length === 0 ? (
          <section className="rounded-2xl border bg-card p-10 text-center shadow-sm">
            <Database className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="text-xl font-bold text-foreground">Profil topilmadi</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">Ro'yxatdan o'tgan real profillar paydo bo'lsa, shu yerda chiqadi.</p>
          </section>
        ) : (
          <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
            {profiles.map((user, index) => (
              <div key={user.id} className="flex items-center gap-4 border-b px-4 py-4 last:border-b-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary font-bold text-foreground">#{index + 1}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-foreground">{user.full_name || "Nomsiz profil"}</p>
                  <p className="text-sm text-muted-foreground">{user.city || "Shahar kiritilmagan"}</p>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                  <Award className="h-4 w-4" /> Real profil
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Leaderboard;
