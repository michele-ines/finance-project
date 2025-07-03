import React, { useState, useEffect } from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import type { Transaction } from 'interfaces/dashboard';
import CardListExtract from './card-list-extract';

/* ------------------------------------------------------------------ */
/* 0) Mock global de fetch ------------------------------------------ */
beforeAll(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,

    // ✅ agora há await de uma Promise real
    json: async () => await Promise.resolve({}),
  }) as unknown as typeof fetch;
});

/* ------------------------------------------------------------------ */
/* 1) DEMAIS MOCKS --------------------------------------------------- */
jest.mock('next/font/google', () => ({
  Inter:       () => ({ className: 'mocked-inter',       variable: '--mocked-inter' }),
  Roboto_Mono: () => ({ className: 'mocked-roboto-mono', variable: '--mocked-roboto-mono' }),
}));

jest.mock(
  'components/infinite-scroll-sentinel/infinite-scroll-sentinel',
  () => ({
    __esModule: true,
    default: () => <div data-testid="sentinel" />,
  }),
  { virtual: true },
);

const mockTransactions: Transaction[] = [
  {
    _id: 1,
    tipo: 'entrada',
    valor: 1000,
    createdAt: '2024-05-20T00:00:00.000Z',
    updatedAt: '2024-05-20T00:00:00.000Z',
  },
  {
    _id: 2,
    tipo: 'saída',
    valor: -500,
    createdAt: '2024-05-21T00:00:00.000Z',
    updatedAt: '2024-05-21T00:00:00.000Z',
  },
];

jest.mock(
  '../../../hooks/use-paginated-transactions',
  () => {
    const fetchPage = jest.fn();
    return {
      usePaginatedTransactions: () => {
        const [state, setState] = useState({
          transactions: [] as Transaction[],
          fetchPage,
          hasMore: false,
          isLoading: true,
        });

        useEffect(() => {
          const id = setTimeout(() => {
            setState({
              transactions: mockTransactions,
              fetchPage,
              hasMore: false,
              isLoading: false,
            });
          }, 0);
          return () => clearTimeout(id);
        }, []);

        return state;
      },
    };
  },
  { virtual: true },
);

jest.useFakeTimers();
const loadAndStop = () => act(() => jest.runAllTimers());

/* ------------------------------------------------------------------ */
/* 2)  Mocks de callbacks externos ---------------------------------- */
const onSave        = jest.fn();
const onDelete      = jest.fn().mockResolvedValue(undefined);
const atualizaSaldo = jest.fn().mockResolvedValue(undefined);

/* ------------------------------------------------------------------ */
/* 3) TESTES --------------------------------------------------------- */
describe('CardListExtract – cobertura total ajustada', () => {
  beforeEach(() => jest.clearAllMocks());

  it('4) handleTransactionChange finaliza a edição e exibe valor atualizado', async () => {
    const fetchPage = jest.fn();

    render(
      <CardListExtract
        transactions={mockTransactions}
        fetchPage={fetchPage}
        hasMore={false}
        isPageLoading={false}
        onSave={onSave}
        onDelete={onDelete}
        atualizaSaldo={atualizaSaldo}
      />,
    );
    loadAndStop();

    fireEvent.click(await screen.findByLabelText('editar'));

    const valorInput = screen.getAllByDisplayValue(/R\$ 1\.000,00/)[0]!;
    fireEvent.change(valorInput, { target: { value: 'R$ 2.000,00' } });
    fireEvent.click(screen.getByText('Salvar'));

    await waitFor(() => {
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      expect(screen.getByText('R$ 2.000,00')).toBeInTheDocument();
    });

    expect(fetchPage).toHaveBeenCalled();
  });

 it('9) handleDeleteClick remove seleção e volta ao estado normal', async () => {
    const successfulDelete = jest.fn().mockResolvedValue(undefined);

    render(
      <CardListExtract
        transactions={mockTransactions}
        fetchPage={jest.fn()}
        hasMore={false}
        isPageLoading={false}
        onSave={onSave}
        onDelete={successfulDelete}
        atualizaSaldo={atualizaSaldo}
      />,
    );
    loadAndStop();

    fireEvent.click(screen.getByLabelText('excluir'));
    const [chk] = await screen.findAllByRole('checkbox');
    fireEvent.click(chk!);

    act(() => {
      fireEvent.click(screen.getByText('Excluir'));
    });

    /* espera o efeito “finally” do componente terminar */
    await waitFor(() => expect(successfulDelete).toHaveBeenCalledWith([1]));
    await waitFor(() =>
      expect(screen.queryAllByRole('checkbox')).toHaveLength(0),
    );
  });
});
