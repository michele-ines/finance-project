import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent, {
  PointerEventsCheckLevel,
} from "@testing-library/user-event";
import CardNewTransaction from "./card-new-transaction";

/* ---- mocks -------------------------------------------------------- */
jest.mock("next/font/google", () => ({
  Inter: () => ({ className: "mock-inter" }),
  Roboto_Mono: () => ({ className: "mock-roboto" }),
}));

/* ---- helpers ------------------------------------------------------ */
const onSubmitMock = jest.fn();
const setup = (isLoading = false) =>
  render(<CardNewTransaction onSubmit={onSubmitMock} isLoading={isLoading} />);

/* ---- timeout extra p/ este arquivo -------------------------------- */
jest.setTimeout(10_000);

describe("CardNewTransaction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    setup();
    expect(screen.getByText(/nova transação/i)).toBeInTheDocument();
    expect(screen.getByText(/concluir transação/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("00,00")).toBeInTheDocument();
    expect(
      screen.getByText(/selecione o tipo de transação/i)
    ).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    setup();
    const user = userEvent.setup({ delay: null });

    await user.click(
      screen.getByRole("button", { name: /concluir transação/i })
    );

    expect(
      await screen.findByText(/tipo de transação é obrigatório/i)
    ).toBeInTheDocument();
    expect(await screen.findByText(/valor é obrigatório/i)).toBeInTheDocument();

    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  it("submits the form with valid data", async () => {
    jest.useFakeTimers();
    setup();

    const user = userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
      delay: null,
      pointerEventsCheck: PointerEventsCheckLevel.Never,
    });

    // abre o select de tipo e escolhe "Depósito (Saída)"
    await user.click(screen.getByRole("combobox"));
    const depositoOption = await screen.findByRole("option", {
      name: /depósito/i,
    });
    await user.click(depositoOption);

    // preenche valor
    const valorInput = screen.getByPlaceholderText("00,00");
    await user.clear(valorInput);
    await user.type(valorInput, "150,00");

    // envia
    await user.click(
      screen.getByRole("button", { name: /concluir transação/i })
    );

    act(() => jest.runOnlyPendingTimers());

    await waitFor(() => expect(onSubmitMock).toHaveBeenCalled());

    type FormData = { tipo: string; valor: string };

    const firstCall = onSubmitMock.mock.calls.at(0) as [FormData] | undefined;
    expect(firstCall).toBeDefined(); // garante existência
    const formData = firstCall![0];

    expect(formData).toMatchObject({ tipo: "deposito" });
    expect(formData.valor).toBe("150,00");
  });

  it("disables button when isLoading is true", () => {
    setup(true); // isLoading = true

    // O texto acessível do botão é “Concluindo…”
    const button = screen.getByRole("button", { name: /concluindo/i });

    expect(button).toBeDisabled();
    expect(button).toHaveClass("cursor-not-allowed opacity-50");
  });

  it("renders error styles when validation fails", async () => {
    setup();
    const user = userEvent.setup({ delay: null });

    await user.click(
      screen.getByRole("button", { name: /concluir transação/i })
    );

    expect(
      await screen.findByText(/tipo de transação é obrigatório/i)
    ).toBeInTheDocument();
    expect(await screen.findByText(/valor é obrigatório/i)).toBeInTheDocument();
  });
});
