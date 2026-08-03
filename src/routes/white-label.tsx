import { createFileRoute } from "@tanstack/react-router";
import { Palette } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/white-label")({
  head: () => ({ meta: [
    { title: "White Label Mode — Creator Dashboard" },
    { name: "description", content: "Own creator portal, branding and domain." },
    { property: "og:title", content: "White Label Mode" },
    { property: "og:description", content: "Own creator portal, branding and domain." },
  ]}),
  component: () => <StubPage title="White Label Mode" subtitle="Own creator portal, branding and domain." icon={Palette}
    sections={["Portal", "Branding", "Domain", "Website", ]} />,
});
