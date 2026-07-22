import Navbar from "../components/layout/Navbar";
import Hero from "../components/landing/hero/Hero";
import Companies from "../components/landing/companies/Companies";
import Features from "../components/landing/features/Features";
import Workflow from "../components/landing/workflow/Workflow";
import DashboardPreview from "../components/landing/dashboard-preview/DashboardPreview";
import Testimonials from "../components/landing/testimonials/Testimonials";
import Pricing from "../components/landing/pricing/Pricing";
import FAQ from "../components/landing/faq/FAQ";
import CTA from "../components/landing/cta/CTA";
import Footer from "../components/landing/footer/Footer";

export default function LandingPage() {
  return (
    <div>
      <main className="min-h-screen bg-[#060F0E] text-white">
        <Navbar />
        <Hero />
        <Companies />
        <Features />
        <Workflow />
        <DashboardPreview />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
        <Footer />
      </main>
    </div>
  );
}