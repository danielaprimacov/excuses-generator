import { createContext, useState, useEffect } from "react";

import {
  login as doLogin,
  register as doRegister,
  logout as doLogout,
  getCurrentUser,
} from "../utils/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser());

  useEffect(() => {
    const current = getCurrentUser();
    if (current) setUser(current);
  }, []);

  const login = ({ username, password }) => {
    const res = doLogin({ username, password });
    if (!res.ok) {
      return res;
    }
    setUser(res.user);
    return { ok: true };
  };

  const signup = ({ username, password }) => {
    const res = doRegister({ username, password });
    return res;
  };

  const logout = () => {
    doLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}
