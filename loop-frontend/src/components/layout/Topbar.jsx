import { Bell, UserCircle2 } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex items-center justify-end border-b border-white/10 bg-[#0E1515] px-6 py-4">
      <div className="flex items-center gap-5">
        <Bell className="cursor-pointer text-gray-300 transition hover:text-cyan-400" />

        <UserCircle2
          size={34}
          className="cursor-pointer text-cyan-400"
        />
      </div>
    </header>
  );
}