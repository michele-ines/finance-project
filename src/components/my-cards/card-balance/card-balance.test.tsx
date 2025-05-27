import '@testing-library/jest-dom';
import React, { ComponentProps } from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import CardBalance from './card-balance';

jest.mock('next/font/google', () => ({
  Inter: () => ({ className: 'mocked-inter' }),
  Roboto_Mono: () => ({ className: 'mocked-roboto' }),
}));

jest.mock('../../../utils/currency-formatte/currency-formatte', () => ({
  formatBRL: jest.fn(() => 'R$ 1.000,00'),
}));

type Props = ComponentProps<typeof CardBalance>;

describe('CardBalance', () => {
  const props: Props = {
    user: { name: 'João Silva' },
    balance: { account: '12345-6', value: 1000 },
  };

  it('should render with user name and date', () => {
    const { getByText } = render(<CardBalance {...props} />);
    expect(getByText('Olá, João :)')).toBeInTheDocument();
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
    const weekday = today
      .toLocaleDateString('pt-BR', options)
      .replace(/^\w/, (c) => c.toUpperCase());
    const formattedDate = today.toLocaleDateString('pt-BR');
    expect(getByText(`${weekday}, ${formattedDate}`)).toBeInTheDocument();
  });

  it('should show balance when showBalance is true', () => {
    const { getByText } = render(<CardBalance {...props} />);
    expect(getByText('R$ 1.000,00')).toBeInTheDocument();
  });

  it('should hide balance when clicking visibility icon', () => {
    const { getByLabelText, getByText, queryByText } = render(
      <CardBalance {...props} />
    );
    const hideButton = getByLabelText('Ocultar saldo');
    if (hideButton) {
      act(() => {
        fireEvent.click(hideButton);
      });
    }
    expect(getByLabelText('Mostrar saldo')).toBeInTheDocument();
    expect(getByText('••••••')).toBeInTheDocument();
    expect(queryByText('R$ 1.000,00')).not.toBeInTheDocument();
  });

  it('should show balance again when clicking visibility off icon', () => {
    const { getByLabelText, getByText } = render(<CardBalance {...props} />);
    const hideButton = getByLabelText('Ocultar saldo');
    if (hideButton) {
      act(() => {
        fireEvent.click(hideButton);
      });
    }
    const showButton = getByLabelText('Mostrar saldo');
    if (showButton) {
      act(() => {
        fireEvent.click(showButton);
      });
    }
    expect(getByText('R$ 1.000,00')).toBeInTheDocument();
  });

  it('should show "Carregando..." if balance is undefined', () => {
    const { getByText } = render(
      <CardBalance
        {...{
          ...props,
          balance: { account: '12345-6', value: undefined as unknown as number },
        }}
      />
    );
    expect(getByText('Carregando...')).toBeInTheDocument();
  });

  it('should display account number', () => {
    const { getByText } = render(<CardBalance {...props} />);
    expect(getByText('12345-6')).toBeInTheDocument();
  });
});
