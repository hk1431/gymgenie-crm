import { useMemo, useState } from "react";
import { Phone, AlarmClock, UserX, MessageSquareHeart, Wallet, Check, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { members, enquiries, pendingDues, lastVisitDays } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const TODAY = new Date("2026-06-08");
const daysBetween = (a: Date, b: Date) => Math.floor((a.getTime() - b.getTime()) / 86400000);

export type Task = {
  id: string;
  name: string;
  phone: string;
  type: "Renewal" | "Re-engage" | "Follow-up" | "Payment";
  reason: string;
  icon: typeof Phone;
  tone: string;
};

export function buildTasks(): Task[] {
  const t: Task[] = [];
  for (const m of members) {
    const expIn = daysBetween(new Date(m.expiryDate), TODAY);
    if (m.status === "Active" && expIn >= 0 && expIn <= 3) {
      t.push({ id: `r-${m.id}`, name: m.name, phone: m.phone, type: "Renewal", reason: `Plan expires in ${expIn} day${expIn === 1 ? "" : "s"}`, icon: AlarmClock, tone: "text-warning" });
    }
    const absent = lastVisitDays[m.id] ?? 0;
    if (m.status === "Active" && absent >= 7) {
      t.push({ id: `a-${m.id}`, name: m.name, phone: m.phone, type: "Re-engage", reason: `Absent ${absent} days`, icon: UserX, tone: "text-destructive" });
    }
  }
  for (const e of enquiries) {
    if (e.followUpDate === "2026-06-08") {
      t.push({ id: `e-${e.id}`, name: e.name, phone: e.phone, type: "Follow-up", reason: `Enquiry — ${e.interest}`, icon: MessageSquareHeart, tone: "text-primary" });
    }
  }
  for (const d of pendingDues) {
    const overdue = daysBetween(TODAY, new Date(d.dueSince));
    if (overdue >= 7) {
      t.push({ id: `p-${d.memberId}`, name: d.memberName, phone: members.find(m => m.id === d.memberId)?.phone || "", type: "Payment", reason: `₹${d.amount.toLocaleString("en-IN")} overdue ${overdue}d`, icon: Wallet, tone: "text-destructive" });
    }
  }
  return t;
}

export function AajKaKaam() {
  const all = useMemo(() => buildTasks(), []);
  const [done, setDone] = useState<Set<string>>(new Set());
  const remaining = all.filter(t => !done.has(t.id));

  return (
    <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold tracking-tight">Aaj Ka Kaam</h3>
            <Badge variant="outline" className="border-primary/40 text-primary">{remaining.length} pending</Badge>
          </div>
          <p className="text-xs text-muted-foreground">Today's follow-ups, renewals and re-engagement calls.</p>
        </div>
        {remaining.length === 0 && (
          <div className="flex items-center gap-1.5 text-sm text-success"><CheckCircle2 className="h-4 w-4" /> All caught up!</div>
        )}
      </div>

      {remaining.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-background/40 py-8 text-center text-sm text-muted-foreground">
          Shabaash! No pending follow-ups right now.
        </div>
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2">
          {remaining.slice(0, 8).map((t) => {
            const Icon = t.icon;
            return (
              <li key={t.id} className="flex items-center gap-3 rounded-lg border border-border bg-background/60 p-3">
                <div className={cn("grid h-9 w-9 place-items-center rounded-lg bg-primary/10", t.tone)}><Icon className="h-4 w-4" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">{t.name}</span>
                    <Badge variant="outline" className="text-[10px]">{t.type}</Badge>
                  </div>
                  <div className="truncate text-xs text-muted-foreground">{t.reason} · {t.phone}</div>
                </div>
                <div className="flex gap-1">
                  <Button asChild size="icon" variant="ghost" className="h-8 w-8">
                    <a href={`tel:${t.phone.replace(/\s/g, "")}`}><Phone className="h-3.5 w-3.5 text-primary" /></a>
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setDone(new Set([...done, t.id]))}>
                    <Check className="h-3.5 w-3.5 text-success" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
