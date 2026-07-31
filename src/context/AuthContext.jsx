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

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}