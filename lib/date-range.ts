export function formatDateInput(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

// Les <input type="date"> ne donnent qu'une date sans heure : on l'étend aux
// bornes réelles du jour (heure locale) pour interroger l'API.
export function startOfDayISO(dateInput: string): string {
  return new Date(`${dateInput}T00:00:00`).toISOString();
}

export function endOfDayISO(dateInput: string): string {
  return new Date(`${dateInput}T23:59:59.999`).toISOString();
}

export function defaultDateRange(days: number): { from: string; to: string } {
  const to = new Date();
  const from = new Date(to);
  from.setDate(from.getDate() - (days - 1));
  return { from: formatDateInput(from), to: formatDateInput(to) };
}
