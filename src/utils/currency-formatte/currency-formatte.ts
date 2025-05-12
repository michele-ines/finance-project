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

/**
 * Formata o tipo de transação – ex.: "deposito" -> "Depósito"
 * Se o tipo não estiver mapeado, apenas coloca a primeira letra maiúscula.
 */
export const formatTipo = (raw: string): string => {
  const map: Record<string, string> = {
    deposito: "Depósito",
    retirada: "Retirada",
    transferencia: "Transferência",
    pagamento: "Pagamento",
  };

  const lower = raw.toLowerCase();
  return map[lower] ?? lower.charAt(0).toUpperCase() + lower.slice(1);
};
