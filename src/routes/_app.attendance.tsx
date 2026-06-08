import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, StatCard } from "@/components/ui-bits";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { members, todayAttendance, attendancePct, attendanceTrend } from "@/lib/mock-data";
import { ClipboardCheck, QrCode, Sparkles, UserCheck, UserX } from "lucide-react";
import { toast } from "sonner";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/_app/attendance")({
  head: () => ({ meta: [{ title: "Attendance — GymGenie" }] }),
  component: AttendancePage,
});

function AttendancePage() {
  const [date, setDate] = useState(new Date("2026-06-08").toISOString().slice(0,10));
  const [present, setPresent] = useState<Record<string, boolean>>(todayAttendance);

  const toggle = (id: string, val: boolean) => {
    setPresent({ ...present, [id]: val });
    toast.success(`${members.find(m=>m.id===id)?.name} marked ${val ? "present" : "absent"}`);
  };

  const presentCount = Object.values(present).filter(Boolean).length;
  const absentCount = members.length - presentCount;

  return (
    <>
      <PageHeader
        title="Attendance"
        description="Mark daily check-ins and track attendance trends."
        actions={<Input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="w-44" />}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Present today" value={presentCount.toString()} hint={`${Math.round(presentCount/members.length*100)}% of roster`} icon={<UserCheck className="h-5 w-5" />} accent />
        <StatCard label="Absent" value={absentCount.toString()} icon={<UserX className="h-5 w-5" />} />
        <StatCard label="Weekly avg" value="60" hint="check-ins / day" icon={<ClipboardCheck className="h-5 w-5" />} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between p-5 pb-3">
            <h3 className="font-semibold">Member check-ins</h3>
            <Badge variant="outline" className="font-normal">{date}</Badge>
          </div>
          <ul className="divide-y divide-border">
            {members.map(m => (
              <li key={m.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar className="h-9 w-9"><AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold">{m.name.split(" ").map(s=>s[0]).slice(0,2).join("")}</AvatarFallback></Avatar>
                  <div className="min-w-0">
                    <div className="truncate font-medium">{m.name}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Attendance {attendancePct[m.id] ?? 0}%</span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary"><QrCode className="h-2.5 w-2.5" /> QR <Sparkles className="h-2.5 w-2.5" /></span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium ${present[m.id] ? "text-success" : "text-muted-foreground"}`}>{present[m.id] ? "Present" : "Absent"}</span>
                  <Switch checked={!!present[m.id]} onCheckedChange={(v)=>toggle(m.id, v)} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-semibold">Daily count (this week)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="day" stroke="#ffffff60" fontSize={12} />
                <YAxis stroke="#ffffff60" fontSize={12} />
                <Tooltip contentStyle={{ background: "#0A0A0A", border: "1px solid #ffffff15", borderRadius: 8 }} />
                <Bar dataKey="count" fill="#FF6B00" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
