// utils/date-formatte/date-formatte.ts

export function getMonthNameBR(dateString: string): string {
  const date = new Date(dateString);
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const monthIndex = date.getMonth();
  if (isNaN(monthIndex)) return "Invalid Date";

  return monthNames[monthIndex];
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
export const parseDateBR = (brDate: string): string => {
  const [day, month, year] = brDate.split("/");
  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
  ).toISOString();
};
