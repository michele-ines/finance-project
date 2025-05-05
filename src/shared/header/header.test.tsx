
// 1) Mock das fontes do Next antes de qualquer import que use fonts
jest.mock('next/font/google', () => ({
  Inter: () => ({ className: '' }),
  Roboto_Mono: () => ({ className: '' }),
}));

// 2) Mock do useRouter do seu ui/index
const pushMock = jest.fn();
jest.mock('../ui/index', () => {
  const actual = jest.requireActual('../ui/index');
  return {
    ...actual,
    useRouter: () => ({ push: pushMock }),
  };
});

// 3) Imports do React, Testing Library e do componente
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import Header from './header';

describe('Header', () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  it('renderiza logo e botões de navegação desktop', () => {
    render(<Header />);

    // Logo principal
    expect(screen.getAllByAltText('Bite Bank Logo').length).toBeGreaterThan(0);

    // Botões de menu desktop
    expect(screen.getByRole('button', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sobre/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /serviços/i })).toBeInTheDocument();

    // Botões de ação
    expect(screen.getByRole('button', { name: /abrir conta/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /já tenho conta/i })).toBeInTheDocument();
  });

  it('chama router.push("/dashboard") ao clicar em Dashboard', () => {
    render(<Header />);
    fireEvent.click(screen.getByRole('button', { name: /dashboard/i }));
    expect(pushMock).toHaveBeenCalledWith('/dashboard');
  });

  it('abre e fecha o menu mobile corretamente', () => {
    render(<Header />);

    // Abre o menu mobile
    fireEvent.click(screen.getByLabelText('menu'));

    // Captura o <ul role="menu">
    const menu = screen.getByRole('menu');
    expect(menu).toBeVisible();

    // Dentro do menu, pega o item “Dashboard”
    const mobileDashboard = within(menu).getByText('Dashboard');
    expect(mobileDashboard).toBeVisible();

    // Clica e verifica fechamento
    fireEvent.click(mobileDashboard);
    expect(menu).not.toBeVisible();
  });
});
