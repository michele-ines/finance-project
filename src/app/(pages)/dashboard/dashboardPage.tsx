"use client";

import { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "store/store";
import {
  fetchTransactions,
  createNewTransaction,
  saveTransactions,
  deleteTransactions,
} from "store/slices/transactionsSlice";
import { fetchBalance } from "store/slices/balanceSlice";
import { useDashboardData } from "../../hooks/use-dashboard-data";

import CardBalance from "components/my-cards/card-balance/card-balance";
import CardListExtract from "components/my-cards/card-list-extract/card-list-extract";
import CardNewTransaction from "components/my-cards/card-new-transaction/card-new-transaction";
import SavingsGoalWidget from "components/widgets/savings-goal-widget";
import SpendingAlertWidget from "components/widgets/spending-alert-widget";

import { Box } from "@mui/material";

import type {
  DashboardData,
  NewTransactionData,
  Transaction,
} from "interfaces/dashboard";

import dashboardData from "mocks/dashboard-data.json";
import FinancialChart from "components/charts/financialChart";
import WidgetPreferencesButton from "components/widgets/widget-preferences-button";
import { useWidgetPreferences } from "app/hooks/useWidgetPreferences";

export default function DashboardPage() {
  const data: DashboardData = dashboardData;
  const dispatch = useDispatch<AppDispatch>();

  useDashboardData();
  const {
    items: transactions,
    status: transactionsStatus,
    hasMore,
    currentPage,
  } = useSelector((state: RootState) => state.transactions);
  const { value: balanceValue } = useSelector(
    (state: RootState) => state.balance
  );
  const [loadingTransaction] = useState(false);

  /* ---------------- prefs de widgets ----------------- */
  const { preferences } = useWidgetPreferences();
  /* --------------------------------------------------- */

  const fetchNextPage = useCallback(() => {
    if (transactionsStatus !== "loading" && hasMore) {
      void dispatch(fetchTransactions(currentPage + 1));
    }
  }, [dispatch, transactionsStatus, hasMore, currentPage]);

  const onSubmit = async (data: NewTransactionData) => {
    await dispatch(createNewTransaction(data));
  };

  const handleSaveTransactions = async (txs: Transaction[]) => {
    await dispatch(saveTransactions(txs));
  };

  const handleDeleteTransactions = async (ids: number[]) => {
    await dispatch(deleteTransactions(ids));
  };

  const handleAtualizaSaldo = useCallback(async () => {
    await dispatch(fetchBalance());
  }, [dispatch]);

  return (
    <Box className="w-full px-4 py-6 lg:px-12 bg-[var(--byte-bg-dashboard)] flex flex-col">
      <Box className="font-sans max-w-screen-xl mx-auto w-full flex flex-col flex-1 min-h-0">
        <Box className="flex justify-end mb-4">
          <WidgetPreferencesButton />
        </Box>

        <Box className="flex flex-col lg:flex-row gap-y-6 lg:gap-x-6 lg:ml-8 flex-1 min-h-0">
          <Box className="flex flex-col gap-6 w-full max-w-full lg:w-[calc(55.666%-12px)]">
            <CardBalance
              user={data.user}
              balance={{ ...data.balance, value: balanceValue }}
            />
            <FinancialChart />
            {preferences.spendingAlert && (
              <SpendingAlertWidget limit={2000} transactions={transactions} />
            )}
            {preferences.savingsGoal && (
              <SavingsGoalWidget goal={3000} transactions={transactions} />
            )}
            <CardNewTransaction
              onSubmit={onSubmit}
              isLoading={loadingTransaction}
            />
          </Box>

          <Box className="max-w-full flex flex-col">
            <div className="flex-1 overflow-y-auto max-h-[800px]">
              <CardListExtract
                transactions={transactions}
                fetchPage={fetchNextPage}
                hasMore={hasMore}
                isPageLoading={transactionsStatus === "loading"}
                onSave={(txs) => {
                  void handleSaveTransactions(txs);
                }}
                /* onDelete já é Promise<void> no tipo do componente */
                onDelete={handleDeleteTransactions}
                /* atualizaSaldo espera void */
                atualizaSaldo={() => {
                  void handleAtualizaSaldo();
                }}
              />
            </div>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
