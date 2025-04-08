import '@testing-library/jest-dom';
import React from 'react';
import { render } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('should render', () => {
    const { baseElement } = render(<Footer />);
    expect(baseElement).toBeInTheDocument();
  });

  it('should display Serviços section', () => {
    const { getByText } = render(<Footer />);
    expect(getByText('Serviços')).toBeInTheDocument();
    expect(getByText('Conta corrente')).toBeInTheDocument();
    expect(getByText('Conta PJ')).toBeInTheDocument();
    expect(getByText('Cartão de crédito')).toBeInTheDocument();
  });

  it('should display Contato section', () => {
    const { getByText } = render(<Footer />);
    expect(getByText('Contato')).toBeInTheDocument();
    expect(getByText('0800 504 3058')).toBeInTheDocument();
    expect(getByText('oi@designedbyalex.art.br')).toBeInTheDocument();
    expect(getByText('studio@bytebank.com.br')).toBeInTheDocument();
  });

  it('should display Desenvolvido por Alex section and images', () => {
    const { getByText, getAllByRole } = render(<Footer />);
    expect(getByText('Desenvolvido por Alex')).toBeInTheDocument();
    const images = getAllByRole('img');
    expect(images.length).toBeGreaterThanOrEqual(4);
  });
});
