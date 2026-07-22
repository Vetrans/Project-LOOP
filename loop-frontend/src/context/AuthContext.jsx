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

  function logout() { localStorage.removeItem("loop_token"); setUser(null); }
  return <AuthContext.Provider value={{ user, loading, login, signup, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
