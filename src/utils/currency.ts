/**
 * Formata um número para BRL – ex.: 500  -> "R$ 500,00"
 */
export const formatBRL = (value: number): string =>
  `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

/**
 * Converte string em formato BRL para número – ex.: "R$ 500,00" -> 500
 */
export const parseBRL = (input: string): number =>
  parseFloat(input.replace(/[^\d,-]/g, "").replace(",", ".")) || 0;
