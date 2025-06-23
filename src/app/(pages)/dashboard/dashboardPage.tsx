/* -------------------------------------------------------------------------- */
/*  src/app/(pages)/dashboard/dashboardPage.tsx                               */
/* -------------------------------------------------------------------------- */
"use client";

import { useCallback, useEffect, useState } from "react";
import CardBalance         from "components/my-cards/card-balance/card-balance";
import CardListExtract     from "components/my-cards/card-list-extract/card-list-extract";
import CardNewTransaction  from "components/my-cards/card-new-transaction/card-new-transaction";
import SavingsGoalWidget   from "components/widgets/savings-goal-widget";
import SpendingAlertWidget from "components/widgets/spending-alert-widget";

import {
  Box,
  Modal,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import type {
  DashboardData,
  NewTransactionData,
  Transaction,
} from "interfaces/dashboard";

import { parseBRL }   from "utils/currency-formatte/currency-formatte";        // ⬅️ novo
import { handleRequest } from "utils/error-handlers/error-handle";
import dashboardData     from "mocks/dashboard-data.json";
import { usePaginatedTransactions } from "hooks/use-paginated-transactions";

export default function DashboardPage() {
  const data: DashboardData = dashboardData;

  /* -------------------------------------------------------- */
  /*  Estados locais                                          */
  /* -------------------------------------------------------- */
  const [loadingTransaction, setLoadingTransaction] = useState(false);
  const [balanceValue,       setBalanceValue]       = useState<number | null>(null);

  /* prefs de widgets --------------------------------------- */
  const [widgetPreferences, setWidgetPreferences] = useState({
    savingsGoal:   true,
    spendingAlert: true,
  });
  const [showModal, setShowModal] = useState(false);

  /* -------------------------------------------------------- */
  /*  Paginação                                               */
  /* -------------------------------------------------------- */
  const {
    transactions,
    fetchPage,
    prepend,            // ⬅️ novo
    refresh,            // ⬅️ novo
    hasMore,
    isLoading: isPageLoading,
  } = usePaginatedTransactions();

  /* -------------------------------------------------------- */
  /*  Carrega prefs                                           */
  /* -------------------------------------------------------- */
  useEffect(() => {
    const saved = localStorage.getItem("widgetPreferences");
    if (saved) setWidgetPreferences(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("widgetPreferences", JSON.stringify(widgetPreferences));
  }, [widgetPreferences]);

  const toggleWidget = (key: keyof typeof widgetPreferences) =>
    setWidgetPreferences(prev => ({ ...prev, [key]: !prev[key] }));

  /* -------------------------------------------------------- */
  /*  Saldo                                                   */
  /* -------------------------------------------------------- */
  const fetchBalance = useCallback(async () => {
    await handleRequest(async () => {
      const res = await fetch("/api/transacao/soma-depositos");
      if (!res.ok) throw new Error("Falha ao buscar o saldo");
      const { total } = await res.json();
      setBalanceValue(total);
    });
  }, []);

  /* -------------------------------------------------------- */
  /*  Callbacks do Extrato                                    */
  /* -------------------------------------------------------- */
  const handleSaveTransactions = async (txs: Transaction[]) => {
    await handleRequest(async () => {
      await Promise.all(
        txs.map(tx =>
          fetch(`/api/transacao/${tx._id}`, {
            method:  "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tipo: tx.tipo, valor: tx.valor }),
          })
        )
      );
      await refresh();        // ⬅️ garante lista nova
      fetchBalance();
    });
  };

  const handleDeleteTransactions = async (ids: number[]) => {
    try {
      await Promise.all(
        ids.map(id => fetch(`/api/transacao/${id}`, { method: "DELETE" }))
      );
      await refresh();        // ⬅️ recarrega sem itens excluídos
      fetchBalance();
    } catch (err) {
      console.error("Erro ao excluir transações:", err);
    }
  };

  /* -------------------------------------------------------- */
  /*  Nova transação                                          */
  /* -------------------------------------------------------- */
  const onSubmit = async (data: NewTransactionData) => {
    await handleRequest(async () => {
      setLoadingTransaction(true);

      const payload = { ...data, valor: parseBRL(data.valor) }; // ⬅️ parse
      const res = await fetch("/api/transacao", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Falha ao adicionar transação");

      const { transacao, message } = await res.json();
      alert(message);

      prepend(transacao);     // ⬅️ aparece no topo
      fetchBalance();
      setLoadingTransaction(false);
    });
  };

  /* carrega saldo na montagem */
  useEffect(() => { fetchBalance(); }, [fetchBalance]);

  /* -------------------------------------------------------- */
  /*  Render                                                  */
  /* -------------------------------------------------------- */
  return (
    <Box className="w-full px-4 py-6 lg:px-12 bg-[var(--byte-bg-dashboard)] flex flex-col">
      <Box className="font-sans max-w-screen-xl mx-auto w-full flex flex-col flex-1 min-h-0">
        {/* Botão de personalização -------------------------------------- */}
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
          {/* Coluna esquerda -------------------------------------------- */}
          <Box className="flex flex-col gap-6 w-full max-w-full lg:w-[calc(55.666%-12px)]">
            <CardBalance
              user={data.user}
              balance={{
                ...data.balance,
                value: balanceValue ?? data.balance.value,
              }}
            />

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

          {/* Coluna direita (Extrato) ----------------------------------- */}
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

        {/* Modal de personalização ------------------------------------- */}
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
