import Navbar from "../components/layout/Navbar";
import Hero from "../components/landing/hero/Hero";
import Companies from "../components/landing/companies/Companies";
import DashboardPreview from "../components/landing/dashboard/DashboardPreview";
import Testimonials from "../components/landing/testimonials/Testimonials";
import CTA from "../components/landing/cta/CTA";
import Footer from "../components/landing/footer/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050B0B] text-white">
      <Navbar />

      <main>
        <Hero />
        <Companies />
        <DashboardPreview />
        <Testimonials />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}