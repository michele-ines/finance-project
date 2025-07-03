"use client";

import { useEffect, useState } from "react";
import { Box, Modal, FormControlLabel, Checkbox } from "@mui/material";

import CardBalance from "components/my-cards/card-balance/card-balance";
import CadInvestments from "components/my-cards/cad-investments/cad-investments";
import CardListExtract from "components/my-cards/card-list-extract/card-list-extract";
import SavingsGoalWidget from "components/widgets/savings-goal-widget";
import SpendingAlertWidget from "components/widgets/spending-alert-widget";

import type { Balance, DashboardData, Transaction } from "interfaces/dashboard";
import dashboardData from "mocks/dashboard-data.json";
import { handleRequest } from "utils/error-handlers/error-handle";
import { usePaginatedTransactions } from "hooks/use-paginated-transactions";

export default function InvestmentPage() {
  const data = dashboardData as DashboardData;

  const balanceData: Balance = {
    account: "Conta Investimento",
    value: 50_000,
  };

  /* -------------------- paginação -------------------- */
  const {
    transactions,
    fetchPage,
    refresh,
    hasMore,
    isLoading: isPageLoading,
  } = usePaginatedTransactions();

  /* ---------------- prefs de widgets ----------------- */
  const [widgetPreferences, setWidgetPreferences] = useState({
    savingsGoal: true,
    spendingAlert: true,
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("widgetPreferencesInvestments");
    if (saved) {
      setWidgetPreferences(
        JSON.parse(saved) as { savingsGoal: boolean; spendingAlert: boolean }
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "widgetPreferencesInvestments",
      JSON.stringify(widgetPreferences)
    );
  }, [widgetPreferences]);

  const toggleWidget = (k: keyof typeof widgetPreferences) =>
    setWidgetPreferences((p) => ({ ...p, [k]: !p[k] }));

  /* ---------------- callbacks Extrato ----------------- */
  const handleSaveTransactions = async (txs: Transaction[]) => {
    await handleRequest(async () => {
      await Promise.all(
        txs.map(async (tx) => {
          await fetch(`/api/transacao/${tx._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tipo: tx.tipo, valor: tx.valor }),
          });
        })
      );
      await refresh();
    });
  };

  const handleDeleteTransactions = async (ids: number[]) => {
    await Promise.all(
      ids.map(async (id) => {
        await fetch(`/api/transacao/${id}`, { method: "DELETE" });
      })
    );
    await refresh();
  };

  /* ----------------------- UI ------------------------- */
  return (
    <Box className="w-full min-h-screen px-4 py-6 lg:px-12 bg-[var(--byte-bg-dashboard)]">
      <Box className="font-sans max-w-screen-xl mx-auto">
        {/* botão de personalização */}
        <Box className="flex justify-end mb-4">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded text-white"
            style={{ backgroundColor: "var(--byte-color-dash)" }}
          >
            Personalizar Widgets
          </button>
        </Box>

        <Box className="flex flex-col lg:flex-row gap-y-6 lg:gap-x-6 lg:ml-8">
          {/* coluna esquerda */}
          <Box className="flex flex-col gap-6 w-full lg:w-[calc(55.666%-12px)]">
            <CardBalance user={data.user} balance={balanceData} />

            {widgetPreferences.spendingAlert && (
              <SpendingAlertWidget limit={2000} transactions={transactions} />
            )}
            {widgetPreferences.savingsGoal && (
              <SavingsGoalWidget goal={3000} transactions={transactions} />
            )}

            <CadInvestments
              balance={balanceData}
              investments={data.investments}
            />
          </Box>

          {/* coluna direita – extrato com scroll */}
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
              />
            </div>
          </Box>
        </Box>

        {/* modal de widgets */}
        <Modal open={showModal} onClose={() => setShowModal(false)}>
          <Box
            className="bg-white p-6 rounded-2xl shadow-md"
            sx={{ width: 480, m: "auto", mt: "15%", outline: "none" }}
          >
            <h2 className="text-xl font-bold mb-4">Personalizar Widgets</h2>

            <FormControlLabel
              control={
                <Checkbox
                  checked={widgetPreferences.spendingAlert}
                  onChange={() => toggleWidget("spendingAlert")}
                  sx={{
                    color: "var(--byte-color-dash)",
                    "&.Mui-checked": { color: "var(--byte-color-dash)" },
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
                    "&.Mui-checked": { color: "var(--byte-color-dash)" },
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
