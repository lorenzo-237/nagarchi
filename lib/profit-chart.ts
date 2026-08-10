export interface ProfitBar {
  dateKey: string;
  label: string;
  total: number;
}

function localDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

// Un total par jour (heure locale) sur les `days` derniers jours, tous les
// jours présents même sans vente (barre à 0) pour ne pas casser l'échelle.
export function buildDailyTotals(
  sales: { amount: number; soldAt: string }[],
  days: number
): ProfitBar[] {
  const order: string[] = [];
  const buckets = new Map<string, { total: number; label: string }>();
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(now);
    day.setDate(day.getDate() - i);
    const key = localDateKey(day);
    order.push(key);
    buckets.set(key, {
      total: 0,
      label: day.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }),
    });
  }

  for (const sale of sales) {
    const key = localDateKey(new Date(sale.soldAt));
    const bucket = buckets.get(key);
    if (bucket) bucket.total += sale.amount;
  }

  return order.map((key) => ({ dateKey: key, ...buckets.get(key)! }));
}
