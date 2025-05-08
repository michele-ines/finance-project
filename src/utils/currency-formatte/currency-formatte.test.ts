import { formatBRL, parseBRL } from "./currency-formatte";

describe('formatBRL', () => {
  it('deve formatar 500 como R$ 500,00', () => {
    expect(formatBRL(500)).toBe('R$ 500,00');
  });

  it('deve formatar 1234.56 como R$ 1.234,56', () => {
    expect(formatBRL(1234.56)).toBe('R$ 1.234,56');
  });

  it('deve formatar 0 como R$ 0,00', () => {
    expect(formatBRL(0)).toBe('R$ 0,00');
  });
});

describe('parseBRL', () => {
  it('deve converter "R$ 500,00" para 500', () => {
    expect(parseBRL('R$ 500,00')).toBe(500);
  });

  it('deve converter "R$ 1.234,56" para 1234.56', () => {
    expect(parseBRL('R$ 1.234,56')).toBe(1234.56);
  });

  it('deve retornar 0 se input for inválido', () => {
    expect(parseBRL('')).toBe(0);
    expect(parseBRL('abc')).toBe(0);
  });
});
