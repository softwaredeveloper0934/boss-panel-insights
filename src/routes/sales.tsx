import { createFileRoute } from "@tanstack/react-router";
import { ShoppingBag, CheckCircle, Archive, RefreshCw } from "lucide-react";
import { ListPage } from "@/components/layout/ListPage";
import { DataTable, type DataColumn } from "@/components/data/DataTable";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n/I18nProvider";

interface SaleRow {
  id: string; orderId: string; product: string; customer: string;
  status: string; total: number; commission: number; createdAt: string;
}

export const Route = createFileRoute("/sales")({
  head: () => ({ meta: [
    { title: "Sales — Influencer Dashboard" },
    { name: "description", content: "Orders, revenue, customers and conversions." },
  ]}),
  component: SalesPage,
});

function SalesPage() {
  const { formatCurrency, formatDate, t } = useI18n();

  const columns: DataColumn<SaleRow>[] = [
    { key: "orderId",    header: "Order", sortable: true, alwaysVisible: true,
      render: (r) => <span className="font-mono text-xs">{r.orderId}</span>,
      exportValue: (r) => r.orderId },
    { key: "product",    header: "Product", sortable: true, exportValue: (r) => r.product },
    { key: "customer",   header: "Customer", exportValue: (r) => r.customer },
    { key: "status",     header: "Status", render: (r) => <Badge variant="secondary">{r.status}</Badge>,
      exportValue: (r) => r.status },
    { key: "total",      header: "Total", sortable: true, align: "right",
      render: (r) => formatCurrency(r.total), exportValue: (r) => r.total },
    { key: "commission", header: "Commission", sortable: true, align: "right",
      render: (r) => formatCurrency(r.commission), exportValue: (r) => r.commission },
    { key: "createdAt",  header: "Date", sortable: true,
      render: (r) => formatDate(r.createdAt), exportValue: (r) => r.createdAt },
  ];

  return (
    <ListPage
      title="Sales"
      subtitle="Orders, revenue, customers, conversions and top-selling products."
      icon={ShoppingBag}
      permission="orders:view"
      sections={["Orders", "Revenue", "Customers", "Conversions", "Top Products", "Analytics"]}
    >
      <DataTable<SaleRow>
        tableId="sales"
        resource="sales"
        columns={columns}
        data={[]}
        total={0}
        rowKey={(r) => r.id}
        viewPermission="orders:view"
        realtime={{ channel: "sales" }}
        onRefresh={() => {}}
        searchPlaceholder={t("search", "Search orders…")}
        filters={[
          { key: "status", label: "Status", options: [
            { value: "paid",      label: "Paid" },
            { value: "pending",   label: "Pending" },
            { value: "refunded",  label: "Refunded" },
            { value: "cancelled", label: "Cancelled" },
          ]},
          { key: "channel", label: "Channel", options: [
            { value: "referral", label: "Referral" },
            { value: "campaign", label: "Campaign" },
            { value: "organic",  label: "Organic" },
          ]},
        ]}
        bulkActions={[
          { id: "approve", label: "Mark paid", icon: <CheckCircle className="h-3.5 w-3.5" />,
            permission: "orders:update",
            confirm: { title: "Mark selected orders as paid?", confirmLabel: "Mark paid" },
            audit: { action: "sales.mark_paid", resource: "sales" },
            onRun: () => {} },
          { id: "status", label: "Change status", icon: <RefreshCw className="h-3.5 w-3.5" />,
            permission: "orders:update",
            audit: { action: "sales.status", resource: "sales" },
            onRun: () => {} },
          { id: "archive", label: "Archive", icon: <Archive className="h-3.5 w-3.5" />,
            permission: "orders:update", variant: "destructive",
            confirm: { title: "Archive selected orders?", destructive: true, confirmLabel: "Archive" },
            audit: { action: "sales.archive", resource: "sales" },
            onRun: () => {} },
        ]}
      />
    </ListPage>
  );
}
