/** Formata data AAAA-MM-DD para exibição local (pt-BR). */
export function formatDueDate(iso: string | null | undefined): string {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
