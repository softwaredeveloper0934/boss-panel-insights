import { createFileRoute } from "@tanstack/react-router";
import { Handshake } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/brand-collaboration")({
  head: () => ({ meta: [
    { title: "Brand Collaboration — Creator Dashboard" },
    { name: "description", content: "Brand requests, partnerships, collaboration and campaign invitations." },
    { property: "og:title", content: "Brand Collaboration" },
    { property: "og:description", content: "Brand requests, partnerships, collaboration and campaign invitations." },
  ]}),
  component: () => <StubPage title="Brand Collaboration" subtitle="Brand requests, partnerships, collaboration and campaign invitations." icon={Handshake}
    sections={["Brand Requests", "Collaboration", "Invitations", "Partnerships", ]} />,
});
