import { formatDateBR, getMonthNameBR, parseDateBR } from "./date-formatte";

describe('formatDateBR', () => {
  it('deve formatar ISO para DD/MM/YYYY', () => {
    expect(formatDateBR('2025-05-05T17:46:54.337Z')).toBe('05/05/2025');
  });

  it('deve devolver "Invalid Date" para string inválida', () => {
    expect(formatDateBR('data-invalida')).toBe('Invalid Date');
  });
});

describe('getMonthNameBR', () => {
  it('mapeia corretamente todos os 12 meses de Janeiro a Dezembro', () => {
    const names = [
      'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
      'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
    ];
    names.forEach((name, idx) => {
      // criar uma data no dia 10 de cada mês às 12:00Z para evitar DST
      const month = String(idx + 1).padStart(2, '0');
      const iso = `2025-${month}-10T12:00:00.000Z`;
      expect(getMonthNameBR(iso)).toBe(name);
    });
  });

  it('retorna "Invalid Date" para string inválida', () => {
    expect(getMonthNameBR('não-é-data')).toBe('Invalid Date');
  });
});

describe('parseDateBR', () => {
  it('converte dd/MM/YYYY para ISO string (data correta, UTC-offset pode variar)', () => {
    const iso = parseDateBR('05/05/2025');
    expect(iso.slice(0,10)).toBe('2025-05-05');
    expect(iso.endsWith(':00:00.000Z')).toBe(true);

    const iso2 = parseDateBR('31/12/1999');
    expect(iso2.slice(0,10)).toBe('1999-12-31');
    expect(iso2.endsWith(':00:00.000Z')).toBe(true);
  });

  it('lança RangeError para formato diferente de dd/MM/YYYY', () => {
    expect(() => parseDateBR('05-05-2025')).toThrow(RangeError);
    expect(() => parseDateBR('data-invalida')).toThrow(RangeError);
  });
});
