export interface PricePoint {
  x: number;
  y: number;
  recordedAt: string | null;
}

// Le prix reste constant jusqu'au prochain changement connu : on construit un
// "escalier" (palier horizontal puis saut vertical), pas une interpolation
// linéaire entre deux valeurs qui suggérerait une évolution progressive.
export function buildPriceSeries(
  events: { price: number; recordedAt: string }[],
  windowEnd: Date
): PricePoint[] {
  const sorted = [...events].sort(
    (a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
  );
  if (sorted.length === 0) return [];

  const points: PricePoint[] = [];
  let lastPrice: number | null = null;

  for (const event of sorted) {
    const t = new Date(event.recordedAt).getTime();
    if (lastPrice !== null) {
      points.push({ x: t, y: lastPrice, recordedAt: null });
    }
    points.push({ x: t, y: event.price, recordedAt: event.recordedAt });
    lastPrice = event.price;
  }

  points.push({ x: windowEnd.getTime(), y: lastPrice!, recordedAt: null });

  return points;
}
