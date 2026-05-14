import { Heart } from "lucide-react";

const Footer = () => (
  <footer className="border-t bg-card py-10">
    <div className="container mx-auto">
      <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
        <a href="#hero" className="flex items-center gap-1.5 font-display text-xl font-bold text-foreground">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">IT</span>
          IshTop<span className="text-primary">.uz</span>
        </a>

        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <a href="#services" className="hover:text-foreground transition-colors">Xizmatlar</a>
          <a href="#specialists" className="hover:text-foreground transition-colors">Mutaxassislar</a>
          <a href="#steps" className="hover:text-foreground transition-colors">Qanday ishlaydi</a>
          <a href="#contact" className="hover:text-foreground transition-colors">Aloqa</a>
        </div>

        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          © 2026 IshTop.uz <Heart className="h-3.5 w-3.5 fill-destructive text-destructive" />
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
