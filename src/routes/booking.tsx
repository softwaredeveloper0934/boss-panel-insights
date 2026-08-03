import { createFileRoute } from "@tanstack/react-router";
import { Calendar } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/booking")({
  head: () => ({ meta: [
    { title: "Booking Center — Creator Dashboard" },
    { name: "description", content: "Book consultations, meetings, training and live sessions." },
    { property: "og:title", content: "Booking Center" },
    { property: "og:description", content: "Book consultations, meetings, training and live sessions." },
  ]}),
  component: () => <StubPage title="Booking Center" subtitle="Book consultations, meetings, training and live sessions." icon={Calendar}
    sections={["Consultation", "Meeting", "Training", "Live", ]} />,
});
