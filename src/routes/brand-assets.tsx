import { createFileRoute } from "@tanstack/react-router";
import { Palette } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/brand-assets")({
  head: () => ({ meta: [
    { title: "Brand Assets — Influencer Dashboard" },
    { name: "description", content: "Logos, colors, fonts and brand-approved creatives." },
  ]}),
  component: () => <StubPage title="Brand Assets" subtitle="Logos, colors, fonts and brand-approved creatives ready for every campaign." icon={Palette}
    sections={["Logos", "Colors", "Fonts", "Templates", "Approved Creatives"]} />,
});
