import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { NewTransactionData, Transaction } from 'interfaces/dashboard';
import { parseBRL } from 'utils/currency-formatte/currency-formatte';
import { fetchBalance } from './balanceSlice';

// ===================================================================
// 1. DEFINIÇÃO DE TODOS OS THUNKS (AÇÕES ASSÍNCRONAS)
// ===================================================================

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (page: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/transacao?page=${page}&limit=10`);
      if (!response.ok) throw new Error('Falha ao buscar transações.');
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createNewTransaction = createAsyncThunk(
  'transactions/createNew',
  async (transactionData: NewTransactionData, { dispatch, rejectWithValue }) => {
    try {
      const payload = { ...transactionData, valor: parseBRL(transactionData.valor) };
      console.log(payload)
      const res = await fetch("/api/transacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Falha ao adicionar transação");
      }

      const { transacao, message } = await res.json();
      alert(message);
      dispatch(fetchBalance()); // Despacha a atualização do saldo
      return transacao as Transaction; // Retorna a nova transação para o reducer

    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveTransactions = createAsyncThunk(
  'transactions/saveMultiple',
  async (transactionsToSave: Transaction[], { dispatch, rejectWithValue }) => {
    try {
      await Promise.all(
        transactionsToSave.map(tx =>
          fetch(`/api/transacao/${tx._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tipo: tx.tipo, valor: tx.valor }),
          })
        )
      );
      await dispatch(fetchTransactions(1));
      await dispatch(fetchBalance());
      return;
    } catch (error: any) {
      console.error("Erro ao salvar transações:", error);
      return rejectWithValue("Falha ao salvar as transações.");
    }
  }
);

export const deleteTransactions = createAsyncThunk(
  'transactions/deleteMultiple',
  async (transactionIds: number[], { dispatch, rejectWithValue }) => {
    try {
      await Promise.all(
        transactionIds.map(id => fetch(`/api/transacao/${id}`, { method: "DELETE" }))
      );
      await dispatch(fetchTransactions(1));
      await dispatch(fetchBalance());
      return;
    } catch (error: any) {
      console.error("Erro ao excluir transações:", error);
      return rejectWithValue("Falha ao excluir as transações.");
    }
  }
);


// ===================================================================
// 2. DEFINIÇÃO DO ESTADO E DA INTERFACE DO SLICE
// ===================================================================

interface TransactionsState {
  items: Transaction[];
  total: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  creationStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  currentPage: number;
  hasMore: boolean;
}

const initialState: TransactionsState = {
  items: [],
  total: 0,
  status: 'idle',
  creationStatus: 'idle', // <<< NOVO: Valor inicial
  error: null,
  currentPage: 0,
  hasMore: true,
};


// ===================================================================
// 3. CRIAÇÃO DO SLICE COM REDUCERS E EXTRAREDUCERS
// ===================================================================

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  // Reducers são para ações síncronas
  reducers: {
    clearTransactions: (state) => {
      state.items = [];
      state.currentPage = 0;
      state.hasMore = true;
      state.status = 'idle';
    },
    // O prependTransaction pode ser removido pois a lógica agora vive no extraReducer
    // Mas vamos mantê-lo caso seja útil para alguma atualização otimista no futuro
    prependTransaction: (state, action: PayloadAction<Transaction>) => {
      state.items.unshift(action.payload);
      state.total += 1;
    },
  },
  // extraReducers são para ouvir ações de fora do slice, como nossos thunks
  extraReducers: (builder) => {
    builder
      // Ciclo de vida para buscar transações (fetchTransactions)
      .addCase(fetchTransactions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const newItems = action.payload.transacoes.filter(
          (newItem: Transaction) => !state.items.some(existingItem => existingItem._id === newItem._id)
        );
        state.items.push(...newItems);
        state.total = action.payload.total;
        state.currentPage += 1;
        state.hasMore = state.items.length < state.total;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // <<< NOVO: Ciclo de vida para criar uma nova transação (createNewTransaction) >>>
      .addCase(createNewTransaction.pending, (state) => {
        state.creationStatus = 'loading';
      })
      .addCase(createNewTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.creationStatus = 'succeeded';
        // A lógica de adicionar ao topo da lista agora vive aqui!
        state.items.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createNewTransaction.rejected, (state, action) => {
        state.creationStatus = 'failed';
        state.error = action.payload as string; // Pode-se ter um erro de criação específico
      })

      .addCase(saveTransactions.pending, (state) => {
        state.status = 'loading'; // Reutiliza o status geral para mostrar um loading na lista
      })
      .addCase(deleteTransactions.pending, (state) => {
        state.status = 'loading'; // Reutiliza o status geral
      });
  },
});

export const { clearTransactions, prependTransaction } = transactionsSlice.actions;

export default transactionsSlice.reducer;