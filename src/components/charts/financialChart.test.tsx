import { render, screen } from "@testing-library/react";
import FinancialChart from "../../components/charts/financialChart";

jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-container">{children}</div>
  ),
  LineChart: ({
    children,
    ...rest
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <svg data-testid="line-chart" {...rest}>
      {children}
    </svg>
  ),
  CartesianGrid: () => <g data-testid="grid" />,
  XAxis: () => (
    <g data-testid="x-axis">
      <text>Jan</text>
      <text>Fev</text>
    </g>
  ),
  YAxis: () => <g data-testid="y-axis" />,
  Tooltip: () => <g data-testid="tooltip" />,
  Line: () => <path data-testid="line" />,
}));

describe("FinancialChart", () => {
  it("renderiza o gráfico e mantém atributos de acessibilidade", () => {
    render(<FinancialChart />);

    /* estrutura básica */
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    expect(screen.getByTestId("x-axis")).toBeInTheDocument();
    expect(screen.getByTestId("y-axis")).toBeInTheDocument();
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
    expect(screen.getByTestId("line")).toBeInTheDocument();

    /* meses (uso regex exata para evitar colisão com 'Janeiro') */
    expect(screen.getByText(/^Jan$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Fev$/i)).toBeInTheDocument();

    /* acessibilidade */
    expect(
      screen.getByRole("region", {
        name: /gráfico financeiro: valores mensais de janeiro a junho/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("img", {
        name: /gráfico de linha mostrando a variação de valores/i,
      })
    ).toBeInTheDocument();
  });
});
