export interface KillChartPoint {
  x: number;
  y: number;
  killedAt: string | null;
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

// Construit une série "en dents de scie" : le compteur grimpe de 1 à chaque
// kill et retombe à 0 à minuit (heure locale), pour visualiser combien de
// fois un archimonstre a été tué chaque jour sur la fenêtre affichée. Les
// paliers de minuit sont représentés par deux points à la même abscisse
// (valeur avant reset, puis 0) pour dessiner une chute verticale.
export function buildKillSeries(
  events: { killedAt: string }[],
  windowStart: Date,
  windowEnd: Date
): KillChartPoint[] {
  const sorted = [...events].sort(
    (a, b) => new Date(a.killedAt).getTime() - new Date(b.killedAt).getTime()
  );

  const points: KillChartPoint[] = [{ x: windowStart.getTime(), y: 0, killedAt: null }];
  let count = 0;
  let nextMidnight = addDays(startOfDay(windowStart), 1);

  for (const event of sorted) {
    const killedAt = new Date(event.killedAt);

    while (nextMidnight.getTime() <= killedAt.getTime()) {
      points.push({ x: nextMidnight.getTime(), y: count, killedAt: null });
      points.push({ x: nextMidnight.getTime(), y: 0, killedAt: null });
      count = 0;
      nextMidnight = addDays(nextMidnight, 1);
    }

    count += 1;
    points.push({ x: killedAt.getTime(), y: count, killedAt: event.killedAt });
  }

  points.push({ x: windowEnd.getTime(), y: count, killedAt: null });
  return points;
}
