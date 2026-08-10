"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePriceHistory } from "@/hooks/use-prices";
import type { PriceRange } from "@/lib/api/types";
import { buildPriceSeries } from "@/lib/price-chart";

const RANGE_MS: Record<PriceRange, number> = {
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
};
const RANGE_LABELS: Record<PriceRange, string> = {
  "24h": "24 heures",
  "7d": "7 jours",
  "30d": "30 jours",
};
const RANGES: PriceRange[] = ["24h", "7d", "30d"];

const VIEWBOX_WIDTH = 820;
const VIEWBOX_HEIGHT = 380;
const PADDING = { top: 20, right: 20, bottom: 32, left: 60 };
const INNER_WIDTH = VIEWBOX_WIDTH - PADDING.left - PADDING.right;
const INNER_HEIGHT = VIEWBOX_HEIGHT - PADDING.top - PADDING.bottom;

function formatXTick(date: Date, range: PriceRange): string {
  if (range === "24h") {
    return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
}

function formatPointLabel(iso: string): string {
  const date = new Date(iso);
  const day = date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
  const time = date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  return `${day} à ${time}`;
}

function RangeTabs({ range, onChange }: { range: PriceRange; onChange: (range: PriceRange) => void }) {
  return (
    <div className="flex items-center gap-1 rounded-2xl bg-muted p-1">
      {RANGES.map((key) => (
        <Button
          key={key}
          type="button"
          size="xs"
          variant={range === key ? "default" : "ghost"}
          onClick={() => onChange(key)}
        >
          {RANGE_LABELS[key]}
        </Button>
      ))}
    </div>
  );
}

interface ArchimonsterPriceChartProps {
  archimonsterId: string;
  serverId: string;
}

export function ArchimonsterPriceChart({ archimonsterId, serverId }: ArchimonsterPriceChartProps) {
  const [range, setRange] = React.useState<PriceRange>("7d");
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const { data: events, isLoading } = usePriceHistory(serverId, archimonsterId, range);

  const windowEnd = new Date();
  const windowStart = new Date(windowEnd.getTime() - RANGE_MS[range]);

  const points = React.useMemo(
    () => buildPriceSeries(events ?? [], windowEnd),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [events, range]
  );
  const dots = points.filter((point) => point.recordedAt !== null);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Historique des prix</span>
          <RangeTabs range={range} onChange={setRange} />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (points.length === 0) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Historique des prix</span>
          <RangeTabs range={range} onChange={setRange} />
        </div>
        <p className="py-12 text-center text-xs text-muted-foreground">
          Aucun changement de prix enregistré sur cette période.
        </p>
      </div>
    );
  }

  const rawMin = Math.min(...points.map((p) => p.y));
  const rawMax = Math.max(...points.map((p) => p.y));
  const pad = Math.max((rawMax - rawMin) * 0.1, rawMax * 0.02, 1);
  const yMin = Math.max(0, rawMin - pad);
  const yMax = rawMax + pad;
  const average = Math.round(dots.reduce((sum, dot) => sum + dot.y, 0) / dots.length);

  const scaleX = (t: number) =>
    PADDING.left + ((t - windowStart.getTime()) / (windowEnd.getTime() - windowStart.getTime())) * INNER_WIDTH;
  const scaleY = (v: number) => PADDING.top + INNER_HEIGHT - ((v - yMin) / (yMax - yMin)) * INNER_HEIGHT;

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${scaleX(p.x)},${scaleY(p.y)}`).join(" ");
  const areaPath = `${linePath} L${scaleX(points[points.length - 1].x)},${scaleY(yMin)} L${scaleX(points[0].x)},${scaleY(yMin)} Z`;

  const yTickCount = 4;
  const yTicks = Array.from({ length: yTickCount + 1 }, (_, i) => yMin + (i / yTickCount) * (yMax - yMin));

  const xTickCount = 4;
  const xTicks = Array.from({ length: xTickCount + 1 }, (_, i) => {
    const t = windowStart.getTime() + (i / xTickCount) * (windowEnd.getTime() - windowStart.getTime());
    return { t, label: formatXTick(new Date(t), range) };
  });

  const hovered = hoveredIndex !== null ? dots[hoveredIndex] : null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          Historique des prix
          <span className="ml-2 text-muted-foreground">· moyen {average.toLocaleString("fr-FR")} K</span>
        </span>
        <RangeTabs range={range} onChange={setRange} />
      </div>

      <svg
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        className="w-full text-muted-foreground"
        role="img"
        aria-label={`Historique du prix sur ${RANGE_LABELS[range]}`}
      >
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={PADDING.left}
              x2={VIEWBOX_WIDTH - PADDING.right}
              y1={scaleY(tick)}
              y2={scaleY(tick)}
              stroke="var(--border)"
              strokeWidth={1}
            />
            <text x={PADDING.left - 6} y={scaleY(tick)} dy="0.32em" textAnchor="end" fontSize={13} fill="currentColor">
              {Math.round(tick).toLocaleString("fr-FR")}
            </text>
          </g>
        ))}

        <line
          x1={PADDING.left}
          x2={VIEWBOX_WIDTH - PADDING.right}
          y1={scaleY(average)}
          y2={scaleY(average)}
          stroke="var(--muted-foreground)"
          strokeWidth={1}
          strokeDasharray="3 2"
        />

        {xTicks.map(({ t, label }) => (
          <text key={t} x={scaleX(t)} y={VIEWBOX_HEIGHT - 8} textAnchor="middle" fontSize={13} fill="currentColor">
            {label}
          </text>
        ))}

        <path d={areaPath} fill="var(--primary)" opacity={0.1} />
        <path d={linePath} fill="none" stroke="var(--primary)" strokeWidth={2} strokeLinejoin="round" />

        {hovered && (
          <line
            x1={scaleX(hovered.x)}
            x2={scaleX(hovered.x)}
            y1={PADDING.top}
            y2={scaleY(yMin)}
            stroke="var(--border)"
            strokeWidth={1}
            strokeDasharray="2 2"
          />
        )}

        {dots.map((dot, index) => (
          <g
            key={dot.recordedAt}
            tabIndex={0}
            role="button"
            aria-label={`Prix ${dot.y.toLocaleString("fr-FR")} K le ${formatPointLabel(dot.recordedAt!)}`}
            onPointerEnter={() => setHoveredIndex(index)}
            onPointerLeave={() => setHoveredIndex((current) => (current === index ? null : current))}
            onFocus={() => setHoveredIndex(index)}
            onBlur={() => setHoveredIndex((current) => (current === index ? null : current))}
            onClick={() => setHoveredIndex((current) => (current === index ? null : index))}
            className="cursor-pointer outline-none"
          >
            <circle cx={scaleX(dot.x)} cy={scaleY(dot.y)} r={20} fill="transparent" />
            <circle
              cx={scaleX(dot.x)}
              cy={scaleY(dot.y)}
              r={6}
              fill="var(--primary)"
              stroke="var(--card)"
              strokeWidth={2}
            />
          </g>
        ))}

        {hovered && (
          <g>
            {(() => {
              const boxWidth = 150;
              const boxHeight = 30;
              const px = Math.min(
                Math.max(scaleX(hovered.x) - boxWidth / 2, PADDING.left),
                VIEWBOX_WIDTH - PADDING.right - boxWidth
              );
              const py = Math.max(scaleY(hovered.y) - boxHeight - 8, PADDING.top);
              return (
                <>
                  <rect
                    x={px}
                    y={py}
                    width={boxWidth}
                    height={boxHeight}
                    rx={4}
                    fill="var(--popover)"
                    stroke="var(--border)"
                    strokeWidth={1}
                  />
                  <text x={px + boxWidth / 2} y={py + boxHeight / 2} dy="0.32em" textAnchor="middle" fontSize={13} fill="var(--popover-foreground)">
                    {hovered.y.toLocaleString("fr-FR")} K · {formatPointLabel(hovered.recordedAt!)}
                  </text>
                </>
              );
            })()}
          </g>
        )}
      </svg>
    </div>
  );
}
