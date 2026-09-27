import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

type AdminCtx = {
  isAdmin: boolean;
  ready: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
};

const Ctx = createContext<AdminCtx>({
  isAdmin: false,
  ready: false,
  login: async () => "Not ready yet — try again in a moment.",
  logout: () => {},
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAdmin(!!data.session);
      setReady(true);
    });
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
    });
    return () => subscription.subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    return error ? error.message : null;
  };

  const logout = () => {
    void supabase.auth.signOut();
  };

  return <Ctx.Provider value={{ isAdmin, ready, login, logout }}>{children}</Ctx.Provider>;
}

export const useAdmin = () => useContext(Ctx);
