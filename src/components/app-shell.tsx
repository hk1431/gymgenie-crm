import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Users, CreditCard, ClipboardCheck, MessageSquareHeart, BarChart3, Settings, LogOut, Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Logo, FrequencyFooter } from "./brand";
import { NotificationsBell } from "./notifications-bell";
import { setAuth, useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/members", label: "Members", icon: Users },
  { to: "/plans", label: "Plans & Fees", icon: CreditCard },
  { to: "/attendance", label: "Attendance", icon: ClipboardCheck },
  { to: "/enquiries", label: "Enquiries", icon: MessageSquareHeart },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const user = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    setAuth(null);
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between border-b border-border bg-sidebar px-4 py-3">
        <Logo size="sm" />
        <div className="flex items-center gap-2">
          <NotificationsBell />
          <button onClick={() => setOpen(!open)} className="rounded-md p-2 hover:bg-sidebar-accent" aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed lg:sticky inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform lg:top-0 lg:h-screen",
            open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <div className="hidden lg:block px-6 py-6">
            <Logo size="md" />
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4">
            {nav.map((item) => {
              const active = pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    active
                      ? "bg-primary/15 text-primary glow-orange"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <Icon className={cn("h-4.5 w-4.5", active && "text-primary")} />
                  <span>{item.label}</span>
                  {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-sidebar-border p-4">
            <div className="mb-3 flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                  {(user?.name || "G").slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{user?.name || "Guest"}</div>
                <div className="truncate text-xs text-muted-foreground">{user?.role || "—"}</div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
            <FrequencyFooter className="mt-3 text-center" />
          </div>
        </aside>

        {open && <div className="fixed inset-0 z-20 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />}

        <main className="flex-1 min-w-0 flex flex-col">
          <div className="hidden lg:flex sticky top-0 z-20 items-center justify-end gap-3 border-b border-border bg-background/70 px-6 py-3 backdrop-blur lg:px-8">
            <NotificationsBell />
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/20 text-primary font-semibold text-xs">
                {(user?.name || "G").slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
          <footer className="border-t border-border bg-card/40 px-4 py-4 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
              <FrequencyFooter />
              <span className="hidden text-xs text-muted-foreground sm:block">© {new Date().getFullYear()} GymGenie</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
