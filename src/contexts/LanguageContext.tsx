import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'uz' | 'ru';

interface Translations {
  [key: string]: {
    uz: string;
    ru: string;
  };
}

const translations: Translations = {
  // Navbar
  home: { uz: "Bosh sahifa", ru: "Главная" },
  services: { uz: "Xizmatlar", ru: "Услуги" },
  specialists: { uz: "Mutaxassislar", ru: "Специалисты" },
  map: { uz: "Xarita", ru: "Карта" },
  how_it_works: { uz: "Qanday ishlaydi", ru: "Как это работает" },
  help: { uz: "Yordam", ru: "Помощь" },
  contact: { uz: "Aloqa", ru: "Контакты" },
  login: { uz: "Kirish", ru: "Войти" },
  profile: { uz: "Profil", ru: "Профиль" },
  admin: { uz: "Admin", ru: "Админ" },

  // Hero
  hero_badge: { uz: "O'zbekistonda №1 usta topish platformasi", ru: "Платформа №1 для поиска мастеров в Узбекистане" },
  hero_title_1: { uz: "Ishonchli va tajribali", ru: "Надежные и опытные" },
  hero_title_2: { uz: "mutaxassislar", ru: "специалисты" },
  hero_title_3: { uz: "bir joyda", ru: "в одном месте" },
  hero_desc: { uz: "Santexnik, elektrik, tozalovchi va boshqa yuzlab tasdiqlangan ustalar endi har qachongidan ham yaqinroq.", ru: "Сантехники, электрики, уборщики и сотни других проверенных мастеров теперь ближе, чем когда-либо." },
  find_specialist: { uz: "Mutaxassis izlash", ru: "Найти специалиста" },
  search_placeholder: { uz: "Masalan: Santexnik...", ru: "Например: Сантехник..." },

  // Map
  map_badge: { uz: "🗺️ Xarita", ru: "🗺️ Карта" },
  map_title_1: { uz: "Yaqin atrofdagi", ru: "Ближайшие" },
  map_title_2: { uz: "mutaxassislar", ru: "специалисты" },
  map_desc: { uz: "O'zbekiston bo'ylab — Toshkent, Samarqand, Farg'ona, Buxoro va boshqa viloyatlarda", ru: "По всему Узбекистану — Ташкент, Самарканд, Фергана, Бухара и другие области" },
  search_map: { uz: "Ism, kasb, viloyat...", ru: "Имя, профессия, регион..." },
};

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('uz');

  useEffect(() => {
    const saved = localStorage.getItem('ishtop_lang') as Language;
    if (saved && (saved === 'uz' || saved === 'ru')) setLang(saved);
  }, []);

  const toggleLang = () => {
    const next = lang === 'uz' ? 'ru' : 'uz';
    setLang(next);
    localStorage.setItem('ishtop_lang', next);
  };

  const t = (key: string) => {
    return translations[key]?.[lang] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
