"use client";

import { useCallback, useEffect, useState } from "react";
import CardBalance from "components/my-cards/card-balance/card-balance";
import CardListExtract from "components/my-cards/card-list-extract/card-list-extract";
import CardNewTransaction from "components/my-cards/card-new-transaction/card-new-transaction";
import SavingsGoalWidget from "components/widgets/savings-goal-widget";
import SpendingAlertWidget from "components/widgets/spending-alert-widget";

import { Box, Modal, FormControlLabel, Checkbox } from "@mui/material";
import type {
  DashboardData,
  NewTransactionData,
  Transaction,
} from "../../../interfaces/dashboard";
import { handleRequest } from "utils/error-handlers/error-handle";
import dashboardData from "../../../mocks/dashboard-data.json";
import { usePaginatedTransactions } from "hooks/use-paginated-transactions";

export default function DashboardPage() {
  const data: DashboardData = dashboardData;

  /* ▸ widgets ainda precisam das transações   */
  // const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransaction, setLoadingTransaction] = useState(false);
  const [balanceValue, setBalanceValue] = useState<number | null>(null);

  /* ▸ preferências de widgets --------------- */
  const [widgetPreferences, setWidgetPreferences] = useState({
    savingsGoal: true,
    spendingAlert: true,
  });
  const [showModal, setShowModal] = useState(false);

const {
  transactions, // << AQUI ESTÁ A SEGUNDA DECLARAÇÃO
  fetchPage,
  hasMore,
  isLoading: isPageLoading,
} = usePaginatedTransactions();

  /* ▸ carrega prefs do localStorage --------- */
  useEffect(() => {
    const saved = localStorage.getItem("widgetPreferences");
    if (saved) setWidgetPreferences(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "widgetPreferences",
      JSON.stringify(widgetPreferences)
    );
  }, [widgetPreferences]);

  const toggleWidget = (key: keyof typeof widgetPreferences) =>
    setWidgetPreferences((prev) => ({ ...prev, [key]: !prev[key] }));

  /* ▸ saldo sempre vem da API --------------- */
  const fetchBalance = useCallback(async () => {
    await handleRequest(async () => {
      const res = await fetch("/api/transacao/soma-depositos");
      if (!res.ok) throw new Error("Falha ao buscar o saldo");
      const { total } = await res.json();
      setBalanceValue(total);
    });
  }, []);

  /* ▸ callbacks para o CardListExtract ------- */
  const handleSaveTransactions = async (txs: Transaction[]) => {
    await handleRequest(async () => {
      for (const tx of txs) {
        await fetch(`/api/transacao/${tx._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tipo: tx.tipo, valor: tx.valor }),
        });
      }
      // setTransactions(txs);            // mantém widgets em sincronia
      fetchBalance();
    });
  };

  const handleDeleteTransactions = async (ids: number[]) => {
    try {
      await Promise.all(ids.map((id) => fetch(`/api/transacao/${id}`, { method: "DELETE" })));
      // setTransactions((prev) => prev.filter((tx) => !ids.includes(tx._id)));
      fetchBalance();
    } catch (error) {
      console.error("Erro ao excluir transações:", error);
    }
  };

  /* ▸ Nova transação ------------------------ */
  const onSubmit = async (data: NewTransactionData) => {
    await handleRequest(async () => {
      setLoadingTransaction(true);
      const res = await fetch("/api/transacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Falha ao adicionar transação");

      const { message, transacao } = await res.json();
      alert(message);
      // setTransactions((prev) => [...prev, transacao]);
      fetchBalance();
      setLoadingTransaction(false);
    });
  };

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return (
    <Box className="w-full px-4 py-6 lg:px-12 bg-[var(--byte-bg-dashboard)] flex flex-col">
      <Box className="font-sans max-w-screen-xl mx-auto w-full flex flex-col flex-1 min-h-0">
        {/* Botão de personalização */}
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
              balance={{
                ...data.balance,
                value: balanceValue ?? data.balance.value,
              }}
            />

            {/* Os widgets agora usam a lista de transações do hook de paginação */}
            {widgetPreferences.spendingAlert && (
              <SpendingAlertWidget limit={2000} transactions={transactions} />
            )}

            {widgetPreferences.savingsGoal && (
              <SavingsGoalWidget goal={3000} transactions={transactions} />
            )}

            <CardNewTransaction
              onSubmit={onSubmit}
              isLoading={loadingTransaction}
            />
          </Box>

          {/* Coluna direita */}
          {/* 4. A coluna da direita também precisa ser um container flex para o filho crescer */}
          <Box className="max-w-full flex flex-col">
            
            <div className="flex-1 overflow-y-auto max-h-[800px]">
              <CardListExtract
                transactions={transactions}
                fetchPage={fetchPage}
                hasMore={hasMore}
                isPageLoading={isPageLoading}
                onSave={handleSaveTransactions}
                onDelete={handleDeleteTransactions}
                atualizaSaldo={fetchBalance}
              />
            </div>
          </Box>
        </Box>


        {/* Modal de personalização */}
        <Modal open={showModal} onClose={() => setShowModal(false)}>
          <Box
            className="bg-white p-6 rounded-2xl shadow-md text-gray-800"
            sx={{ width: 480, margin: "auto", mt: "15%", outline: "none" }}
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
