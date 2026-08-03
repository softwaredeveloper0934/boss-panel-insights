import { createFileRoute } from "@tanstack/react-router";
import { Wallet, CheckCircle, Archive, RefreshCw } from "lucide-react";
import { ListPage } from "@/components/layout/ListPage";
import { DataTable, type DataColumn } from "@/components/data/DataTable";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n/I18nProvider";

interface CommissionRow {
  id: string; orderId: string; product: string; status: string;
  amount: number; bonus: number; createdAt: string;
}

export const Route = createFileRoute("/commissions")({
  head: () => ({ meta: [
    { title: "Commissions — Influencer Dashboard" },
    { name: "description", content: "Pending, approved, paid and bonus commission." },
  ]}),
  component: CommissionsPage,
});

function CommissionsPage() {
  const { formatCurrency, formatDate, t } = useI18n();

  const columns: DataColumn<CommissionRow>[] = [
    { key: "orderId",   header: "Order", sortable: true, alwaysVisible: true,
      render: (r) => <span className="font-mono text-xs">{r.orderId}</span>,
      exportValue: (r) => r.orderId },
    { key: "product",   header: "Product", sortable: true, exportValue: (r) => r.product },
    { key: "status",    header: "Status", render: (r) => <Badge variant="secondary">{r.status}</Badge>,
      exportValue: (r) => r.status },
    { key: "amount",    header: "Commission", sortable: true, align: "right",
      render: (r) => formatCurrency(r.amount), exportValue: (r) => r.amount },
    { key: "bonus",     header: "Bonus", sortable: true, align: "right",
      render: (r) => formatCurrency(r.bonus), exportValue: (r) => r.bonus },
    { key: "createdAt", header: "Date", sortable: true,
      render: (r) => formatDate(r.createdAt), exportValue: (r) => r.createdAt },
  ];

  return (
    <ListPage
      title="Commissions"
      subtitle="Track everything you have earned — pending, approved, paid and bonus."
      icon={Wallet}
      permission="commissions:view"
      sections={["Pending", "Approved", "Paid", "Bonus", "History", "Payout Requests", "Wallet"]}
    >
      <DataTable<CommissionRow>
        tableId="commissions"
        resource="commissions"
        columns={columns}
        data={[]}
        total={0}
        rowKey={(r) => r.id}
        viewPermission="commissions:view"
        realtime={{ channel: "commissions" }}
        onRefresh={() => {}}
        searchPlaceholder={t("search", "Search commissions…")}
        filters={[
          { key: "status", label: "Status", options: [
            { value: "pending",  label: "Pending" },
            { value: "approved", label: "Approved" },
            { value: "paid",     label: "Paid" },
            { value: "reversed", label: "Reversed" },
          ]},
          { key: "type", label: "Type", options: [
            { value: "sale",    label: "Sale" },
            { value: "bonus",   label: "Bonus" },
            { value: "tier",    label: "Tier" },
          ]},
        ]}
        bulkActions={[
          { id: "approve", label: "Approve", icon: <CheckCircle className="h-3.5 w-3.5" />,
            permission: "commissions:approve",
            confirm: { title: "Approve selected commissions?", confirmLabel: "Approve" },
            audit: { action: "commissions.approve", resource: "commissions" },
            onRun: () => {} },
          { id: "status", label: "Change status", icon: <RefreshCw className="h-3.5 w-3.5" />,
            permission: "commissions:approve",
            audit: { action: "commissions.status", resource: "commissions" },
            onRun: () => {} },
          { id: "reverse", label: "Reverse", icon: <Archive className="h-3.5 w-3.5" />,
            permission: "commissions:approve", variant: "destructive",
            confirm: { title: "Reverse selected commissions?", destructive: true, confirmLabel: "Reverse" },
            audit: { action: "commissions.reverse", resource: "commissions" },
            onRun: () => {} },
        ]}
      />
    </ListPage>
  );
}
