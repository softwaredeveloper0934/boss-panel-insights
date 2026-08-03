// Client-safe server-function entry point for influencer dashboard analytics.
// Components import this module; the repository (.server.ts) is loaded only
// inside the handler body and is stripped from the client bundle.

import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

import type { DashboardAnalytics, TimeRange } from "./types";

const rangeSchema = z.enum(["1d", "7d", "30d", "90d"]);

const inputSchema = z.object({
  range: rangeSchema.default("7d"),
  influencerId: z.string().min(1).optional(),
});

export const getDashboardAnalytics = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => inputSchema.parse(data ?? {}))
  .handler(async ({ data }): Promise<DashboardAnalytics> => {
    const { fetchDashboardAnalytics } = await import("./repository.server");
    return fetchDashboardAnalytics(data);
  });

export const dashboardAnalyticsQueryOptions = (range: TimeRange = "7d") =>
  queryOptions({
    queryKey: ["dashboard-analytics", range] as const,
    queryFn: () => getDashboardAnalytics({ data: { range } }),
    staleTime: 60_000,
  });
