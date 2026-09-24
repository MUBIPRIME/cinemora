import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthPage({ mode }: { mode: 'login' | 'signup' | 'forgot' }) {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState<null | string>(null);
  const navigate = useNavigate();

  const title = mode === 'login' ? 'Welcome back' : mode === 'signup' ? 'Create your account' : 'Reset your password';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
        if (error) throw error;
        setSent("Check your inbox for the reset link.");
        toast.success("Reset link sent");
        return;
      }
      if (mode === 'signup') {
        if (password !== confirm) { toast.error("Passwords do not match"); return }
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin, data: { display_name: name } },
        });
        if (error) throw error;
        if (!data.session) { setSent("Check your email to confirm your account, then sign in."); return }
        toast.success("Account created");
        void navigate({ to: '/library' });
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Signed in");
      void navigate({ to: '/library' });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) { toast.error("Google sign-in failed"); return }
    if (result.redirected) return;
    void navigate({ to: '/library' });
  };

  return <div className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-24">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--accent),transparent_48%)] opacity-40" />
    <form className="relative w-full max-w-md rounded-md border border-border bg-glass p-7 backdrop-blur-xl" onSubmit={submit}>
      <Link to="/" className="font-display text-lg font-bold tracking-[.2em] text-primary">CINEMORA</Link>
      <h1 className="mt-8 font-display text-3xl font-semibold">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Your account keeps your list, watch progress and personal library in sync.</p>

      {sent && <p className="mt-5 rounded-md border border-border bg-card p-3 text-sm" role="status">{sent}</p>}

      {mode === 'signup' && <div className="mt-6">
        <Label htmlFor="name">Name</Label>
        <Input id="name" className="mt-2" value={name} onChange={e => setName(e.target.value)} required />
      </div>}

      <div className="mt-5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" className="mt-2" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>

      {mode !== 'forgot' && <div className="mt-5">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input id="password" type={show ? 'text' : 'password'} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} className="mt-2 pr-10" value={password} onChange={e => setPassword(e.target.value)} required />
          <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-2" onClick={() => setShow(!show)} aria-label="Show or hide password">{show ? <EyeOff /> : <Eye />}</Button>
        </div>
      </div>}

      {mode === 'signup' && <div className="mt-5">
        <Label htmlFor="confirm">Confirm password</Label>
        <Input id="confirm" type="password" autoComplete="new-password" className="mt-2" value={confirm} onChange={e => setConfirm(e.target.value)} required />
      </div>}

      <Button className="mt-7 w-full" size="lg" disabled={busy}>
        {busy ? 'Please wait…' : mode === 'forgot' ? 'Send reset link' : mode === 'signup' ? 'Create account' : 'Sign in'}
      </Button>

      {mode !== 'forgot' && <Button type="button" variant="outline" className="mt-3 w-full" onClick={google}>Continue with Google</Button>}

      {mode === 'login' && <>
        <Button type="button" variant="ghost" className="mt-3 w-full" asChild><Link to="/">Continue as guest</Link></Button>
        <div className="mt-5 flex justify-between text-sm">
          <Link to="/forgot-password" className="text-muted-foreground">Forgot password?</Link>
          <Link to="/signup" className="text-primary">Create account</Link>
        </div>
      </>}

      {mode === 'signup' && <p className="mt-5 text-center text-sm text-muted-foreground">Already a member? <Link to="/login" className="text-primary">Sign in</Link></p>}
      {mode === 'forgot' && <p className="mt-5 text-center text-sm text-muted-foreground"><Link to="/login" className="text-primary">Back to sign in</Link></p>}
    </form>
  </div>;
}
