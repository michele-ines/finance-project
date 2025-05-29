import "@testing-library/jest-dom";
import { formatBRL, formatTipo, parseBRL } from "./currency-formatte";

describe("formatBRL", () => {
  it("should format integer to BRL", () => {
    expect(formatBRL(500)).toBe("R$ 500,00");
  });

  it("should format decimal to BRL", () => {
    expect(formatBRL(1234.56)).toBe("R$ 1.234,56");
  });

  it("should format zero to BRL", () => {
    expect(formatBRL(0)).toBe("R$ 0,00");
  });
});

describe("parseBRL", () => {
  it("should parse BRL string with symbol and comma", () => {
    expect(parseBRL("R$ 1234,56")).toBe(1234.56);
  });

  it("should parse BRL string without symbol", () => {
    expect(parseBRL("999999999,99")).toBe(999999999.99);
  });

  it("should parse BRL string with excess decimals", () => {
    expect(parseBRL("123456789,123")).toBeCloseTo(123456789.12, 2);
  });

  it("should parse BRL string with only integers", () => {
    expect(parseBRL("500")).toBe(500);
  });

  it("should parse BRL string with garbage characters", () => {
    expect(parseBRL("R$ abc123,45xyz")).toBe(123.45);
  });

  it("should return 0 for empty string", () => {
    expect(parseBRL("")).toBe(0);
  });
});

describe("formatTipo", () => {
  it('should format "deposito" to "Depósito"', () => {
    expect(formatTipo("deposito")).toBe("Depósito");
  });

  it('should format "retirada" to "Retirada"', () => {
    expect(formatTipo("retirada")).toBe("Retirada");
  });

  it('should format "transferencia" to "Transferência"', () => {
    expect(formatTipo("transferencia")).toBe("Transferência");
  });

  it('should format "pagamento" to "Pagamento"', () => {
    expect(formatTipo("pagamento")).toBe("Pagamento");
  });

  it("should capitalize unknown types", () => {
    expect(formatTipo("custom")).toBe("Custom");
  });

  it("should handle uppercase input", () => {
    expect(formatTipo("DEPOSITO")).toBe("Depósito");
  });

  it("should return empty string if undefined", () => {
    expect(formatTipo(undefined)).toBe("");
  });

  it("should return empty string if empty", () => {
    expect(formatTipo("")).toBe("");
  });
});
