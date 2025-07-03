import React from 'react';
import { render, screen } from '@testing-library/react';
import type { RootState } from 'store/store';
import * as ReactRedux from 'react-redux';

/* ------------------------------------------------------------------ */
/* Helper para criar mocks com displayName                            */
/* ------------------------------------------------------------------ */
const createMockComponent = (testId: string, name: string): React.FC =>
  Object.assign(() => <div data-testid={testId} />, { displayName: name });

/* ------------------------------------------------------------------ */
/* Mocks dos slices e do store (virtuais)                             */
/* ------------------------------------------------------------------ */
jest.mock(
  'store/slices/transactionsSlice',
  () => ({
    __esModule: true,
    fetchTransactions: jest.fn(() => ({ type: 'transactions/fetch' })),
    createNewTransaction: jest.fn(() => ({ type: 'transactions/create' })),
    saveTransactions: jest.fn(() => ({ type: 'transactions/save' })),
    deleteTransactions: jest.fn(() => ({ type: 'transactions/delete' })),
  }),
  { virtual: true },
);

jest.mock(
  'store/slices/balanceSlice',
  () => ({
    __esModule: true,
    fetchBalance: jest.fn(() => ({ type: 'balance/fetch' })),
  }),
  { virtual: true },
);

jest.mock(
  'store/store',
  () => ({
    __esModule: true,
    AppDispatch: () => undefined,
    RootState: {},
  }),
  { virtual: true },
);

/* ------------------------------------------------------------------ */
/* Mock de react-redux – tipado, sem any                               */
/* ------------------------------------------------------------------ */
jest.mock('react-redux', () => {
  const actual = jest.requireActual<typeof ReactRedux>('react-redux');

  const mockState: RootState = {
    transactions: {
      items: [],
      status: 'idle',
      hasMore: false,
      currentPage: 0,
      total: 0,
      creationStatus: 'idle',
      error: null,
    },
    balance: {
      value: 0,
      status: 'idle',
      error: null,
    },
  };

  return {
    ...actual,
    useDispatch: () => jest.fn(),
    useSelector: <T,>(sel: (s: RootState) => T): T => sel(mockState),
  };
});

/* ------------------------------------------------------------------ */
/* Mocks visuais para componentes pesados                             */
/* ------------------------------------------------------------------ */
jest.mock(
  'components/my-cards/card-balance/card-balance',
  () => createMockComponent('card-balance', 'CardBalanceMock'),
  { virtual: true },
);
jest.mock(
  'components/my-cards/card-list-extract/card-list-extract',
  () => createMockComponent('card-list', 'CardListExtractMock'),
  { virtual: true },
);
jest.mock(
  'components/my-cards/card-new-transaction/card-new-transaction',
  () => createMockComponent('card-new', 'CardNewTransactionMock'),
  { virtual: true },
);
jest.mock(
  'components/widgets/savings-goal-widget',
  () => createMockComponent('savings-widget', 'SavingsGoalWidgetMock'),
  { virtual: true },
);
jest.mock(
  'components/widgets/spending-alert-widget',
  () => createMockComponent('alert-widget', 'SpendingAlertWidgetMock'),
  { virtual: true },
);

/* ------------------------------------------------------------------ */
/* Hook de dados                                                      */
/* ------------------------------------------------------------------ */
jest.mock('../../hooks/use-dashboard-data', () => ({
  useDashboardData: jest.fn(),
}));

/* ------------------------------------------------------------------ */
/* Mock do JSON de dados do dashboard                                 */
/* ------------------------------------------------------------------ */
jest.mock(
  'mocks/dashboard-data.json',
  () => ({
    __esModule: true,
    default: {
      user: { name: 'Usuário Teste' },
      balance: { value: 0 },
    },
  }),
  { virtual: true },
);

/* ------------------------------------------------------------------ */
/* IMPORTA o componente APÓS todos os mocks                           */
/* ------------------------------------------------------------------ */
import DashboardPage from './dashboardPage';

/* ------------------------------------------------------------------ */
/* Teste                                                              */
/* ------------------------------------------------------------------ */
describe('DashboardPage', () => {
  it('renderiza sem crashar', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('card-balance')).toBeInTheDocument();
  });
});
