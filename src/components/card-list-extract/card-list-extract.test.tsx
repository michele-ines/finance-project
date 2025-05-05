import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import CardListExtract from "./card-list-extract";
import { Transaction } from "../../types/dashboard";

jest.mock("next/font/google", () => ({
  Inter: () => ({
    variable: "--font-geist-sans",
    className: "mocked-inter-font",
  }),
  Roboto_Mono: () => ({
    variable: "--font-roboto-mono",
    className: "mocked-roboto-mono-font",
  }),
}));

describe("CardListExtract", () => {
  const mockTransactions: Transaction[] = [
    {
      id: 1,
      type: "Receita",
      date: "2025-05-01",
      amount: 1200,
      month: "Mai",
    },
    {
      id: 2,
      type: "Despesa",
      date: "2025-05-03",
      amount: -200,
      month: "Mai",
    },
  ];

  it("renderiza as transações em modo somente leitura por padrão", () => {
    const { getByText } = render(
      <CardListExtract transactions={mockTransactions} />
    );

    expect(getByText("Receita")).toBeInTheDocument();
    expect(getByText("Despesa")).toBeInTheDocument();
    expect(getByText("2025-05-01")).toBeInTheDocument();
  });

  it("permite editar, salvar alterações e aciona onSave", () => {
    const handleSave = jest.fn();

    const { getByTestId, getAllByDisplayValue, getByText } = render(
      <CardListExtract transactions={mockTransactions} onSave={handleSave} />
    );

    const editIcon = getByTestId("EditIcon");
    const editBtn = editIcon.closest("button");
    if (editBtn) {
      act(() => {
        fireEvent.click(editBtn);
      });
    }

    const inputs = getAllByDisplayValue(/Receita|Despesa|2025/);
    if (inputs[0]) {
      act(() => {
        fireEvent.change(inputs[0], { target: { value: "Nova Receita" } });
      });
    }

    const saveBtn = getByText(/salvar/i).closest("button");
    if (saveBtn) {
      act(() => {
        fireEvent.click(saveBtn);
      });
    }

    expect(handleSave).toHaveBeenCalledWith([
      expect.objectContaining({ type: "Nova Receita" }),
      expect.any(Object),
    ]);
  });

  it("descarta alterações ao cancelar", () => {
    const { getByTestId, getAllByDisplayValue, getByText } = render(
      <CardListExtract transactions={mockTransactions} />
    );

    const editIcon = getByTestId("EditIcon");
    const editBtn = editIcon.closest("button");
    if (editBtn) {
      act(() => {
        fireEvent.click(editBtn);
      });
    }

    const inputs = getAllByDisplayValue(/Receita|Despesa|2025/);
    if (inputs[0]) {
      act(() => {
        fireEvent.change(inputs[0], { target: { value: "Alterada" } });
      });
    }

    const cancelBtn = getByText(/cancelar/i).closest("button");
    if (cancelBtn) {
      act(() => {
        fireEvent.click(cancelBtn);
      });
    }

    expect(getByText("Receita")).toBeInTheDocument();
  });
});
