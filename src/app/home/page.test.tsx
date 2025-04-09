import '@testing-library/jest-dom';
import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import Home from './page';
import { Button, Image } from '../../components/ui/index';

type ImageProps = ComponentProps<typeof Image>;
type ButtonProps = ComponentProps<typeof Button>;

jest.mock('../../components/ui/index', () => ({
  Image: ({ className, children }: ImageProps) => <div className={className}>{children}</div>,
  Button: ({ children, className, ...props }: ButtonProps) => <button className={className} {...props}>{children}</button>,
}));

describe('Home', () => {
  it('should render home page content', () => {
    const { getByText } = render(<Home />);
    
    getByText('Experimente mais liberdade e controle da sua vida financeira. Crie sua conta com a gente!');
    getByText('Abrir Conta');
    getByText('Já tenho conta');
    getByText('Vantagens do nosso banco');
    getByText('Conta e cartão gratuitos');
    getByText('Saques sem custo');
    getByText('Programa de pontos');
    getByText('Seguro Dispositivos');
  });
});
