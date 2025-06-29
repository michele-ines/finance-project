import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// --- 1. Criando o Thunk para buscar o saldo ---
// Esta é a nossa lógica de API encapsulada.
export const fetchBalance = createAsyncThunk(
  'balance/fetchBalance',
  async (_, { rejectWithValue }) => { // O primeiro argumento é _ porque não precisamos passar parâmetros
    try {
      const res = await fetch("/api/transacao/soma-depositos");
      if (!res.ok) {
        throw new Error("Falha ao buscar o saldo");
      }
      const { total } = await res.json();
      return total as number; // O thunk vai retornar apenas o valor do saldo
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// --- 2. Definindo o estado inicial e a interface ---
interface BalanceState {
  value: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BalanceState = {
  value: 0,
  status: 'idle', // Começa como 'ocioso'
  error: null,
};

// --- 3. Criando o Slice ---
const balanceSlice = createSlice({
  name: 'balance',
  initialState,
  reducers: {
    // Reducers síncronos poderiam ir aqui se precisássemos, como para adicionar/subtrair valores
  },
  // O extraReducers ouve as ações do nosso thunk assíncrono
  extraReducers: (builder) => {
    builder
      .addCase(fetchBalance.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBalance.fulfilled, (state, action: PayloadAction<number>) => {
        state.status = 'succeeded';
        state.value = action.payload; // Atualiza o valor do saldo com o que veio da API
      })
      .addCase(fetchBalance.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default balanceSlice.reducer;