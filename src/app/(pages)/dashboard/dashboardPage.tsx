"use client";

import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "store/store";
import {
  fetchTransactions,
  createNewTransaction,
  saveTransactions,
  deleteTransactions,
  SavePayload,
} from "store/slices/transactionsSlice";
import { fetchBalance } from "store/slices/balanceSlice";

import CardBalance from "components/my-cards/card-balance/card-balance";
import CardListExtract, { TxWithFiles } from "components/my-cards/card-list-extract/card-list-extract";
import CardNewTransaction from "components/my-cards/card-new-transaction/card-new-transaction";
import SavingsGoalWidget from "components/widgets/savings-goal-widget";
import SpendingAlertWidget from "components/widgets/spending-alert-widget";

import { Box, Modal, FormControlLabel, Checkbox } from "@mui/material";

import type {
  DashboardData,
  NewTransactionData,
} from "interfaces/dashboard";

import dashboardData from "mocks/dashboard-data.json";
import FinancialChart from "components/charts/financialChart";
import { useDashboardData } from "app/hooks/use-dashboard-data";

export default function DashboardPage() {
  const data: DashboardData = dashboardData;
  const dispatch = useDispatch<AppDispatch>();

  useDashboardData();

  const {
    items: transactions,
    status: transactionsStatus,
    creationStatus,
    hasMore,
    currentPage,
  } = useSelector((state: RootState) => state.transactions);

  const { value: balanceValue } = useSelector(
    (state: RootState) => state.balance
  );

  const [widgetPreferences, setWidgetPreferences] = useState({
    savingsGoal: true,
    spendingAlert: true,
  });

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("widgetPreferences");
    if (saved) {
      setWidgetPreferences(JSON.parse(saved) as {
        savingsGoal: boolean;
        spendingAlert: boolean;
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "widgetPreferences",
      JSON.stringify(widgetPreferences)
    );
  }, [widgetPreferences]);

  const toggleWidget = (key: keyof typeof widgetPreferences) =>
    setWidgetPreferences((prev) => ({ ...prev, [key]: !prev[key] }));

  const fetchNextPage = useCallback(() => {
    if (transactionsStatus !== "loading" && hasMore) {
      void dispatch(fetchTransactions(currentPage + 1));
    }
  }, [dispatch, transactionsStatus, hasMore, currentPage]);

  const onSubmit = async (data: NewTransactionData) => {

    try {
      await dispatch(createNewTransaction(data)).unwrap();
    } catch (error) {
      console.error("Falha ao criar a transação:", error);
    }
  };

  const handleSaveTransactions = async (txsToSave: TxWithFiles[]) => {
    const payload: SavePayload = { transactions: txsToSave };
    try {
      await dispatch(saveTransactions(payload)).unwrap();
    } catch (error) {
      console.error("Falha ao salvar as transações:", error);
    }
  };

  const handleDeleteTransactions = async (ids: number[]) => {
    try {
      await dispatch(deleteTransactions(ids)).unwrap();
    } catch (error) {
      console.error("Falha ao deletar as transações:", error);
    }
  };

  const handleAtualizaSaldo = useCallback(() => {
    void dispatch(fetchBalance());
  }, [dispatch]);

  return (
    <Box className="w-full px-4 py-6 lg:px-12 bg-[var(--byte-bg-dashboard)] flex flex-col">
      <Box className="font-sans max-w-screen-xl mx-auto w-full flex flex-col flex-1 min-h-0">
        <Box className="flex justify-end mb-4">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded text-white"
            style={{ backgroundColor: "var(--byte-color-dash)" }}
          >
            Personalizar Widgets
          </button>
        </Box>

        <Box className="flex flex-col lg:flex-row gap-y-6 lg:gap-x-6 lg:ml-8 flex-1 min-h-0">
          <Box className="flex flex-col gap-6 w-full max-w-full lg:w-[calc(55.666%-12px)]">
            <CardBalance
              user={data.user}
              balance={{ ...data.balance, value: balanceValue }}
            />
            <FinancialChart />
            {widgetPreferences.spendingAlert && (
              <SpendingAlertWidget transactions={transactions} limit={2000} />
            )}
            {widgetPreferences.savingsGoal && (
              <SavingsGoalWidget transactions={transactions} goal={3000} />
            )}
            <CardNewTransaction
              onSubmit={onSubmit}
              isLoading={creationStatus === "loading"}
            />
          </Box>

          <Box className="max-w-full flex flex-col">
            <div className="flex-1 overflow-y-auto max-h-[800px]">
              <CardListExtract
                transactions={transactions}
                fetchPage={fetchNextPage}
                hasMore={hasMore}
                isPageLoading={transactionsStatus === "loading"}
                onSave={handleSaveTransactions}
                onDelete={handleDeleteTransactions}
                atualizaSaldo={handleAtualizaSaldo}
              />
            </div>
          </Box>
        </Box>

        <Modal open={showModal} onClose={() => setShowModal(false)}>
          <Box
            className="bg-white p-6 rounded-2xl shadow-md text-gray-800"
            sx={{
              width: 480,
              margin: "auto",
              mt: "15%",
              outline: "none",
            }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Personalizar Widgets
            </h2>
            <FormControlLabel
              control={
                <Checkbox
                  checked={widgetPreferences.spendingAlert}
                  onChange={() => toggleWidget("spendingAlert")}
                  sx={{
                    color: "var(--byte-color-dash)",
                    "&.Mui-checked": {
                      color: "var(--byte-color-dash)",
                    },
                  }}
                />
              }
              label="Alerta de Gastos"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={widgetPreferences.savingsGoal}
                  onChange={() => toggleWidget("savingsGoal")}
                  sx={{
                    color: "var(--byte-color-dash)",
                    "&.Mui-checked": {
                      color: "var(--byte-color-dash)",
                    },
                  }}
                />
              }
              label="Meta de Economia"
            />
            <Box className="mt-4 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-white rounded"
                style={{ backgroundColor: "var(--byte-color-dash)" }}
              >
                Fechar
              </button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}