import { createFileRoute } from "@tanstack/react-router";
import { Vault } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/assets-vault")({
  head: () => ({ meta: [
    { title: "Digital Assets Vault — Creator Dashboard" },
    { name: "description", content: "Videos, photos, logos, contracts and brand files." },
    { property: "og:title", content: "Digital Assets Vault" },
    { property: "og:description", content: "Videos, photos, logos, contracts and brand files." },
  ]}),
  component: () => <StubPage title="Digital Assets Vault" subtitle="Videos, photos, logos, contracts and brand files." icon={Vault}
    sections={["Videos", "Photos", "Logos", "Contracts", "Brand Files", ]} />,
});
