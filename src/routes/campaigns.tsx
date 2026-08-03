import { createFileRoute } from "@tanstack/react-router";
import {
  Megaphone, CheckCircle2, Clock, TrendingUp, Target, Wallet, Plus,
  CheckCircle, Archive, UserPlus, RefreshCw,
} from "lucide-react";
import { ListPage } from "@/components/layout/ListPage";
import { DataTable, type DataColumn } from "@/components/data/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/I18nProvider";

interface CampaignRow {
  id: string; name: string; brand: string; status: string;
  reward: number; reach: number; deadline: string;
}

export const Route = createFileRoute("/campaigns")({
  head: () => ({
    meta: [
      { title: "Campaigns — Influencer Dashboard" },
      { name: "description", content: "Browse, join and manage promotion campaigns." },
      { property: "og:title", content: "Campaigns" },
      { property: "og:description", content: "Browse, join and manage promotion campaigns." },
    ],
  }),
  component: CampaignsPage,
});

function CampaignsPage() {
  const { formatCurrency, formatNumber, formatDate, t } = useI18n();

  const columns: DataColumn<CampaignRow>[] = [
    { key: "name",     header: "Campaign", sortable: true, alwaysVisible: true,
      render: (r) => <span className="font-medium">{r.name}</span>,
      exportValue: (r) => r.name },
    { key: "brand",    header: "Brand", sortable: true, exportValue: (r) => r.brand },
    { key: "status",   header: "Status", render: (r) => <Badge variant="secondary">{r.status}</Badge>,
      exportValue: (r) => r.status },
    { key: "reward",   header: "Reward", sortable: true, align: "right",
      render: (r) => formatCurrency(r.reward), exportValue: (r) => r.reward },
    { key: "reach",    header: "Reach", sortable: true, align: "right",
      render: (r) => formatNumber(r.reach), exportValue: (r) => r.reach },
    { key: "deadline", header: "Deadline", sortable: true,
      render: (r) => formatDate(r.deadline), exportValue: (r) => r.deadline },
  ];

  return (
    <ListPage
      title="Campaigns"
      subtitle="Browse, join and track every promotion campaign from brands you collaborate with."
      icon={Megaphone}
      ctaLabel="Browse Marketplace"
      ctaTo="/products"
      permission="campaigns:view"
      sections={["Available", "Active", "Upcoming", "Completed", "Rules", "Rewards", "Analytics"]}
      kpis={[
        { label: "Active",    icon: CheckCircle2, tint: "text-accent-emerald" },
        { label: "Available", icon: Megaphone, tint: "text-primary-glow" },
        { label: "Upcoming",  icon: Clock, tint: "text-accent-amber" },
        { label: "Reach",     icon: TrendingUp, tint: "text-primary-glow" },
        { label: "Leads",     icon: Target, tint: "text-accent-pink" },
        { label: "Rewards",   icon: Wallet, tint: "text-accent-emerald" },
      ]}
    >
      <DataTable<CampaignRow>
        tableId="campaigns"
        resource="campaigns"
        columns={columns}
        data={[]}
        total={0}
        rowKey={(r) => r.id}
        viewPermission="campaigns:view"
        realtime={{ channel: "campaigns" }}
        onRefresh={() => {}}
        searchPlaceholder={t("search", "Search campaigns…")}
        filters={[
          { key: "status",   label: "Status",   options: [
            { value: "available", label: "Available" },
            { value: "active",    label: "Active" },
            { value: "upcoming",  label: "Upcoming" },
            { value: "completed", label: "Completed" },
          ]},
          { key: "category", label: "Category", options: [
            { value: "saas",    label: "SaaS" },
            { value: "d2c",     label: "D2C" },
            { value: "service", label: "Service" },
          ]},
        ]}
        bulkActions={[
          { id: "approve", label: "Approve", icon: <CheckCircle className="h-3.5 w-3.5" />,
            permission: "campaigns:approve",
            confirm: { title: "Approve selected campaigns?", confirmLabel: "Approve" },
            audit: { action: "campaigns.approve", resource: "campaigns" },
            onRun: () => {} },
          { id: "assign", label: "Assign owner", icon: <UserPlus className="h-3.5 w-3.5" />,
            permission: "campaigns:update",
            confirm: { title: "Assign owner", description: "Reassign selected campaigns to another owner." },
            audit: { action: "campaigns.assign", resource: "campaigns" },
            onRun: () => {} },
          { id: "archive", label: "Archive", icon: <Archive className="h-3.5 w-3.5" />,
            permission: "campaigns:update",
            confirm: { title: "Archive selected campaigns?", destructive: true, confirmLabel: "Archive" },
            audit: { action: "campaigns.archive", resource: "campaigns" },
            onRun: () => {} },
          { id: "status", label: "Change status", icon: <RefreshCw className="h-3.5 w-3.5" />,
            permission: "campaigns:update",
            audit: { action: "campaigns.status", resource: "campaigns" },
            onRun: () => {} },
        ]}
        toolbar={<Button size="sm" className="h-9 gap-1.5"><Plus className="h-3.5 w-3.5" /> {t("new", "New")}</Button>}
      />
    </ListPage>
  );
}
