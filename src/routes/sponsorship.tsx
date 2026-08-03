import { createFileRoute } from "@tanstack/react-router";
import { Handshake } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/sponsorship")({
  head: () => ({ meta: [
    { title: "Sponsorship Center — Creator Dashboard" },
    { name: "description", content: "Brand deals, sponsored campaigns, requests, negotiations and contracts." },
    { property: "og:title", content: "Sponsorship Center" },
    { property: "og:description", content: "Brand deals, sponsored campaigns, requests, negotiations and contracts." },
  ]}),
  component: () => <StubPage title="Sponsorship Center" subtitle="Brand deals, sponsored campaigns, requests, negotiations and contracts." icon={Handshake}
    sections={["Brand Deals", "Sponsored", "Requests", "Negotiations", "Contracts", ]} />,
});
