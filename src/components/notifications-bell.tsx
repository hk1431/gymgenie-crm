import { useState } from "react";
import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Alert = { id: string; title: string; description: string; time: string; unread: boolean };

const seed: Alert[] = [
  { id: "n1", title: "3 members expiring this week", description: "Renewal reminders ready to send", time: "Just now", unread: true },
  { id: "n2", title: "2 payments pending", description: "Vikram Singh, Aditya Nair", time: "2 hr ago", unread: true },
  { id: "n3", title: "New enquiry from walk-in", description: "Sandeep Kumar — Weight Loss", time: "Today", unread: true },
  { id: "n4", title: "48 check-ins today", description: "Attendance is 12% above average", time: "Today", unread: false },
];

export function NotificationsBell() {
  const [items, setItems] = useState<Alert[]>(seed);
  const unread = items.filter((i) => i.unread).length;

  const markAll = () => setItems(items.map((i) => ({ ...i, unread: false })));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="relative grid h-9 w-9 place-items-center rounded-lg border border-border bg-card text-foreground transition hover:border-primary/40 hover:text-primary"
          aria-label="Notifications"
        >
          <Bell className="h-4.5 w-4.5" />
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-md shadow-primary/40">
              {unread}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="text-sm font-semibold">Notifications</div>
          {unread > 0 && (
            <button onClick={markAll} className="text-xs text-primary hover:underline">Mark all read</button>
          )}
        </div>
        <ul className="max-h-80 divide-y divide-border overflow-y-auto">
          {items.map((a) => (
            <li key={a.id} className={cn("flex gap-3 px-4 py-3 transition hover:bg-muted/40", a.unread && "bg-primary/5")}>
              <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", a.unread ? "bg-primary" : "bg-muted-foreground/30")} />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{a.title}</div>
                <div className="truncate text-xs text-muted-foreground">{a.description}</div>
                <div className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground/70">{a.time}</div>
              </div>
            </li>
          ))}
        </ul>
        <div className="border-t border-border px-4 py-2 text-center">
          <button className="text-xs text-muted-foreground hover:text-foreground">View all</button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
