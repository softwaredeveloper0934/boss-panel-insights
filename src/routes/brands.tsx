import { createFileRoute } from "@tanstack/react-router";
import { RecordsPage } from "@/components/influencer/records-page";
import { brandsConfig } from "@/lib/module-records";
import { BrandContractViewer } from "@/components/influencer/brand-contract-viewer";
import { WALL_BY_SLUG } from "@/lib/influencer-walls";

export const Route = createFileRoute("/brands")({
  head: () => ({
    meta: [
      { title: "Brands — Influencer Manager" },
      { name: "description", content: WALL_BY_SLUG["brands"].description },
    ],
  }),
  component: BrandsPage,
});

function BrandsPage() {
  return (
    <RecordsPage wall={WALL_BY_SLUG["brands"]} config={brandsConfig}>
      <BrandContractViewer />
    </RecordsPage>
  );
}
