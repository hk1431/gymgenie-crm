import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader, EmptyState } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { members as seedMembers, type Member, plans, memberRisk } from "@/lib/mock-data";
import { RiskBadge } from "@/components/risk-badge";
import { Download, Edit, Eye, Plus, Search, ShieldAlert, Trash2, Upload, Users } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/members/")({
  head: () => ({ meta: [{ title: "Members — GymGenie" }] }),
  component: MembersPage,
});

function statusColor(s: Member["status"]) {
  if (s === "Active") return "bg-success/15 text-success border-success/30";
  if (s === "Expired") return "bg-destructive/15 text-destructive border-destructive/30";
  return "bg-warning/15 text-warning border-warning/30";
}

function MembersPage() {
  const [list, setList] = useState<Member[]>(seedMembers);
  const [q, setQ] = useState("");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [highRiskOnly, setHighRiskOnly] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const filtered = useMemo(() => list.filter((m) => {
    if (q && !`${m.name} ${m.phone} ${m.email}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (planFilter !== "all" && m.plan !== planFilter) return false;
    if (statusFilter !== "all" && m.status !== statusFilter) return false;
    if (highRiskOnly && memberRisk(m.id).level !== "high") return false;
    return true;
  }), [list, q, planFilter, statusFilter, highRiskOnly]);

  const exportCsv = () => {
    const rows = [["ID","Name","Phone","Email","Plan","Join","Expiry","Status"], ...filtered.map(m => [m.id,m.name,m.phone,m.email,m.plan,m.joinDate,m.expiryDate,m.status])];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "members.csv";
    a.click();
    toast.success("Members exported");
  };

  const onDelete = (id: string) => {
    setList(list.filter(m => m.id !== id));
    toast.success("Member removed");
  };

  return (
    <>
      <PageHeader
        title="Members"
        description="Manage member profiles, plans and statuses."
        actions={
          <>
            <Button variant="outline" onClick={exportCsv} className="gap-2"><Download className="h-4 w-4" /> Export CSV</Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"><Plus className="h-4 w-4" /> Add Member</Button>
              </DialogTrigger>
              <AddMemberDialog onAdd={(m) => { setList([m, ...list]); setOpen(false); toast.success(`${m.name} added`); }} />
            </Dialog>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name, phone, email…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="All plans" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All plans</SelectItem>
            {plans.map(p => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="All statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Expired">Expired</SelectItem>
            <SelectItem value="Paused">Paused</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant={highRiskOnly ? "default" : "outline"}
          onClick={() => setHighRiskOnly(v => !v)}
          className={cn("gap-2", highRiskOnly && "bg-destructive text-destructive-foreground hover:bg-destructive/90")}
        >
          <ShieldAlert className="h-4 w-4" /> {highRiskOnly ? "Showing High Risk" : "High Risk Only"}
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {filtered.length === 0 ? (
          <EmptyState title="No members found" description="Try changing your filters or add a new member." icon={<Users className="h-5 w-5" />} />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Member</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((m) => (
                  <TableRow key={m.id} className="cursor-pointer" onClick={() => navigate({ to: "/members/$id", params: { id: m.id } })}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9"><AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold">{m.name.split(" ").map(s=>s[0]).slice(0,2).join("")}</AvatarFallback></Avatar>
                        <div>
                          <div className="font-medium hover:text-primary">{m.name}</div>
                          <div className="text-xs text-muted-foreground">{m.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{m.phone}</TableCell>
                    <TableCell><Badge variant="outline">{m.plan}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{m.joinDate}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{m.expiryDate}</TableCell>
                    <TableCell><span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", statusColor(m.status))}>{m.status}</span></TableCell>
                    <TableCell><RiskBadge memberId={m.id} /></TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-1">
                        <Button asChild variant="ghost" size="icon"><Link to="/members/$id" params={{ id: m.id }}><Eye className="h-4 w-4" /></Link></Button>
                        <Button asChild variant="ghost" size="icon"><Link to="/members/$id" params={{ id: m.id }}><Edit className="h-4 w-4" /></Link></Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
}

function AddMemberDialog({ onAdd }: { onAdd: (m: Member) => void }) {
  const [f, setF] = useState({ name: "", phone: "", email: "", dob: "", address: "", emergencyContact: "", goal: "Fitness" as Member["goal"], plan: "Monthly", status: "Active" as Member["status"] });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name || !f.phone || !f.email || !f.dob) { toast.error("Please fill all required fields"); return; }
    const today = new Date(); const exp = new Date(); exp.setDate(today.getDate() + 30);
    onAdd({
      id: `M${Math.floor(Math.random()*900+100)}`,
      name: f.name, phone: f.phone, email: f.email, dob: f.dob, address: f.address, emergencyContact: f.emergencyContact, goal: f.goal,
      plan: f.plan, joinDate: today.toISOString().slice(0,10), expiryDate: exp.toISOString().slice(0,10), status: f.status,
    });
  };
  return (
    <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Add new member</DialogTitle>
        <DialogDescription>Capture member details and assign a plan.</DialogDescription>
      </DialogHeader>
      <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2 flex items-center gap-3 rounded-lg border border-dashed border-border p-3">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/15 text-primary"><Upload className="h-5 w-5" /></div>
          <div className="text-xs text-muted-foreground">Photo upload (coming soon)</div>
        </div>
        <div className="space-y-1.5"><Label>Full name *</Label><Input required value={f.name} onChange={(e)=>setF({...f, name:e.target.value})} /></div>
        <div className="space-y-1.5"><Label>Phone *</Label><Input required value={f.phone} onChange={(e)=>setF({...f, phone:e.target.value})} placeholder="+91" /></div>
        <div className="space-y-1.5"><Label>Email *</Label><Input required type="email" value={f.email} onChange={(e)=>setF({...f, email:e.target.value})} /></div>
        <div className="space-y-1.5"><Label>Date of birth *</Label><Input required type="date" value={f.dob} onChange={(e)=>setF({...f, dob:e.target.value})} /></div>
        <div className="space-y-1.5 sm:col-span-2"><Label>Address</Label><Textarea rows={2} value={f.address} onChange={(e)=>setF({...f, address:e.target.value})} /></div>
        <div className="space-y-1.5"><Label>Emergency contact</Label><Input value={f.emergencyContact} onChange={(e)=>setF({...f, emergencyContact:e.target.value})} /></div>
        <div className="space-y-1.5"><Label>Goal *</Label>
          <Select value={f.goal} onValueChange={(v)=>setF({...f, goal:v as Member["goal"]})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Weight Loss","Muscle Gain","Fitness","Sports"].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5"><Label>Plan *</Label>
          <Select value={f.plan} onValueChange={(v)=>setF({...f, plan:v})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{plans.map(p => <SelectItem key={p.id} value={p.name}>{p.name} — ₹{p.price}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5"><Label>Status *</Label>
          <Select value={f.status} onValueChange={(v)=>setF({...f, status:v as Member["status"]})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Active","Paused","Expired"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter className="sm:col-span-2 mt-2">
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">Add member</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
