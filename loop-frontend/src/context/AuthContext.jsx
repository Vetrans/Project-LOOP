import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("loop_token");
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem("loop_token"))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const res = await authApi.login({ email, password });
    localStorage.setItem("loop_token", res.data.token);
    setUser(res.data.user);
  }

  async function signup(payload) {
    const res = await authApi.signup(payload);
    localStorage.setItem("loop_token", res.data.token);
    setUser(res.data.user);
  }

  function logout() {
    localStorage.removeItem("loop_token");
    setUser(null);
  }

  // Central place role checks funnel through, so pages never hardcode
  // "if role === ..." logic inline — the API enforces it server-side too,
  // this is only the UX layer (hide/disable), never the real boundary.
  function can(action) {
    if (!user) return false;
    const permissions = {
      ADMIN: ["manage_members", "manage_feedback", "use_ai", "view"],
      ANALYST: ["manage_feedback", "use_ai", "view"],
      VIEWER: ["view"],
    };
    return permissions[user.role]?.includes(action) ?? false;
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, can }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
