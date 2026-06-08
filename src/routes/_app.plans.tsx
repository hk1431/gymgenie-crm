import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, EmptyState } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { plans, payments as seedPayments, pendingDues, members, type Payment } from "@/lib/mock-data";
import { Bell, CreditCard, Plus, Receipt } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/plans")({
  head: () => ({ meta: [{ title: "Plans & Fees — GymGenie" }] }),
  component: PlansPage,
});

function PlansPage() {
  const [pays, setPays] = useState<Payment[]>(seedPayments);
  const [f, setF] = useState({ memberId: "", amount: "", mode: "UPI" as Payment["mode"], date: new Date().toISOString().slice(0,10) });

  const record = (e: React.FormEvent) => {
    e.preventDefault();
    const m = members.find(x => x.id === f.memberId);
    if (!m || !f.amount) { toast.error("Pick a member and amount"); return; }
    const nextNo = pays.length + 1;
    const p: Payment = {
      id: `PAY${Math.floor(Math.random()*900+100)}`,
      memberId: m.id, memberName: m.name, amount: Number(f.amount), mode: f.mode,
      receiptNo: `GG-${String(nextNo).padStart(3, "0")}`, paidAt: f.date,
    };
    setPays([p, ...pays]);
    toast.success(`Payment recorded — Receipt ${p.receiptNo}`);
    setF({ memberId: "", amount: "", mode: "UPI", date: new Date().toISOString().slice(0,10) });
  };

  return (
    <>
      <PageHeader title="Plans & Fees" description="Manage plans, collect payments and track dues." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Plans</h3>
              <Button variant="outline" size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" /> New plan</Button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {plans.map(p => (
                <div key={p.id} className="group relative rounded-lg border border-border bg-background/40 p-4 transition hover:border-primary/50">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">{p.durationDays}d</div>
                  <div className="mt-1 font-semibold">{p.name}</div>
                  <div className="mt-2 text-lg font-bold text-primary">₹{p.price.toLocaleString("en-IN")}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between p-5 pb-3">
              <h3 className="font-semibold">Payment history</h3>
              <Badge variant="outline" className="font-normal">{pays.length} records</Badge>
            </div>
            {pays.length === 0 ? (
              <div className="px-5 pb-5">
                <EmptyState
                  icon={<Receipt className="h-5 w-5" />}
                  title="No payments yet"
                  description="Recorded payments will appear here with auto-generated receipts. Use the form on the right to collect your first fee."
                />
              </div>
            ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Receipt</TableHead><TableHead>Member</TableHead><TableHead>Amount</TableHead><TableHead>Mode</TableHead><TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pays.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-xs">{p.receiptNo}</TableCell>
                      <TableCell className="font-medium">{p.memberName}</TableCell>
                      <TableCell className="font-semibold text-primary">₹{p.amount.toLocaleString("en-IN")}</TableCell>
                      <TableCell><Badge variant="outline">{p.mode}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.paidAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <form onSubmit={record} className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary" /><h3 className="font-semibold">Collect fee</h3></div>
            <div className="space-y-3">
              <div><Label>Member</Label>
                <Select value={f.memberId} onValueChange={(v)=>setF({...f, memberId:v})}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select member" /></SelectTrigger>
                  <SelectContent>{members.map(m => <SelectItem key={m.id} value={m.id}>{m.name} — {m.phone}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Amount (₹)</Label><Input type="number" value={f.amount} onChange={(e)=>setF({...f, amount:e.target.value})} placeholder="1500" className="mt-1.5" /></div>
              <div><Label>Payment mode</Label>
                <Select value={f.mode} onValueChange={(v)=>setF({...f, mode:v as Payment["mode"]})}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem><SelectItem value="UPI">UPI</SelectItem><SelectItem value="Card">Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Date</Label><Input type="date" value={f.date} onChange={(e)=>setF({...f, date:e.target.value})} className="mt-1.5" /></div>
              <Button type="submit" className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"><Receipt className="h-4 w-4" /> Record payment</Button>
            </div>
          </form>

          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-destructive">Pending dues</h3>
              <Badge variant="outline" className="border-destructive/40 text-destructive">{pendingDues.length}</Badge>
            </div>
            <ul className="space-y-3">
              {pendingDues.map(d => (
                <li key={d.memberId} className="flex items-center justify-between gap-2 rounded-lg border border-destructive/20 bg-background/40 p-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{d.memberName}</div>
                    <div className="text-xs text-muted-foreground">Due since {d.dueSince}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-destructive">₹{d.amount.toLocaleString("en-IN")}</div>
                    <button onClick={() => toast.success(`Reminder queued for ${d.memberName}`)} className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"><Bell className="h-3 w-3" /> Remind</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
