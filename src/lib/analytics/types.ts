// Analytics domain models. Stable DTO contract consumed by the dashboard UI.
// Backend implementations (Software Vala API, mock, alternative providers)
// MUST conform to these shapes. Changing a field here is a breaking change.

export type MetricKey =
  | "followers"
  | "reach"
  | "views"
  | "clicks"
  | "leads"
  | "sales"
  | "commissions";

export type TimeRange = "1d" | "7d" | "30d" | "90d";

export interface MetricSeriesPoint {
  /** ISO-8601 timestamp (UTC) of the bucket. */
  t: string;
  /** Numeric value for the bucket. */
  v: number;
}

export interface MetricSnapshot {
  key: MetricKey;
  /** Current absolute value (cumulative for followers, sum for the range otherwise). */
  value: number;
  /** Previous-period absolute value, used for the delta calculation. */
  previousValue: number;
  /** Signed decimal delta vs previousValue, e.g. 0.124 = +12.4%. `null` when no baseline. */
  deltaPct: number | null;
  /** Time-bucketed series for sparkline rendering. May be empty. */
  series: MetricSeriesPoint[];
  /** Optional display unit, e.g. "USD" for commissions. */
  unit?: string;
}

export interface DashboardAnalytics {
  range: TimeRange;
  /** ISO-8601 timestamp this snapshot was produced. */
  generatedAt: string;
  /** Whether the response is backed by a configured live source. */
  connected: boolean;
  /** Source identifier, e.g. "software-vala", "none". */
  source: string;
  metrics: Record<MetricKey, MetricSnapshot>;
}

export const METRIC_KEYS: MetricKey[] = [
  "followers",
  "reach",
  "views",
  "clicks",
  "leads",
  "sales",
  "commissions",
];

export function emptyMetric(key: MetricKey): MetricSnapshot {
  return {
    key,
    value: 0,
    previousValue: 0,
    deltaPct: null,
    series: [],
    unit: key === "commissions" ? "USD" : undefined,
  };
}

export function emptyDashboardAnalytics(range: TimeRange): DashboardAnalytics {
  return {
    range,
    generatedAt: new Date().toISOString(),
    connected: false,
    source: "none",
    metrics: METRIC_KEYS.reduce(
      (acc, k) => {
        acc[k] = emptyMetric(k);
        return acc;
      },
      {} as Record<MetricKey, MetricSnapshot>,
    ),
  };
}
