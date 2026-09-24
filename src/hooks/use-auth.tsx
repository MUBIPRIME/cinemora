import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Profile = { id: string; display_name: string | null; avatar_url: string | null };

type AuthState = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const C = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setLoading(false);
    });
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const userId = session?.user.id;
  const loadProfile = async (id: string) => {
    const { data } = await supabase.from("profiles").select("id, display_name, avatar_url").eq("id", id).maybeSingle();
    setProfile(data ?? null);
  };

  useEffect(() => {
    if (!userId) { setProfile(null); return }
    void loadProfile(userId);
  }, [userId]);

  const value = useMemo<AuthState>(() => ({
    user: session?.user ?? null,
    session,
    profile,
    loading,
    signOut: async () => { await supabase.auth.signOut() },
    refreshProfile: async () => { if (userId) await loadProfile(userId) },
  }), [session, profile, loading, userId]);

  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useAuth() {
  const c = useContext(C);
  if (!c) throw new Error("AuthProvider missing");
  return c;
}
