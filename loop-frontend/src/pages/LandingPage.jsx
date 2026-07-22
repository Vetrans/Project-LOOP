import { useState } from "react";

import Navbar from "../components/layout/Navbar";

import Hero from "../components/landing/hero/Hero";
import Companies from "../components/landing/companies/Companies";
import DashboardPreview from "../components/landing/dashboard-preview/DashboardPreview";
import Testimonials from "../components/landing/testimonials/Testimonials";
import CTA from "../components/landing/cta/CTA";

import Features from "../components/landing/features/Features";
import Workflow from "../components/landing/workflow/Workflow";
import Pricing from "../components/landing/pricing/Pricing";
import FAQ from "../components/landing/faq/FAQ";

import Footer from "../components/landing/footer/Footer";

function HomeView() {
  return (
    <>
      <Hero />
      <Companies />
      <DashboardPreview />
      <Testimonials />
      <CTA />
    </>
  );
}

const SECTIONS = {
  home: HomeView,
  features: Features,
  workflow: Workflow,
  pricing: Pricing,
  faq: FAQ,
};

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState("home");

  const ActiveView = SECTIONS[activeSection] || HomeView;

  return (
    <div>
      <main className="min-h-screen bg-[#060F0E] text-white">
        <Navbar
          activeSection={activeSection}
          onNavigate={setActiveSection}
        />

        <ActiveView />

        <Footer />
      </main>
    </div>
  );
}