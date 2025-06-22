// import { render, screen, waitFor, act } from '@testing-library/react';
// import userEvent, { PointerEventsCheckLevel } from '@testing-library/user-event';

// import CardNewTransaction from './card-new-transaction';

// /* ---- mocks -------------------------------------------------------- */
// jest.mock('next/font/google', () => ({
//   Inter: () => ({ className: 'mock-inter' }),
//   Roboto_Mono: () => ({ className: 'mock-roboto' }),
// }));

// /* ---- helpers ------------------------------------------------------ */
// const onSubmitMock = jest.fn();
// const setup = (isLoading = false) =>
//   render(<CardNewTransaction onSubmit={onSubmitMock} isLoading={isLoading} />);

// /* ---- aumenta o timeout global p/ este arquivo -------------------- */
// jest.setTimeout(10_000);

// describe('CardNewTransaction', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   /* 1) Renderização básica ------------------------------------------ */
//   it('renders correctly', () => {
//     setup();
//     expect(screen.getByText(/nova transação/i)).toBeInTheDocument();
//     expect(screen.getByText(/concluir transação/i)).toBeInTheDocument();
//     expect(screen.getByPlaceholderText('0,00')).toBeInTheDocument();
//     expect(
//       screen.getByText(/selecione o tipo de transação/i),
//     ).toBeInTheDocument();
//   });

//   /* 2) Validação de formulário vazio -------------------------------- */
//   it('shows validation errors when submitting empty form', async () => {
//     setup();
//     const user = userEvent.setup({ delay: null });

//     await user.click(screen.getByRole('button', { name: /concluir transação/i }));

//     expect(
//       await screen.findByText(/tipo de transação é obrigatório/i),
//     ).toBeInTheDocument();
//     expect(
//       await screen.findByText(/valor é obrigatório/i),
//     ).toBeInTheDocument();

//     expect(onSubmitMock).not.toHaveBeenCalled();
//   });

//   /* 3) Envio com dados válidos -------------------------------------- */
//   it('submits the form with valid data', async () => {
//     /* finge que todo timer roda instantaneamente */
//     jest.useFakeTimers();
//     setup();

//     /* userEvent recebe advanceTimers => tudo fica síncrono            */
// const user = userEvent.setup({
//   advanceTimers: jest.advanceTimersByTime,
//   delay: null,
//   // desliga o pointer-events check (mais rápido)
//   pointerEventsCheck: PointerEventsCheckLevel.Never, // ou 0
// });

//     /* 3.1 — tipo */
//     // await user.click(screen.getByRole('button', { name: /tipo de transação/i }));
//     await user.click(screen.getAllByRole('combobox')[0]);
//     await user.click(screen.getByRole('option', { name: /depósito/i }));

//     /* 3.2 — categoria */
//     await user.click(screen.getByRole('button', { name: /categoria/i }));
//     await user.keyboard('{arrowdown}{enter}'); // “Salário”

//     /* 3.3 — valor */
//     const valorInput = screen.getByPlaceholderText('0,00');
//     await user.clear(valorInput);
//     await user.type(valorInput, '150,00');

//     /* 3.4 — submit */
//     await user.click(screen.getByRole('button', { name: /concluir transação/i }));

//     /* força qualquer timeout pendente a ser executado já              */
//     act(() => {
//       jest.runOnlyPendingTimers();
//     });

//     await waitFor(() => expect(onSubmitMock).toHaveBeenCalled());

//     const [[formData]] = onSubmitMock.mock.calls;
//     expect(formData).toMatchObject({
//       tipo: 'deposito',
//       categoria: 'salario',
//     });
//     expect(formData.valor).toMatch(/^R\$\s*150,00$/);
//   });

//   /* 4) Botão desabilitado em loading -------------------------------- */
//   it('disables button when isLoading is true', () => {
//     setup(true);
//     const button = screen.getByRole('button', { name: /concluindo transação/i });
//     expect(button).toBeDisabled();
//     expect(button).toHaveClass('cursor-not-allowed opacity-50');
//   });

//   /* 5) Estilos de erro após submit vazio ---------------------------- */
//   it('renders error styles when validation fails', async () => {
//     setup();
//     const user = userEvent.setup({ delay: null });
//     await user.click(screen.getByRole('button', { name: /concluir transação/i }));

//     expect(
//       await screen.findByText(/tipo de transação é obrigatório/i),
//     ).toBeInTheDocument();
//     expect(
//       await screen.findByText(/valor é obrigatório/i),
//     ).toBeInTheDocument();
//   });
// });
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent, {
  PointerEventsCheckLevel,
} from '@testing-library/user-event';
import CardNewTransaction from './card-new-transaction';

/* ---- mocks -------------------------------------------------------- */
jest.mock('next/font/google', () => ({
  Inter: () => ({ className: 'mock-inter' }),
  Roboto_Mono: () => ({ className: 'mock-roboto' }),
}));

/* ---- helpers ------------------------------------------------------ */
const onSubmitMock = jest.fn();
const setup = (isLoading = false) =>
  render(<CardNewTransaction onSubmit={onSubmitMock} isLoading={isLoading} />);

/* ---- timeout extra p/ este arquivo -------------------------------- */
jest.setTimeout(10_000);

describe('CardNewTransaction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* 1) Renderização básica ------------------------------------------ */
  it('renders correctly', () => {
    setup();
    expect(screen.getByText(/nova transação/i)).toBeInTheDocument();
    expect(screen.getByText(/concluir transação/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('0,00')).toBeInTheDocument();
    expect(
      screen.getByText(/selecione o tipo de transação/i),
    ).toBeInTheDocument();
  });

  /* 2) Validação de formulário vazio -------------------------------- */
  it('shows validation errors when submitting empty form', async () => {
    setup();
    const user = userEvent.setup({ delay: null });

    await user.click(screen.getByRole('button', { name: /concluir transação/i }));

    expect(
      await screen.findByText(/tipo de transação é obrigatório/i),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/valor é obrigatório/i),
    ).toBeInTheDocument();

    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  /* 3) Envio com dados válidos -------------------------------------- */
  it('submits the form with valid data', async () => {
    jest.useFakeTimers();                              // timers instantâneos
    setup();

    const user = userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,         // acelera todos os timeouts
      delay: null,
      pointerEventsCheck: PointerEventsCheckLevel.Never,
    });

    /* 3.1 — tipo */
    await user.click(screen.getAllByRole('combobox')[0]);           // <- aqui!
    await user.click(await screen.findByRole('option', { name: /depósito/i }));

    /* 3.2 — categoria */
    await user.click(screen.getAllByRole('combobox')[1]);
    await user.keyboard('{arrowdown}{enter}'); // “Salário”

    /* 3.3 — valor */
    const valorInput = screen.getByPlaceholderText('0,00');
    await user.clear(valorInput);
    await user.type(valorInput, '150,00');

    /* 3.4 — submit */
    await user.click(screen.getByRole('button', { name: /concluir transação/i }));

    /* executa qualquer timeout pendente */
    act(() => jest.runOnlyPendingTimers());

    await waitFor(() => expect(onSubmitMock).toHaveBeenCalled());

    const [[formData]] = onSubmitMock.mock.calls;
    expect(formData).toMatchObject({
      tipo: 'deposito',
      categoria: 'salario',
    });
    expect(formData.valor).toMatch(/^R\$\s*150,00$/);
  });

  /* 4) Botão desabilitado em loading -------------------------------- */
  it('disables button when isLoading is true', () => {
    setup(true);
    const button = screen.getByRole('button', { name: /concluindo transação/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('cursor-not-allowed opacity-50');
  });

  /* 5) Estilos de erro após submit vazio ---------------------------- */
  it('renders error styles when validation fails', async () => {
    setup();
    const user = userEvent.setup({ delay: null });
    await user.click(screen.getByRole('button', { name: /concluir transação/i }));

    expect(
      await screen.findByText(/tipo de transação é obrigatório/i),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/valor é obrigatório/i),
    ).toBeInTheDocument();
  });
});
