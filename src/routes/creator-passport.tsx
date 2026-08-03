import { createFileRoute } from "@tanstack/react-router";
import { IdCard } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/creator-passport")({
  head: () => ({ meta: [
    { title: "Creator Passport — Creator Dashboard" },
    { name: "description", content: "Unique creator ID with QR verification and lifetime achievements." },
    { property: "og:title", content: "Creator Passport" },
    { property: "og:description", content: "Unique creator ID with QR verification and lifetime achievements." },
  ]}),
  component: () => <StubPage title="Creator Passport" subtitle="Unique creator ID with QR verification and lifetime achievements." icon={IdCard}
    sections={["ID", "QR", "Achievements", "Awards", "Certificates", ]} />,
});
