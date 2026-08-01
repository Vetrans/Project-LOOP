import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  UserCircle2,
  ChevronDown,
  Settings as SettingsIcon,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const initials = (user?.name || "")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    setOpen(false);
    const confirmed = window.confirm("Log out of LOOP AI?");
    if (!confirmed) return;

    logout();
    toast.success("Logged out successfully.");
    navigate("/login", { replace: true });
  };

  return (
    <header className="flex items-center justify-between border-b border-white/10 bg-[#0E1515] px-6 py-4">
      <div>
        {user?.workspace?.name && (
          <p className="text-sm text-gray-400">{user.workspace.name}</p>
        )}
      </div>

      <div className="flex items-center gap-5">
        <Bell className="cursor-pointer text-gray-300 transition hover:text-cyan-400" />

        {/* Profile — hover to reveal the dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <button className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-white/5">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : user?.name ? (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500 text-sm font-semibold text-black">
                {initials || <UserCircle2 size={22} />}
              </div>
            ) : (
              <UserCircle2 size={34} className="text-cyan-400" />
            )}

            {user?.name && (
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium text-white">{user.name}</p>
                {user.designation && (
                  <p className="text-xs text-gray-500">{user.designation}</p>
                )}
              </div>
            )}

            <ChevronDown
              size={16}
              className={`hidden text-gray-500 transition-transform sm:block ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Invisible bridge so the dropdown doesn't close when the
              mouse crosses the small gap between button and panel. */}
          <AnimatePresence>
            {open && (
              <>
                <div className="absolute right-0 top-full h-2 w-full" />

                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-[calc(100%+8px)] z-50 w-60 overflow-hidden rounded-xl border border-white/10 bg-[#111B1A] shadow-2xl"
                >
                  <div className="border-b border-white/10 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-white">
                      {user?.name || "Account"}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {user?.email}
                    </p>
                    {user?.role && (
                      <span className="mt-2 inline-block rounded-full bg-cyan-500/10 px-2 py-0.5 text-xs font-medium text-cyan-400">
                        {user.role}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/settings");
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
                  >
                    <SettingsIcon size={16} />
                    Settings
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-400 transition hover:bg-red-500/10"
                  >
                    <LogOut size={16} />
                    Log Out
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}