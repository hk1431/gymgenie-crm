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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { members as seedMembers, payments as seedPayments, plans, measurements as seedMeasurements, dietPlan7Day, workoutPlan5Day, transformationScore, type Member, type Measurement } from "@/lib/mock-data";
import { RiskBadge } from "@/components/risk-badge";
import { ArrowLeft, CalendarDays, Download, Edit, ImagePlus, Mail, MapPin, Phone, Plus, Printer, Receipt, Ruler, Sparkles, Target, UserCheck } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
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
              <RiskBadge memberId={member.id} showReason />
              <Badge variant="outline" className={cn("border", transformationScore(member.id).tone)}>
                <Sparkles className="mr-1 h-3 w-3" />
                {transformationScore(member.id).label}
              </Badge>
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

      <Tabs defaultValue="details">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="measurements">Measurements</TabsTrigger>
          <TabsTrigger value="ai-plan">AI Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
              <Detail label="Status" value={member.status} />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="mt-4">
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
        </TabsContent>

        <TabsContent value="attendance" className="mt-4">
          <Card
            title="Attendance this month"
            right={
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">{attendancePct}%</span>
                <span className="text-xs text-muted-foreground">{presentCount}/{today.getDate()} days</span>
              </div>
            }
          >
            <div className="mx-auto max-w-md grid grid-cols-7 gap-1.5 text-center text-[10px] text-muted-foreground">
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
            <div className="mt-3 flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-primary/80" /> Present</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-muted/60 border border-border" /> Absent</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm border border-border" /> Upcoming</span>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="measurements" className="mt-4">
          <MeasurementsTab memberId={member.id} />
        </TabsContent>

        <TabsContent value="ai-plan" className="mt-4">
          <AIPlanTab member={member} />
        </TabsContent>
      </Tabs>
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

function MeasurementsTab({ memberId }: { memberId: string }) {
  const initial = useMemo(() => seedMeasurements.filter(m => m.memberId === memberId).sort((a,b) => a.date.localeCompare(b.date)), [memberId]);
  const [list, setList] = useState<Measurement[]>(initial);
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ date: new Date().toISOString().slice(0,10), weightKg: "", heightCm: "", chest: "", waist: "", hips: "", biceps: "", thighs: "" });

  const latest = list[list.length - 1];
  const bmi = latest && latest.heightCm > 0 ? (latest.weightKg / Math.pow(latest.heightCm / 100, 2)).toFixed(1) : "—";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.weightKg || !f.heightCm) { toast.error("Weight and height required"); return; }
    const m: Measurement = {
      id: `MS${Math.floor(Math.random()*900+100)}`,
      memberId, date: f.date,
      weightKg: Number(f.weightKg), heightCm: Number(f.heightCm),
      chest: Number(f.chest || 0), waist: Number(f.waist || 0), hips: Number(f.hips || 0),
      biceps: Number(f.biceps || 0), thighs: Number(f.thighs || 0),
    };
    setList([...list, m].sort((a,b) => a.date.localeCompare(b.date)));
    toast.success("Measurement saved");
    setOpen(false);
    setF({ date: new Date().toISOString().slice(0,10), weightKg: "", heightCm: "", chest: "", waist: "", hips: "", biceps: "", thighs: "" });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Weight" value={latest ? `${latest.weightKg} kg` : "—"} />
        <Stat label="Height" value={latest ? `${latest.heightCm} cm` : "—"} />
        <Stat label="BMI" value={bmi} accent />
        <Stat label="Waist" value={latest ? `${latest.waist} cm` : "—"} />
      </div>

      <Card title="Progress chart" right={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm" className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"><Plus className="h-3.5 w-3.5" /> Add entry</Button></DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>New measurement</DialogTitle></DialogHeader>
            <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2 space-y-1.5"><Label>Date</Label><Input type="date" value={f.date} onChange={(e)=>setF({...f, date:e.target.value})} /></div>
              <div className="space-y-1.5"><Label>Weight (kg)</Label><Input type="number" step="0.1" value={f.weightKg} onChange={(e)=>setF({...f, weightKg:e.target.value})} /></div>
              <div className="space-y-1.5"><Label>Height (cm)</Label><Input type="number" value={f.heightCm} onChange={(e)=>setF({...f, heightCm:e.target.value})} /></div>
              <div className="space-y-1.5"><Label>Chest (cm)</Label><Input type="number" value={f.chest} onChange={(e)=>setF({...f, chest:e.target.value})} /></div>
              <div className="space-y-1.5"><Label>Waist (cm)</Label><Input type="number" value={f.waist} onChange={(e)=>setF({...f, waist:e.target.value})} /></div>
              <div className="space-y-1.5"><Label>Hips (cm)</Label><Input type="number" value={f.hips} onChange={(e)=>setF({...f, hips:e.target.value})} /></div>
              <div className="space-y-1.5"><Label>Biceps (cm)</Label><Input type="number" value={f.biceps} onChange={(e)=>setF({...f, biceps:e.target.value})} /></div>
              <div className="space-y-1.5"><Label>Thighs (cm)</Label><Input type="number" value={f.thighs} onChange={(e)=>setF({...f, thighs:e.target.value})} /></div>
              <DialogFooter className="sm:col-span-2"><Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">Save</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      }>
        {list.length < 2 ? (
          <div className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
            <Ruler className="mx-auto mb-2 h-6 w-6 text-muted-foreground/60" />
            Add at least 2 measurements to see progress.
          </div>
        ) : (
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={list} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="date" stroke="#ffffff60" fontSize={11} />
                <YAxis stroke="#ffffff60" fontSize={12} />
                <Tooltip contentStyle={{ background: "#0A0A0A", border: "1px solid #ffffff15", borderRadius: 8 }} />
                <Line type="monotone" dataKey="weightKg" name="Weight (kg)" stroke="#FF6B00" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="waist" name="Waist (cm)" stroke="#FFB347" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      <Card title="History" right={<Badge variant="outline">{list.length} entries</Badge>}>
        {list.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-8 text-center text-sm text-muted-foreground">No measurements logged yet.</div>
        ) : (
          <div className="-mx-1 overflow-x-auto">
            <Table>
              <TableHeader><TableRow className="hover:bg-transparent">
                <TableHead>Date</TableHead><TableHead>Weight</TableHead><TableHead>Chest</TableHead><TableHead>Waist</TableHead><TableHead>Hips</TableHead><TableHead>Biceps</TableHead><TableHead>Thighs</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {[...list].reverse().map(m => (
                  <TableRow key={m.id}>
                    <TableCell className="text-sm text-muted-foreground">{m.date}</TableCell>
                    <TableCell className="font-semibold text-primary">{m.weightKg}kg</TableCell>
                    <TableCell>{m.chest}</TableCell>
                    <TableCell>{m.waist}</TableCell>
                    <TableCell>{m.hips}</TableCell>
                    <TableCell>{m.biceps}</TableCell>
                    <TableCell>{m.thighs}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <Card title="Before / After photos">
        <div className="grid grid-cols-2 gap-3">
          {(["Before", "After"] as const).map(slot => (
            <div key={slot} className="aspect-square rounded-lg border-2 border-dashed border-border bg-background/40 grid place-items-center text-center">
              <div>
                <ImagePlus className="mx-auto h-8 w-8 text-muted-foreground/60" />
                <div className="mt-2 text-xs font-medium">{slot}</div>
                <button type="button" onClick={() => toast("Photo upload coming soon")} className="mt-1 text-xs text-primary hover:underline">Upload</button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function AIPlanTab({ member }: { member: Member }) {
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [weight, setWeight] = useState("75");
  const [generated, setGenerated] = useState(false);

  if (!generated) {
    return (
      <Card title="Generate AI Plan" right={<Badge variant="outline" className="border-primary/40 text-primary"><Sparkles className="mr-1 h-3 w-3" /> GymGenie AI</Badge>}>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1.5"><Label>Goal</Label><Input value={member.goal} readOnly /></div>
          <div className="space-y-1.5"><Label>Current weight (kg)</Label><Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Fitness level</Label>
            <Select value={level} onValueChange={(v) => setLevel(v as typeof level)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["Beginner","Intermediate","Advanced"].map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={() => { setGenerated(true); toast.success("Personalised plan generated"); }} className="mt-4 gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Sparkles className="h-4 w-4" /> Generate Plan
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">Tailored to {member.goal} · {level} level · {weight}kg</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-primary" />
          <div>
            <div className="font-semibold">Powered by GymGenie AI</div>
            <div className="text-xs text-muted-foreground">{member.goal} · {level} · {weight}kg</div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast("Download coming soon")}><Download className="h-3.5 w-3.5" /> Download</Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.print()}><Printer className="h-3.5 w-3.5" /> Print</Button>
          <Button variant="ghost" size="sm" onClick={() => setGenerated(false)}>Regenerate</Button>
        </div>
      </div>

      <Card title="7-day Indian diet plan">
        <div className="grid gap-3 sm:grid-cols-2">
          {dietPlan7Day.map(d => {
            const totalKcal = d.meals.reduce((s, m) => s + m.kcal, 0);
            return (
              <div key={d.day} className="rounded-lg border border-border bg-background/40 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="font-semibold text-primary">{d.day}</div>
                  <Badge variant="outline" className="text-[10px]">{totalKcal} kcal</Badge>
                </div>
                <ul className="space-y-1.5">
                  {d.meals.map((meal, i) => (
                    <li key={i} className="flex items-start justify-between gap-2 text-xs">
                      <div>
                        <div className="font-medium text-muted-foreground">{meal.time}</div>
                        <div>{meal.item}</div>
                      </div>
                      <div className="shrink-0 text-muted-foreground">{meal.kcal}</div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Card>

      <Card title="5-day workout plan">
        <div className="space-y-3">
          {workoutPlan5Day.map(d => (
            <div key={d.day} className="rounded-lg border border-border bg-background/40 p-4">
              <div className="mb-3 font-semibold text-primary">{d.day}</div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow className="hover:bg-transparent">
                    <TableHead>Exercise</TableHead><TableHead>Sets</TableHead><TableHead>Reps</TableHead><TableHead>Rest</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {d.exercises.map((ex, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{ex.name}</TableCell>
                        <TableCell>{ex.sets}</TableCell>
                        <TableCell>{ex.reps}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{ex.rest}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-4", accent && "border-primary/40 bg-primary/5")}>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={cn("mt-1 text-xl font-bold", accent && "text-primary")}>{value}</div>
    </div>
  );
}
