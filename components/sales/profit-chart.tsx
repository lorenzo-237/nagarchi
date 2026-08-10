"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { buildDailyTotals } from "@/lib/profit-chart";

const VIEWBOX_WIDTH = 560;
const VIEWBOX_HEIGHT = 200;
const PADDING = { top: 16, right: 16, bottom: 28, left: 52 };
const INNER_WIDTH = VIEWBOX_WIDTH - PADDING.left - PADDING.right;
const INNER_HEIGHT = VIEWBOX_HEIGHT - PADDING.top - PADDING.bottom;
const MAX_BAR_WIDTH = 24;

function niceStep(max: number): number {
  if (max <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(max));
  const normalized = max / magnitude;
  const step = normalized <= 2 ? 0.5 : normalized <= 5 ? 1 : 2;
  return step * magnitude;
}

interface ProfitChartProps {
  sales: { amount: number; soldAt: string }[] | undefined;
  isLoading: boolean;
  days: number;
}

export function ProfitChart({ sales, isLoading, days }: ProfitChartProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const bars = React.useMemo(() => buildDailyTotals(sales ?? [], days), [sales, days]);

  const rawMax = Math.max(1, ...bars.map((bar) => bar.total));
  const step = niceStep(rawMax);
  const yMax = Math.ceil(rawMax / step) * step;
  const yTicks = Array.from({ length: Math.floor(yMax / step) + 1 }, (_, i) => i * step);

  const bandWidth = INNER_WIDTH / bars.length;
  const barWidth = Math.min(MAX_BAR_WIDTH, bandWidth * 0.6);
  const labelStride = Math.max(1, Math.ceil(bars.length / 8));

  const scaleX = (index: number) => PADDING.left + index * bandWidth + (bandWidth - barWidth) / 2;
  const scaleY = (v: number) => PADDING.top + INNER_HEIGHT - (v / yMax) * INNER_HEIGHT;

  const hovered = hoveredIndex !== null ? bars[hoveredIndex] : null;

  if (isLoading) return <Skeleton className="h-52 w-full" />;

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      className="w-full text-muted-foreground"
      role="img"
      aria-label={`Bénéfices par jour sur les ${days} derniers jours`}
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
          <text x={PADDING.left - 6} y={scaleY(tick)} dy="0.32em" textAnchor="end" fontSize={10} fill="currentColor">
            {tick.toLocaleString("fr-FR")}
          </text>
        </g>
      ))}

      {bars.map((bar, index) => {
        const height = (bar.total / yMax) * INNER_HEIGHT;
        const x = scaleX(index);
        const showLabel = index === 0 || index === bars.length - 1 || index % labelStride === 0;

        return (
          <g key={bar.dateKey}>
            <rect
              x={x}
              y={bar.total > 0 ? scaleY(bar.total) : scaleY(0) - 1}
              width={barWidth}
              height={bar.total > 0 ? height : 1}
              rx={4}
              fill="var(--primary)"
              opacity={bar.total > 0 ? 1 : 0.15}
              onPointerEnter={() => setHoveredIndex(index)}
              onPointerLeave={() => setHoveredIndex((current) => (current === index ? null : current))}
              className="cursor-pointer"
            />
            {showLabel && (
              <text x={x + barWidth / 2} y={VIEWBOX_HEIGHT - 8} textAnchor="middle" fontSize={9} fill="currentColor">
                {bar.label}
              </text>
            )}
          </g>
        );
      })}

      {hovered && (
        <g>
          {(() => {
            const index = hoveredIndex!;
            const boxWidth = 96;
            const boxHeight = 24;
            const px = Math.min(
              Math.max(scaleX(index) + barWidth / 2 - boxWidth / 2, PADDING.left),
              VIEWBOX_WIDTH - PADDING.right - boxWidth
            );
            const py = Math.max(scaleY(hovered.total) - boxHeight - 8, PADDING.top);
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
                <text x={px + boxWidth / 2} y={py + boxHeight / 2} dy="0.32em" textAnchor="middle" fontSize={11} fill="var(--popover-foreground)">
                  {hovered.label} · {hovered.total.toLocaleString("fr-FR")} K
                </text>
              </>
            );
          })()}
        </g>
      )}
    </svg>
  );
}
