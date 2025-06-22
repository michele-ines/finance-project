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

  // Remove os pontos (separadores de milhar)
  const noThousands = cleaned.replace(/\./g, "");

  // Troca a vírgula pelo ponto para parseFloat entender como decimal
  const normalized = noThousands.replace(",", ".");

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

/**
 * Máscara de campo do tipo texto para formatar um valor monetário.
 * Aceita até 9 dígitos inteiros e 2 decimais.
 */
export const maskCurrency = (valor?: string): string => {
  if (!valor) return "";

  // Remove tudo que não for número
  let numeros = valor.replace(/\D/g, "");

  // Limita a 11 dígitos (9 inteiros + 2 decimais)
  numeros = numeros.slice(0, 11);

  const inteiro = numeros.slice(0, -2) || "0"; // pelo menos 1 inteiro
  const decimal = numeros.slice(-2).padStart(2, "0"); // sempre 2 decimais

  const numeroFinal = `${inteiro}.${decimal}`;

  return Number(numeroFinal).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};


export function formatCurrencyToBRL(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
