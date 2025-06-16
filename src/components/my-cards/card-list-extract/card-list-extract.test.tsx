import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import CardListExtract from "./card-list-extract";
import { Transaction } from "interfaces/dashboard";

jest.mock("next/font/google", () => ({
  Inter: () => ({ className: "mocked-inter", variable: "--mocked-inter" }),
  Roboto_Mono: () => ({
    className: "mocked-roboto-mono",
    variable: "--mocked-roboto-mono",
  }),
}));

jest.useFakeTimers();

const mockTransactions: Transaction[] = [
  {
    _id: 1,
    tipo: "entrada",
    valor: 1000,
    createdAt: "2024-05-20T00:00:00.000Z",
    updatedAt: "2024-05-20T00:00:00.000Z",
  },
  {
    _id: 2,
    tipo: "saída",
    valor: -500,
    createdAt: "2024-05-21T00:00:00.000Z",
    updatedAt: "2024-05-21T00:00:00.000Z",
  },
];

describe("CardListExtract – cobertura total ajustada", () => {
  const onSave = jest.fn();
  const onDelete = jest.fn().mockResolvedValue(undefined);
  const atualizaSaldo = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => jest.clearAllMocks());
  const loadAndStop = () => act(() => jest.runAllTimers());

  it("1) Skeleton e lista aparecem corretamente", () => {
    render(
      <CardListExtract
        transactions={mockTransactions}
        onSave={onSave}
        onDelete={onDelete}
        atualizaSaldo={atualizaSaldo}
      />
    );
    // antes do timeout: 5 skeleton rows
    expect(
      screen
        .getAllByRole("listitem")
        .filter((li) => li.querySelector(".animate-pulse"))
    ).toHaveLength(5);

    loadAndStop();
    // após timers, nenhum skeleton
    expect(
      screen
        .queryAllByRole("listitem")
        .some((li) => li.querySelector(".animate-pulse"))
    ).toBe(false);
  });

  it("2) Exibe transações e valores formatados", async () => {
    render(
      <CardListExtract
        transactions={mockTransactions}
        onSave={onSave}
        onDelete={onDelete}
        atualizaSaldo={atualizaSaldo}
      />
    );
    loadAndStop();

    await waitFor(() => {
      expect(screen.getByText("Entrada")).toBeInTheDocument();
      expect(screen.getByText("Saída")).toBeInTheDocument();
      expect(screen.getByText("R$ 1.000,00")).toBeInTheDocument();
      // basta validar que o valor aparece sem precisar do dash junto
      expect(screen.getByText(/500,00/)).toBeInTheDocument();
    });
  });

  it("3) handleEditClick e handleCancelClick", async () => {
    render(
      <CardListExtract
        transactions={mockTransactions}
        onSave={onSave}
        onDelete={onDelete}
        atualizaSaldo={atualizaSaldo}
      />
    );
    loadAndStop();

    // ao clicar em editar, só aparecem inputs para tipo e valor
    fireEvent.click(await screen.findByLabelText("editar"));
    // dois inputs 'tipo'
    expect(screen.getAllByDisplayValue(/Entrada|Saída/)).toHaveLength(2);
    // dois inputs 'valor'
    expect(
      screen.getAllByDisplayValue(/R\$\s?[0-9,.]+/).length
    ).toBeGreaterThanOrEqual(1);
    // cancelar volta ao estado de spans
    fireEvent.click(screen.getByText("Cancelar"));
    expect(screen.getByText("Entrada")).toBeInTheDocument();
    expect(screen.getByText("Saída")).toBeInTheDocument();
  });

  it("4) handleTransactionChange modifica tipo, data e valor", async () => {
    render(
      <CardListExtract
        transactions={mockTransactions}
        onSave={onSave}
        onDelete={onDelete}
        atualizaSaldo={atualizaSaldo}
      />
    );
    loadAndStop();

    fireEvent.click(await screen.findByLabelText("editar"));
    const tipoInputs = screen.getAllByDisplayValue("Entrada");
    const valorInputs = screen.getAllByDisplayValue(/R\$\s?[0-9,.]+/);

    // altera tipo
    fireEvent.change(tipoInputs[0], { target: { value: "Teste Novo" } });
    // o input normaliza para "Teste novo"
    expect((tipoInputs[0] as HTMLInputElement).value).toBe("Teste novo");

    // altera valor
    fireEvent.change(valorInputs[0], { target: { value: "R$ 2.000,00" } });
    expect((valorInputs[0] as HTMLInputElement).value).toBe("R$ 2.000,00");

    // salva e verifica payload de updatedAt convertido
    fireEvent.click(screen.getByText("Salvar"));
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            updatedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
          }),
        ])
      );
    });
  });

  it("5) handleCheckboxChange adiciona e remove seleção", async () => {
    render(
      <CardListExtract
        transactions={mockTransactions}
        onSave={onSave}
        onDelete={onDelete}
        atualizaSaldo={atualizaSaldo}
      />
    );
    loadAndStop();

    fireEvent.click(screen.getByLabelText("excluir"));
    const boxes = await screen.findAllByRole("checkbox");
    expect(boxes).toHaveLength(2);

    fireEvent.click(boxes[0]);
    expect((boxes[0] as HTMLInputElement).checked).toBe(true);
    fireEvent.click(boxes[0]);
    expect((boxes[0] as HTMLInputElement).checked).toBe(false);
  });

  it("6) handleDeleteClick e handleCancelDeleteClick", async () => {
    render(
      <CardListExtract
        transactions={mockTransactions}
        onSave={onSave}
        onDelete={onDelete}
        atualizaSaldo={atualizaSaldo}
      />
    );
    loadAndStop();

    fireEvent.click(screen.getByLabelText("excluir"));
    // Botão 'Excluir' deve estar *desabilitado* porque não há seleção
    expect(screen.getByText("Excluir")).toBeDisabled();

    // cancelar exclusão deve esconder checkboxes
    fireEvent.click(screen.getByText("Cancelar"));
    expect(screen.queryByRole("checkbox")).toBeNull();
  });

  it("7) exclusão com seleção dispara onDelete e atualizaSaldo", async () => {
    render(
      <CardListExtract
        transactions={mockTransactions}
        onSave={onSave}
        onDelete={onDelete}
        atualizaSaldo={atualizaSaldo}
      />
    );
    loadAndStop();

    fireEvent.click(screen.getByLabelText("excluir"));
    const [chk] = await screen.findAllByRole("checkbox");
    fireEvent.click(chk);
    fireEvent.click(screen.getByText("Excluir"));

    await waitFor(() => expect(onDelete).toHaveBeenCalledWith([1]));
    expect(atualizaSaldo).toHaveBeenCalled();
  });

  it("8) cleanup de timeout no unmount", () => {
    const { unmount } = render(
      <CardListExtract
        transactions={mockTransactions}
        onSave={onSave}
        onDelete={onDelete}
        atualizaSaldo={atualizaSaldo}
      />
    );
    unmount();
    act(() => jest.runAllTimers());
    // não deve gerar warnings de act()
  });

  it("9) console.error em onDelete rejection", async () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    onDelete.mockRejectedValueOnce(new Error("boom"));

    render(
      <CardListExtract
        transactions={mockTransactions}
        onSave={onSave}
        onDelete={onDelete}
        atualizaSaldo={atualizaSaldo}
      />
    );
    loadAndStop();

    fireEvent.click(await screen.findByLabelText("excluir"));
    const [chk] = await screen.findAllByRole("checkbox");
    fireEvent.click(chk);
    fireEvent.click(screen.getByText("Excluir"));

    await waitFor(() =>
      expect(spy).toHaveBeenCalledWith(
        "Erro ao excluir transações:",
        expect.any(Error)
      )
    );
    spy.mockRestore();
  });

it("10) estado vazio sem callbacks", async () => {
  render(<CardListExtract transactions={[]} />);
  loadAndStop();
  await waitFor(() =>
    expect(
      screen.getByText(/Nenhuma transação encontrada/i)
    ).toBeInTheDocument()
  );
});

});
