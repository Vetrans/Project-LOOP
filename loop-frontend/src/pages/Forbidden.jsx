import { Link } from "react-router-dom";
import { ShieldAlert, Home } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Forbidden() {
  const { user } = useAuth();
  const homePath = user ? "/dashboard" : "/";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#081111] px-6 text-center text-white">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/15 text-red-400">
        <ShieldAlert size={30} />
      </div>

      <h1 className="text-6xl font-black text-red-400">403</h1>

      <h2 className="mt-4 text-2xl font-semibold text-white">
        You don't have permission to view this page
      </h2>

      <p className="mt-3 max-w-md text-gray-400">
        Your current role doesn't allow access to this section. If you think
        this is a mistake, ask a workspace admin to check your role under{" "}
        <span className="text-gray-300">Members</span>.
      </p>

      <Link
        to={homePath}
        className="mt-8 flex items-center gap-2 rounded-xl bg-[#32E6A4] px-6 py-3 font-semibold text-black transition hover:scale-105"
      >
        <Home size={18} />
        {user ? "Back to Dashboard" : "Back to Home"}
      </Link>
    </div>
  );
}