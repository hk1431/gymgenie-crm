import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Logo } from "@/components/brand";
import { gymProfile } from "@/lib/mock-data";
import { ArrowRight, Check, PartyPopper, Sparkles } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "gymgenie:onboarded";
const TOTAL_STEPS = 4;

export function OnboardingWizard() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [gym, setGym] = useState({
    name: gymProfile.name,
    phone: gymProfile.phone,
    email: gymProfile.email,
    address: gymProfile.address,
  });
  const [plan, setPlan] = useState({ name: "Monthly", duration: "30", price: "1500" });
  const [confetti, setConfetti] = useState<{ x: number; delay: number; rot: number; color: string }[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(STORAGE_KEY)) setOpen(true);
  }, []);

  useEffect(() => {
    if (step === 4) {
      const colors = ["#FF6B00", "#FFB347", "#FFFFFF", "#FF8A33"];
      setConfetti(
        Array.from({ length: 50 }, () => ({
          x: Math.random() * 100,
          delay: Math.random() * 0.6,
          rot: Math.random() * 360,
          color: colors[Math.floor(Math.random() * colors.length)],
        })),
      );
    }
  }, [step]);

  const finish = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  const skip = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
    toast.message("Onboarding skipped — you can edit settings anytime.");
  };

  const next = () => setStep((s) => Math.min(TOTAL_STEPS, s + 1));

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) finish(); }}>
      <DialogContent className="sm:max-w-xl border-primary/30 bg-card p-0 overflow-hidden">
        <div className="relative">
          {step === 4 && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {confetti.map((c, i) => (
                <span
                  key={i}
                  className="absolute top-[-10px] block h-2 w-2 rounded-sm"
                  style={{
                    left: `${c.x}%`,
                    background: c.color,
                    transform: `rotate(${c.rot}deg)`,
                    animation: `confetti-fall 1.6s ease-in ${c.delay}s forwards`,
                  }}
                />
              ))}
              <style>{`@keyframes confetti-fall { to { transform: translateY(520px) rotate(720deg); opacity: 0; } }`}</style>
            </div>
          )}

          <div className="border-b border-border bg-gradient-to-r from-primary/15 via-card to-card px-6 py-4">
            <div className="flex items-center justify-between">
              <Logo size="sm" />
              <button onClick={skip} className="text-xs text-muted-foreground hover:text-foreground">
                Skip setup
              </button>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <Progress value={(step / TOTAL_STEPS) * 100} className="h-1.5" />
              <span className="shrink-0 text-xs text-muted-foreground">Step {step} of {TOTAL_STEPS}</span>
            </div>
          </div>

          <div className="px-6 py-6">
            {step === 1 && (
              <div className="space-y-4 text-center animate-fade-in">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/15 text-primary">
                  <Sparkles className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold">Welcome to <span className="text-primary">GymGenie</span>!</h2>
                <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                  Let's set up your gym in 3 quick steps. You'll be managing members in under a minute.
                </p>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h2 className="text-xl font-semibold">Gym details</h2>
                  <p className="mt-1 text-sm text-muted-foreground">We've pre-filled your info — review and continue.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5"><Label>Gym name</Label><Input value={gym.name} onChange={(e) => setGym({ ...gym, name: e.target.value })} /></div>
                  <div className="space-y-1.5"><Label>Phone</Label><Input value={gym.phone} onChange={(e) => setGym({ ...gym, phone: e.target.value })} /></div>
                  <div className="space-y-1.5 sm:col-span-2"><Label>Email</Label><Input type="email" value={gym.email} onChange={(e) => setGym({ ...gym, email: e.target.value })} /></div>
                  <div className="space-y-1.5 sm:col-span-2"><Label>Address</Label><Textarea rows={2} value={gym.address} onChange={(e) => setGym({ ...gym, address: e.target.value })} /></div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h2 className="text-xl font-semibold">Add your first plan</h2>
                  <p className="mt-1 text-sm text-muted-foreground">You can add more plans later from Settings.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="space-y-1.5 sm:col-span-3"><Label>Plan name</Label><Input value={plan.name} onChange={(e) => setPlan({ ...plan, name: e.target.value })} /></div>
                  <div className="space-y-1.5"><Label>Duration (days)</Label><Input type="number" value={plan.duration} onChange={(e) => setPlan({ ...plan, duration: e.target.value })} /></div>
                  <div className="space-y-1.5 sm:col-span-2"><Label>Price (₹)</Label><Input type="number" value={plan.price} onChange={(e) => setPlan({ ...plan, price: e.target.value })} /></div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="relative space-y-4 py-2 text-center animate-fade-in">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/40">
                  <Check className="h-8 w-8" strokeWidth={3} />
                </div>
                <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                  You're all set! <PartyPopper className="h-6 w-6 text-primary" />
                </h2>
                <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                  Your gym is ready to manage. Start by adding members or recording today's attendance.
                </p>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between gap-3">
              <Button variant="ghost" onClick={skip} className="text-muted-foreground">Skip</Button>
              {step < TOTAL_STEPS ? (
                <Button onClick={next} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  {step === 1 ? "Get started" : "Continue"} <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={() => { toast.success("Setup complete!"); finish(); }} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  Go to dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
