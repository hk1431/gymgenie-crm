import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatCard } from "@/components/ui-bits";
import { revenueByMonth, memberGrowth, attendance30d, planDistribution } from "@/lib/mock-data";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, PieChart, Pie, Cell, Legend, Area, AreaChart,
} from "recharts";
import { Activity, TrendingUp, UserMinus, UserPlus } from "lucide-react";

export const Route = createFileRoute("/_app/reports")({
  head: () => ({ meta: [{ title: "Reports — GymGenie" }] }),
  component: ReportsPage,
});

const ORANGE = "#FF6B00";
const PIE_COLORS = ["#FF6B00", "#FF8A33", "#FFB347", "#FFD9B3"];

const formatINR = (v: number) => `₹${v.toLocaleString("en-IN")}`;
const tip = {
  background: "#0A0A0A",
  border: "1px solid rgba(255,107,0,0.35)",
  borderRadius: 8,
  color: "#fff",
};

function ReportsPage() {
  return (
    <>
      <PageHeader title="Reports" description="Performance trends across revenue, members, attendance and plans." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Retention Rate" value="87%" hint="last 90 days" icon={<Activity className="h-5 w-5" />} accent />
        <StatCard label="Avg revenue / member" value="₹1,465" hint="this month" icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard label="New joins" value="16" hint="this month" icon={<UserPlus className="h-5 w-5" />} />
        <StatCard label="Churned" value="4" hint="this month" icon={<UserMinus className="h-5 w-5" />} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Revenue — last 6 months">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueByMonth} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ORANGE} stopOpacity={1} />
                  <stop offset="100%" stopColor={ORANGE} stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="month" stroke="#ffffff60" fontSize={12} />
              <YAxis stroke="#ffffff60" fontSize={12} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
              <Tooltip cursor={{ fill: "#FF6B0010" }} contentStyle={tip} formatter={(v: number) => [formatINR(v), "Revenue"]} />
              <Bar dataKey="revenue" fill="url(#revFill)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="New joins per month">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={memberGrowth} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="month" stroke="#ffffff60" fontSize={12} />
              <YAxis stroke="#ffffff60" fontSize={12} />
              <Tooltip contentStyle={tip} formatter={(v: number) => [v, "New joins"]} />
              <Line type="monotone" dataKey="joins" stroke={ORANGE} strokeWidth={3} dot={{ fill: ORANGE, r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Attendance % — last 30 days">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={attendance30d} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="attFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ORANGE} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={ORANGE} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="date" stroke="#ffffff60" fontSize={11} interval={3} />
              <YAxis stroke="#ffffff60" fontSize={12} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={tip} formatter={(v: number) => [`${v}%`, "Attendance"]} />
              <Area type="monotone" dataKey="pct" stroke={ORANGE} strokeWidth={2} fill="url(#attFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Plan-wise distribution">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={planDistribution} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={3} stroke="#0A0A0A" strokeWidth={2}>
                {planDistribution.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tip} formatter={(v: number, n) => [`${v} members`, n]} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#ffffff90" }} />
            </PieChart>
          </ResponsiveContainer>
        </Panel>
      </div>
    </>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 font-semibold">{title}</h3>
      <div className="h-72">{children}</div>
    </div>
  );
}
