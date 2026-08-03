import { createFileRoute } from "@tanstack/react-router";
import {
  Package, Sparkles, Flame, Star, Rocket, Bot, Plus,
  CheckCircle, Archive, RefreshCw,
} from "lucide-react";
import { ListPage } from "@/components/layout/ListPage";
import { DataTable, type DataColumn } from "@/components/data/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/I18nProvider";

interface ProductRow {
  id: string; name: string; category: string; status: string;
  price: number; commission: number; sales: number; conversion: number;
}

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Influencer Dashboard" },
      { name: "description", content: "Discover products available to promote and earn commission on." },
      { property: "og:title", content: "Products" },
      { property: "og:description", content: "Discover products available to promote and earn commission on." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { formatCurrency, formatNumber, t } = useI18n();

  const columns: DataColumn<ProductRow>[] = [
    { key: "name",       header: "Product", sortable: true, alwaysVisible: true,
      render: (r) => <span className="font-medium">{r.name}</span>,
      exportValue: (r) => r.name },
    { key: "category",   header: "Category", sortable: true, exportValue: (r) => r.category },
    { key: "status",     header: "Status", render: (r) => <Badge variant="secondary">{r.status}</Badge>,
      exportValue: (r) => r.status },
    { key: "price",      header: "Price", sortable: true, align: "right",
      render: (r) => formatCurrency(r.price), exportValue: (r) => r.price },
    { key: "commission", header: "Commission", sortable: true, align: "right",
      render: (r) => formatCurrency(r.commission), exportValue: (r) => r.commission },
    { key: "sales",      header: "Sales", sortable: true, align: "right",
      render: (r) => formatNumber(r.sales), exportValue: (r) => r.sales },
    { key: "conversion", header: "Conv.", sortable: true, align: "right",
      render: (r) => `${formatNumber(r.conversion, { maximumFractionDigits: 2 })}%`,
      exportValue: (r) => r.conversion },
  ];

  return (
    <ListPage
      title="Products"
      subtitle="Every product available to promote — featured, trending, top-sellers and new launches."
      icon={Package}
      ctaLabel="Open Marketplace"
      ctaTo="/marketplace"
      permission="products:view"
      sections={["All", "Featured", "Trending", "Top Selling", "New Launches", "AI Ready", "Offline", "SaaS"]}
      kpis={[
        { label: "Promoting",  icon: Package, tint: "text-primary-glow" },
        { label: "Top Seller", icon: Flame, tint: "text-accent-pink" },
        { label: "New Launch", icon: Rocket, tint: "text-accent-amber" },
        { label: "AI Ready",   icon: Bot, tint: "text-primary-glow" },
        { label: "Conversion", icon: Sparkles, tint: "text-accent-emerald" },
        { label: "Commission", icon: Star, tint: "text-accent-amber" },
      ]}
    >
      <DataTable<ProductRow>
        tableId="products"
        resource="products"
        columns={columns}
        data={[]}
        total={0}
        rowKey={(r) => r.id}
        viewPermission="products:view"
        realtime={{ channel: "products" }}
        onRefresh={() => {}}
        searchPlaceholder={t("search", "Search products…")}
        filters={[
          { key: "status", label: "Status", options: [
            { value: "live",   label: "Live" },
            { value: "draft",  label: "Draft" },
            { value: "paused", label: "Paused" },
          ]},
          { key: "category", label: "Category", options: [
            { value: "saas",     label: "SaaS" },
            { value: "physical", label: "Physical" },
            { value: "service",  label: "Service" },
            { value: "digital",  label: "Digital" },
          ]},
          { key: "tag", label: "Tag", options: [
            { value: "featured", label: "Featured" },
            { value: "trending", label: "Trending" },
            { value: "new",      label: "New" },
            { value: "ai-ready", label: "AI Ready" },
          ]},
        ]}
        bulkActions={[
          { id: "approve", label: "Publish", icon: <CheckCircle className="h-3.5 w-3.5" />,
            permission: "products:update",
            confirm: { title: "Publish selected products?", confirmLabel: "Publish" },
            audit: { action: "products.publish", resource: "products" },
            onRun: () => {} },
          { id: "status", label: "Change status", icon: <RefreshCw className="h-3.5 w-3.5" />,
            permission: "products:update",
            audit: { action: "products.status", resource: "products" },
            onRun: () => {} },
          { id: "archive", label: "Archive", icon: <Archive className="h-3.5 w-3.5" />,
            permission: "products:update",
            confirm: { title: "Archive selected products?", destructive: true, confirmLabel: "Archive" },
            audit: { action: "products.archive", resource: "products" },
            onRun: () => {} },
          { id: "delete", label: "Delete", permission: "products:delete", variant: "destructive",
            confirm: { title: "Delete selected products?", description: "This cannot be undone.", destructive: true, confirmLabel: "Delete" },
            audit: { action: "products.delete", resource: "products" },
            onRun: () => {} },
        ]}
        toolbar={<Button size="sm" className="h-9 gap-1.5"><Plus className="h-3.5 w-3.5" /> {t("new", "New")}</Button>}
      />
    </ListPage>
  );
}
