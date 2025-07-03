import { render, screen } from '@testing-library/react';
import SavingsGoalWidget from './savings-goal-widget';
import { SavingsGoalProps, Transaction } from 'interfaces/dashboard';

/* Factory de transação para facilitar os cenários */
const createTransaction = (overrides: Partial<Transaction>): Transaction => ({
  _id: Math.floor(Math.random() * 10_000),
  tipo: 'entrada',
  valor: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

describe('SavingsGoalWidget', () => {
  const setup = (props: SavingsGoalProps) => render(<SavingsGoalWidget {...props} />);

  it('renderiza a meta e o valor economizado corretamente', () => {
    const props: SavingsGoalProps = {
      goal: 1000,
      transactions: [
        createTransaction({ tipo: 'entrada', valor: 200 }),
        createTransaction({ tipo: 'entrada', valor: 300 }),
        createTransaction({ tipo: 'saida',  valor: 100 }),
      ],
    };

    setup(props);

    /* Título segue igual */
    expect(screen.getByRole('heading', { name: /meta de economia/i })).toBeInTheDocument();

    /* Agora usamos os rótulos de acessibilidade */
    expect(screen.getByLabelText(/meta de r\$ 1000/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/economizado r\$ 500/i)).toBeInTheDocument();

    /* Texto de progresso não mudou */
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

    expect(screen.getByLabelText(/economizado r\$ 1200/i)).toBeInTheDocument();
    expect(screen.getByText(/parabéns! você atingiu sua meta!/i)).toBeInTheDocument();

    /* O emoji agora tem papel e nome acessível */
    expect(screen.getByRole('img', { name: /festa/i })).toBeInTheDocument();
  });

  it('mostra progresso 0% quando não há transações', () => {
    const props: SavingsGoalProps = {
      goal: 1000,
      transactions: [],
    };

    setup(props);

    expect(screen.getByLabelText(/economizado r\$ 0/i)).toBeInTheDocument();
    expect(screen.getByText('Progresso: 0.0%')).toBeInTheDocument();
  });

  it('renderiza a barra de progresso com atributos ARIA corretos', () => {
    const props: SavingsGoalProps = {
      goal: 500,
      transactions: [createTransaction({ tipo: 'entrada', valor: 250 })],
    };

    setup(props);

    const progressBar = screen.getByRole('progressbar', {
      name: /progresso da meta de economia/i,
    });

    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });
});
