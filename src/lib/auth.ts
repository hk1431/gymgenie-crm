import { useEffect, useState } from "react";

const KEY = "gymgenie_auth";
export interface AuthUser { email: string; role: "Owner" | "Manager" | "Trainer" | "Receptionist"; name: string; }

export function getAuth(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try { const v = localStorage.getItem(KEY); return v ? JSON.parse(v) : null; } catch { return null; }
}
export function setAuth(u: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (u) localStorage.setItem(KEY, JSON.stringify(u));
  else localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("gymgenie-auth"));
}
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => {
    setUser(getAuth());
    const h = () => setUser(getAuth());
    window.addEventListener("gymgenie-auth", h);
    window.addEventListener("storage", h);
    return () => { window.removeEventListener("gymgenie-auth", h); window.removeEventListener("storage", h); };
  }, []);
  return user;
}
