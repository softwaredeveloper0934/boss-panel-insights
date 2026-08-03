import { createFileRoute } from "@tanstack/react-router";
import { Library } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/media-library")({
  head: () => ({ meta: [
    { title: "Media Library — Creator Dashboard" },
    { name: "description", content: "Images, videos, banners, icons, documents, ZIPs, APKs, source code and brand assets." },
  ]}),
  component: () => <StubPage title="Media Library" subtitle="Centralized media — images, videos, banners, icons, documents, ZIPs, APKs, source code and brand assets." icon={Library}
    sections={["All","Images","Videos","Banners","Icons","Documents","ZIP Files","APK","Source Code","Brand Assets","Folders","Tags","Bulk Upload","Compression","Optimization"]} />,
});
