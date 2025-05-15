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
  const [authModal, setAuthModal] = useState(null);

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
    // close modal on success
    setAuthModal(null);
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

  const openLoginModal = () => setAuthModal("login");
  const openSignupModal = () => setAuthModal("signup");
  const closeAuthModal = () => setAuthModal(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,

        // these are new:
        authModal,
        openLoginModal,
        openSignupModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
