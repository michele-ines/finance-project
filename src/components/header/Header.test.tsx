import '@testing-library/jest-dom';
import React from 'react';

// mock do router do Next
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    pathname: '/',
  }),
}));

import { render, fireEvent, act } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  it('should render desktop layout with logo and buttons', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
    const { getAllByAltText, getByRole } = render(<Header />);
    
    const logos = getAllByAltText('Bite Bank Logo');
    expect(logos).toHaveLength(2);
    
    expect(getByRole('button', { name: 'Sobre' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Serviços' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Abrir Conta' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Já tenho conta' })).toBeInTheDocument();
  });

  it('should open and close mobile menu', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 });
    const { getByLabelText, getByRole } = render(<Header />);
    
    const menuButton = getByLabelText('menu');
    act(() => fireEvent.click(menuButton));

    expect(getByRole('menuitem', { name: 'Sobre' })).toBeInTheDocument();
    expect(getByRole('menuitem', { name: 'Serviços' })).toBeInTheDocument();

    const sobreMenuItem = getByRole('menuitem', { name: 'Sobre' });
    act(() => fireEvent.click(sobreMenuItem));
  });
});
