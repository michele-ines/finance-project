import { render, screen } from "@testing-library/react";
import SpendingAlertWidget from "./spending-alert-widget";
import {
  SpendingAlertProps,
  Transaction,
} from "interfaces/dashboard";

/* utilitário para criar transações */
const createTransaction = (overrides: Partial<Transaction>): Transaction => ({
  _id: Math.floor(Math.random() * 10_000),
  tipo: "saida",
  valor: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

describe("SpendingAlertWidget", () => {
  const setup = (props: SpendingAlertProps) =>
    render(<SpendingAlertWidget {...props} />);

  it("renderiza limite e total gasto corretamente (dentro do limite)", () => {
    const props: SpendingAlertProps = {
      limit: 1000,
      transactions: [
        createTransaction({ valor: 200 }),
        createTransaction({ valor: 300 }),
        createTransaction({ tipo: "entrada", valor: 100 }), // ignorada
      ],
    };

    setup(props);

    /* título semântico */
    expect(
      screen.getByRole("heading", { name: /alerta de gastos/i })
    ).toBeInTheDocument();

    /* rótulos acessíveis */
    expect(screen.getByLabelText(/limite de r\$ 1000/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/total gasto r\$ 500/i)).toBeInTheDocument();

    /* mensagem neutra */
    expect(
      screen.getByText(/gastos dentro do limite/i)
    ).toBeInTheDocument();
  });

  it("exibe alerta quando os gastos ultrapassam o limite", () => {
    const props: SpendingAlertProps = {
      limit: 500,
      transactions: [
        createTransaction({ valor: 400 }),
        createTransaction({ valor: 200 }),
      ],
    };

    setup(props);

    expect(screen.getByLabelText(/total gasto r\$ 600/i)).toBeInTheDocument();

    const alertMsg = screen.getByRole("alert");
    expect(alertMsg).toHaveTextContent(/você ultrapassou o limite!/i);
    /* emoji com descrição */
    expect(screen.getByRole("img", { name: /alerta/i })).toBeInTheDocument();
  });

  it("mostra total gasto 0 quando não há transações", () => {
    const props: SpendingAlertProps = {
      limit: 1000,
      transactions: [],
    };

    setup(props);

    expect(screen.getByLabelText(/total gasto r\$ 0/i)).toBeInTheDocument();
    expect(
      screen.getByText(/gastos dentro do limite/i)
    ).toBeInTheDocument();
  });
});
