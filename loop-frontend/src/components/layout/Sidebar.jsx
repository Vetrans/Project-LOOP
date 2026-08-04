import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  TrendingUp,
  Bot,
  FileText,
  Users,
  ShieldCheck,
  Settings,
  Sparkles,
} from "lucide-react";

const links = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Feedback", icon: MessageSquare, path: "/feedback" },
  { name: "Analytics", icon: BarChart3, path: "/analytics" },
  { name: "Trends", icon: TrendingUp, path: "/trends" },
  { name: "Ask LOOP", icon: Bot, path: "/ask-loop" },
  { name: "Reports", icon: FileText, path: "/reports" },
  { name: "Team", icon: Users, path: "/team" },
  { name: "Members", icon: ShieldCheck, path: "/members" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

export default function Sidebar() {
  const { user } = useAuth();
  return (
    <aside className="sticky top-0 h-screen w-64 border-r border-white/10 bg-[#0E1515] px-5 py-6">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500 text-black">
          <Sparkles size={20} />
        </div>

        <h1 className="text-2xl font-bold text-white">
          LOOP <span className="text-cyan-400">AI</span>
        </h1>
      </div>

      <nav className="space-y-2">
        {links
  .filter((link) => {
    if (user?.role === "VIEWER" && link.path === "/ask-loop") {
      return false;
    }

    if (user?.role !== "ADMIN" && link.path === "/members") {
      return false;
    }

    return true;
  })
  .map(({ name, icon: Icon, path }) => (
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