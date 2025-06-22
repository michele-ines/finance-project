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
// 1) fontes next/font/google
jest.mock("next/font/google", () => ({
  Inter: ()       => ({ className: "mocked-inter",       variable: "--mocked-inter" }),
  Roboto_Mono: () => ({ className: "mocked-roboto-mono", variable: "--mocked-roboto-mono" }),
}));

// 2) sentinel (mantendo alias components/…)
jest.mock(
  "components/infinite-scroll-sentinel/infinite-scroll-sentinel",
  () => ({
    __esModule: true,
    default: () => <div data-testid="sentinel" />,
  }),
  { virtual: true },
);

// 3) hook de paginação – skeleton → lista
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
const flushTimers = () => act(() => jest.runAllTimers());

/* callbacks dummy */
const onSave        = jest.fn();
const onDelete      = jest.fn().mockResolvedValue(undefined);
const atualizaSaldo = jest.fn().mockResolvedValue(undefined);

/* ======================================================== */
/*                         TESTES                           */
/* ======================================================== */
describe("CardListExtract – cobertura total ajustada", () => {
  beforeEach(() => jest.clearAllMocks());

  /* 1) Skeleton → lista -------------------------------- */
  it("1) Mostra skeleton e depois a lista", () => {
    render(<CardListExtract onSave={onSave} onDelete={onDelete} atualizaSaldo={atualizaSaldo} />);

    expect(
      screen.getAllByRole("listitem").filter(li => li.querySelector(".animate-pulse")),
    ).toHaveLength(5);

    flushTimers();

    expect(
      screen.queryAllByRole("listitem").some(li => li.querySelector(".animate-pulse")),
    ).toBe(false);
  });

  /* 2) valores formatados ------------------------------ */
  it("2) Exibe transações e valores formatados", async () => {
    render(<CardListExtract />);
    flushTimers();

    await waitFor(() => {
      expect(screen.getByText("Entrada")).toBeInTheDocument();
      expect(screen.getByText("Saída")).toBeInTheDocument();
      expect(screen.getByText("R$ 1.000,00")).toBeInTheDocument();
      expect(screen.getByText(/500,00/)).toBeInTheDocument();
    });
  });

  /* 3) editar / cancelar ------------------------------- */
  it("3) handleEditClick e handleCancelClick", async () => {
    render(<CardListExtract onSave={onSave} />);
    flushTimers();

    fireEvent.click(await screen.findByLabelText("editar"));

    expect(screen.getAllByDisplayValue(/Entrada|Saída/)).toHaveLength(2);
    fireEvent.click(screen.getByText("Cancelar"));
    expect(screen.getByText("Entrada")).toBeInTheDocument();
  });

  /* 4) alteração + salvar ------------------------------ */
  it("4) handleTransactionChange modifica tipo e valor", async () => {
    render(<CardListExtract onSave={onSave} />);
    flushTimers();

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

  /* 5) checkbox toggle -------------------------------- */
  it("5) handleCheckboxChange adiciona e remove seleção", async () => {
    render(<CardListExtract />);
    flushTimers();

    fireEvent.click(screen.getByLabelText("excluir"));
    const [box] = await screen.findAllByRole("checkbox");

    fireEvent.click(box);
    expect(box).toBeChecked();
    fireEvent.click(box);
    expect(box).not.toBeChecked();
  });

  /* 6) cancelar exclusão ------------------------------ */
  it("6) handleDeleteClick e handleCancelDeleteClick", async () => {
    render(<CardListExtract />);
    flushTimers();

    fireEvent.click(screen.getByLabelText("excluir"));
    expect(screen.getByText("Excluir")).toBeDisabled();

    fireEvent.click(screen.getByText("Cancelar"));
    expect(screen.queryByRole("checkbox")).toBeNull();
  });

  /* 7) exclusão com seleção --------------------------- */
  it("7) exclusão dispara onDelete e atualizaSaldo", async () => {
    render(<CardListExtract onDelete={onDelete} atualizaSaldo={atualizaSaldo} />);
    flushTimers();

    fireEvent.click(screen.getByLabelText("excluir"));
    const [chk] = await screen.findAllByRole("checkbox");
    fireEvent.click(chk);
    fireEvent.click(screen.getByText("Excluir"));

    await waitFor(() => expect(onDelete).toHaveBeenCalledWith([1]));
    expect(atualizaSaldo).toHaveBeenCalled();
  });

  /* 8) cleanup no unmount ----------------------------- */
  it("8) cleanup de timeout no unmount", () => {
    const { unmount } = render(<CardListExtract />);
    unmount();
    act(() => jest.runAllTimers()); // nada deve acusar act warning
  });

  /* 9) onDelete rejeitado ----------------------------- */
  it("9) console.error em onDelete rejection", async () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    const failingDelete = jest.fn().mockRejectedValue(new Error("boom"));

    render(<CardListExtract onDelete={failingDelete} />);
    flushTimers();

    fireEvent.click(await screen.findByLabelText("excluir"));
    const [chk] = await screen.findAllByRole("checkbox");
    fireEvent.click(chk);
    fireEvent.click(screen.getByText("Excluir"));

    await waitFor(() =>
      expect(spy).toHaveBeenCalledWith(
        "Erro ao excluir transações:",
        expect.any(Error),
      ),
    );
    spy.mockRestore();
  });

  /* 10) estado vazio --------------------------------- */
  it("10) Estado vazio sem callbacks", async () => {
    // limpa lista simulando retorno vazio
    mockTransactions.length = 0;

    render(<CardListExtract />);
    flushTimers();

    await waitFor(() =>
      expect(
        screen.getByText(/Nenhuma transação encontrada/i),
      ).toBeInTheDocument(),
    );
  });
});
