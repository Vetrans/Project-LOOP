import { Menu, X, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../common/Button";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { name: "Features", href: "#features" },
    { name: "Workflow", href: "#workflow" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed left-0 top-0 z-50 w-full">
      <div className="mx-auto mt-5 max-w-7xl px-6">
        <div
          className={`flex h-16 items-center justify-between rounded-full border px-6 transition-all duration-300 ${
            scrolled
              ? "border-cyan-500/20 bg-[#0B1514]/95 shadow-lg backdrop-blur-xl"
              : "border-white/10 bg-[#0B1514]/80 backdrop-blur-xl"
          }`}
        >
          {/* Logo */}

          <a
            href="#home"
            className="flex items-center gap-3 text-xl font-bold text-white"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#32E6A4] text-black">
              <Sparkles size={20} />
            </div>

            <span>
              LOOP
              <span className="text-[#32E6A4]"> AI</span>
            </span>
          </a>

          {/* Desktop */}

          <nav className="hidden gap-8 lg:flex">
            {links.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm text-white/70 transition hover:text-[#32E6A4]"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Desktop Buttons */}

          <div className="hidden items-center gap-3 lg:flex">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>

            <Link
              to="/login"
              className="rounded-full bg-[#32E6A4] px-6 py-2 font-semibold text-black transition hover:scale-105"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile */}

          <button
            onClick={() => setOpen(!open)}
            className="text-white lg:hidden"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {open && (
          <div className="mt-3 rounded-3xl border border-white/10 bg-[#101C1B] p-6 lg:hidden">
            <div className="flex flex-col gap-5">
              {links.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                >
                  {item.name}
                </a>
              ))}

              <Link to="/login">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}