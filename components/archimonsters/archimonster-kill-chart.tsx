"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSettings } from "@/hooks/use-settings";
import { useKillHistory } from "@/hooks/use-kills";
import type { KillRange } from "@/lib/api/types";
import { buildKillSeries } from "@/lib/kill-chart";

const RANGE_MS: Record<KillRange, number> = {
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
};

const VIEWBOX_WIDTH = 820;
const VIEWBOX_HEIGHT = 380;
const PADDING = { top: 20, right: 20, bottom: 32, left: 40 };
const INNER_WIDTH = VIEWBOX_WIDTH - PADDING.left - PADDING.right;
const INNER_HEIGHT = VIEWBOX_HEIGHT - PADDING.top - PADDING.bottom;

function niceStep(max: number): number {
  if (max <= 10) return 1;
  return Math.ceil(max / 8);
}

function formatXTick(date: Date, range: KillRange): string {
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

interface ArchimonsterKillChartProps {
  archimonsterId: string;
  serverId: string;
}

export function ArchimonsterKillChart({ archimonsterId, serverId }: ArchimonsterKillChartProps) {
  const [range, setRange] = React.useState<KillRange>("24h");
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const { data: events, isLoading: eventsLoading } = useKillHistory(
    serverId,
    archimonsterId,
    range
  );
  const { data: settings } = useAppSettings();
  const maxKillsPerDay = settings?.maxKillsPerDay ?? 7;

  const windowEnd = new Date();
  const windowStart = new Date(windowEnd.getTime() - RANGE_MS[range]);

  const points = React.useMemo(
    () => buildKillSeries(events ?? [], windowStart, windowEnd),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [events, range]
  );

  const dots = points.filter((point) => point.killedAt !== null);
  const yMax = Math.max(maxKillsPerDay, ...points.map((point) => point.y));
  const step = niceStep(yMax);
  const yTicks = Array.from({ length: Math.floor(yMax / step) + 1 }, (_, i) => i * step);

  const scaleX = (t: number) =>
    PADDING.left + ((t - windowStart.getTime()) / (windowEnd.getTime() - windowStart.getTime())) * INNER_WIDTH;
  const scaleY = (v: number) => PADDING.top + INNER_HEIGHT - (v / yMax) * INNER_HEIGHT;

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${scaleX(p.x)},${scaleY(p.y)}`).join(" ");
  const areaPath = `${linePath} L${scaleX(windowEnd.getTime())},${scaleY(0)} L${scaleX(windowStart.getTime())},${scaleY(0)} Z`;

  const xTickCount = 4;
  const xTicks = Array.from({ length: xTickCount + 1 }, (_, i) => {
    const t = windowStart.getTime() + (i / xTickCount) * (windowEnd.getTime() - windowStart.getTime());
    return { t, label: formatXTick(new Date(t), range) };
  });

  const hovered = hoveredIndex !== null ? dots[hoveredIndex] : null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Historique des kills</span>
        <div className="flex items-center gap-1 rounded-2xl bg-muted p-1">
          <Button
            type="button"
            size="xs"
            variant={range === "24h" ? "default" : "ghost"}
            onClick={() => setRange("24h")}
          >
            24 heures
          </Button>
          <Button
            type="button"
            size="xs"
            variant={range === "7d" ? "default" : "ghost"}
            onClick={() => setRange("7d")}
          >
            7 jours
          </Button>
        </div>
      </div>

      {eventsLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <svg
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          className="w-full text-muted-foreground"
          role="img"
          aria-label={`Nombre de kills par jour sur ${range === "24h" ? "les dernières 24 heures" : "les 7 derniers jours"}`}
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
              <text x={PADDING.left - 4} y={scaleY(tick)} dy="0.32em" textAnchor="end" fontSize={13} fill="currentColor">
                {tick}
              </text>
            </g>
          ))}

          {maxKillsPerDay <= yMax && (
            <line
              x1={PADDING.left}
              x2={VIEWBOX_WIDTH - PADDING.right}
              y1={scaleY(maxKillsPerDay)}
              y2={scaleY(maxKillsPerDay)}
              stroke="var(--muted-foreground)"
              strokeWidth={1}
              strokeDasharray="3 2"
            />
          )}

          {xTicks.map(({ t, label }) => (
            <text
              key={t}
              x={scaleX(t)}
              y={VIEWBOX_HEIGHT - 4}
              textAnchor="middle"
              fontSize={13}
              fill="currentColor"
            >
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
              y2={scaleY(0)}
              stroke="var(--border)"
              strokeWidth={1}
              strokeDasharray="2 2"
            />
          )}

          {dots.map((dot, index) => (
            <g
              key={dot.killedAt}
              tabIndex={0}
              role="button"
              aria-label={`Tué le ${formatPointLabel(dot.killedAt!)}`}
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
                const boxWidth = 130;
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
                    <text
                      x={px + boxWidth / 2}
                      y={py + boxHeight / 2}
                      dy="0.32em"
                      textAnchor="middle"
                      fontSize={13}
                      fill="var(--popover-foreground)"
                    >
                      {formatPointLabel(hovered.killedAt!)}
                    </text>
                  </>
                );
              })()}
            </g>
          )}
        </svg>
      )}

      {!eventsLoading && dots.length === 0 && (
        <p className="text-center text-xs text-muted-foreground">
          Aucun kill enregistré sur cette période.
        </p>
      )}
    </div>
  );
}
