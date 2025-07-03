import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from 'store/store';
import { fetchTransactions } from 'store/slices/transactionsSlice';
import { fetchBalance } from 'store/slices/balanceSlice';

/**
 * Hook customizado responsável por carregar os dados iniciais do dashboard,
 * como transações e saldo, se eles ainda não tiverem sido carregados.
 */
export const useDashboardData = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Observa os status dos nossos slices
  const { transactionsStatus, balanceStatus } = useSelector((state: RootState) => ({
    transactionsStatus: state.transactions.status,
    balanceStatus: state.balance.status,
  }));

  // Este efeito unificado cuida de toda a lógica de carregamento inicial
  useEffect(() => {
    // Busca transações apenas se o estado estiver 'ocioso'
    if (transactionsStatus === 'idle') {
      dispatch(fetchTransactions(1));
    }

    // Busca o saldo apenas se o estado estiver 'ocioso'
    if (balanceStatus === 'idle') {
      dispatch(fetchBalance());
    }
    // Este efeito depende dos status e do dispatch para funcionar
  }, [transactionsStatus, balanceStatus, dispatch]);
};