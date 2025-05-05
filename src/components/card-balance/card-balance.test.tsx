import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CardBalanceProps } from 'types/dashboard';
import CardBalance from './card-balance';
import { formatBRL } from '../../utils/currency';

jest.mock('../../utils/currency.ts', () => ({
  formatBRL: jest.fn((value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`),
}));

jest.mock('next/font/google', () => ({
  Inter: jest.fn(() => ({ className: 'mock-font' })),
}));

jest.mock('../../components/ui', () => {
  const React = jest.requireActual('react');
  return {
    __esModule: true,
    React,
    Box: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <div className={className}>{children}</div>
    ),
    VisibilityIcon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg data-testid="visibility-icon" {...props} />
    ),
    CardBalanceStyles: {
      cardSaldo: 'cardSaldo',
      nameTitle: 'nameTitle',
      dateText: 'dateText',
      balanceSection: 'balanceSection',
      saldoHeader: 'saldoHeader',
      saldoTitle: 'saldoTitle',
      eyeIcon: 'eyeIcon',
      hrOrange: 'hrOrange',
      contaCorrenteTitle: 'contaCorrenteTitle',
      valorSaldoText: 'valorSaldoText',
    },
  };
});

describe('CardBalance', () => {
  const mockProps: CardBalanceProps = {
    user: { name: 'Maria Oliveira' },
    balance: { account: 'Conta Corrente 001', value: 1234.56 },
  };

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2024-05-01T10:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('deve renderizar o nome do usuário com saudação', () => {
    render(<CardBalance {...mockProps} />);
    expect(screen.getByText('Olá, Maria :)')).toBeInTheDocument();
  });

  it('deve exibir a data formatada corretamente', () => {
    render(<CardBalance {...mockProps} />);
    expect(screen.getByText(/Quarta-feira, 01\/05\/2024/)).toBeInTheDocument();
  });

  it('deve exibir o título "Saldo" com ícone de visibilidade', () => {
    render(<CardBalance {...mockProps} />);
    expect(screen.getByText('Saldo')).toBeInTheDocument();
    expect(screen.getByTestId('visibility-icon')).toBeInTheDocument();
  });

  it('deve exibir a conta e o saldo formatado', () => {
    render(<CardBalance {...mockProps} />);
    expect(screen.getByText(mockProps.balance.account)).toBeInTheDocument();
    expect(formatBRL).toHaveBeenCalledWith(mockProps.balance.value);
    expect(screen.getByText('R$ 1234,56')).toBeInTheDocument();
  });
});
