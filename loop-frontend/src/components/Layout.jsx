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
      <path d="M16 4a12 12 0 0 1 12 12" stroke="#7C6FF0" strokeWidth="3" strokeLinecap="round" />
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
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <LoopMark />
          <div>
            <p className="sidebar-brand-name">LOOP</p>
            <p className="sidebar-brand-tag">feedback intelligence</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV.filter((item) => !item.permission || can(item.permission)).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
            >
              <item.icon size={17} strokeWidth={2} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{user?.name?.[0] ?? "?"}</div>
            <div className="sidebar-user-info">
              <p className="sidebar-user-name">{user?.name}</p>
              <p className="sidebar-user-meta">
                {user?.role} · {user?.workspace?.name}
              </p>
            </div>
            <button className="sidebar-logout" onClick={handleLogout} aria-label="Log out" title="Log out">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <div className="main-content-inner">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
