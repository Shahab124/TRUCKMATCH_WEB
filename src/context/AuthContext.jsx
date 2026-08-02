import { createContext, useContext, useState } from "react";
import { getToken, getUser, saveSession, clearSession } from "../lib/token";
import { login as loginRequest, signup as signupRequest } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getUser());

  const isLoggedIn = Boolean(getToken()) && Boolean(user);

  async function login(email, password) {
    const session = await loginRequest(email, password);
    saveSession(session);
    setUser({ role: session.role, name: session.name });
    return session;
  }

  async function signup(payload) {
    return signupRequest(payload);
  }

  function logout() {
    clearSession();
    setUser(null);
  }

  // After editing the profile, keep the cached name (navbar, greeting) in sync
  // without forcing a re-login.
  function refreshName(name) {
    setUser((prev) => {
      const next = { ...prev, name };
      saveSession({ access_token: getToken(), role: next.role, name });
      return next;
    });
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, signup, logout, refreshName }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}