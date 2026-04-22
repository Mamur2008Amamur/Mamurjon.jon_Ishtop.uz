import { useEffect, useState } from "react";
import { User, LogIn, MessageSquare } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import NotificationBell from "@/components/NotificationBell";
import { supabase } from "@/integrations/supabase/client";

const navLinks = [
  { label: "Bosh sahifa",     href: "#hero" },
  { label: "Xizmatlar",       href: "#xizmatlar" },
  { label: "Mutaxassislar",   href: "#mutaxassislar" },
  { label: "Xarita",          href: "#xarita" },
  { label: "Qanday ishlaydi", href: "#qanday-ishlaydi" },
  { label: "Yordam",          href: "/yordam" },
  { label: "Aloqa",           href: "/aloqa" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setIsLoggedIn(!!s));
    supabase.auth.getSession().then(({ data: { session } }) => setIsLoggedIn(!!session));
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => { subscription.unsubscribe(); window.removeEventListener("scroll", onScroll); };
  }, []);

  const handleNav = (href: string) => {
    if (href.startsWith("/")) { navigate(href); return; }
    if (location.pathname !== "/") { navigate("/" + href); return; }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/95 backdrop-blur-xl border-b shadow-sm" : "glass"}`}>
      <div className="container mx-auto flex h-16 items-center gap-3 px-4">

        {/* Logo */}
        <button onClick={() => handleNav("#hero")}
          className="shrink-0 flex items-center gap-2 font-display text-xl font-bold text-foreground">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow">IT</span>
          IshTop<span className="text-primary">.uz</span>
        </button>

        {/* Nav links — desktop */}
        <div className="hidden md:flex items-center gap-0.5 ml-1 overflow-x-auto scrollbar-hide">
          {navLinks.map(link => (
            <button key={link.href} onClick={() => handleNav(link.href)}
              className="whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
              {link.label}
            </button>
          ))}
        </div>

        {/* Nav links — mobile */}
        <div className="flex md:hidden items-center gap-0 overflow-x-auto scrollbar-hide flex-1">
          {navLinks.slice(0, 3).map(link => (
            <button key={link.href} onClick={() => handleNav(link.href)}
              className="whitespace-nowrap rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
              {link.label}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2 shrink-0">
          <ThemeToggle />
          {/* Chat — kun/tun va profil orasida */}
          <button onClick={() => navigate("/chat")}
            title="Chat"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border bg-card text-muted-foreground hover:text-primary hover:border-primary/40 transition-all">
            <MessageSquare className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-background animate-pulse" />
          </button>
          {isLoggedIn && <NotificationBell />}
          {isLoggedIn ? (
            <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => navigate("/profil")}>
              <User className="h-5 w-5" />
            </Button>
          ) : (
            <Button size="sm" className="rounded-xl px-4 gap-1.5 font-semibold" onClick={() => navigate("/auth")}>
              <LogIn className="h-4 w-4" /> Kirish
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
