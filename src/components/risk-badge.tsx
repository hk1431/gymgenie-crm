import { memberRisk, type RiskLevel } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const tone: Record<RiskLevel, string> = {
  high: "bg-destructive/15 text-destructive border-destructive/40",
  medium: "bg-warning/15 text-warning border-warning/40",
  low: "bg-success/15 text-success border-success/40",
};
const dot: Record<RiskLevel, string> = {
  high: "bg-destructive",
  medium: "bg-warning",
  low: "bg-success",
};
const label: Record<RiskLevel, string> = { high: "High", medium: "Medium", low: "Low" };

export function RiskBadge({ memberId, showReason = false }: { memberId: string; showReason?: boolean }) {
  const { level, reasons } = memberRisk(memberId);
  return (
    <span title={reasons.join(" · ")} className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium", tone[level])}>
      <span className={cn("h-1.5 w-1.5 rounded-full", dot[level])} />
      {label[level]}
      {showReason && <span className="opacity-70">· {reasons[0]}</span>}
    </span>
  );
}

export { memberRisk };
