import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { gymProfile, staff, plans } from "@/lib/mock-data";
import { FrequencyFooter, Logo } from "@/components/brand";
import { Lock, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — GymGenie" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Manage your gym profile, staff and plans." />

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-5">
          <form onSubmit={(e)=>{e.preventDefault(); toast.success("Gym profile saved successfully");}} className="rounded-xl border border-border bg-card p-6">
            <div className="mb-6 flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-xl bg-primary text-primary-foreground text-xl font-bold shadow-lg">SP</div>
              <div>
                <div className="font-semibold">Gym logo</div>
                <div className="text-xs text-muted-foreground">PNG or SVG, square, at least 256px</div>
                <Button type="button" variant="outline" size="sm" className="mt-2 gap-1.5"><Upload className="h-3.5 w-3.5" /> Upload logo</Button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Gym name" defaultValue={gymProfile.name} />
              <Field label="Phone" defaultValue={gymProfile.phone} />
              <Field label="WhatsApp" defaultValue={gymProfile.whatsapp} />
              <Field label="Email" defaultValue={gymProfile.email} />
              <Field label="GSTIN" defaultValue={gymProfile.gst} />
              <div className="sm:col-span-2 space-y-1.5">
                <Label>Address</Label>
                <Textarea defaultValue={gymProfile.address} rows={2} />
              </div>
            </div>
            <div className="mt-6 flex justify-end"><Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">Save changes</Button></div>
          </form>
        </TabsContent>

        <TabsContent value="staff" className="mt-5">
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between p-5 pb-3">
              <h3 className="font-semibold">Team ({staff.length})</h3>
              <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"><Plus className="h-3.5 w-3.5" /> Add staff</Button>
            </div>
            <ul className="divide-y divide-border">
              {staff.map(s => (
                <li key={s.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9"><AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold">{s.name.split(" ").map(x=>x[0]).slice(0,2).join("")}</AvatarFallback></Avatar>
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{s.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{s.role}</Badge>
                    <Button variant="ghost" size="icon" onClick={()=>toast.success(`${s.name} removed`)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="plans" className="mt-5">
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between p-5 pb-3">
              <h3 className="font-semibold">Plans</h3>
              <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"><Plus className="h-3.5 w-3.5" /> Add plan</Button>
            </div>
            <ul className="divide-y divide-border">
              {plans.map(p => (
                <li key={p.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.durationDays} days</div>
                  </div>
                  <div className="flex items-center gap-3"><div className="font-semibold text-primary">₹{p.price.toLocaleString("en-IN")}</div></div>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-5">
          <div className="space-y-3 rounded-xl border border-border bg-card p-5">
            {[
              ["WhatsApp renewal reminders", true],
              ["Email payment receipts", true],
              ["SMS expiry alerts (3 days before)", false],
              ["Daily summary email to owner", true],
            ].map(([label, defChecked]) => (
              <div key={label as string} className="flex items-center justify-between rounded-lg border border-border bg-background/40 p-3">
                <div className="text-sm">{label}</div>
                <Switch defaultChecked={defChecked as boolean} />
              </div>
            ))}
            <p className="text-xs text-muted-foreground">Integrations coming soon. Toggle preferences are saved locally for now.</p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex items-center justify-between rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 via-card to-card p-5">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <div className="hidden text-sm text-muted-foreground sm:block">• White-labeled for {gymProfile.name}</div>
        </div>
        <div className="flex items-center gap-3">
          <FrequencyFooter />
          <Badge variant="outline" className="gap-1 border-primary/40 text-primary"><Lock className="h-3 w-3" /> Locked</Badge>
        </div>
      </div>
    </>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue?: string }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input defaultValue={defaultValue} />
    </div>
  );
}
