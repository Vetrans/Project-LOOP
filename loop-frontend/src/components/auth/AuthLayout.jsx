import { motion } from "framer-motion";
import AuthIllustration from "./AuthIllustration";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#081111] text-white">

      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-10">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid w-full overflow-hidden rounded-[32px] border border-white/10 bg-[#0E1515] shadow-2xl lg:grid-cols-2"
        >

          {/* Left */}
          <div className="flex flex-col p-10">

           <Link
           to="/"
           className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:border-[#32E6A4] hover:text-[#32E6A4]"
           >
           <ArrowLeft size={16} />
           Return to LOOP AI
           </Link>
           {children}
          </div>

          {/* Right */}
          <div className="hidden lg:flex">
            <AuthIllustration />
          </div>

        </motion.div>

      </div>

    </div>
  );
}