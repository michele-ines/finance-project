import { render, screen } from "@testing-library/react";
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
jest.mock("../ui/index.ts", () => ({
  Box: ({ children, className }: BoxProps) => (
    <div className={className}>{children}</div>
  ),
  PieChart: ({ series }: PieChartProps) => (
    <div data-testid="pie-chart">
      {series[0].data.map((item) => (
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

  it("deve renderizar o título de investimentos", () => {
    render(<CadInvestments {...defaultProps} />);
    expect(screen.getByText("Investimentos")).toBeInTheDocument();
  });

  it("deve renderizar o total formatado corretamente", () => {
    render(<CadInvestments {...defaultProps} />);
    expect(
      screen.getByText((content, element) => {
        const hasLabel = content.includes("Total");
        const hasValue = element?.textContent?.includes("R$ 50.000,00") ?? false;
        return hasLabel && hasValue;
      })
    ).toBeInTheDocument();
  });

  it("deve renderizar todos os investimentos com rótulo e valor", () => {
    render(<CadInvestments {...defaultProps} />);
    mockInvestments.forEach(({ label, value }) => {
      expect(screen.getByText(label)).toBeInTheDocument();
      expect(
        screen.getByText((_, element) => {
          return (
            element?.textContent === value.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })
          );
        })
      ).toBeInTheDocument();
    });
  });

  it("deve renderizar o título de estatísticas", () => {
    render(<CadInvestments {...defaultProps} />);
    expect(screen.getByText("Estatísticas")).toBeInTheDocument();
  });

  it("deve renderizar o gráfico de pizza com dados corretos", () => {
    render(<CadInvestments {...defaultProps} />);
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
    expect(screen.getByText("Fundos de investimento: 5")).toBeInTheDocument();
    expect(screen.getByText("Tesouro Direto: 10")).toBeInTheDocument();
    expect(screen.getByText("Previdência Privada: 15")).toBeInTheDocument();
    expect(screen.getByText("Bolsa de Valores: 20")).toBeInTheDocument();
  });
});
