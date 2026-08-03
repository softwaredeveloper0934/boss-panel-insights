import { createFileRoute } from "@tanstack/react-router";
import { Ticket } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/coupons")({
  head: () => ({ meta: [
    { title: "Coupons — Creator Dashboard" },
    { name: "description", content: "Create, edit, schedule, analyze and track coupon usage." },
  ]}),
  component: () => <StubPage title="Coupons" subtitle="Create, schedule, analyze and track coupon usage across products." icon={Ticket}
    sections={["Create","Edit","Schedule","Analytics","Usage"]} />,
});
