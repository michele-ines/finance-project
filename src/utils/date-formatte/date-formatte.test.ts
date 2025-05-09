import { formatDateBR, getMonthNameBR } from "./date-formatte";

describe("formatDateBR", () => {
  it("should format an ISO date to DD/MM/YYYY format", () => {
    const isoDate = "2025-05-05T17:46:54.337Z";
    const formattedDate = formatDateBR(isoDate);
    expect(formattedDate).toBe("05/05/2025");
  });

  it("should handle invalid dates gracefully", () => {
    const invalidDate = "invalid-date";
    const formattedDate = formatDateBR(invalidDate);
    expect(formattedDate).toBe("Invalid Date");
  });
});

describe("getMonthNameBR", () => {
  it("should return the month name in Portuguese for a valid ISO date", () => {
    const isoDate = "2025-05-05T17:46:54.337Z";
    const monthName = getMonthNameBR(isoDate);
    expect(monthName).toBe("Maio");
  });




});