import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CardNewTransaction from './card-new-transaction';

jest.mock('next/font/google', () => ({
  Inter: () => ({ className: 'mock-inter' }),
  Roboto_Mono: () => ({ className: 'mock-roboto' }),
}));

jest.mock('../../../utils/currency-formatte/currency-formatte', () => ({
  maskCurrency: jest.fn((v) => v),
}));

const onSubmitMock = jest.fn();

const setup = (isLoading = false) => {
  render(<CardNewTransaction onSubmit={onSubmitMock} isLoading={isLoading} />);
};

describe('CardNewTransaction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

it('renders correctly', () => {
  setup();

  expect(screen.getByText(/nova transação/i)).toBeInTheDocument();
  expect(screen.getByText(/concluir transação/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText('00,00')).toBeInTheDocument();
  expect(screen.getByText(/selecione o tipo de transação/i)).toBeInTheDocument();
});


  it('shows validation errors when submitting empty form', async () => {
    setup();

    const submitButton = screen.getByRole('button', { name: /concluir transação/i });
    await userEvent.click(submitButton);

    expect(
      await screen.findByText(/tipo de transação é obrigatório/i)
    ).toBeInTheDocument();

    expect(
      await screen.findByText(/valor é obrigatório/i)
    ).toBeInTheDocument();

    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  it('submits the form with valid data', async () => {
    setup();

    // ✅ Abre o Select
    const select = screen.getByRole('combobox');
    await userEvent.click(select);

    // ✅ Seleciona a opção 'Depósito'
    const optionDeposito = await screen.findByRole('option', { name: /depósito/i });
    await userEvent.click(optionDeposito);

    // ✅ Preenche o input de valor
    const inputValor = screen.getByPlaceholderText('00,00');
    await userEvent.type(inputValor, '150');

    // ✅ Clica no botão de submit
    const submitButton = screen.getByRole('button', { name: /concluir transação/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
      expect(onSubmitMock).toHaveBeenCalledWith(
        { tipo: 'deposito', valor: '150' },
        expect.any(Object) // handleSubmit event
      );
    });
  });

  it('disables button when isLoading is true', () => {
    setup(true);

    const button = screen.getByRole('button', { name: /concluindo transação/i });

    expect(button).toBeDisabled();
    expect(button).toHaveClass('cursor-not-allowed');
    expect(button).toHaveClass('opacity-50');
  });

  it('renders error styles when validation fails', async () => {
    setup();

    const submitButton = screen.getByRole('button', { name: /concluir transação/i });
    await userEvent.click(submitButton);

    const tipoError = await screen.findByText(/tipo de transação é obrigatório/i);
    const valorError = await screen.findByText(/valor é obrigatório/i);

    expect(tipoError).toBeInTheDocument();
    expect(valorError).toBeInTheDocument();
  });
});
