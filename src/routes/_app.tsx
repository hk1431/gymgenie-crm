import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { OnboardingWizard } from "@/components/onboarding-wizard";
import { getAuth } from "@/lib/auth";

export const Route = createFileRoute("/_app")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getAuth()) throw redirect({ to: "/" });
  },
  component: () => (
    <AppShell>
      <Outlet />
      <OnboardingWizard />
    </AppShell>
  ),
});
