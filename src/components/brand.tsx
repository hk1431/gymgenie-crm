import { Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "text-lg", md: "text-xl", lg: "text-3xl" };
  const iconSizes = { sm: "h-5 w-5", md: "h-6 w-6", lg: "h-9 w-9" };
  return (
    <div className={cn("flex items-center gap-2 font-bold tracking-tight", sizes[size], className)}>
      <div className="grid place-items-center rounded-lg bg-primary/15 p-1.5 text-primary glow-orange">
        <Dumbbell className={iconSizes[size]} strokeWidth={2.5} />
      </div>
      <span>
        Gym<span className="text-gradient-orange">Genie</span>
      </span>
    </div>
  );
}

export function FrequencyFooter({ className }: { className?: string }) {
  return (
    <div className={cn("text-xs text-muted-foreground", className)}>
      Powered by{" "}
      <a
        href="https://frequencybuilders.com"
        target="_blank"
        rel="noreferrer"
        className="font-medium text-primary hover:underline"
      >
        Frequency Builders
      </a>
    </div>
  );
}
