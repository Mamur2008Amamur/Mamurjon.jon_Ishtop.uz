import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Database, Flame, PlusCircle } from "lucide-react";

const Quests = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container mx-auto px-4 pb-16 pt-24">
      <div className="mb-8">
        <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-3 py-1 text-sm font-semibold text-orange-600">
          <Flame className="h-4 w-4" /> Missiyalar
        </p>
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Haqiqiy missiyalar</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">Missiyalar faqat serverda saqlangan real yozuvlar asosida ko'rsatiladi.</p>
      </div>

      <section className="rounded-2xl border bg-card p-10 text-center shadow-sm">
        <Database className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-bold text-foreground">Missiyalar jadvali hali ulanmagan</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Oldindan yozilgan vazifalar olib tashlandi. Real missiya jadvali qo'shilsa, foydalanuvchi bajargan holati bilan shu yerda chiqadi.
        </p>
        <button className="mt-6 inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold text-muted-foreground">
          <PlusCircle className="h-4 w-4" /> Real missiya moduli tayyorlanadi
        </button>
      </section>
    </main>
    <Footer />
  </div>
);

export default Quests;
