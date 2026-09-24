import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export type WatchEntry = { pct: number; time: number; duration: number; updated: number };
type ProgressMap = Record<string, WatchEntry>;
type State = {
  list: string[]; toggleList: (id: string) => void;
  profile: string; switchProfile: (id: string, name: string) => void;
  progress: ProgressMap;
  setProgress: (id: string, time: number, duration: number) => void;
  clearProgress: (id: string) => void;
  resumeOf: (id: string) => WatchEntry | undefined;
  synced: boolean;
};
const C = createContext<State | undefined>(undefined);
// Seeded with full-length films so Continue watching resumes a real movie.
const SEED: ProgressMap = {
  "pd-notld": { pct: 34, time: 1960, duration: 5760, updated: Date.now() - 36e5 },
  "pd-general": { pct: 21, time: 990, duration: 4680, updated: Date.now() - 864e5 },
  "pd-detour": { pct: 57, time: 2330, duration: 4080, updated: Date.now() - 2592e5 },
};
function migrate(raw: unknown): ProgressMap {
  const out: ProgressMap = {};
  if (!raw || typeof raw !== "object") return out;
  for (const [id, v] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof v === "number") out[id] = { pct: v, time: 0, duration: 0, updated: Date.now() };
    else if (v && typeof v === "object" && typeof (v as WatchEntry).pct === "number") out[id] = v as WatchEntry;
  }
  return out;
}

export function CinemoraProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [list, setList] = useState<string[]>([]);
  const [profile, setProfile] = useState("mubarak");
  const [progress, setP] = useState<ProgressMap>(SEED);
  const [synced, setSynced] = useState(false);
  const lastPush = useRef<Record<string, number>>({});

  useEffect(() => {
    try {
      setList(JSON.parse(localStorage.getItem("cinemora-list") || "[]"));
      setProfile(localStorage.getItem("cinemora-profile") || "mubarak");
      const stored = localStorage.getItem("cinemora-progress");
      setP(stored ? migrate(JSON.parse(stored)) : SEED);
    } catch { /* ignore */ }
  }, []);

  // Pull the signed-in account's saved list and progress, merging anything
  // watched while signed out.
  useEffect(() => {
    if (!userId) { setSynced(false); return }
    let cancelled = false;
    (async () => {
      const [{ data: wl }, { data: wp }] = await Promise.all([
        supabase.from("watchlist").select("media_id"),
        supabase.from("watch_progress").select("media_id, pct, position_seconds, duration_seconds, updated_at"),
      ]);
      if (cancelled) return;
      const remoteList = (wl ?? []).map(r => r.media_id);
      const remoteProgress: ProgressMap = {};
      for (const r of wp ?? []) {
        remoteProgress[r.media_id] = {
          pct: r.pct, time: r.position_seconds, duration: r.duration_seconds,
          updated: new Date(r.updated_at).getTime(),
        };
      }
      const localList = JSON.parse(localStorage.getItem("cinemora-list") || "[]") as string[];
      const localProgress = migrate(JSON.parse(localStorage.getItem("cinemora-progress") || "{}"));

      const mergedList = Array.from(new Set([...remoteList, ...localList]));
      const mergedProgress: ProgressMap = { ...remoteProgress };
      for (const [id, entry] of Object.entries(localProgress)) {
        const r = remoteProgress[id];
        if (!r || entry.updated > r.updated) mergedProgress[id] = entry;
      }

      const newList = mergedList.filter(id => !remoteList.includes(id));
      if (newList.length) await supabase.from("watchlist").upsert(newList.map(media_id => ({ user_id: userId, media_id })), { onConflict: "user_id,media_id" });
      const toPush = Object.entries(mergedProgress).filter(([id, e]) => !remoteProgress[id] || remoteProgress[id]!.updated < e.updated);
      if (toPush.length) await supabase.from("watch_progress").upsert(toPush.map(([media_id, e]) => ({
        user_id: userId, media_id, pct: e.pct, position_seconds: e.time, duration_seconds: e.duration,
        updated_at: new Date(e.updated).toISOString(),
      })), { onConflict: "user_id,media_id" });

      if (cancelled) return;
      setList(mergedList);
      setP(mergedProgress);
      localStorage.setItem("cinemora-list", JSON.stringify(mergedList));
      localStorage.setItem("cinemora-progress", JSON.stringify(mergedProgress));
      setSynced(true);
    })().catch(() => setSynced(false));
    return () => { cancelled = true };
  }, [userId]);

  const value = useMemo<State>(() => ({
    list, profile, progress, synced,
    toggleList: (id: string) => setList(v => {
      const has = v.includes(id);
      const n = has ? v.filter(x => x !== id) : [...v, id];
      localStorage.setItem("cinemora-list", JSON.stringify(n));
      if (userId) {
        if (has) void supabase.from("watchlist").delete().eq("user_id", userId).eq("media_id", id);
        else void supabase.from("watchlist").upsert({ user_id: userId, media_id: id }, { onConflict: "user_id,media_id" });
      }
      toast.success(has ? "Removed from My List" : "Added to My List");
      return n;
    }),
    switchProfile: (id: string, name: string) => { setProfile(id); localStorage.setItem("cinemora-profile", id); toast.success(`Switched to ${name}`); },
    setProgress: (id: string, time: number, duration: number) => setP(v => {
      const pct = duration > 0 ? Math.min(100, Math.round((time / duration) * 100)) : 0;
      const prev = v[id];
      if (prev && Math.abs(prev.time - time) < 3 && prev.pct === pct) return v;
      const entry = { pct, time, duration, updated: Date.now() };
      const next = { ...v, [id]: entry };
      localStorage.setItem("cinemora-progress", JSON.stringify(next));
      if (userId && entry.updated - (lastPush.current[id] ?? 0) > 5000) {
        lastPush.current[id] = entry.updated;
        void supabase.from("watch_progress").upsert({
          user_id: userId, media_id: id, pct, position_seconds: time, duration_seconds: duration,
          updated_at: new Date(entry.updated).toISOString(),
        }, { onConflict: "user_id,media_id" });
      }
      return next;
    }),
    clearProgress: (id: string) => setP(v => {
      const next = { ...v }; delete next[id];
      localStorage.setItem("cinemora-progress", JSON.stringify(next));
      if (userId) void supabase.from("watch_progress").delete().eq("user_id", userId).eq("media_id", id);
      return next;
    }),
    resumeOf: (id: string) => progress[id],
  }), [list, profile, progress, synced, userId]);

  return <C.Provider value={value}>{children}</C.Provider>;
}
export function useCinemora() { const c = useContext(C); if (!c) throw new Error("CinemoraProvider missing"); return c; }
