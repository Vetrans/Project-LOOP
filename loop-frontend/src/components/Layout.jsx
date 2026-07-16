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
import LoopMark from "./LoopMark";

const NAV = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/inbox", label: "Inbox", icon: InboxIcon },
  { to: "/app/trends", label: "Trends", icon: TrendingUp },
  { to: "/app/ask", label: "Ask LOOP", icon: MessagesSquare },
  { to: "/app/reports", label: "Reports", icon: FileText },
  { to: "/app/settings", label: "Members", icon: Users, permission: "manage_members" },
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
              <item.icon size={16} strokeWidth={2} />
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
