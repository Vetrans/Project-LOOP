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

export default function Footer() {
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

            <div className="mt-8 flex gap-4">

              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/10 p-3 text-white transition-all duration-300 hover:border-[#32E6A4] hover:bg-[#32E6A4]/10 hover:text-[#32E6A4]"
              >
                <FaGithub size={20} />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/10 p-3 text-white transition-all duration-300 hover:border-[#32E6A4] hover:bg-[#32E6A4]/10 hover:text-[#32E6A4]"
              >
                <FaLinkedin size={20} />
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/10 p-3 text-white transition-all duration-300 hover:border-[#32E6A4] hover:bg-[#32E6A4]/10 hover:text-[#32E6A4]"
              >
                <FaXTwitter size={20} />
              </a>

              <a
                href="mailto:contact@loopai.com"
                className="rounded-xl border border-white/10 p-3 text-white transition-all duration-300 hover:border-[#32E6A4] hover:bg-[#32E6A4]/10 hover:text-[#32E6A4]"
              >
                <Mail size={20} />
              </a>

            </div>
          </div>

          <FooterColumn
            title="Product"
            links={product}
          />

          <FooterColumn
            title="Company"
            links={company}
          />

          <FooterColumn
            title="Resources"
            links={resources}
          />

        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center text-sm text-white/50 md:flex-row">

          <p>
            © 2026 LOOP AI. All rights reserved.
          </p>

          <p>
            Built with ❤️ using React, Tailwind CSS & AI
          </p>

        </div>

      </div>
    </footer>
  );
}