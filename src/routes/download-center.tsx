import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { StubPage } from "@/components/layout/StubPage";

export const Route = createFileRoute("/download-center")({
  head: () => ({ meta: [
    { title: "Download Center — Creator Dashboard" },
    { name: "description", content: "Download banners, posters, reels, videos, product media and media kits." },
    { property: "og:title", content: "Download Center" },
    { property: "og:description", content: "Download banners, posters, reels, videos, product media and media kits." },
  ]}),
  component: () => <StubPage title="Download Center" subtitle="Download banners, posters, reels, videos, product media and media kits." icon={Download}
    sections={["Banners", "Posters", "Reels", "Videos", "Stories", "Product Images", "Logos", "Media Kit", ]} />,
});
