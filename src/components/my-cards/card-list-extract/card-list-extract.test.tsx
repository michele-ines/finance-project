import React, { useState, useEffect } from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import type { Transaction } from "interfaces/dashboard";
import CardListExtract from "./card-list-extract";

/* ────── mocks ─────────────────────────────────────────── */
jest.mock("next/font/google", () => ({
  Inter: ()       => ({ className: "mocked-inter",       variable: "--mocked-inter" }),
  Roboto_Mono: () => ({ className: "mocked-roboto-mono", variable: "--mocked-roboto-mono" }),
}));

jest.mock(
  "components/infinite-scroll-sentinel/infinite-scroll-sentinel",
  () => ({
    __esModule: true,
    default: () => <div data-testid="sentinel" />,
  }),
  { virtual: true },
);

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

jest.mock(
  "../../../hooks/use-paginated-transactions",
  () => {
    const fetchPage = jest.fn();
    return {
      usePaginatedTransactions: () => {
        const [state, setState] = useState({
          transactions: [] as Transaction[],
          fetchPage,
          hasMore: false,
          isLoading: true,
        });

        useEffect(() => {
          const id = setTimeout(() => {
            setState({
              transactions: mockTransactions,
              fetchPage,
              hasMore: false,
              isLoading: false,
            });
          }, 0);
          return () => clearTimeout(id);
        }, []);

        return state;
      },
    };
  },
  { virtual: true },
);

/* ───────────────────────────────────────────────────────── */

jest.useFakeTimers();
const loadAndStop = () => act(() => jest.runAllTimers());

const onSave        = jest.fn();
const onDelete      = jest.fn().mockResolvedValue(undefined);
const atualizaSaldo = jest.fn().mockResolvedValue(undefined);

/* ======================================================== */
/*                         TESTES                           */
/* ======================================================== */
describe("CardListExtract – cobertura total ajustada", () => {
  beforeEach(() => jest.clearAllMocks());

  it("1) Skeleton e lista aparecem corretamente", async () => {
    const { rerender } = render(
      <CardListExtract
        transactions={[]} 
        fetchPage={jest.fn()}
        hasMore={false}
        isPageLoading={true} 
        onSave={onSave}
        onDelete={onDelete}
        atualizaSaldo={atualizaSaldo}
      />
    );
    expect(
      screen.getAllByRole("listitem").filter(li => li.querySelector(".animate-pulse")),
    ).toHaveLength(5);

    rerender(
      <CardListExtract
        transactions={[]}
        fetchPage={jest.fn()}
        hasMore={false}
        isPageLoading={false}
        onSave={onSave}
        onDelete={onDelete}
        atualizaSaldo={atualizaSaldo}
      />
    );

    await waitFor(() =>
      expect(
        screen
          .queryAllByRole("listitem")
          .some((li) => li.querySelector(".animate-pulse"))
      ).toBe(false)
    );
  });

  it("2) Exibe transações e valores formatados", async () => {
    render(
      <CardListExtract
        transactions={mockTransactions}
        fetchPage={jest.fn()}
        hasMore={false}
        isPageLoading={false}
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
      expect(screen.getByText(/500,00/)).toBeInTheDocument();
    });
  });

  it("3) handleEditClick e handleCancelClick", async () => {
    render(
      <CardListExtract
        transactions={mockTransactions}
        fetchPage={jest.fn()}
        hasMore={false}
        isPageLoading={false}
        onSave={onSave}
        onDelete={onDelete}
        atualizaSaldo={atualizaSaldo}
      />
    );
    loadAndStop();

    fireEvent.click(await screen.findByLabelText("editar"));

    expect(screen.getAllByDisplayValue(/Entrada|Saída/)).toHaveLength(2);
    fireEvent.click(screen.getByText("Cancelar"));
    expect(screen.getByText("Entrada")).toBeInTheDocument();
  });

  it("4) handleTransactionChange modifica tipo, data e valor", async () => {
    render(
      <CardListExtract
        transactions={mockTransactions}
        fetchPage={jest.fn()}
        hasMore={false}
        isPageLoading={false}
        onSave={onSave}
        onDelete={onDelete}
        atualizaSaldo={atualizaSaldo}
      />
    );
    loadAndStop();

    fireEvent.click(await screen.findByLabelText("editar"));
    const valorInput = screen.getAllByDisplayValue(/R\$ 1\.000,00/)[0];

    fireEvent.change(valorInput, { target: { value: "R$ 2.000,00" } });
    fireEvent.click(screen.getByText("Salvar"));

    await waitFor(() =>
      expect(onSave).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            valor: 2000,
            updatedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
          }),
        ]),
      ),
    );
  });

  it("5) handleCheckboxChange adiciona e remove seleção", async () => {
    render(
      <CardListExtract
        transactions={mockTransactions}
        fetchPage={jest.fn()}
        hasMore={false}
        isPageLoading={false}
        onSave={onSave}
        onDelete={onDelete}
        atualizaSaldo={atualizaSaldo}
      />
    );
    loadAndStop();

    fireEvent.click(screen.getByLabelText("excluir"));
    const [box] = await screen.findAllByRole("checkbox");

    fireEvent.click(box);
    expect(box).toBeChecked();
    fireEvent.click(box);
    expect(box).not.toBeChecked();
  });

  it("6) handleDeleteClick e handleCancelDeleteClick", async () => {
    render(
      <CardListExtract
        transactions={mockTransactions}
        fetchPage={jest.fn()}
        hasMore={false}
        isPageLoading={false}
        onSave={onSave}
        onDelete={onDelete}
        atualizaSaldo={atualizaSaldo}
      />
    );
    loadAndStop();

    fireEvent.click(screen.getByLabelText("excluir"));
    expect(screen.getByText("Excluir")).toBeDisabled();

    fireEvent.click(screen.getByText("Cancelar"));
    expect(screen.queryByRole("checkbox")).toBeNull();
  });

  it("7) exclusão com seleção dispara onDelete e atualizaSaldo", async () => {
    render(
      <CardListExtract
        transactions={mockTransactions}
        fetchPage={jest.fn()}
        hasMore={false}
        isPageLoading={false}
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
        fetchPage={jest.fn()}
        hasMore={false}
        isPageLoading={false}
        onSave={onSave}
        onDelete={onDelete}
        atualizaSaldo={atualizaSaldo}
      />
    );
    unmount();
    act(() => jest.runAllTimers());
  });

  it("9) console.error em onDelete rejection", async () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    const failingDelete = jest.fn().mockRejectedValue(new Error("boom"));

    render(
      <CardListExtract
        transactions={mockTransactions}
        fetchPage={jest.fn()}
        hasMore={false}
        isPageLoading={false}
        onSave={onSave}
        onDelete={failingDelete} // uso correto
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
        expect.any(Error),
      )
    );

    spy.mockRestore();
  });

  it("10) estado vazio sem callbacks", async () => {
    render(
      <CardListExtract
        transactions={[]}
        fetchPage={jest.fn()}
        hasMore={false}
        isPageLoading={false}
      />
    );
    loadAndStop();
    await waitFor(() =>
      expect(
        screen.getByText(/Nenhuma transação encontrada/i)
      ).toBeInTheDocument()
    );
  });
});
