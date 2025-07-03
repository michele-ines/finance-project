// src/components/my-cards/card-balance/card-balance.test.tsx
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CardBalance from './card-balance';

jest.mock('next/font/google', () => ({
  Inter: () => ({ className: 'mocked-inter' }),
  Roboto_Mono: () => ({ className: 'mocked-roboto' }),
}));

jest.mock('../../../utils/currency-formatte/currency-formatte', () => ({
  formatBRL: jest.fn(() => 'R$ 1.000,00'),
}));

describe('CardBalance', () => {
  const props = {
    user: { name: 'João Silva' },
    balance: { account: '12345-6', value: 1000 },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    render(<CardBalance {...props} />);
  });

  it('renderiza nome do usuário e data corretamente', () => {
    expect(
      screen.getByRole('heading', { name: 'Olá, João :)' })
    ).toBeInTheDocument();

    const today = new Date();
    const weekday = today
      .toLocaleDateString('pt-BR', { weekday: 'long' })
      .replace(/^\w/, (c) => c.toUpperCase());
    const formattedDate = today.toLocaleDateString('pt-BR');
    expect(
      screen.getByText(`${weekday}, ${formattedDate}`)
    ).toBeInTheDocument();
  });

  it('mostra saldo formatado por padrão', () => {
    expect(screen.getByText('R$ 1.000,00')).toBeInTheDocument();
  });

  it('oculta saldo ao clicar no ícone e atualiza aria-label', () => {
    const toggle = screen.getByRole('button', { name: 'Ocultar saldo' });
    fireEvent.click(toggle);

    expect(
      screen.getByRole('button', { name: 'Mostrar saldo' })
    ).toBeInTheDocument();
    expect(screen.getByText('••••••')).toBeInTheDocument();
    expect(screen.queryByText('R$ 1.000,00')).not.toBeInTheDocument();
  });

  it('permite alternar via teclado (Enter e Space)', () => {
    const toggle = screen.getByRole('button', { name: 'Ocultar saldo' });

    fireEvent.keyDown(toggle, { key: 'Enter' });
    expect(
      screen.getByRole('button', { name: 'Mostrar saldo' })
    ).toBeInTheDocument();

    const toggleAgain = screen.getByRole('button', { name: 'Mostrar saldo' });
    fireEvent.keyDown(toggleAgain, { key: ' ' });
    expect(
      screen.getByRole('button', { name: 'Ocultar saldo' })
    ).toBeInTheDocument();
  });

  it('exibe "Carregando..." quando value não é número', () => {
    // Renderização extra usando undefined as unknown as number para evitar any
    render(
      <CardBalance
        user={props.user}
        balance={{ account: props.balance.account, value: undefined as unknown as number }}
      />
    );
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('exibe número da conta', () => {
    expect(screen.getByText('12345-6')).toBeInTheDocument();
  });
});
