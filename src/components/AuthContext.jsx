import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // load persisted user
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = ({ username, password }) => {
    const adminPass = import.meta.env.VITE_ADMIN_PASSWORD || "letmein";
    if (username === "admin" && password === adminPass) {
      const adminUser = { username: "admin", role: "admin" };
      setUser(adminUser);
      localStorage.setItem("user", JSON.stringify(adminUser));
      return { ok: true };
    }
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const match = users.find(
      (u) => u.username === username && u.password === password
    );
    if (match) {
      const normalUser = { username, role: "user" };
      setUser(normalUser);
      localStorage.setItem("user", JSON.stringify(normalUser));
      return { ok: true };
    }
    return { ok: false, message: "Invalid credentials" };
  };

  const signup = ({ username, password }) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find((u) => u.username === username)) {
      return { ok: false, message: "Username exists" };
    }
    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}
