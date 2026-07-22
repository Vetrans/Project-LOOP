import { Bell, UserCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Topbar() {
  const { user } = useAuth();

  const initials = (user?.name || "")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <header className="flex items-center justify-between border-b border-white/10 bg-[#0E1515] px-6 py-4">
      <div>
        {user?.workspace?.name && (
          <p className="text-sm text-gray-400">{user.workspace.name}</p>
        )}
      </div>

      <div className="flex items-center gap-5">
        <Bell className="cursor-pointer text-gray-300 transition hover:text-cyan-400" />

        <div className="flex items-center gap-3">
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
        </div>
      </div>
    </header>
  );
}