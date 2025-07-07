"use client";

import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "store/store";
import { fetchBalance } from "store/slices/balanceSlice";

import { Box } from "@mui/material";

import CardBalance from "components/my-cards/card-balance/card-balance";
import CardsOtherService from "components/my-cards/card-other-services/card-other-services";
import CardListExtract from "components/my-cards/card-list-extract/card-list-extract";
import SavingsGoalWidget from "components/widgets/savings-goal-widget";
import SpendingAlertWidget from "components/widgets/spending-alert-widget";

import type { DashboardData, Transaction } from "interfaces/dashboard";
import dashboardData from "mocks/dashboard-data.json";
import { handleRequest } from "utils/error-handlers/error-handle";
import { usePaginatedTransactions } from "hooks/use-paginated-transactions";
import FinancialChart from "components/charts/financialChart";
import { useWidgetPreferences } from "app/hooks/useWidgetPreferences";
import WidgetPreferencesButton from "components/widgets/widget-preferences-button";

export default function OtherServicesPage() {
  const data = dashboardData as DashboardData;
  const dispatch = useDispatch<AppDispatch>();

  // === saldo via Redux ===
  const { value: balanceValue } = useSelector(
    (state: RootState) => state.balance
  );

  const handleAtualizaSaldo = useCallback(async () => {
    await dispatch(fetchBalance());
  }, [dispatch]);

  // fetch inicial do saldo
  useEffect(() => {
    void handleAtualizaSaldo();
  }, [handleAtualizaSaldo]);

  /* -------------------- paginação -------------------- */
  const {
    transactions,
    fetchPage,
    refresh,
    hasMore,
    isLoading: isPageLoading,
  } = usePaginatedTransactions();

  /* -------------- prefs dos widgets ------------------ */
  const { preferences } = useWidgetPreferences();

  /* -------------- callbacks do extrato --------------- */
  const handleSaveTransactions = async (txs: Transaction[]) => {
    await handleRequest(async () => {
      await Promise.all(
        // CORREÇÃO: Adicionado 'async' e corrigido o template literal
        txs.map(async (tx) =>
          fetch(`/api/transacao/${tx._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tipo: tx.tipo, valor: tx.valor }),
          })
        )
      );
      await refresh();
      // atualiza saldo após salvar
      await handleAtualizaSaldo();
    });
  };

  const handleDeleteTransactions = async (ids: number[]) => {
    await handleRequest(async () => {
      await Promise.all(
        // CORREÇÃO: Adicionado 'async' e corrigido o template literal
        ids.map(async (id) =>
          fetch(`/api/transacao/${id}`, { method: "DELETE" })
        )
      );
      await refresh();
      // atualiza saldo após deletar
      await handleAtualizaSaldo();
    });
  };

  /* ------------------------ UI ----------------------- */
  return (
    <Box className="w-full min-h-screen px-4 py-6 lg:px-12 bg-[var(--byte-bg-dashboard)]">
      <Box className="font-sans max-w-screen-xl mx-auto">
        {/* botão de personalização */}
        <Box className="flex justify-end mb-4">
          <WidgetPreferencesButton />
        </Box>

        <Box className="flex flex-col lg:flex-row gap-y-6 lg:gap-x-6 lg:ml-8">
          {/* coluna esquerda */}
          <Box className="flex flex-col gap-6 w-full lg:w-[calc(55.666%-12px)]">
            {/* Balance agora vem do Redux */}
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
            <CardsOtherService />
          </Box>

          {/* coluna direita – extrato com scroll infinito */}
          <Box className="max-w-full flex flex-col">
            <div className="flex-1 overflow-y-auto max-h-[800px]">
              <CardListExtract
                transactions={transactions}
                fetchPage={() => {
                  void fetchPage();
                }}
                hasMore={hasMore}
                isPageLoading={isPageLoading}
                onSave={(txs) => {
                  void handleSaveTransactions(txs);
                }}
                onDelete={handleDeleteTransactions}
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
