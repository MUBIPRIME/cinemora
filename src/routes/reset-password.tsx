import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute('/reset-password')({
  head: () => ({ meta: [
    { title: 'Set a new password — CINEMORA' },
    { name: 'description', content: 'Choose a new password for your CINEMORA account.' },
    { property: 'og:title', content: 'Set a new password — CINEMORA' },
    { property: 'og:description', content: 'Choose a new password for your CINEMORA account.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: ResetPassword,
});

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error("Use at least 6 characters"); return }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) { toast.error(error.message); return }
    toast.success("Password updated");
    void navigate({ to: '/profile' });
  };

  return <div className="relative grid min-h-screen place-items-center px-4 py-24">
    <form onSubmit={submit} className="w-full max-w-md rounded-md border border-border bg-glass p-7 backdrop-blur-xl">
      <h1 className="font-display text-3xl font-semibold">Set a new password</h1>
      <p className="mt-2 text-sm text-muted-foreground">Open this page from the link in your reset email.</p>
      <div className="mt-6">
        <Label htmlFor="new-password">New password</Label>
        <Input id="new-password" type="password" className="mt-2" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <Button className="mt-6 w-full" size="lg" disabled={busy}>{busy ? "Saving…" : "Update password"}</Button>
    </form>
  </div>;
}
