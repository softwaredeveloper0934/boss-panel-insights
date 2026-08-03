import { createFileRoute } from "@tanstack/react-router";
import { FileSignature } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/contracts")({
  head: () => ({ meta: [
    { title: "Contract Center — Creator Dashboard" },
    { name: "description", content: "Campaign agreements, brand contracts, NDAs and contract vault." },
    { property: "og:title", content: "Contract Center" },
    { property: "og:description", content: "Campaign agreements, brand contracts, NDAs and contract vault." },
  ]}),
  component: () => <StubPage title="Contract Center" subtitle="Campaign agreements, brand contracts, NDAs and contract vault." icon={FileSignature}
    sections={["Agreements", "Brand Contracts", "NDA", "Signatures", "Vault", ]} />,
});
