import { useState } from "react";
import {
  Building2,
  Check,
  ChevronRight,
  Clock,
  Download,
  FileSignature,
  FileText,
  History,
  Mail,
  MoreHorizontal,
  PenLine,
  Printer,
  Search,
  Send,
  Shield,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { EmptySurface } from "@/components/influencer/wall-page";

const TABS = [
  { key: "directory", label: "Brand Directory", icon: Building2 },
  { key: "contracts", label: "Contracts", icon: FileSignature },
] as const;

type Tab = (typeof TABS)[number]["key"];

export function BrandContractViewer() {
  const [tab, setTab] = useState<Tab>("contracts");
  const [viewerOpen, setViewerOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border bg-surface overflow-hidden">
        <div className="border-b border-border bg-surface-muted/40">
          <div className="flex items-center px-2">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = t.key === tab;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={[
                    "shrink-0 px-3 h-10 inline-flex items-center gap-1.5 text-[12.5px] font-medium border-b-2 -mb-px transition-colors",
                    active
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4">
          {tab === "contracts" ? (
            <ContractsPanel onOpenViewer={() => setViewerOpen(true)} />
          ) : (
            <EmptySurface
              title="No brands onboarded"
              description="Brand profiles, categories, and contact information will appear here once brand onboarding is connected."
              primaryAction="Invite Brand"
            />
          )}
        </div>
      </div>

      <ContractViewerDrawer open={viewerOpen} onClose={() => setViewerOpen(false)} />
    </div>
  );
}

function ContractsPanel({ onOpenViewer }: { onOpenViewer: () => void }) {
  const chips = ["Status", "Brand", "Creator", "Type", "Signed date", "Expires"];
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-surface p-2">
        <div className="flex items-center gap-1.5 flex-1 min-w-[240px] h-8 px-2.5 rounded-md border border-border bg-background">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            placeholder="Search contracts by brand, creator, reference…"
            className="flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground"
          />
        </div>
        {chips.map((c) => (
          <button
            key={c}
            className="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-md border border-dashed border-border bg-background hover:bg-muted text-[12px]"
          >
            {c}
          </button>
        ))}
      </div>

      <div className="rounded-md border border-border bg-surface overflow-hidden">
        <div className="flex items-center justify-between px-4 h-10 border-b border-border bg-surface-muted">
          <div className="text-[12.5px] font-semibold">Active & pending contracts</div>
          <button
            onClick={onOpenViewer}
            className="h-7 px-2.5 rounded-md bg-primary text-primary-foreground text-[11.5px] inline-flex items-center gap-1.5"
          >
            <FileText className="h-3.5 w-3.5" /> Open sample viewer
          </button>
        </div>
        <EmptySurface
          title="No contracts yet"
          description="Signed agreements, NDAs and amendments will list here with signature status and expiry countdowns."
          primaryAction="New Contract"
        />
      </div>
    </div>
  );
}

/* ----------------------------- PDF viewer drawer ----------------------------- */

function ContractViewerDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [zoom, setZoom] = useState(100);
  return (
    <Dialog open={open} onOpenChange={(o) => (!o ? onClose() : null)}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <DialogPrimitive.Content
          className="fixed inset-y-0 right-0 z-50 w-full max-w-[1100px] bg-background border-l border-border shadow-2xl flex flex-col outline-none"
        >
          <DialogContent asChild>
            <div className="flex flex-col h-full">
              {/* header */}
              <div className="h-14 border-b border-border bg-surface flex items-center px-4 gap-3">
                <div className="h-8 w-8 rounded-md bg-muted grid place-items-center">
                  <FileSignature className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold truncate">Master Collaboration Agreement</div>
                  <div className="text-[11.5px] text-muted-foreground truncate">
                    Contract reference will appear once linked to a brand & creator
                  </div>
                </div>
                <StatusChip icon={<Clock className="h-3 w-3" />} tone="warning" label="Awaiting signature" />
                <StatusChip icon={<Shield className="h-3 w-3" />} tone="neutral" label="Compliance: pending" />
                <div className="flex items-center gap-1">
                  <IconBtn onClick={() => toast.message("Download")}><Download className="h-3.5 w-3.5" /></IconBtn>
                  <IconBtn onClick={() => toast.message("Print")}><Printer className="h-3.5 w-3.5" /></IconBtn>
                  <IconBtn onClick={() => toast.message("Send for signature")}><Send className="h-3.5 w-3.5" /></IconBtn>
                  <IconBtn onClick={onClose}><X className="h-3.5 w-3.5" /></IconBtn>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-[1fr_340px] overflow-hidden">
                {/* PDF viewer */}
                <div className="flex flex-col bg-surface-muted/50 overflow-hidden">
                  <div className="h-10 border-b border-border bg-surface flex items-center px-3 gap-2 text-[12px]">
                    <span className="text-muted-foreground">Page 1 of —</span>
                    <div className="ml-auto flex items-center gap-1">
                      <IconBtn onClick={() => setZoom((z) => Math.max(50, z - 10))}><ZoomOut className="h-3.5 w-3.5" /></IconBtn>
                      <span className="tabular-nums w-10 text-center">{zoom}%</span>
                      <IconBtn onClick={() => setZoom((z) => Math.min(200, z + 10))}><ZoomIn className="h-3.5 w-3.5" /></IconBtn>
                    </div>
                  </div>
                  <div className="flex-1 overflow-auto p-6 grid place-items-center">
                    <div
                      className="bg-background border border-border shadow-sm rounded-sm"
                      style={{
                        width: `${(816 * zoom) / 100}px`,
                        height: `${(1056 * zoom) / 100}px`,
                        maxWidth: "100%",
                      }}
                    >
                      <div className="h-full w-full grid place-items-center text-center px-8">
                        <div>
                          <div className="mx-auto h-14 w-14 rounded-full bg-muted grid place-items-center text-muted-foreground mb-3">
                            <FileText className="h-6 w-6" />
                          </div>
                          <div className="text-[13px] font-semibold">Contract PDF preview</div>
                          <p className="mt-1 text-[12px] text-muted-foreground max-w-sm">
                            The signed contract PDF renders here with clause navigation, signature anchors, and audit stamps.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* side rail: signatures + activity */}
                <aside className="border-l border-border bg-surface overflow-y-auto">
                  <section className="p-4 border-b border-border">
                    <div className="text-[12.5px] font-semibold mb-2 flex items-center gap-1.5">
                      <PenLine className="h-3.5 w-3.5" /> Signature & approval
                    </div>
                    <ul className="space-y-2">
                      {[
                        { role: "Brand signatory", tone: "success" as const, label: "Signed" },
                        { role: "Creator", tone: "warning" as const, label: "Awaiting" },
                        { role: "Legal review", tone: "neutral" as const, label: "Not started" },
                        { role: "Finance approval", tone: "neutral" as const, label: "Not started" },
                      ].map((row) => (
                        <li key={row.role} className="flex items-center justify-between rounded-md border border-border bg-surface-muted/50 px-2.5 py-2 text-[12px]">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="h-6 w-6 rounded-full bg-muted grid place-items-center text-[10px] font-semibold">
                              {row.role.slice(0, 1)}
                            </div>
                            <span className="truncate">{row.role}</span>
                          </div>
                          <StatusChip tone={row.tone} label={row.label} icon={row.tone === "success" ? <Check className="h-3 w-3" /> : <Clock className="h-3 w-3" />} />
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button className="h-8 rounded-md bg-primary text-primary-foreground text-[12px] inline-flex items-center justify-center gap-1.5" onClick={() => toast.message("Send reminder")}>
                        <Mail className="h-3.5 w-3.5" /> Remind
                      </button>
                      <button className="h-8 rounded-md border border-border bg-surface hover:bg-muted text-[12px] inline-flex items-center justify-center gap-1.5" onClick={() => toast.message("Void contract")}>
                        Void
                      </button>
                    </div>
                  </section>

                  <section className="p-4">
                    <div className="text-[12.5px] font-semibold mb-2 flex items-center gap-1.5">
                      <History className="h-3.5 w-3.5" /> Activity timeline
                    </div>
                    <ol className="relative pl-4 space-y-3">
                      <span className="absolute left-1.5 top-1 bottom-1 w-px bg-border" />
                      {[
                        { label: "Contract drafted", when: "—" },
                        { label: "Sent to brand", when: "—" },
                        { label: "Brand signed", when: "—" },
                        { label: "Sent to creator", when: "—" },
                        { label: "Awaiting creator signature", when: "now" },
                      ].map((e) => (
                        <li key={e.label} className="relative">
                          <span className="absolute -left-[13px] top-1 h-2 w-2 rounded-full bg-primary" />
                          <div className="text-[12px] font-medium">{e.label}</div>
                          <div className="text-[11px] text-muted-foreground">{e.when}</div>
                        </li>
                      ))}
                    </ol>
                    <button className="mt-3 text-[11.5px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                      View full audit log <ChevronRight className="h-3 w-3" />
                    </button>
                  </section>
                </aside>
              </div>
            </div>
          </DialogContent>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}

function IconBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-8 w-8 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
    >
      {children}
    </button>
  );
}

function StatusChip({
  label,
  tone,
  icon,
}: {
  label: string;
  tone: "success" | "warning" | "danger" | "neutral";
  icon?: React.ReactNode;
}) {
  const toneCls =
    tone === "success"
      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
      : tone === "warning"
        ? "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400"
        : tone === "danger"
          ? "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400"
          : "bg-muted text-muted-foreground border-border";
  return (
    <span className={["inline-flex items-center gap-1 h-5 px-1.5 rounded text-[10.5px] font-medium border whitespace-nowrap", toneCls].join(" ")}>
      {icon}
      {label}
    </span>
  );
}

// suppress unused-import lint for MoreHorizontal
void MoreHorizontal;
