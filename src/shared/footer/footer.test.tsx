import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

// Mock do next/font/google antes de carregar o ui/index
jest.mock('next/font/google', () => ({
  Inter: () => ({ className: '' }),
  Roboto_Mono: () => ({ className: '' }),
}));

import Footer from './footer';

describe('Footer', () => {
  it('deve renderizar o footer', () => {
    const { baseElement } = render(<Footer />);
    expect(baseElement).toBeInTheDocument();
  });

  it('deve exibir seção Serviços', () => {
    render(<Footer />);
    expect(screen.getByText(/Serviços/i)).toBeInTheDocument();
    expect(screen.getByText(/Conta corrente/i)).toBeInTheDocument();
    expect(screen.getByText(/Conta PJ/i)).toBeInTheDocument();
    expect(screen.getByText(/Cartão de crédito/i)).toBeInTheDocument();
  });

  it('deve exibir seção Contato', () => {
    render(<Footer />);
    expect(screen.getByText(/Contato/i)).toBeInTheDocument();
    expect(screen.getByText('0800 504 3058')).toBeInTheDocument();
    expect(screen.getByText('suporte@bytebank.com')).toBeInTheDocument();
    expect(screen.getByText('contato@bytebank.com')).toBeInTheDocument();
  });

  it('deve exibir seção Developed by Front-End e imagens', () => {
    render(<Footer />);
    expect(screen.getByText(/Developed by Front-End/i)).toBeInTheDocument();
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThanOrEqual(4);
  });
});
