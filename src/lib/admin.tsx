import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "dittoland_admin_v1";
const PASSCODE = "ditto2026";

type AdminCtx = {
  isAdmin: boolean;
  login: (code: string) => boolean;
  logout: () => void;
};

const Ctx = createContext<AdminCtx>({
  isAdmin: false,
  login: () => false,
  logout: () => {},
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "1") {
        setIsAdmin(true);
      }
    } catch {
      /* noop */
    }
  }, []);

  const login = (code: string) => {
    if (code.trim() === PASSCODE) {
      setIsAdmin(true);
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* noop */
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
  };

  return <Ctx.Provider value={{ isAdmin, login, logout }}>{children}</Ctx.Provider>;
}

export const useAdmin = () => useContext(Ctx);
