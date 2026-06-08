import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Logo, FrequencyFooter } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { setAuth, getAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Dumbbell, Sparkles, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Sign in — GymGenie" }] }),
  beforeLoad: () => {
    if (typeof window !== "undefined" && getAuth()) throw redirect({ to: "/dashboard" });
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("ravi@sixpaxindia.com");
  const [password, setPassword] = useState("demo1234");
  const [role, setRole] = useState<"Owner" | "Manager" | "Trainer" | "Receptionist">("Owner");
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Enter email and password"); return; }
    setLoading(true);
    setTimeout(() => {
      setAuth({ email, role, name: email.split("@")[0].split(".")[0].replace(/^./, (c) => c.toUpperCase()) });
      toast.success(`Welcome back, ${role}`);
      navigate({ to: "/dashboard" });
    }, 500);
  };

  return (
    <div className="relative grid min-h-screen lg:grid-cols-2">
      {/* Left hero */}
      <div className="relative hidden overflow-hidden bg-sidebar lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative">
          <Logo size="lg" />
        </div>
        <div className="relative space-y-6">
          <h2 className="text-4xl font-bold leading-tight">
            The all-in-one CRM <br /> built for{" "}
            <span className="text-gradient-orange">modern gyms.</span>
          </h2>
          <p className="max-w-md text-muted-foreground">
            Manage members, plans, attendance, leads and payments — beautifully, on any device.
          </p>
          <div className="space-y-3 pt-4">
            {[
              { icon: Dumbbell, text: "Built for Indian gyms — UPI, GST, regional plans" },
              { icon: Sparkles, text: "Lead pipeline that converts walk-ins into members" },
              { icon: ShieldCheck, text: "Role-based access for owners, managers, trainers" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 text-primary">
                  <f.icon className="h-4 w-4" />
                </div>
                <span className="text-foreground/90">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
        <FrequencyFooter className="relative" />
      </div>

      {/* Right form */}
      <div className="flex flex-col items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 flex justify-center"><Logo size="md" /></div>
          <h1 className="text-2xl font-bold">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">Welcome back. Pick your role and continue.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@gym.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as typeof role)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Owner">Owner</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Trainer">Trainer</SelectItem>
                  <SelectItem value="Receptionist">Receptionist</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-orange">
              {loading ? "Signing in…" : "Sign in"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Demo credentials are pre-filled. Click sign in to explore.
            </p>
          </form>
          <div className="mt-10 lg:hidden"><FrequencyFooter className="text-center" /></div>
        </div>
      </div>
    </div>
  );
}
