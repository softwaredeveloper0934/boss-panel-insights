import { createFileRoute } from "@tanstack/react-router";
import { Users, Plus, CheckCircle, Archive, UserPlus, RefreshCw } from "lucide-react";
import { ListPage } from "@/components/layout/ListPage";
import { DataTable, type DataColumn } from "@/components/data/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/I18nProvider";

interface LeadRow {
  id: string; name: string; source: string; status: string;
  value: number; createdAt: string;
}

export const Route = createFileRoute("/leads")({
  head: () => ({ meta: [
    { title: "Leads — Influencer Dashboard" },
    { name: "description", content: "Track generated, qualified and converted leads." },
  ]}),
  component: LeadsPage,
});

function LeadsPage() {
  const { formatCurrency, formatDate, t } = useI18n();

  const columns: DataColumn<LeadRow>[] = [
    { key: "name",      header: "Lead", sortable: true, alwaysVisible: true,
      render: (r) => <span className="font-medium">{r.name}</span>,
      exportValue: (r) => r.name },
    { key: "source",    header: "Source", sortable: true, exportValue: (r) => r.source },
    { key: "status",    header: "Status", render: (r) => <Badge variant="secondary">{r.status}</Badge>,
      exportValue: (r) => r.status },
    { key: "value",     header: "Value", sortable: true, align: "right",
      render: (r) => formatCurrency(r.value), exportValue: (r) => r.value },
    { key: "createdAt", header: "Created", sortable: true,
      render: (r) => formatDate(r.createdAt), exportValue: (r) => r.createdAt },
  ];

  return (
    <ListPage
      title="Leads"
      subtitle="Every lead you generate — qualified, contacted and converted."
      icon={Users}
      sections={["All", "Generated", "Qualified", "Converted", "History", "Analytics"]}
    >
      <DataTable<LeadRow>
        tableId="leads"
        resource="leads"
        columns={columns}
        data={[]}
        total={0}
        rowKey={(r) => r.id}
        realtime={{ channel: "leads" }}
        onRefresh={() => {}}
        searchPlaceholder={t("search", "Search leads…")}
        filters={[
          { key: "status", label: "Status", options: [
            { value: "new",       label: "New" },
            { value: "qualified", label: "Qualified" },
            { value: "contacted", label: "Contacted" },
            { value: "converted", label: "Converted" },
            { value: "lost",      label: "Lost" },
          ]},
          { key: "source", label: "Source", options: [
            { value: "referral",  label: "Referral" },
            { value: "campaign",  label: "Campaign" },
            { value: "qr",        label: "QR" },
            { value: "shortlink", label: "Short link" },
          ]},
        ]}
        bulkActions={[
          { id: "qualify", label: "Mark qualified", icon: <CheckCircle className="h-3.5 w-3.5" />,
            confirm: { title: "Mark selected leads as qualified?", confirmLabel: "Qualify" },
            audit: { action: "leads.qualify", resource: "leads" },
            onRun: () => {} },
          { id: "assign", label: "Assign owner", icon: <UserPlus className="h-3.5 w-3.5" />,
            confirm: { title: "Assign owner", description: "Reassign selected leads." },
            audit: { action: "leads.assign", resource: "leads" },
            onRun: () => {} },
          { id: "status", label: "Change status", icon: <RefreshCw className="h-3.5 w-3.5" />,
            audit: { action: "leads.status", resource: "leads" },
            onRun: () => {} },
          { id: "archive", label: "Archive", icon: <Archive className="h-3.5 w-3.5" />,
            variant: "destructive",
            confirm: { title: "Archive selected leads?", destructive: true, confirmLabel: "Archive" },
            audit: { action: "leads.archive", resource: "leads" },
            onRun: () => {} },
        ]}
        toolbar={<Button size="sm" className="h-9 gap-1.5"><Plus className="h-3.5 w-3.5" /> {t("new", "New")}</Button>}
      />
    </ListPage>
  );
}
