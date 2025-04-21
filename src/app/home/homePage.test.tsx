import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import HomePage from './homePage';

jest.mock('../../components/ui/index', () => ({
  Image: ({ className, children }: { className?: string; children?: React.ReactNode }) => (
    <div className={className}>{children}</div>
  ),
  Button: ({ className, children, ...props }: React.ComponentProps<'button'>) => (
    <button className={className} {...props}>
      {children}
    </button>
  ),
}));

describe('Home', () => {
  it('should render home page content', () => {
    render(<HomePage />);

    /** h1 – as três variações devem existir */
    const headings = screen.getAllByRole('heading', {
      level: 1,
      name: /experimente mais liberdade/i,
    });
    expect(headings).toHaveLength(3);

    // botões
    expect(screen.getByRole('button', { name: /abrir conta/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /já tenho conta/i })).toBeInTheDocument();

    // demais textos
    expect(screen.getByText('Vantagens do nosso banco')).toBeInTheDocument();
    expect(screen.getByText('Conta e cartão gratuitos')).toBeInTheDocument();
    expect(screen.getByText('Saques sem custo')).toBeInTheDocument();
    expect(screen.getByText('Programa de pontos')).toBeInTheDocument();
    expect(screen.getByText('Seguro Dispositivos')).toBeInTheDocument();
  });
});
