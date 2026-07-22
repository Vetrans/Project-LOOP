import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  Bot,
  FileText,
  Users,
  Settings,
} from "lucide-react";

const links = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Feedback", icon: MessageSquare, path: "/feedback" },
  { name: "Analytics", icon: BarChart3, path: "/analytics" },
  { name: "Ask LOOP", icon: Bot, path: "/ask-loop" },
  { name: "Reports", icon: FileText, path: "/reports" },
  { name: "Team", icon: Users, path: "/team" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

export default function Sidebar() {
  return (
    <aside className="sticky top-0 h-screen w-64 border-r border-white/10 bg-[#0E1515] px-5 py-6">
      <h1 className="mb-10 text-2xl font-bold text-cyan-400">
        LOOP AI
      </h1>

      <nav className="space-y-2">
        {links.map(({ name, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                isActive
                  ? "bg-cyan-500 text-black font-semibold"
                  : "text-gray-300 hover:bg-white/10"
              }`
            }
          >
            <Icon size={20} />
            {name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}