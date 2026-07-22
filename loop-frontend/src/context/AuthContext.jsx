import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("loop_token")) { setLoading(false); return; }
    api.get("/auth/me").then(({ data }) => setUser(data)).catch(() => {
      localStorage.removeItem("loop_token");
    }).finally(() => setLoading(false));
  }, []);

  async function login(credentials) {
    const { data } = await api.post("/auth/login", credentials);
    localStorage.setItem("loop_token", data.token);
    setUser(data.user);
    return data.user;
  }

  async function signup(payload) {
    const { data } = await api.post("/auth/signup", payload);
    localStorage.setItem("loop_token", data.token);
    setUser(data.user);
    return data.user;
  }

  // Called once, at the end of the mandatory onboarding flow. Merges the
  // server's response (which includes onboardingCompleted: true) into
  // the current user so ProtectedRoute immediately stops redirecting
  // to /onboarding without needing a full /auth/me refetch.
  async function completeOnboarding(payload) {
    const { data } = await api.patch("/auth/onboarding", payload);
    setUser((prev) => ({ ...prev, ...data }));
    return data;
  }

  // Lets pages like Settings push a partial update (e.g. new name,
  // avatar, workspace name) into the shared user object after a save,
  // so the Topbar/Sidebar reflect it without a page reload.
  function updateUser(partial) {
    setUser((prev) => (prev ? { ...prev, ...partial } : prev));
  }

  function logout() { localStorage.removeItem("loop_token"); setUser(null); }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, completeOnboarding, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}