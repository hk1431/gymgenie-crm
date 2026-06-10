import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader, StatCard, StatCardSkeleton } from "@/components/ui-bits";
import { Users, UserCheck, Wallet, AlarmClock, ArrowRight, UserPlus, ClipboardCheck, CreditCard, TrendingUp, ShieldAlert } from "lucide-react";
import { members, payments, recentActivity, revenueByMonth, attendanceTrend, memberRisk } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from "recharts";
import { AajKaKaam } from "@/components/aaj-ka-kaam";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — GymGenie" }] }),
  component: Dashboard,
});

const today = new Date("2026-06-08");
const inDays = (d: string, n: number) => {
  const ed = new Date(d).getTime();
  return ed >= today.getTime() && ed <= today.getTime() + n * 86400000;
};

function Dashboard() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  const total = members.length;
  const active = members.filter((m) => m.status === "Active").length;
  const revenue = payments
    .filter((p) => p.paidAt.startsWith("2026-06") || p.paidAt.startsWith("2026-05"))
    .reduce((s, p) => s + p.amount, 0);
  const expiring = members.filter((m) => inDays(m.expiryDate, 7) && m.status === "Active").length;
  const atRisk = members.filter(m => memberRisk(m.id).level === "high").length;

  return (
    <>
      <PageHeader
        title="Welcome back 👋"
        description="Here's what's happening at your gym today."
        actions={
          <>
            <Link to="/members"><Button variant="outline" className="gap-2"><UserPlus className="h-4 w-4" /> Add Member</Button></Link>
            <Link to="/plans"><Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"><CreditCard className="h-4 w-4" /> Record Payment</Button></Link>
          </>
        }
      />

      <div className="mb-6">
        <AajKaKaam />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {loading ? (
          <>
            <StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard label="Total Members" value={total.toString()} hint="+12 this month" icon={<Users className="h-5 w-5" />} />
            <StatCard label="Active Members" value={active.toString()} hint={`${Math.round((active/total)*100)}% activation`} icon={<UserCheck className="h-5 w-5" />} accent />
            <StatCard label="Revenue (this month)" value={`₹${(revenue/1000).toFixed(1)}K`} hint="vs ₹1.92L last month" icon={<Wallet className="h-5 w-5" />} />
            <StatCard label="Expiring This Week" value={expiring.toString()} hint="Send reminders" icon={<AlarmClock className="h-5 w-5" />} />
            <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-destructive/80">At Risk Members</div>
                  <div className="mt-2 text-2xl font-bold text-destructive sm:text-3xl">{atRisk}</div>
                  <div className="mt-1 text-xs text-muted-foreground">Need attention now</div>
                </div>
                <div className="rounded-lg bg-destructive/15 p-2.5 text-destructive"><ShieldAlert className="h-5 w-5" /></div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Revenue (last 6 months)</h3>
              <p className="text-xs text-muted-foreground">Monthly collections</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-success"><TrendingUp className="h-3.5 w-3.5" /> +18.4%</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueByMonth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF6B00" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#FF6B00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#ffffff60" fontSize={12} />
                <YAxis stroke="#ffffff60" fontSize={12} tickFormatter={(v) => `₹${v/1000}K`} />
                <Tooltip contentStyle={{ background: "#0A0A0A", border: "1px solid #ffffff15", borderRadius: 8 }} formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`} />
                <Area type="monotone" dataKey="revenue" stroke="#FF6B00" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-semibold">This week's check-ins</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="day" stroke="#ffffff60" fontSize={12} />
                <YAxis stroke="#ffffff60" fontSize={12} />
                <Tooltip contentStyle={{ background: "#0A0A0A", border: "1px solid #ffffff15", borderRadius: 8 }} />
                <Bar dataKey="count" fill="#FF6B00" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Recent activity</h3>
            <Link to="/members" className="flex items-center gap-1 text-xs text-primary hover:underline">View all <ArrowRight className="h-3 w-3" /></Link>
          </div>
          <ul className="divide-y divide-border">
            {recentActivity.map((a) => (
              <li key={a.id} className="flex items-start gap-3 py-3">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm">{a.text}</p>
                  <p className="text-xs text-muted-foreground">{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-semibold">Quick actions</h3>
          <div className="space-y-2">
            <Link to="/members"><Button variant="outline" className="w-full justify-start gap-2"><UserPlus className="h-4 w-4 text-primary" /> Add a new member</Button></Link>
            <Link to="/plans"><Button variant="outline" className="w-full justify-start gap-2"><CreditCard className="h-4 w-4 text-primary" /> Record a payment</Button></Link>
            <Link to="/attendance"><Button variant="outline" className="w-full justify-start gap-2"><ClipboardCheck className="h-4 w-4 text-primary" /> Mark attendance</Button></Link>
            <Link to="/enquiries"><Button variant="outline" className="w-full justify-start gap-2"><Users className="h-4 w-4 text-primary" /> Manage enquiries</Button></Link>
          </div>
        </div>
      </div>
    </>
  );
}
