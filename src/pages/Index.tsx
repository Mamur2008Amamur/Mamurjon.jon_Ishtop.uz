import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustedSection from "@/components/TrustedSection";
import CategoriesSection from "@/components/CategoriesSection";
import SpecialistsSection from "@/components/SpecialistsSection";
import MapSection from "@/components/MapSection";
import HowItWorks from "@/components/HowItWorks";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import AIChatWidget from "@/components/AIChatWidget";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <div id="hero"><HeroSection /></div>
    <TrustedSection />
    <div id="xizmatlar"><CategoriesSection /></div>
    <div id="mutaxassislar"><SpecialistsSection /></div>
    <div id="xarita"><MapSection /></div>
    <div id="qanday-ishlaydi"><HowItWorks /></div>
    <CTASection />
    <Footer />
    <AIChatWidget />
  </div>
);

export default Index;
