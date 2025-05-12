import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import CardListExtract from "./card-list-extract";
import { Transaction } from "../../../interfaces/dashboard";

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
      _id: 1,
      tipo: "Receita",
      createdAt: "2025-05-05T17:41:58.092+00:00",
      updatedAt: "2025-05-05T17:41:58.092+00:00",
      valor: 1200,
    },
    {
      _id: 2,
      tipo: "Despesa",
      createdAt: "2025-05-06T17:41:58.092+00:00",
      updatedAt: "2025-05-06T17:41:58.092+00:00",
      valor: 200,
    },
  ];

  it("renderiza as transações em modo somente leitura por padrão", () => {
    const { getByText } = render(
      <CardListExtract transactions={mockTransactions} />
    );

    expect(getByText("Receita")).toBeInTheDocument();
    expect(getByText("Despesa")).toBeInTheDocument();
    expect(getByText("05/05/2025")).toBeInTheDocument(); // Data formatada no formato BR
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

    const inputs = getAllByDisplayValue("Receita");
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
      expect.objectContaining({ tipo: "Nova Receita" }),
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

    const inputs = getAllByDisplayValue("Receita");
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

    expect(getByText("Receita")).toBeInTheDocument(); // Verifica que a alteração foi descartada
  });
});