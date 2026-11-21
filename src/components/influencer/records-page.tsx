import { useMemo, useState, type ReactNode } from "react";
import { KpiStrip, PageHeader, RightPanel } from "@/components/influencer/wall-page";
import { RecordsSurface } from "@/components/influencer/records-surface";
import { useRecords, type AnyRow } from "@/lib/use-records";
import type { RecordConfig } from "@/lib/module-records";
import type { WallConfig } from "@/lib/influencer-walls";

/** Standard module page: header, live KPIs, real records table, optional extra content. */
export function RecordsPage({
  wall,
  config,
  kpis,
  children,
}: {
  wall: WallConfig;
  config: RecordConfig;
  kpis?: (rows: AnyRow[]) => Record<string, string>;
  children?: ReactNode;
}) {
  const api = useRecords(config.table);
  const values = useMemo(() => (kpis ?? config.kpis)(api.rows), [api.rows, kpis, config]);
  const [openKey, setOpenKey] = useState(0);
  return (
    <div className="flex flex-col">
      <PageHeader wall={wall} onPrimaryAction={() => setOpenKey((k) => k + 1)} />
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 pb-3">
        <KpiStrip wall={wall} loading={api.loading} values={values} />
      </div>
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 grid gap-6 pb-12 pt-6 lg:grid-cols-[1fr_320px]">
        <main className="min-w-0 space-y-6">
          <RecordsSurface
            table={config.table}
            api={api}
            title={config.title}
            fields={config.fields}
            columns={config.columns}
            addLabel={config.addLabel}
            emptyTitle={config.emptyTitle}
            emptyDescription={config.emptyDescription}
            openCreateSignal={openKey}
          />
          {children}
        </main>
        <RightPanel wall={wall} />
      </div>
    </div>
  );
}
