import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { NewTransactionData, Transaction } from "interfaces/dashboard";
import { parseBRL } from "utils/currency-formatte/currency-formatte";
import { fetchBalance } from "./balanceSlice";

// ===============================================================
// 1. TIPOS AUXILIARES E TYPE-GUARDS
// ===============================================================
interface TransactionsResponse {
  transacoes: Transaction[];
  total: number;
}

interface CreateTransactionResponse {
  transacao: Transaction;
  message: string;
}

const isTransactionsResponse = (raw: unknown): raw is TransactionsResponse =>
  typeof raw === "object" &&
  raw !== null &&
  "transacoes" in raw &&
  Array.isArray((raw as { transacoes: unknown }).transacoes) &&
  "total" in raw &&
  typeof (raw as { total: unknown }).total === "number";

const isCreateTransactionResponse = (
  raw: unknown
): raw is CreateTransactionResponse =>
  typeof raw === "object" && raw !== null && "transacao" in raw && "message" in raw;

// ===============================================================
// 2. THUNKS (AÇÕES ASSÍNCRONAS)
// ===============================================================

export const fetchTransactions = createAsyncThunk<
  TransactionsResponse,
  number,
  { rejectValue: string }
>("transactions/fetchTransactions", async (page, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/transacao?page=${page}&limit=10`);
    if (!response.ok) {
      return rejectWithValue("Falha ao buscar transações.");
    }

    const raw: unknown = await response.json();
    if (isTransactionsResponse(raw)) return raw;

    return rejectWithValue("Formato inesperado na resposta do servidor.");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro inesperado";
    return rejectWithValue(message);
  }
});

export const createNewTransaction = createAsyncThunk<
  Transaction,
  NewTransactionData,
  { rejectValue: string }
>(
  "transactions/createNew",
  async (transactionData, { dispatch, rejectWithValue }) => {
    try {
      const payload = {
        ...transactionData,
        valor: parseBRL(transactionData.valor),
      };

      const res = await fetch("/api/transacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errRaw: unknown = await res.json();
        const errMsg =
          typeof errRaw === "object" && errRaw !== null && "message" in errRaw
            ? String((errRaw as { message: unknown }).message)
            : "Falha ao adicionar transação";
        return rejectWithValue(errMsg);
      }

      const raw: unknown = await res.json();
      if (isCreateTransactionResponse(raw)) {
        alert(raw.message);
        await dispatch(fetchBalance()).unwrap();
        return raw.transacao;
      }

      return rejectWithValue("Formato inesperado na resposta do servidor.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro inesperado";
      return rejectWithValue(message);
    }
  }
);

export const saveTransactions = createAsyncThunk<
  void,
  Transaction[],
  { rejectValue: string }
>(
  "transactions/saveMultiple",
  async (transactionsToSave, { dispatch, rejectWithValue }) => {
    try {
      await Promise.all(
        transactionsToSave.map(async (tx) => {
          await fetch(`/api/transacao/${tx._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tipo: tx.tipo, valor: tx.valor }),
          });
        })
      );

      // highlight-start
      // AQUI A CORREÇÃO: Limpa o estado antes de buscar os dados atualizados.
      dispatch(clearTransactions());
      // highlight-end
      await dispatch(fetchTransactions(1)).unwrap();
      await dispatch(fetchBalance()).unwrap();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Falha ao salvar as transações.";
      return rejectWithValue(message);
    }
  }
);

export const deleteTransactions = createAsyncThunk<
  void,
  number[],
  { rejectValue: string }
>(
  "transactions/deleteMultiple",
  async (transactionIds, { dispatch, rejectWithValue }) => {
    try {
      await Promise.all(
        transactionIds.map(async (id) => {
          await fetch(`/api/transacao/${id}`, { method: "DELETE" });
        })
      );

      // highlight-start
      // E AQUI A MESMA CORREÇÃO: Limpa o estado para refletir a exclusão.
      dispatch(clearTransactions());
      // highlight-end
      await dispatch(fetchTransactions(1)).unwrap();
      await dispatch(fetchBalance()).unwrap();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Falha ao excluir as transações.";
      return rejectWithValue(message);
    }
  }
);

// ===============================================================
// 3. ESTADO INICIAL E SLICE
// ===============================================================
interface TransactionsState {
  items: Transaction[];
  total: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  creationStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  currentPage: number;
  hasMore: boolean;
}

const initialState: TransactionsState = {
  items: [],
  total: 0,
  status: "idle",
  creationStatus: "idle",
  error: null,
  currentPage: 0,
  hasMore: true,
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    clearTransactions: (state) => {
      state.items = [];
      state.currentPage = 0;
      state.hasMore = true;
      state.status = "idle";
    },
    prependTransaction: (state, action: PayloadAction<Transaction>) => {
      state.items.unshift(action.payload);
      state.total += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchTransactions
      .addCase(fetchTransactions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchTransactions.fulfilled,
        (state, action: PayloadAction<TransactionsResponse>) => {
          state.status = "succeeded";
          const newItems = action.payload.transacoes.filter(
            (newItem) => !state.items.some((item) => item._id === newItem._id)
          );
          state.items.push(...newItems);
          state.total = action.payload.total;
          state.currentPage += 1;
          state.hasMore = state.items.length < state.total;
        }
      )
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Erro desconhecido";
      })

      // createNewTransaction
      .addCase(createNewTransaction.pending, (state) => {
        state.creationStatus = "loading";
      })
      .addCase(
        createNewTransaction.fulfilled,
        (state, action: PayloadAction<Transaction>) => {
          state.creationStatus = "succeeded";
          state.items.unshift(action.payload);
          state.total += 1;
        }
      )
      .addCase(createNewTransaction.rejected, (state, action) => {
        state.creationStatus = "failed";
        state.error = action.payload ?? "Erro desconhecido";
      })

      // save / delete start a loading state
      .addCase(saveTransactions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteTransactions.pending, (state) => {
        state.status = "loading";
      });
  },
});

export const { clearTransactions, prependTransaction } =
  transactionsSlice.actions;
export default transactionsSlice.reducer;