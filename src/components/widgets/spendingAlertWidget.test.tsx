import { render, screen } from '@testing-library/react';
import { SpendingAlertProps, Transaction } from 'interfaces/dashboard';
import SpendingAlertWidget from './spendingAlertWidget';

const createTransaction = (
  overrides: Partial<Transaction>
): Transaction => ({
  _id: Math.floor(Math.random() * 10000),
  tipo: 'saida',
  valor: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

describe('SpendingAlertWidget', () => {
  const setup = (props: SpendingAlertProps) => {
    render(<SpendingAlertWidget {...props} />);
  };

  it('renderiza limite e total gasto corretamente com gastos dentro do limite', () => {
    const props: SpendingAlertProps = {
      limit: 1000,
      transactions: [
        createTransaction({ tipo: 'saida', valor: 200 }),
        createTransaction({ tipo: 'saida', valor: 300 }),
        createTransaction({ tipo: 'entrada', valor: 100 }),
      ],
    };

    setup(props);

    expect(screen.getByText('Alerta de Gastos')).toBeInTheDocument();
    expect(screen.getByText('Limite mensal: R$ 1000')).toBeInTheDocument();
    expect(screen.getByText('Total gasto: R$ 500')).toBeInTheDocument();
    expect(
      screen.getByText('Gastos dentro do limite')
    ).toBeInTheDocument();
  });

  it('exibe alerta quando os gastos ultrapassam o limite', () => {
    const props: SpendingAlertProps = {
      limit: 500,
      transactions: [
        createTransaction({ tipo: 'saida', valor: 400 }),
        createTransaction({ tipo: 'saida', valor: 200 }),
      ],
    };

    setup(props);

    expect(screen.getByText('Total gasto: R$ 600')).toBeInTheDocument();
    expect(
      screen.getByText('⚠ Você ultrapassou o limite!')
    ).toBeInTheDocument();
  });

  it('mostra total gasto como 0 quando não há transações', () => {
    const props: SpendingAlertProps = {
      limit: 1000,
      transactions: [],
    };

    setup(props);

    expect(screen.getByText('Total gasto: R$ 0')).toBeInTheDocument();
    expect(
      screen.getByText('Gastos dentro do limite')
    ).toBeInTheDocument();
  });
});
