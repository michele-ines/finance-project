import '@testing-library/jest-dom';
import React, { ComponentProps } from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import CardNewTransaction from './card-new-transaction';

type Props = ComponentProps<typeof CardNewTransaction>;

jest.mock('next/font/google', () => ({
  Inter: () => ({
    style: { fontFamily: 'mocked-inter' },
    className: 'mocked-inter',
    variable: '--font-inter',
  }),
  Roboto_Mono: () => ({
    style: { fontFamily: 'mocked-roboto-mono' },
    className: 'mocked-roboto-mono',
    variable: '--font-roboto-mono',
  }),
}));

describe('CardNewTransaction', () => {
  const onSubmit = jest.fn((e) => e.preventDefault());
  const props: Props = { onSubmit };

  it('should render and submit the form', () => {
    const { getByText, getByPlaceholderText, container } = render(<CardNewTransaction {...props} />);
    
    const select = container.querySelector('select');
    if (select) {
      act(() => {
        fireEvent.change(select, { target: { value: 'deposito' } });
      });
    }

    const input = getByPlaceholderText('00,00');
    act(() => {
      if (input) {
        fireEvent.change(input, { target: { value: '100' } });
      }
    });

    const button = getByText('Concluir Transação');
    act(() => {
      if (button) {
        fireEvent.click(button);
      }
    });

    expect(onSubmit).toHaveBeenCalled();
  });
});
