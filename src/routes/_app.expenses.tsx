import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader, StatCard, EmptyState } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { expenses as seedExpenses, expenseCategories, type Expense, type ExpenseCategory } from "@/lib/mock-data";
import { Plus, Receipt, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/expenses")({
  head: () => ({ meta: [{ title: "Expenses — GymGenie" }] }),
  component: ExpensesPage,
});

function ExpensesPage() {
  const [list, setList] = useState<Expense[]>(seedExpenses);
  const [cat, setCat] = useState<string>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [f, setF] = useState({ category: "Rent" as ExpenseCategory, amount: "", date: new Date().toISOString().slice(0, 10), notes: "" });

  const filtered = useMemo(() => list.filter(e => {
    if (cat !== "all" && e.category !== cat) return false;
    if (from && e.date < from) return false;
    if (to && e.date > to) return false;
    return true;
  }), [list, cat, from, to]);

  const thisMonth = "2026-06";
  const lastMonth = "2026-05";
  const totalThis = list.filter(e => e.date.startsWith(thisMonth)).reduce((s, e) => s + e.amount, 0);
  const totalLast = list.filter(e => e.date.startsWith(lastMonth)).reduce((s, e) => s + e.amount, 0);
  const byCat = list.filter(e => e.date.startsWith(thisMonth)).reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount; return acc;
  }, {});
  const biggest = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];
  const delta = totalLast ? Math.round(((totalThis - totalLast) / totalLast) * 100) : 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.amount) { toast.error("Enter an amount"); return; }
    const nextNo = list.length + 1;
    const exp: Expense = {
      id: `E${String(nextNo).padStart(3, "0")}`,
      receiptNo: `EXP-${String(nextNo).padStart(3, "0")}`,
      category: f.category, amount: Number(f.amount), date: f.date, notes: f.notes,
    };
    setList([exp, ...list]);
    toast.success(`Expense logged — ${exp.receiptNo}`);
    setF({ category: "Rent", amount: "", date: new Date().toISOString().slice(0, 10), notes: "" });
  };

  return (
    <>
      <PageHeader title="Expenses" description="Track operating costs and compare against revenue." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total expenses (this month)" value={`₹${totalThis.toLocaleString("en-IN")}`} hint={`vs ₹${totalLast.toLocaleString("en-IN")} last month`} icon={<Wallet className="h-5 w-5" />} accent />
        <StatCard label="Biggest category" value={biggest ? biggest[0] : "—"} hint={biggest ? `₹${biggest[1].toLocaleString("en-IN")}` : ""} icon={<Receipt className="h-5 w-5" />} />
        <StatCard label="vs Last month" value={`${delta > 0 ? "+" : ""}${delta}%`} hint={delta >= 0 ? "Higher spending" : "Saved this month"} icon={delta >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <form onSubmit={submit} className="rounded-xl border border-border bg-card p-5 lg:col-span-1">
          <div className="mb-4 flex items-center gap-2"><Plus className="h-4 w-4 text-primary" /><h3 className="font-semibold">Add expense</h3></div>
          <div className="space-y-3">
            <div><Label>Category</Label>
              <Select value={f.category} onValueChange={(v) => setF({ ...f, category: v as ExpenseCategory })}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>{expenseCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Amount (₹)</Label><Input type="number" value={f.amount} onChange={(e) => setF({ ...f, amount: e.target.value })} placeholder="0" className="mt-1.5" /></div>
            <div><Label>Date</Label><Input type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} className="mt-1.5" /></div>
            <div><Label>Notes</Label><Textarea rows={2} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} className="mt-1.5" /></div>
            <Button type="submit" className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"><Receipt className="h-4 w-4" /> Log expense</Button>
          </div>
        </form>

        <div className="rounded-xl border border-border bg-card lg:col-span-2">
          <div className="flex flex-wrap items-end gap-3 p-5 pb-3">
            <div className="flex-1 min-w-[140px]"><Label className="text-xs">Category</Label>
              <Select value={cat} onValueChange={setCat}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="all">All</SelectItem>{expenseCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">From</Label><Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1.5" /></div>
            <div><Label className="text-xs">To</Label><Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="mt-1.5" /></div>
          </div>
          {filtered.length === 0 ? (
            <div className="p-5"><EmptyState icon={<Receipt className="h-5 w-5" />} title="No expenses match" description="Try clearing the filters or log your first expense." /></div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow className="hover:bg-transparent">
                  <TableHead>Receipt</TableHead><TableHead>Category</TableHead><TableHead>Amount</TableHead><TableHead>Date</TableHead><TableHead>Notes</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {filtered.map(e => (
                    <TableRow key={e.id}>
                      <TableCell className="font-mono text-xs">{e.receiptNo}</TableCell>
                      <TableCell><Badge variant="outline">{e.category}</Badge></TableCell>
                      <TableCell className="font-semibold text-primary">₹{e.amount.toLocaleString("en-IN")}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{e.date}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{e.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
