jest.mock('next/font/google', () => ({
  Inter: () => ({ className: '' }),
  Roboto_Mono: () => ({ className: '' }),
}));

const pushMock = jest.fn();

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: pushMock }),
}));

import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import Header from './header';

describe('Header', () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  it('renderiza logo e botões de navegação desktop', () => {
    render(<Header />);

    expect(screen.getAllByAltText('Logo').length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sobre/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /serviços/i })).toBeInTheDocument();
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

    // Abre menu
    fireEvent.click(screen.getByLabelText('menu'));
    const menu = screen.getByRole('menu');
    expect(menu).toBeVisible();

    // Clica no item do menu
    const mobileDashboard = within(menu).getByText('Dashboard');
    expect(mobileDashboard).toBeVisible();

    fireEvent.click(mobileDashboard);

    // Menu deve fechar (dependente da implementação interna)
    expect(menu).not.toBeVisible();
  });
});
