import { render, screen } from '@testing-library/react';
import SavingsGoalWidget from './savings-goal-widget';
import { SavingsGoalProps, Transaction } from 'interfaces/dashboard';

const createTransaction = (
  overrides: Partial<Transaction>
): Transaction => ({
  _id: Math.floor(Math.random() * 10000),
  tipo: 'entrada',
  valor: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

describe('SavingsGoalWidget', () => {
  const setup = (props: SavingsGoalProps) => {
    render(<SavingsGoalWidget {...props} />);
  };

  it('renderiza a meta e o valor economizado corretamente', () => {
    const props: SavingsGoalProps = {
      goal: 1000,
      transactions: [
        createTransaction({ tipo: 'entrada', valor: 200 }),
        createTransaction({ tipo: 'entrada', valor: 300 }),
        createTransaction({ tipo: 'saida', valor: 100 }),
      ],
    };

    setup(props);

    expect(screen.getByText('Meta de Economia')).toBeInTheDocument();
    expect(screen.getByText('Meta: R$ 1000')).toBeInTheDocument();
    expect(screen.getByText('Economizado: R$ 500')).toBeInTheDocument();
    expect(screen.getByText('Progresso: 50.0%')).toBeInTheDocument();
  });

  it('limita o progresso a 100% quando a meta é ultrapassada', () => {
    const props: SavingsGoalProps = {
      goal: 1000,
      transactions: [
        createTransaction({ tipo: 'entrada', valor: 700 }),
        createTransaction({ tipo: 'entrada', valor: 500 }),
      ],
    };

    setup(props);

    expect(screen.getByText('Economizado: R$ 1200')).toBeInTheDocument();
    expect(
      screen.getByText('🎉 Parabéns! Você atingiu sua meta!')
    ).toBeInTheDocument();
  });

  it('mostra progresso 0% quando não há transações', () => {
    const props: SavingsGoalProps = {
      goal: 1000,
      transactions: [],
    };

    setup(props);

    expect(screen.getByText('Economizado: R$ 0')).toBeInTheDocument();
    expect(screen.getByText('Progresso: 0.0%')).toBeInTheDocument();
  });

  it('renderiza a barra de progresso com o valor correto', () => {
    const props: SavingsGoalProps = {
      goal: 500,
      transactions: [createTransaction({ tipo: 'entrada', valor: 250 })],
    };

    setup(props);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
  });
});
