import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { members as seedMembers, payments as seedPayments, plans, type Member } from "@/lib/mock-data";
import { ArrowLeft, CalendarDays, Edit, Mail, MapPin, Phone, Receipt, Target, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/members/$id")({
  head: () => ({ meta: [{ title: "Member profile — GymGenie" }] }),
  component: MemberProfilePage,
});

function statusColor(s: Member["status"]) {
  if (s === "Active") return "bg-success/15 text-success border-success/30";
  if (s === "Expired") return "bg-destructive/15 text-destructive border-destructive/30";
  return "bg-warning/15 text-warning border-warning/30";
}

function MemberProfilePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const initial = seedMembers.find((m) => m.id === id);
  const [member, setMember] = useState<Member | undefined>(initial);
  const [editing, setEditing] = useState(false);

  const memberPayments = useMemo(
    () => seedPayments.filter((p) => p.memberId === id),
    [id],
  );

  // Deterministic mock heatmap for current month
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  const seedNum = id.split("").reduce((a: number, c: string) => a + c.charCodeAt(0), 0);
  const presentDays = Array.from({ length: daysInMonth }, (_, i) => {
    const v = Math.sin(seedNum + i * 1.7) * 1000;
    return Math.abs(v) % 1 > 0.35;
  });
  const presentCount = presentDays.slice(0, today.getDate()).filter(Boolean).length;
  const attendancePct = Math.round((presentCount / today.getDate()) * 100);

  if (!member) {
    return (
      <>
        <PageHeader title="Member not found" description="This member doesn't exist or has been removed." />
        <Button asChild variant="outline"><Link to="/members"><ArrowLeft className="mr-2 h-4 w-4" /> Back to members</Link></Button>
      </>
    );
  }

  return (
    <>
      <div className="mb-4">
        <button onClick={() => navigate({ to: "/members" })} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to members
        </button>
      </div>

      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 ring-2 ring-primary/40">
            <AvatarFallback className="bg-primary/15 text-primary text-xl font-bold">
              {member.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{member.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">#{member.id}</span>
              <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", statusColor(member.status))}>{member.status}</span>
              <Badge variant="outline" className="border-primary/40 text-primary">{member.plan}</Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog open={editing} onOpenChange={setEditing}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"><Edit className="h-4 w-4" /> Edit profile</Button>
            </DialogTrigger>
            <EditMemberDialog member={member} onSave={(m) => { setMember(m); setEditing(false); toast.success("Profile updated"); }} />
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <Card title="Details">
            <Detail icon={<Phone className="h-4 w-4" />} label="Phone" value={member.phone} />
            <Detail icon={<Mail className="h-4 w-4" />} label="Email" value={member.email || "—"} />
            <Detail icon={<CalendarDays className="h-4 w-4" />} label="Date of birth" value={member.dob || "—"} />
            <Detail icon={<MapPin className="h-4 w-4" />} label="Address" value={member.address || "—"} />
            <Detail icon={<UserCheck className="h-4 w-4" />} label="Emergency" value={member.emergencyContact || "—"} />
            <Detail icon={<Target className="h-4 w-4" />} label="Goal" value={member.goal} />
          </Card>

          <Card title="Membership">
            <Detail label="Plan" value={member.plan} />
            <Detail label="Join date" value={member.joinDate} />
            <Detail label="Expiry" value={member.expiryDate} />
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card
            title="Attendance this month"
            right={
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">{attendancePct}%</span>
                <span className="text-xs text-muted-foreground">{presentCount}/{today.getDate()} days</span>
              </div>
            }
          >
            <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] text-muted-foreground">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i} className="pb-1">{d}</div>)}
              {Array.from({ length: firstWeekday }).map((_, i) => <div key={`pad-${i}`} />)}
              {presentDays.map((present, i) => {
                const dayNum = i + 1;
                const isPast = dayNum <= today.getDate();
                const isToday = dayNum === today.getDate();
                return (
                  <div
                    key={dayNum}
                    title={`${dayNum} — ${isPast ? (present ? "Present" : "Absent") : "Upcoming"}`}
                    className={cn(
                      "aspect-square rounded-md flex items-center justify-center text-[10px] font-medium border",
                      !isPast && "border-border bg-background/40 text-muted-foreground/40",
                      isPast && present && "border-primary/40 bg-primary/80 text-primary-foreground",
                      isPast && !present && "border-border bg-muted/40 text-muted-foreground/60",
                      isToday && "ring-2 ring-primary",
                    )}
                  >
                    {dayNum}
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-primary/80" /> Present</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-muted/60 border border-border" /> Absent</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm border border-border" /> Upcoming</span>
            </div>
          </Card>

          <Card title="Payment history" right={<Badge variant="outline">{memberPayments.length} records</Badge>}>
            {memberPayments.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border py-8 text-center text-sm text-muted-foreground">No payments recorded yet.</div>
            ) : (
              <div className="-mx-1 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Receipt</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Mode</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {memberPayments.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-mono text-xs">{p.receiptNo}</TableCell>
                        <TableCell className="font-semibold text-primary">₹{p.amount.toLocaleString("en-IN")}</TableCell>
                        <TableCell><Badge variant="outline">{p.mode}</Badge></TableCell>
                        <TableCell className="text-sm text-muted-foreground">{p.paidAt}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            <div className="mt-3 flex items-center justify-end text-sm">
              <Receipt className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Total paid:&nbsp;</span>
              <span className="font-semibold text-primary">₹{memberPayments.reduce((s, p) => s + p.amount, 0).toLocaleString("en-IN")}</span>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

function Card({ title, right, children }: { title: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-semibold">{title}</h3>
        {right}
      </div>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function Detail({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-right font-medium">{value}</div>
    </div>
  );
}

function EditMemberDialog({ member, onSave }: { member: Member; onSave: (m: Member) => void }) {
  const [f, setF] = useState<Member>(member);
  return (
    <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit member</DialogTitle>
      </DialogHeader>
      <form onSubmit={(e) => { e.preventDefault(); onSave(f); }} className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5"><Label>Full name</Label><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
        <div className="space-y-1.5"><Label>Phone</Label><Input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></div>
        <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
        <div className="space-y-1.5"><Label>Date of birth</Label><Input type="date" value={f.dob} onChange={(e) => setF({ ...f, dob: e.target.value })} /></div>
        <div className="space-y-1.5 sm:col-span-2"><Label>Address</Label><Textarea rows={2} value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} /></div>
        <div className="space-y-1.5"><Label>Emergency contact</Label><Input value={f.emergencyContact} onChange={(e) => setF({ ...f, emergencyContact: e.target.value })} /></div>
        <div className="space-y-1.5"><Label>Goal</Label>
          <Select value={f.goal} onValueChange={(v) => setF({ ...f, goal: v as Member["goal"] })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{["Weight Loss", "Muscle Gain", "Fitness", "Sports"].map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5"><Label>Plan</Label>
          <Select value={f.plan} onValueChange={(v) => setF({ ...f, plan: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{plans.map((p) => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5"><Label>Status</Label>
          <Select value={f.status} onValueChange={(v) => setF({ ...f, status: v as Member["status"] })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{["Active", "Paused", "Expired"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5"><Label>Expiry date</Label><Input type="date" value={f.expiryDate} onChange={(e) => setF({ ...f, expiryDate: e.target.value })} /></div>
        <DialogFooter className="sm:col-span-2 mt-2">
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">Save changes</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
