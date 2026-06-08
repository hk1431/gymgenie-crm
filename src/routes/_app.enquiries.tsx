import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, EmptyState } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { enquiries as seedEnq, type Enquiry, type EnquiryStage } from "@/lib/mock-data";
import { ArrowRight, CalendarClock, MessageSquareHeart, Phone, Plus, UserPlus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/enquiries")({
  head: () => ({ meta: [{ title: "Enquiries — GymGenie" }] }),
  component: EnquiriesPage,
});

const stages: EnquiryStage[] = ["New", "Contacted", "Demo Done", "Converted", "Lost"];
const stageColor: Record<EnquiryStage, string> = {
  "New": "border-chart-4/40 text-chart-4",
  "Contacted": "border-warning/40 text-warning",
  "Demo Done": "border-primary/40 text-primary",
  "Converted": "border-success/40 text-success",
  "Lost": "border-destructive/40 text-destructive",
};

function EnquiriesPage() {
  const [list, setList] = useState<Enquiry[]>(seedEnq);
  const [open, setOpen] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);

  const move = (id: string, to: EnquiryStage) => {
    setList(list.map(e => e.id === id ? { ...e, status: to } : e));
    const e = list.find(x => x.id === id);
    if (e && e.status !== to) toast.success(`${e.name} → ${to}`);
  };

  const convert = (id: string) => {
    move(id, "Converted");
    toast.success("Converted to member");
  };

  return (
    <>
      <PageHeader
        title="Enquiries"
        description="Track leads across the conversion pipeline."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"><Plus className="h-4 w-4" /> New enquiry</Button></DialogTrigger>
            <AddEnquiry onAdd={(e) => { setList([e, ...list]); setOpen(false); toast.success(`Enquiry from ${e.name} added`); }} />
          </Dialog>
        }
      />

      {list.length === 0 ? (
        <EmptyState
          icon={<MessageSquareHeart className="h-5 w-5" />}
          title="No leads yet"
          description="New enquiries from walk-ins, Instagram, referrals and Google will show up here. Add your first lead to start tracking the pipeline."
        />
      ) : (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {stages.map(stage => {
          const items = list.filter(e => e.status === stage);
          return (
            <div
              key={stage}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => { if (dragId) move(dragId, stage); setDragId(null); }}
              className="flex flex-col rounded-xl border border-border bg-card/60 p-3"
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <h3 className={`text-sm font-semibold ${stageColor[stage].split(" ")[1]}`}>{stage}</h3>
                <span className="rounded-full bg-background/60 px-2 py-0.5 text-xs text-muted-foreground">{items.length}</span>
              </div>
              <div className="flex-1 space-y-2 min-h-[120px]">
                {items.map(e => (
                  <article
                    key={e.id}
                    draggable
                    onDragStart={() => setDragId(e.id)}
                    className="cursor-grab rounded-lg border border-border bg-background/60 p-3 transition hover:border-primary/40 active:cursor-grabbing"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{e.name}</div>
                        <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><Phone className="h-3 w-3" />{e.phone}</div>
                      </div>
                      <span className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${stageColor[e.status]}`}>{e.source}</span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{e.notes}</p>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-[10px] text-warning"><CalendarClock className="h-2.5 w-2.5" />{e.followUpDate}</span>
                      {e.status !== "Converted" && e.status !== "Lost" && (
                        <button onClick={() => convert(e.id)} className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline">
                          <UserPlus className="h-3 w-3" /> Convert <ArrowRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </article>
                ))}
                {items.length === 0 && <div className="grid place-items-center rounded-lg border border-dashed border-border py-6 text-xs text-muted-foreground">Drop a card here</div>}
              </div>
            </div>
          );
        })}
      </div>
      )}
      <p className="mt-3 text-xs text-muted-foreground">Tip: drag cards between columns to update status.</p>
    </>
  );
}

function AddEnquiry({ onAdd }: { onAdd: (e: Enquiry) => void }) {
  const [f, setF] = useState<Enquiry>({
    id: `E${Math.floor(Math.random()*900+100)}`, name: "", phone: "", source: "Walk-in",
    interest: "", notes: "", status: "New", followUpDate: new Date().toISOString().slice(0,10),
  });
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader><DialogTitle>New enquiry</DialogTitle></DialogHeader>
      <form onSubmit={(e) => { e.preventDefault(); if (!f.name || !f.phone) { toast.error("Name and phone required"); return; } onAdd(f); }} className="space-y-3">
        <div><Label>Name</Label><Input value={f.name} onChange={(e)=>setF({...f, name:e.target.value})} className="mt-1.5" /></div>
        <div><Label>Phone</Label><Input value={f.phone} onChange={(e)=>setF({...f, phone:e.target.value})} className="mt-1.5" placeholder="+91" /></div>
        <div><Label>Source</Label>
          <Select value={f.source} onValueChange={(v)=>setF({...f, source:v as Enquiry["source"]})}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>{["Walk-in","Instagram","Facebook","Referral","Google"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>Interest</Label><Input value={f.interest} onChange={(e)=>setF({...f, interest:e.target.value})} className="mt-1.5" /></div>
        <div><Label>Notes</Label><Textarea rows={3} value={f.notes} onChange={(e)=>setF({...f, notes:e.target.value})} className="mt-1.5" /></div>
        <div><Label>Follow-up date</Label><Input type="date" value={f.followUpDate} onChange={(e)=>setF({...f, followUpDate:e.target.value})} className="mt-1.5" /></div>
        <DialogFooter><Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">Add enquiry</Button></DialogFooter>
      </form>
    </DialogContent>
  );
}
