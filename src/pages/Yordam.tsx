import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import YordamSection from "@/components/YordamSection";

const Yordam = () => (
  <div className="min-h-screen">
    <Navbar />
    <div className="pt-16">
      <YordamSection />
    </div>
    <Footer />
  </div>
);

export default Yordam;
