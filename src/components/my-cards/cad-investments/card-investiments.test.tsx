import { render, screen, fireEvent } from "@testing-library/react";
import React, { ReactNode } from "react";
import CadInvestments from "./cad-investments";

// Tipos mockados conforme estrutura esperada do projeto
type Balance = {
  value: number;
  account: string;
};

type Investment = {
  id: number;
  label: string;
  value: number;
};

type CadInvestmentsProps = {
  balance: Balance;
  investments: Investment[];
};

// Mock dos dados
const mockBalance: Balance = {
  value: 50000,
  account: "001",
};

const mockInvestments: Investment[] = [
  { id: 1, label: "Tesouro Direto", value: 10000 },
  { id: 2, label: "Bolsa de Valores", value: 15000 },
  { id: 3, label: "Fundos de investimento", value: 25000 },
];

// Tipagens dos componentes mockados
type BoxProps = {
  children: ReactNode;
  className?: string;
  role?: string;
  tabIndex?: number;
  "aria-label"?: string;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
};

type PieChartProps = {
  series: Array<{
    data: Array<{ value: number; label: string }>;
    innerRadius: number;
    cornerRadius: number;
  }>;
  width: number;
  height: number;
};

// Mock dos componentes do UI
jest.mock("../../ui/index.ts", () => ({
  Box: ({
    children,
    className,
    role,
    tabIndex,
    "aria-label": ariaLabel,
    onKeyDown,
  }: BoxProps) => (
    <div
      className={className}
      role={role}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  ),
  PieChart: ({ series = [] }: PieChartProps) => (
    <div data-testid="pie-chart">
      {(series[0]?.data ?? []).map((item) => (
        <div key={item.label}>
          {item.label}: {item.value}
        </div>
      ))}
    </div>
  ),
  CadInvestmentsStyles: {
    cardTransacao: "cardTransacao",
    investmentTitle: "investmentTitle",
    totalLabel: "totalLabel",
    investmentBox: "investmentBox",
    investmentBoxType: "investmentBoxType",
    investmentBoxTitle: "investmentBoxTitle",
    investmentBoxValue: "investmentBoxValue",
    statsTitle: "statsTitle",
    investmentBoxStats: "investmentBoxStats",
  },
}));

describe("CadInvestments", () => {
  const defaultProps: CadInvestmentsProps = {
    balance: mockBalance,
    investments: mockInvestments,
  };

  beforeEach(() => {
    render(<CadInvestments {...defaultProps} />);
  });

  it("deve renderizar o título de investimentos", () => {
    expect(screen.getByRole("heading", { name: "Investimentos" })).toBeInTheDocument();
  });

  it("deve renderizar o total formatado corretamente", () => {
    // matcher unificado para capturar "Total: R$ 50.000,00"
    expect(
      screen.getByText(/Total:\s*R\$\s*50\.000,00/)
    ).toBeInTheDocument();
  });

  it("deve renderizar todos os investimentos com role=button, tabIndex e aria-label corretos", () => {
    mockInvestments.forEach(({ label, value }) => {
      const formatted = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
      const investmentButton = screen.getByRole("button", {
        name: `${label}, valor ${formatted}`,
      });
      expect(investmentButton).toBeInTheDocument();
      expect(investmentButton).toHaveAttribute("tabIndex", "0");
    });
  });

  it("deve permitir ativar via Enter e Space usando keyboard", () => {
    const first = mockInvestments[0]!;
    const formatted = first.value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    const investmentButton = screen.getByRole("button", {
      name: `${first.label}, valor ${formatted}`,
    });
    const clickMock = jest.fn();
    investmentButton.onclick = clickMock;

    fireEvent.keyDown(investmentButton, { key: "Enter", code: "Enter" });
    expect(clickMock).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(investmentButton, { key: " ", code: "Space" });
    expect(clickMock).toHaveBeenCalledTimes(2);
  });

  it("deve renderizar o título de estatísticas", () => {
    expect(screen.getByRole("heading", { name: "Estatísticas" })).toBeInTheDocument();
  });

  it("deve renderizar o PieChart dentro de um elemento com role=img e aria-label adequado", () => {
    const chart = screen.getByRole("img", {
      name: "Gráfico de pizza de investimentos",
    });
    expect(chart).toBeInTheDocument();
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });

  it("deve renderizar os dados corretos no gráfico de pizza", () => {
    expect(screen.getByText("Fundos de investimento: 5")).toBeInTheDocument();
    expect(screen.getByText("Tesouro Direto: 10")).toBeInTheDocument();
    expect(screen.getByText("Previdência Privada: 15")).toBeInTheDocument();
    expect(screen.getByText("Bolsa de Valores: 20")).toBeInTheDocument();
  });
});
