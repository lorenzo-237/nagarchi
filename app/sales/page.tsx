"use client";

import * as React from "react";

import { AppHeader } from "@/components/layout/app-header";
import { DateRangeFilter } from "@/components/sales/date-range-filter";
import { KillFeedList } from "@/components/sales/kill-feed-list";
import { ProfitChart } from "@/components/sales/profit-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useServerContext } from "@/components/providers/server-context";
import { useProfitSummary } from "@/hooks/use-sales";
import type { ProfitRange } from "@/lib/api/types";
import { defaultDateRange, endOfDayISO, startOfDayISO } from "@/lib/date-range";

const RANGE_DAYS: Record<ProfitRange, number> = { "7d": 7, "30d": 30, "90d": 90 };
const RANGE_LABELS: Record<ProfitRange, string> = {
  "7d": "7 jours",
  "30d": "30 jours",
  "90d": "90 jours",
};
const RANGES: ProfitRange[] = ["7d", "30d", "90d"];

export default function SalesPage() {
  const { currentServerId } = useServerContext();
  const [range, setRange] = React.useState<ProfitRange>("7d");
  const { data: summary, isLoading: summaryLoading } = useProfitSummary(currentServerId, range);
  const [feedRange, setFeedRange] = React.useState(() => defaultDateRange(7));

  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 p-4">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle>Mes ventes</CardTitle>
                <CardDescription>Bénéfices tirés de la vente de tes captures.</CardDescription>
              </div>
              <div className="flex items-center gap-1 rounded-2xl bg-muted p-1">
                {RANGES.map((key) => (
                  <Button
                    key={key}
                    type="button"
                    size="xs"
                    variant={range === key ? "default" : "ghost"}
                    onClick={() => setRange(key)}
                  >
                    {RANGE_LABELS[key]}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Total sur la période</p>
              <p className="text-2xl font-semibold">{(summary?.total ?? 0).toLocaleString("fr-FR")} K</p>
            </div>
            <ProfitChart sales={summary?.sales} isLoading={summaryLoading} days={RANGE_DAYS[range]} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle>Kills récents</CardTitle>
                <CardDescription>
                  Marque un kill comme vendu pour l&apos;ajouter à tes bénéfices.
                </CardDescription>
              </div>
              <DateRangeFilter value={feedRange} onChange={setFeedRange} />
            </div>
          </CardHeader>
          <CardContent>
            {currentServerId ? (
              <KillFeedList
                serverId={currentServerId}
                from={startOfDayISO(feedRange.from)}
                to={endOfDayISO(feedRange.to)}
              />
            ) : (
              <p className="text-sm text-muted-foreground">Sélectionne un serveur.</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
