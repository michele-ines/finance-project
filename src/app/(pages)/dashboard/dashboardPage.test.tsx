/* __tests__/dashboard-page.test.tsx ---------------------------------- */
import React from 'react';
import { render, screen } from '@testing-library/react';
import type { RootState } from 'store/store';
import * as ReactRedux from 'react-redux';

/* ------------------------------------------------------------------ */
/* 1. Mock do localStorage                                            */
/* ------------------------------------------------------------------ */
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => { store[k] = v; },
    clear: () => { store = {}; },
    removeItem: (k: string) => { delete store[k]; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

/* ------------------------------------------------------------------ */
/* 2. Helper para mocks visuais                                       */
/* ------------------------------------------------------------------ */
function createMockComponent(testId: string, name: string): React.FC {
  return Object.assign(() => <div data-testid={testId} />, { displayName: name });
}

/* ------------------------------------------------------------------ */
/* 3. Mocks dos slices assíncronos                                    */
/* ------------------------------------------------------------------ */
jest.mock('store/slices/transactionsSlice', () => ({
  __esModule: true,
  fetchTransactions: jest.fn(() => ({ type: 'transactions/fetch' })),
  createNewTransaction: jest.fn(() => ({ type: 'transactions/create' })),
  saveTransactions: jest.fn(() => ({ type: 'transactions/save' })),
  deleteTransactions: jest.fn(() => ({ type: 'transactions/delete' })),
}), { virtual: true });

jest.mock('store/slices/balanceSlice', () => ({
  __esModule: true,
  fetchBalance: jest.fn(() => ({ type: 'balance/fetch' })),
}), { virtual: true });

/* ------------------------------------------------------------------ */
/* 4. Mocks visuais para componentes pesados                          */
/* ------------------------------------------------------------------ */
jest.mock('components/my-cards/card-balance/card-balance',
  () => createMockComponent('card-balance', 'CardBalanceMock'),
  { virtual: true },
);
jest.mock('components/my-cards/card-list-extract/card-list-extract',
  () => createMockComponent('card-list', 'CardListExtractMock'),
  { virtual: true },
);
jest.mock('components/my-cards/card-new-transaction/card-new-transaction',
  () => createMockComponent('card-new', 'CardNewTransactionMock'),
  { virtual: true },
);
jest.mock('components/widgets/savings-goal-widget',
  () => createMockComponent('savings-widget', 'SavingsGoalWidgetMock'),
  { virtual: true },
);
jest.mock('components/widgets/spending-alert-widget',
  () => createMockComponent('alert-widget', 'SpendingAlertWidgetMock'),
  { virtual: true },
);
jest.mock('components/charts/financialChart',
  () => createMockComponent('financial-chart', 'FinancialChartMock'),
  { virtual: true },
);

/* ------------------------------------------------------------------ */
/* 5. Hook de dados & JSON mocks                                      */
/* ------------------------------------------------------------------ */
jest.mock('app/hooks/use-dashboard-data', () => ({
  useDashboardData: jest.fn(),
}));
jest.mock('mocks/dashboard-data.json', () => ({
  user: { name: 'Usuário Teste' },
  balance: { value: 0 },
}), { virtual: true });


/* ------------------------------------------------------------------ */
/* 6. Mock de react-redux (VERSÃO FINAL CORRIGIDA)                    */
/* ------------------------------------------------------------------ */
jest.mock('react-redux', () => {
  const actual = jest.requireActual<typeof ReactRedux>('react-redux');

  // A definição do tipo e do estado inicial são movidas para DENTRO
  // do mock para evitar erros de "hoisting" e "ReferenceError".
  type WidgetPreferences = {
    activeWidgets: string[];
    savingsGoal: boolean;
    spendingAlert: boolean;
  };
  const widgetPrefsInitialState: WidgetPreferences = {
    activeWidgets: [],
    savingsGoal: false,
    spendingAlert: false,
  };

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
    widgetPreferences: widgetPrefsInitialState,
  };

  const mockDispatch = jest.fn(() => ({ unwrap: jest.fn() }));

  return {
    ...actual,
    useDispatch: () => mockDispatch,
    useSelector: <T,>(sel: (s: RootState) => T): T => sel(mockState),
  };
});


/* ------------------------------------------------------------------ */
/* 7. IMPORTA o componente APÓS todos os mocks                        */
/* ------------------------------------------------------------------ */
import DashboardPage from './page';

/* ------------------------------------------------------------------ */
/* 8. Teste                                                           */
/* ------------------------------------------------------------------ */
describe('DashboardPage', () => {
  it('renderiza sem crashar', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('card-balance')).toBeInTheDocument();
  });
});