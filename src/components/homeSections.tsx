import { HelpCircle, ListChecks, Mail, Users, Wrench, type LucideIcon } from "lucide-react";
import CategoriesSection from "@/components/CategoriesSection";
import SpecialistsSection from "@/components/SpecialistsSection";
import HowItWorks from "@/components/HowItWorks";
import ContactSection from "@/components/ContactSection";
import YordamSection from "@/components/YordamSection";

export type HomeSectionKey = "services" | "specialists" | "steps" | "contact" | "help";

export interface HomeSectionItem {
  key: HomeSectionKey;
  navLabel: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  colorClass: string;
}

export const homeSections: HomeSectionItem[] = [
  {
    key: "services",
    navLabel: "Xizmatlar",
    title: "Eng mashhur yo'nalishlar",
    desc: "12 ta yo'nalish bo'yicha kerakli xizmatni tez toping.",
    icon: Wrench,
    colorClass: "from-primary to-accent",
  },
  {
    key: "specialists",
    navLabel: "Mutaxassislar",
    title: "Ishonchli mutaxassislar",
    desc: "Tekshirilgan va yuqori baholangan ustalar bilan ishlang.",
    icon: Users,
    colorClass: "from-accent to-primary",
  },
  {
    key: "steps",
    navLabel: "Qanday ishlaydi",
    title: "Faqat 4 qadamda boshlang",
    desc: "Qidirishdan buyurtmagacha bo'lgan yo'l juda sodda.",
    icon: ListChecks,
    colorClass: "from-primary to-primary",
  },
  {
    key: "contact",
    navLabel: "Aloqa",
    title: "Aloqa va xabar",
    desc: "Sayt bo'yicha savol yoki taklifni shu joydan yuboring.",
    icon: Mail,
    colorClass: "from-accent to-accent",
  },
  {
    key: "help",
    navLabel: "Yordam",
    title: "Rasm bilan yordam so'rang",
    desc: "Buzilgan joyni rasmga oling, manzil yozing, mos usta topamiz.",
    icon: HelpCircle,
    colorClass: "from-primary to-accent",
  },
];

export const renderHomeSectionContent = (key: HomeSectionKey) => {
  switch (key) {
    case "services":
      return <CategoriesSection embedded />;
    case "specialists":
      return <SpecialistsSection embedded />;
    case "steps":
      return <HowItWorks embedded />;
    case "contact":
      return <ContactSection embedded />;
    case "help":
      return <YordamSection />;
    default:
      return null;
  }
};
