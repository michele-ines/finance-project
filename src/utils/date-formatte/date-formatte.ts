export function getMonthNameBR(dateString: string): string {
  const date = new Date(dateString);
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const monthIndex = date.getMonth();
  if (isNaN(monthIndex)) return "Invalid Date";

    return monthNames[monthIndex] ?? "Invalid Date";

}

export const formatDateBR = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/** Recebe "dd/MM/yyyy" e devolve ISO string (“2025-05-10T00:00:00.000Z”) */
export function parseDateBR(dateBR: string): string {
  // Aceita apenas datas no formato dd/MM/yyyy
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dateBR);
  if (!match) throw new RangeError("Formato de data inválido (esperado dd/MM/yyyy)");

  const [, dd, mm, yyyy] = match;
  // Cria a data em UTC (mês começa do zero)
  const date = new Date(Date.UTC(Number(yyyy), Number(mm) - 1, Number(dd)));
  if (isNaN(date.getTime())) throw new RangeError("Data inválida");

  return date.toISOString();
}
