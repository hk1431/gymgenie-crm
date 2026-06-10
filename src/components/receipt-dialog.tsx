import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, QrCode } from "lucide-react";
import { gymProfile, members, type Payment } from "@/lib/mock-data";

export function ReceiptDialog({ open, onOpenChange, payment, gstPct = 0 }: { open: boolean; onOpenChange: (v: boolean) => void; payment: Payment | null; gstPct?: number }) {
  if (!payment) return null;
  const m = members.find(x => x.id === payment.memberId);
  const gstAmt = Math.round((payment.amount * gstPct) / 100);
  const subtotal = payment.amount - gstAmt;

  const printIt = () => {
    const el = document.getElementById("receipt-printable");
    if (!el) return;
    const w = window.open("", "_blank", "width=420,height=640");
    if (!w) return;
    w.document.write(`<html><head><title>${payment.receiptNo}</title>
      <style>body{font-family:system-ui,sans-serif;padding:24px;color:#111}h1{color:#FF6B00;margin:0}table{width:100%;border-collapse:collapse;margin-top:12px}td{padding:6px 0;font-size:13px}.r{text-align:right}.sep{border-top:1px dashed #999}.foot{margin-top:24px;font-size:11px;color:#777;text-align:center}</style>
      </head><body>${el.innerHTML}</body></html>`);
    w.document.close(); w.focus(); w.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Receipt {payment.receiptNo}</DialogTitle></DialogHeader>
        <div id="receipt-printable" className="rounded-lg border border-border bg-background p-5 text-sm">
          <div className="text-center">
            <h1 className="text-xl font-bold text-primary">{gymProfile.name}</h1>
            <div className="text-xs text-muted-foreground">{gymProfile.address}</div>
            <div className="text-xs text-muted-foreground">{gymProfile.phone} · {gymProfile.email}</div>
            {gymProfile.gst && <div className="text-xs text-muted-foreground">GSTIN: {gymProfile.gst}</div>}
          </div>
          <div className="mt-4 border-t border-dashed border-border pt-3">
            <div className="flex justify-between"><span className="text-muted-foreground">Receipt</span><span className="font-mono">{payment.receiptNo}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span>{payment.paidAt}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Member</span><span className="font-medium">{m?.name}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span>{m?.phone}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Plan</span><span>{m?.plan}</span></div>
          </div>
          <div className="mt-3 border-t border-dashed border-border pt-3 space-y-1">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div>
            {gstPct > 0 && <div className="flex justify-between"><span>GST ({gstPct}%)</span><span>₹{gstAmt.toLocaleString("en-IN")}</span></div>}
            <div className="flex justify-between border-t border-dashed border-border pt-2 text-base font-bold text-primary"><span>Total</span><span>₹{payment.amount.toLocaleString("en-IN")}</span></div>
            <div className="flex justify-between text-xs text-muted-foreground"><span>Mode</span><span>{payment.mode}</span></div>
          </div>
          {payment.mode === "UPI" && gymProfile.upi && (
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-border bg-card p-3">
              <div className="grid h-16 w-16 place-items-center rounded-md border border-border bg-background text-muted-foreground">
                <QrCode className="h-10 w-10" />
              </div>
              <div className="text-xs">
                <div className="font-medium">Pay via UPI</div>
                <div className="text-muted-foreground">{gymProfile.upi}</div>
              </div>
            </div>
          )}
          <div className="mt-4 text-center text-[11px] text-muted-foreground">
            Powered by GymGenie · frequencybuilders.com
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={printIt} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"><Printer className="h-4 w-4" /> Print receipt</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
