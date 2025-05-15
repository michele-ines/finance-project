/**
 * Formata um número para BRL – ex.: 500  -> "R$ 500,00"
 */
export const formatBRL = (value: number): string =>
  `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

/**
 * Converte string em formato BRL para número.
 * – Aceita no máx. 9 dígitos inteiros e 2 decimais (999 999 999,99).
 * – Remove qualquer caractere extra que o usuário cole.
 *
 * Exemplos:
 *  "R$ 1.234,56"  -> 1234.56
 *  "999999999,99" -> 999999999.99
 *  "123.456.789,123" (excesso) -> 123456789.12  (trunca para 2 decimais)
 */
export const parseBRL = (input: string): number => {
  // 1. Mantém apenas dígitos, vírgula ou ponto
  const cleaned = input.replace(/[^\d.,]/g, "");

  // 2. Captura até 9 inteiros e até 2 decimais
  //    groups: [0] match completo, [1] inteiros, [2] decimais (opcional)
  const [, integers = "", decimals = ""] =
    cleaned.match(/^(\d{0,9})(?:[.,](\d{0,2}))?/) ?? [];

  // 3. Normaliza para "1234.56" (ponto antes dos decimais)
  const normalized = decimals ? `${integers}.${decimals}` : integers;

  return parseFloat(normalized) || 0;
};

/**
 * Formata o tipo de transação – ex.: "deposito" -> "Depósito"
 * Se o tipo não estiver mapeado, apenas coloca a primeira letra maiúscula.
 */
export const formatTipo = (raw?: string): string => {
  if (!raw) return ""; // ou "Desconhecido", se preferir um fallback visível

  const map: Record<string, string> = {
    deposito: "Depósito",
    retirada: "Retirada",
    transferencia: "Transferência",
    pagamento: "Pagamento",
  };

  const lower = raw.toLowerCase();
  return map[lower] ?? lower.charAt(0).toUpperCase() + lower.slice(1);
};
