import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import React from 'react';
import ForgotPasswordForm from './forgot-password-form';

/* ------------------------------------------------------------------
 * 1) Mock universal para qualquer fonte de next/font/google
 * -----------------------------------------------------------------*/
jest.mock('next/font/google', () => {
  const mockFont = () => ({ className: 'mock-font' });
  return new Proxy({}, { get: () => mockFont });
});

/* ------------------------------------------------------------------
 * 2) Demais mocks
 * -----------------------------------------------------------------*/
jest.mock('../../config-routes/routes', () => ({
  ROUTES: { HOME: '/mock-login-path' },
}));

jest.mock('../../utils/forms-validations/formValidations', () => ({
  forgotPasswordValidations: {
    email: {
      required: 'O campo de e-mail é obrigatório.',
      pattern: {
        value: /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/,
        message: 'Digite um e-mail válido.',
      },
    },
  },
}));

/* ------------------------------------------------------------------
 * 3) TESTES
 * -----------------------------------------------------------------*/
describe('ForgotPasswordForm', () => {
  it('renderiza o formulário inicial', () => {
    render(<ForgotPasswordForm />);

    expect(
      screen.getByRole('textbox', { name: /e-mail cadastrado/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /enviar link de recuperação/i }),
    ).toBeInTheDocument();
  });

  it('mostra erro “campo obrigatório” ao submeter vazio', async () => {
    render(<ForgotPasswordForm />);
    const user = userEvent.setup();

    await user.click(
      screen.getByRole('button', { name: /enviar link de recuperação/i }),
    );

    expect(
      await screen.findByText(/o campo de e-mail é obrigatório/i),
    ).toBeInTheDocument();
  });

  it('mostra erro “e-mail inválido” ao submeter formato errado', async () => {
    render(<ForgotPasswordForm />);
    const user = userEvent.setup();

    await user.type(
      screen.getByRole('textbox', { name: /e-mail cadastrado/i }),
      'invalido',
    );
    await user.click(
      screen.getByRole('button', { name: /enviar link de recuperação/i }),
    );

    expect(
      await screen.findByText(/digite um e-mail válido/i),
    ).toBeInTheDocument();
  });

  it('submissão bem-sucedida exibe mensagem de sucesso e foca nela', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<ForgotPasswordForm />);

    await user.type(
      screen.getByRole('textbox', { name: /e-mail cadastrado/i }),
      'usuario@exemplo.com',
    );
    await user.click(
      screen.getByRole('button', { name: /enviar link de recuperação/i }),
    );

    expect(
      screen.getByRole('button', { name: /enviando/i }),
    ).toBeDisabled();

    /* ⬇️ não há await dentro da callback, então removemos async */
    act(() => {
      jest.runAllTimers();
    });

    const success = await screen.findByRole('alert');
    expect(success).toHaveTextContent(/um link para redefinição de senha/i);
    await waitFor(() => expect(success).toHaveFocus());

    jest.useRealTimers();
  });

  it('retorno de erro da “API” exibe mensagem e foca no input', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<ForgotPasswordForm />);

    const emailInput = screen.getByRole('textbox', {
      name: /e-mail cadastrado/i,
    });

    await user.type(emailInput, 'erro@exemplo.com');
    await user.click(
      screen.getByRole('button', { name: /enviar link de recuperação/i }),
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(
      await screen.findByText(/este e-mail não foi encontrado/i),
    ).toBeInTheDocument();
    await waitFor(() => expect(emailInput).toHaveFocus());

    jest.useRealTimers();
  });
});
