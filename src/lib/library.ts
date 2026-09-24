import { supabase } from "@/integrations/supabase/client";

export type LibraryTitle = {
  id: string;
  title: string;
  description: string | null;
  year: number | null;
  genres: string[];
  poster_path: string | null;
  video_path: string | null;
  video_url: string | null;
  created_at: string;
};

const BUCKET = "library-media";

export async function listLibrary(): Promise<LibraryTitle[]> {
  const { data, error } = await supabase
    .from("library_titles")
    .select("id, title, description, year, genres, poster_path, video_path, video_url, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as LibraryTitle[];
}

export async function signedUrl(path: string | null, seconds = 60 * 60 * 6) {
  if (!path) return null;
  const { data } = await supabase.storage.from(BUCKET).createSignedUrl(path, seconds);
  return data?.signedUrl ?? null;
}

function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function uploadFile(userId: string, file: File, kind: "poster" | "video") {
  const path = `${userId}/${kind}/${Date.now()}-${safeName(file.name)}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw error;
  return path;
}

export async function createTitle(userId: string, row: {
  title: string; description: string; year: number | null; genres: string[];
  poster_path: string | null; video_path: string | null; video_url: string | null;
}) {
  const { data, error } = await supabase.from("library_titles").insert({ user_id: userId, ...row }).select().single();
  if (error) throw error;
  return data;
}

export async function updateTitle(id: string, patch: Partial<LibraryTitle>) {
  const { error } = await supabase.from("library_titles").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw error;
}

export async function deleteTitle(t: LibraryTitle) {
  const paths = [t.poster_path, t.video_path].filter(Boolean) as string[];
  if (paths.length) await supabase.storage.from(BUCKET).remove(paths);
  const { error } = await supabase.from("library_titles").delete().eq("id", t.id);
  if (error) throw error;
}
