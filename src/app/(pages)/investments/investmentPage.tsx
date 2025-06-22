"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Modal,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import CardBalance from "../../../components/my-cards/card-balance/card-balance";
import CadInvestments from "../../../components/my-cards/cad-investments/cad-investments";
import CardListExtract from "../../../components/my-cards/card-list-extract/card-list-extract";
import SavingsGoalWidget from "../../../components/widgets/savings-goal-widget";
import SpendingAlertWidget from "../../../components/widgets/spending-alert-widget";

import type {
  Balance,
  DashboardData,
  Transaction,
} from "../../../interfaces/dashboard";

import dashboardData from "../../../mocks/dashboard-data.json";
import { handleRequest } from "../../../utils/error-handlers/error-handle";

export default function InvestmentPage() {
  /* ------------------------------------------------------------------ */
  /* MOCK DATA (substitua por dados reais assim que houver API)          */
  /* ------------------------------------------------------------------ */
  const data = dashboardData as DashboardData;

  const balanceData: Balance = {
    account: "Conta Investimento",
    value: 50_000,
  };

  /* ------------------------------------------------------------------ */
  /* STATE                                                               */
  /* ------------------------------------------------------------------ */
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  /* ▸ preferências de widgets ---------------------------------------- */
  const [widgetPreferences, setWidgetPreferences] = useState({
    savingsGoal: true,
    spendingAlert: true,
  });
  const [showModal, setShowModal] = useState(false);

  /* ------------------------------------------------------------------ */
  /* EFFECTS                                                             */
  /* ------------------------------------------------------------------ */
  /** carrega prefs do localStorage uma única vez **/
  useEffect(() => {
    const saved = localStorage.getItem("widgetPreferencesInvestments");
    if (saved) setWidgetPreferences(JSON.parse(saved));
  }, []);

  /** salva prefs a cada alteração **/
  useEffect(() => {
    localStorage.setItem(
      "widgetPreferencesInvestments",
      JSON.stringify(widgetPreferences)
    );
  }, [widgetPreferences]);

  /** carrega transações na primeira renderização **/
  useEffect(() => {
    fetchTransactions();
  }, []);

  /* ------------------------------------------------------------------ */
  /* HANDLERS                                                            */
  /* ------------------------------------------------------------------ */
  const toggleWidget = (key: keyof typeof widgetPreferences) =>
    setWidgetPreferences((prev) => ({ ...prev, [key]: !prev[key] }));

  const fetchTransactions = async () => {
    await handleRequest(async () => {
      const res = await fetch("/api/transacao");
      if (!res.ok) throw new Error("Falha ao buscar transações");
      const { transacoes } = await res.json();
      setTransactions(transacoes);
    });
  };

  const handleSaveTransactions = async (txs: Transaction[]) => {
    console.log("Transações editadas no extrato:", txs);
    setTransactions(txs);
    // Caso precise, faça a chamada PUT individual aqui.
  };

  const handleDeleteTransactions = async (transactionIds: number[]) => {
    try {
      await Promise.all(
        transactionIds.map((id) =>
          fetch(`/api/transacao/${id}`, { method: "DELETE" })
        )
      );
      setTransactions((prev) =>
        prev.filter((tx) => !transactionIds.includes(tx._id))
      );
      console.log("Transações excluídas com sucesso:", transactionIds);
    } catch (error) {
      console.error("Erro ao excluir transações:", error);
      throw error;
    }
  };

  /* ------------------------------------------------------------------ */
  /* RENDER                                                              */
  /* ------------------------------------------------------------------ */
  return (
    <Box className="w-full min-h-screen px-4 py-6 lg:px-12 bg-[var(--byte-bg-dashboard)]">
      <Box className="font-sans max-w-screen-xl mx-auto">
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

        <Box className="flex flex-col lg:flex-row gap-y-6 lg:gap-x-6 lg:ml-8">
          {/* COLUNA ESQUERDA --------------------------------------------- */}
          <Box className="flex flex-col gap-6 w-full max-w-full lg:w-[calc(55.666%-12px)]">
            {/* SALDO DE INVESTIMENTOS */}
            <CardBalance user={data.user} balance={balanceData} />

            {/* WIDGETS ---------------------------------------------------- */}
            {widgetPreferences.spendingAlert && (
              <SpendingAlertWidget limit={2000} transactions={transactions} />
            )}

            {widgetPreferences.savingsGoal && (
              <SavingsGoalWidget goal={3000} transactions={transactions} />
            )}

            {/* CARD DE INVESTIMENTOS ------------------------------------ */}
            <CadInvestments
              balance={balanceData}
              investments={data.investments}
            />
          </Box>

          {/* COLUNA DIREITA ---------------------------------------------- */}
          <Box className="w-full max-w-full lg:w-[calc(44.334%-12px)]">
            <CardListExtract
              onSave={handleSaveTransactions}
              onDelete={handleDeleteTransactions}
            />
          </Box>
        </Box>

        {/* MODAL DE PERSONALIZAÇÃO --------------------------------------- */}
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
