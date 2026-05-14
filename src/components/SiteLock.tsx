import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Lock, ShieldCheck } from "lucide-react";

const LOCK_KEY = "edubot_site_unlocked";
const SITE_PASSWORD = import.meta.env.VITE_SITE_PASSWORD || "edubot2026";

const SiteLock = ({ children }: { children: ReactNode }) => {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Har marta sahifa yangilanganda kod so'rash uchun sessionStorage olib tashlandi
    // setUnlocked(false) default holatda
  }, []);

  const unlock = () => {
    if (password === SITE_PASSWORD) {
      setUnlocked(true);
      return;
    }
    setError("Parol noto'g'ri");
    setPassword("");
  };

  if (unlocked) return <>{children}</>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm rounded-2xl border bg-card p-6 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">EduBot himoyasi</h1>
        <p className="mt-2 text-sm text-muted-foreground">Saytga kirish uchun parolni kiriting.</p>
        <div className="mt-5 text-left">
          <label className="mb-1.5 block text-sm font-semibold text-foreground">Parol</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              onKeyDown={(e) => { if (e.key === "Enter") unlock(); }}
              autoFocus
              className="h-11 w-full rounded-xl border bg-background pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Parol"
            />
          </div>
          {error && <p className="mt-2 text-sm font-semibold text-destructive">{error}</p>}
        </div>
        <button onClick={unlock} className="mt-5 h-11 w-full rounded-xl bg-primary font-bold text-primary-foreground transition hover:bg-primary/90">
          Kirish
        </button>
      </div>
    </div>
  );
};

export default SiteLock;
