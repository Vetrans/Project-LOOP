import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Inbox as InboxIcon,
  TrendingUp,
  MessagesSquare,
  FileText,
  Users,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function LoopMark({ size = 28 }) {
  // Signature element: an unclosed ring that "closes the loop" — echoes
  // the brief's own framing ("close the loop on customer feedback").
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="12" stroke="#2A3349" strokeWidth="3" />
      <path
        d="M16 4a12 12 0 0 1 12 12"
        stroke="#7C6FF0"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="28" cy="16" r="2.5" fill="#2DD9B9" />
    </svg>
  );
}

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/inbox", label: "Inbox", icon: InboxIcon },
  { to: "/trends", label: "Trends", icon: TrendingUp },
  { to: "/ask", label: "Ask LOOP", icon: MessagesSquare },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/settings", label: "Members", icon: Users, permission: "manage_members" },
];

export default function Layout() {
  const { user, logout, can } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen bg-ink-950">
      <aside className="flex w-60 shrink-0 flex-col border-r border-ink-700 bg-ink-900/60 px-4 py-5">
        <div className="mb-8 flex items-center gap-2 px-2">
          <LoopMark />
          <div>
            <p className="font-display text-base font-bold leading-none text-mist-100">LOOP</p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-mist-400">
              feedback intelligence
            </p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {NAV.filter((item) => !item.permission || can(item.permission)).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-loop-violet/15 text-loop-violet"
                    : "text-mist-300 hover:bg-ink-800 hover:text-mist-100"
                }`
              }
            >
              <item.icon size={17} strokeWidth={2} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-ink-700 pt-4">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-loop-violet/20 font-display text-xs font-semibold text-loop-violet">
              {user?.name?.[0] ?? "?"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-mist-100">{user?.name}</p>
              <p className="truncate font-mono text-[10px] uppercase tracking-wide text-mist-400">
                {user?.role} · {user?.workspace?.name}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-md p-1.5 text-mist-400 hover:bg-ink-800 hover:text-loop-coral"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
