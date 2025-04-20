import '@testing-library/jest-dom';
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import Headermenu from './HeaderMenu'; // Ajuste o caminho conforme necessário

describe('Header', () => {
  it('should render desktop layout with logo and buttons', () => {
    // Simula uma tela desktop
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
    const { getAllByAltText, getByRole } = render(<Headermenu />);
    
    // Verifica que existem duas instâncias do logo (se esse for o comportamento esperado)
    const logos = getAllByAltText('Bite Bank Logo');
    expect(logos).toHaveLength(2);
    
    // Usa getByRole para identificar os botões de forma mais específica
    expect(getByRole('button', { name: 'Sobre' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Serviços' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Abrir Conta' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Já tenho conta' })).toBeInTheDocument();
  });

  it('should open and close mobile menu', () => {
    // Simula uma tela mobile
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 });
    const { getByLabelText, getByRole } = render(<Headermenu />);
    
    // Seleciona o botão de menu pela label
    const menuButton = getByLabelText('menu');
    act(() => {
      fireEvent.click(menuButton);
    });

    // Após abrir o menu, usa getByRole para identificar os itens de menu de forma mais específica
    expect(getByRole('menuitem', { name: 'Sobre' })).toBeInTheDocument();
    expect(getByRole('menuitem', { name: 'Serviços' })).toBeInTheDocument();

    // Seleciona o item "Sobre" do menu e simula um clique
    const sobreMenuItem = getByRole('menuitem', { name: 'Sobre' });
    act(() => {
      fireEvent.click(sobreMenuItem);
    });
  });
});
