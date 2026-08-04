import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import FooterColumn from "./FooterColumn";

const product = [
  "Features",
  "Analytics",
  "Reports",
  "Pricing",
];

const company = [
  "About",
  "Careers",
  "Blog",
  "Contact",
];

const resources = [
  "Documentation",
  "Help Center",
  "Privacy Policy",
  "Terms of Service",
];

export default function Footer({ onNavigate }) {
  return (
    <footer className="border-t border-white/10 bg-[#050B0B]">
      <div className="mx-auto max-w-7xl px-6 py-20">

        <div className="grid gap-12 lg:grid-cols-4">

          {/* Logo Section */}
          <div>
            <h2 className="text-3xl font-black text-white">
              LOOP
            </h2>

            <p className="mt-5 leading-7 text-white/60">
              AI-powered customer feedback intelligence platform helping
              businesses transform customer voices into smarter business
              decisions.
            </p>
            
          </div>

          <FooterColumn
            title="Product"
            links={product}
            onNavigate={onNavigate}
          />

          <FooterColumn
            title="Company"
            links={company}
            onNavigate={onNavigate}
          />

          <FooterColumn
            title="Resources"
            links={resources}
            onNavigate={onNavigate}
          />

        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center text-sm text-white/50 md:flex-row">

          <p>
            © 2026 LOOP AI. All rights reserved.
          </p>

          <p>
          </p>

        </div>

      </div>
    </footer>
  );
}