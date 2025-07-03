import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from 'store/store';
import { fetchTransactions } from 'store/slices/transactionsSlice';
import { fetchBalance } from 'store/slices/balanceSlice';

/**
 * Hook responsável por carregar os dados iniciais do dashboard
 * (transações e saldo) caso ainda não tenham sido buscados.
 */
export const useDashboardData = (): void => {
  const dispatch = useDispatch<AppDispatch>();

  const { transactionsStatus, balanceStatus } = useSelector(
    (state: RootState) => ({
      transactionsStatus: state.transactions.status,
      balanceStatus: state.balance.status,
    }),
  );

  useEffect(() => {
    /* evita no-floating-promises: marcamos a Promise como ignorada */
    if (transactionsStatus === 'idle') {
      void dispatch(fetchTransactions(1));
    }

    if (balanceStatus === 'idle') {
      void dispatch(fetchBalance());
    }
  }, [transactionsStatus, balanceStatus, dispatch]);
};
