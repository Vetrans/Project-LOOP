import { motion } from "framer-motion";
import AuthIllustration from "./AuthIllustration";

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
          <div className="flex items-center justify-center p-10">
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