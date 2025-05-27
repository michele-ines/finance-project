import '@testing-library/jest-dom';
import React, { ComponentProps } from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import CardListExtract from './card-list-extract';

jest.mock('next/font/google', () => ({
  Inter: () => ({ className: 'inter' }),
  Roboto_Mono: () => ({ className: 'roboto' }),
}));

type Props = ComponentProps<typeof CardListExtract>;

jest.mock('../../ui/skeleton-list-extract/skeleton-list-extract', () => ({
  __esModule: true,
  default: () => <div data-testid="skeleton" />,
}));

jest.mock('../../ui', () => ({
  ...jest.requireActual('../../ui'),
  ReceiptLongOutlinedIcon: () => <div data-testid="receipt-icon" />,
}));

jest.mock('../../../utils/currency-formatte/currency-formatte', () => ({
  formatBRL: jest.fn((v) => `R$${v}`),
  formatTipo: jest.fn((v) => `Tipo ${v}`),
  parseBRL: jest.fn((v) => Number(v.replace(',', '.'))),
}));

jest.mock('../../../utils/date-formatte/date-formatte', () => ({
  formatDateBR: jest.fn((v) => `formatted-${v}`),
  parseDateBR: jest.fn((v) => `parsed-${v}`),
}));

describe('CardListExtract', () => {
  const transactions = [
    {
      _id: 1,
      tipo: 'entrada',
      valor: 100,
      createdAt: '2023-01-01',
      updatedAt: '2023-01-02',
    },
    {
      _id: 2,
      tipo: 'saida',
      valor: -50,
      createdAt: '2023-02-01',
      updatedAt: '2023-02-02',
    },
  ];

  const props: Props = {
    transactions,
    onSave: jest.fn(),
    onDelete: jest.fn(() => Promise.resolve()),
    atualizaSaldo: jest.fn(() => Promise.resolve()),
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should render skeleton on loading then render transactions', () => {
    const { getByTestId, getByText } = render(<CardListExtract {...props} />);
    expect(getByTestId('skeleton')).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(getByText('Tipo entrada')).toBeInTheDocument();
    expect(getByText('Tipo saida')).toBeInTheDocument();
  });

  it('should show empty state when no transactions', () => {
    const { getByTestId, getByText } = render(
      <CardListExtract {...props} transactions={[]} />
    );
    expect(getByTestId('skeleton')).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(getByTestId('receipt-icon')).toBeInTheDocument();
    expect(getByText('Nenhuma transação por aqui')).toBeInTheDocument();
  });

  it('should enter edit mode and save changes', () => {
    const { getByRole, getByDisplayValue } = render(<CardListExtract {...props} />);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    const editButton = getByRole('button', { name: /editar/i });
    act(() => {
      fireEvent.click(editButton);
    });

    const input = getByDisplayValue('100');
    act(() => {
      fireEvent.change(input, { target: { value: '200' } });
    });

    const saveButton = getByRole('button', { name: /salvar/i });
    act(() => {
      fireEvent.click(saveButton);
    });

    expect(props.onSave).toHaveBeenCalled();
  });

  it('should enter delete mode and delete selected transaction', async () => {
    const { getByRole, getAllByRole } = render(<CardListExtract {...props} />);
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    const deleteButton = getAllByRole('button', { name: /excluir/i })[0];
    act(() => {
      fireEvent.click(deleteButton);
    });

    const checkboxes = getAllByRole('checkbox');
    act(() => {
      fireEvent.click(checkboxes[0]);
    });

    const deleteConfirmButton = getByRole('button', { name: /excluir/i });
    await act(async () => {
      fireEvent.click(deleteConfirmButton);
    });

    expect(props.onDelete).toHaveBeenCalledWith([1]);
    expect(props.atualizaSaldo).toHaveBeenCalled();
  });

  it('should cancel edit and delete modes', () => {
    const { getByRole, getAllByRole } = render(<CardListExtract {...props} />);
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    const editButton = getAllByRole('button', { name: /editar/i })[0];
    act(() => {
      fireEvent.click(editButton);
    });

    const cancelButton = getByRole('button', { name: /cancelar/i });
    act(() => {
      fireEvent.click(cancelButton);
    });

    const deleteButton = getAllByRole('button', { name: /excluir/i })[0];
    act(() => {
      fireEvent.click(deleteButton);
    });

    act(() => {
      fireEvent.click(cancelButton);
    });
  });
});
