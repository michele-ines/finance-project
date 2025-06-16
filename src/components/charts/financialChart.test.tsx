import { render, screen } from "@testing-library/react";
import FinancialChart from "../../components/charts/financialChart";

jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-container">{children}</div>
  ),
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <svg data-testid="line-chart">{children}</svg>
  ),
  CartesianGrid: () => <g data-testid="grid" />,
  XAxis: () => <g data-testid="x-axis"><text>Jan</text><text>Fev</text></g>,
  YAxis: () => <g data-testid="y-axis" />,
  Tooltip: () => <g data-testid="tooltip" />,
  Line: () => <path data-testid="line" />,
}));

describe("FinancialChart", () => {
  it("deve renderizar o gráfico com todos os elementos esperados", () => {
    render(<FinancialChart />);

    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    expect(screen.getByTestId("x-axis")).toBeInTheDocument();
    expect(screen.getByTestId("y-axis")).toBeInTheDocument();
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
    expect(screen.getByTestId("line")).toBeInTheDocument();

    expect(screen.getByText(/Jan/i)).toBeInTheDocument();
    expect(screen.getByText(/Fev/i)).toBeInTheDocument();
  });
});
