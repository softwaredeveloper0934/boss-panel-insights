import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ShieldCheck, ExternalLink } from "lucide-react";

import { ListPage } from "@/components/layout/ListPage";
import { DataTable, type DataColumn, type DataQuery } from "@/components/data/DataTable";
import { Badge } from "@/components/ui/badge";
import { readAuditLog, type AuditEntry } from "@/lib/audit/audit";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useAuthz } from "@/lib/rbac/AuthzProvider";

export const Route = createFileRoute("/audit-log")({
  head: () => ({
    meta: [
      { title: "Audit Log — Software Vala" },
      { name: "description", content: "Search and filter bulk actions with timestamps, actor details and record links." },
    ],
  }),
  component: AuditLogPage,
});

/**
 * Resource → route map. When an audit entry's `resource` matches a key
 * here, the row renders a clickable link to the affected record list
 * (or a specific record when `meta.entityId` is present in the future).
 */
const RESOURCE_ROUTES: Record<string, string> = {
  campaigns: "/campaigns",
  leads: "/leads",
  sales: "/sales",
  products: "/products",
  commissions: "/commissions",
  orders: "/orders",
  customers: "/customers",
  reviews: "/reviews",
  payouts: "/payouts",
  subscriptions: "/subscriptions",
  "audit-log": "/audit-log",
};

function resolveLink(entry: AuditEntry): string | null {
  const base = RESOURCE_ROUTES[entry.resource];
  if (!base) return null;
  const entityId =
    (entry.meta?.entityId as string | undefined) ??
    (entry.ids && entry.ids.length === 1 ? entry.ids[0] : undefined);
  return entityId ? `${base}?id=${encodeURIComponent(entityId)}` : base;
}

function ChangesCell({ entry }: { entry: AuditEntry }) {
  const changes = (entry.meta?.changes ?? entry.meta?.changed ?? null) as
    | Record<string, { from?: unknown; to?: unknown } | unknown>
    | null;
  if (!changes || typeof changes !== "object") {
    // Fall back to a compact meta summary
    const keys = entry.meta ? Object.keys(entry.meta).filter((k) => k !== "entityId") : [];
    if (keys.length === 0) return <span className="text-muted-foreground">—</span>;
    return (
      <span className="font-mono text-[11px] text-muted-foreground truncate max-w-[220px] inline-block align-middle">
        {keys.slice(0, 3).join(", ")}{keys.length > 3 ? ` +${keys.length - 3}` : ""}
      </span>
    );
  }
  const entries = Object.entries(changes).slice(0, 3);
  return (
    <div className="flex flex-wrap gap-1">
      {entries.map(([field, val]) => {
        const v = val as { from?: unknown; to?: unknown };
        const hasFromTo = v && typeof v === "object" && ("from" in v || "to" in v);
        return (
          <span key={field} className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/40 px-1.5 py-0.5 text-[11px]">
            <span className="font-medium">{field}</span>
            {hasFromTo && (
              <span className="font-mono text-muted-foreground">
                {String(v.from ?? "∅")} → {String(v.to ?? "∅")}
              </span>
            )}
          </span>
        );
      })}
      {Object.keys(changes).length > 3 && (
        <span className="text-[11px] text-muted-foreground">+{Object.keys(changes).length - 3}</span>
      )}
    </div>
  );
}

function AuditLogPage() {
  const { formatDate, t } = useI18n();
  const { can } = useAuthz();
  const canFilter = can("audit:view");
  const [tick, setTick] = useState(0);
  const [query, setQuery] = useState<DataQuery | null>(null);

  const all = useMemo<AuditEntry[]>(() => {
    void tick;
    return readAuditLog().slice().reverse();
  }, [tick]);

  const actions = useMemo(() => Array.from(new Set(all.map((r) => r.action))).sort(), [all]);
  const resources = useMemo(() => Array.from(new Set(all.map((r) => r.resource))).sort(), [all]);

  const filtered = useMemo(() => {
    if (!query) return all;
    const q = query.search.trim().toLowerCase();
    let out = all.filter((r) => {
      if (query.filters.action && r.action !== query.filters.action) return false;
      if (query.filters.resource && r.resource !== query.filters.resource) return false;
      if (!q) return true;
      return (
        r.action.toLowerCase().includes(q) ||
        r.resource.toLowerCase().includes(q) ||
        (r.actorId ?? "").toLowerCase().includes(q) ||
        (r.ids?.join(",") ?? "").toLowerCase().includes(q)
      );
    });
    if (query.sort) {
      const { key, dir } = query.sort;
      const sign = dir === "asc" ? 1 : -1;
      out = [...out].sort((a, b) => {
        const av = (a as unknown as Record<string, unknown>)[key];
        const bv = (b as unknown as Record<string, unknown>)[key];
        if (av == null) return 1;
        if (bv == null) return -1;
        return av > bv ? sign : av < bv ? -sign : 0;
      });
    }
    return out;
  }, [all, query]);

  const pageSize = query?.pageSize ?? 25;
  const page = query?.page ?? 1;
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  /** Locale-aware timestamp string reused by both cell and export. */
  const fmtTimestamp = (iso: string) =>
    `${formatDate(iso)} · ${new Date(iso).toLocaleTimeString()}`;

  const columns: DataColumn<AuditEntry>[] = [
    {
      key: "ts", header: "Timestamp", sortable: true, alwaysVisible: true,
      render: (r) => <span className="tabular-nums text-xs">{fmtTimestamp(r.ts)}</span>,
      exportValue: (r) => fmtTimestamp(r.ts),
    },
    {
      key: "actorId", header: "Actor", sortable: true,
      render: (r) => <span className="font-mono text-xs">{r.actorId ?? "system"}</span>,
      exportValue: (r) => r.actorId ?? "system",
    },
    {
      key: "action", header: "Action", sortable: true,
      render: (r) => <Badge variant="secondary" className="font-mono text-[11px]">{r.action}</Badge>,
      exportValue: (r) => r.action,
    },
    {
      key: "resource", header: "Resource", sortable: true,
      render: (r) => {
        const href = resolveLink(r);
        if (!href) return <span className="text-sm">{r.resource}</span>;
        return (
          <a
            href={href}
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            title={`Open ${r.resource}`}
          >
            {r.resource}
            <ExternalLink className="h-3 w-3 opacity-70" />
          </a>
        );
      },
      exportValue: (r) => r.resource,
    },
    {
      key: "count", header: "Records", sortable: true, align: "right",
      render: (r) => r.count ?? "—",
      exportValue: (r) => r.count ?? 0,
    },
    {
      key: "changes", header: "Changed fields",
      render: (r) => <ChangesCell entry={r} />,
      exportValue: (r) => {
        const changes = (r.meta?.changes ?? r.meta?.changed) as
          | Record<string, { from?: unknown; to?: unknown } | unknown>
          | undefined;
        if (!changes || typeof changes !== "object") return "";
        return Object.entries(changes)
          .map(([k, v]) => {
            const vv = v as { from?: unknown; to?: unknown };
            return vv && typeof vv === "object" && ("from" in vv || "to" in vv)
              ? `${k}: ${String(vv.from ?? "∅")} → ${String(vv.to ?? "∅")}`
              : `${k}`;
          })
          .join("; ");
      },
    },
    {
      key: "ids", header: "IDs",
      render: (r) => {
        const href = resolveLink(r);
        const label =
          (r.ids?.slice(0, 3).join(", ") ?? "") +
          (r.ids && r.ids.length > 3 ? ` +${r.ids.length - 3}` : "");
        if (!label) return <span className="text-muted-foreground">—</span>;
        if (!href) return <span className="font-mono text-[11px] text-muted-foreground truncate max-w-[260px] inline-block align-middle">{label}</span>;
        return (
          <a
            href={href}
            className="font-mono text-[11px] text-primary hover:underline truncate max-w-[260px] inline-block align-middle"
          >
            {label}
          </a>
        );
      },
      exportValue: (r) => r.ids?.join("|") ?? "",
    },
  ];

  return (
    <ListPage
      title="Audit Log"
      subtitle="Every bulk action — approve, archive, assign, status update and export — with actor, timestamp and links to the affected record."
      icon={ShieldCheck}
      permission="audit:view"
      sections={["All", "Approvals", "Archives", "Assignments", "Status Updates", "Exports"]}
    >
      <DataTable<AuditEntry>
        tableId="audit-log"
        resource="audit-log"
        columns={columns}
        data={paged}
        total={filtered.length}
        rowKey={(r) => r.id}
        viewPermission="audit:view"
        realtime={{ channel: "audit" }}
        onQueryChange={setQuery}
        onRefresh={() => setTick((n) => n + 1)}
        searchPlaceholder={t("search", "Search audit log…")}
        emptyTitle="No audit entries yet"
        emptyDescription="Bulk actions and exports are logged here as soon as they run."
        filters={canFilter ? [
          { key: "action",   label: "Action",   options: actions.map((a) => ({ value: a, label: a })) },
          { key: "resource", label: "Resource", options: resources.map((r) => ({ value: r, label: r })) },
        ] : []}
      />
    </ListPage>
  );
}
