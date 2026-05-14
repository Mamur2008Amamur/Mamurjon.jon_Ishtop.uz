<<<<<<< HEAD
import { useEffect, useState, useCallback } from "react";
import { User, LogIn, MessageSquare, Home, Briefcase, Users, Map, HelpCircle, Phone, LifeBuoy, BarChart3 } from "lucide-react";
=======
import { useEffect, useState } from "react";
import { User, LogIn, MessageSquare } from "lucide-react";
>>>>>>> 9e3f45b0ee34d0c9b3b0b17417f24ac9ba002cd8
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import NotificationBell from "@/components/NotificationBell";
import { supabase } from "@/integrations/supabase/client";
<<<<<<< HEAD
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const navLinks = [
  { labelKey: "home",         href: "#hero",            icon: Home },
  { labelKey: "services",     href: "#xizmatlar",       icon: Briefcase },
  { labelKey: "specialists",  href: "#mutaxassislar",   icon: Users },
  { labelKey: "map",          href: "#xarita",          icon: Map },
  { labelKey: "how_it_works", href: "#qanday-ishlaydi", icon: HelpCircle },
  { labelKey: "help",         href: "/yordam",          icon: LifeBuoy },
  { labelKey: "contact",      href: "/aloqa",           icon: Phone },
=======

const navLinks = [
  { label: "Bosh sahifa",     href: "#hero" },
  { label: "Xizmatlar",       href: "#xizmatlar" },
  { label: "Mutaxassislar",   href: "#mutaxassislar" },
  { label: "Xarita",          href: "#xarita" },
  { label: "Qanday ishlaydi", href: "#qanday-ishlaydi" },
  { label: "Yordam",          href: "/yordam" },
  { label: "Aloqa",           href: "/aloqa" },
>>>>>>> 9e3f45b0ee34d0c9b3b0b17417f24ac9ba002cd8
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
<<<<<<< HEAD
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#hero");
  const { lang, toggleLang, t } = useLanguage();

  useEffect(() => {
    let isMounted = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => {
      if (isMounted) setIsLoggedIn(!!s);
    });

    const timeoutId = setTimeout(() => {
      if (isMounted) {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (isMounted) setIsLoggedIn(!!session);
        }).catch(() => {
          if (isMounted) setIsLoggedIn(false);
        });
      }
    }, 300);

    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = ["hero", "xizmatlar", "mutaxassislar", "xarita", "qanday-ishlaydi"];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 100) {
          setActiveSection("#" + sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleNav = useCallback((href: string) => {
    setMobileOpen(false);
=======
  const [scrolled,   setScrolled]   = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setIsLoggedIn(!!s));
    supabase.auth.getSession().then(({ data: { session } }) => setIsLoggedIn(!!session));
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => { subscription.unsubscribe(); window.removeEventListener("scroll", onScroll); };
  }, []);

  const handleNav = (href: string) => {
>>>>>>> 9e3f45b0ee34d0c9b3b0b17417f24ac9ba002cd8
    if (href.startsWith("/")) { navigate(href); return; }
    if (location.pathname !== "/") { navigate("/" + href); return; }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
<<<<<<< HEAD
  }, [navigate, location.pathname]);

  return (
    <>
      {/* ===== NAVBAR ===== */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-lg shadow-black/5"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto flex h-16 items-center gap-4 px-4">

          {/* Logo */}
          <motion.button
            onClick={() => handleNav("#hero")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="shrink-0 flex items-center gap-2 font-display text-xl font-bold text-foreground"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-[11px] font-black text-primary-foreground shadow-lg shadow-primary/25">
              IT
            </div>
            <span className="hidden sm:inline">
              IshTop<span className="text-primary">.uz</span>
            </span>
          </motion.button>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-0.5 ml-6 flex-1">
            {navLinks.map((link, i) => {
              const Icon = link.icon;
              const isActive = activeSection === link.href || location.pathname === link.href;
              return (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => handleNav(link.href)}
                  className={`relative flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200 ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{t(link.labelKey)}</span>
                  {isActive && (
                    <motion.div
                      layoutId="desktopActiveIndicator"
                      className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="ml-auto flex items-center gap-2 shrink-0">
            <button
              onClick={toggleLang}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 text-sm font-bold text-foreground hover:bg-accent/50 transition uppercase"
            >
              {lang}
            </button>
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            <motion.button
              onClick={() => navigate("/chat")}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative hidden sm:flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-50" />
                <span className="relative rounded-full h-2.5 w-2.5 bg-green-500 border border-background" />
              </span>
            </motion.button>

            {isLoggedIn && (
              <div className="hidden sm:block">
                <NotificationBell />
              </div>
            )}

            <div className="hidden lg:block">
              {isLoggedIn ? (
                <Button variant="ghost" size="icon" className="rounded-lg" onClick={() => navigate("/profil")}>
                  <User className="h-5 w-5" />
                </Button>
              ) : (
                <Button size="sm" className="rounded-lg px-4 gap-2 font-semibold" onClick={() => navigate("/auth")}>
                  <LogIn className="h-4 w-4" /> {t("login")}
                </Button>
              )}
            </div>

            {/* ===== BURGER BUTTON ===== */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
              aria-label="Menyu"
            >
              <div className="flex flex-col justify-center items-center w-[18px] h-[18px] gap-[4px]">
                <motion.span
                  animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="block h-[2px] w-[18px] rounded-full bg-foreground origin-center"
                />
                <motion.span
                  animate={mobileOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className="block h-[2px] w-[18px] rounded-full bg-foreground"
                />
                <motion.span
                  animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="block h-[2px] w-[18px] rounded-full bg-foreground origin-center"
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* ===== MOBILE MENU ===== */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Dark overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            />

            {/* Menu panel — slides from right */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[280px] max-w-[80vw] bg-background border-l border-border/50 shadow-2xl lg:hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-border/30">
                <span className="font-display text-lg font-bold">
                  IshTop<span className="text-primary">.uz</span>
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-accent transition-colors"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Nav Links — FAQAT 7 TA */}
              <div className="flex-1 overflow-y-auto py-4 px-3">
                {navLinks.map((link, i) => {
                  const Icon = link.icon;
                  const isActive = activeSection === link.href || location.pathname === link.href;
                  return (
                    <motion.button
                      key={link.href}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => handleNav(link.href)}
                      className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 mb-1 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-foreground/70 hover:bg-accent/50 hover:text-foreground"
                      }`}
                    >
                      <Icon className={`h-[18px] w-[18px] ${isActive ? "text-primary" : ""}`} />
                      <span>{t(link.labelKey)}</span>
                      {isActive && (
                        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Footer — Auth + Theme */}
              <div className="border-t border-border/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">Mavzu</span>
                  <ThemeToggle />
                </div>
                {isLoggedIn ? (
                  <Button
                    className="w-full rounded-xl h-11 gap-2 font-semibold"
                    onClick={() => { navigate("/profil"); setMobileOpen(false); }}
                  >
                    <User className="h-4 w-4" /> {t("profile")}
                  </Button>
                ) : (
                  <Button
                    className="w-full rounded-xl h-11 gap-2 font-semibold"
                    onClick={() => { navigate("/auth"); setMobileOpen(false); }}
                  >
                    <LogIn className="h-4 w-4" /> {t("login")}
                  </Button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
=======
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
>>>>>>> 9e3f45b0ee34d0c9b3b0b17417f24ac9ba002cd8
  );
};

export default Navbar;
