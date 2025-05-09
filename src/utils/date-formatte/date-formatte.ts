export const formatDateBR = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  export const getMonthNameBR = (isoDate: string): string => {
    const date = new Date(isoDate);
    const month = date.toLocaleDateString("pt-BR", { month: "long" });
    return month.charAt(0).toUpperCase() + month.slice(1);
  };