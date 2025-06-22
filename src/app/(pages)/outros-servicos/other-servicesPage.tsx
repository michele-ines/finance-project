"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Modal,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import CardBalance from "components/my-cards/card-balance/card-balance";
import CardListExtract from "components/my-cards/card-list-extract/card-list-extract";
import CardsOtherService from "components/my-cards/card-other-services/card-other-services";
import SavingsGoalWidget from "components/widgets/savings-goal-widget";
import SpendingAlertWidget from "components/widgets/spending-alert-widget";

import type { DashboardData, Transaction } from "../../../interfaces/dashboard";
import dashboardData from "../../../mocks/dashboard-data.json";
import { handleRequest } from "utils/error-handlers/error-handle";

export default function OtherServicesPage() {
  const data = dashboardData as DashboardData;

  /* ------------------------------------------------------------------ */
  /* STATE                                                               */
  /* ------------------------------------------------------------------ */
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [widgetPreferences, setWidgetPreferences] = useState({
    savingsGoal: true,
    spendingAlert: true,
  });
  const [showModal, setShowModal] = useState(false);

  /* ------------------------------------------------------------------ */
  /* EFFECTS                                                             */
  /* ------------------------------------------------------------------ */
  /** prefs */
  useEffect(() => {
    const saved = localStorage.getItem("widgetPreferencesOtherServices");
    if (saved) setWidgetPreferences(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "widgetPreferencesOtherServices",
      JSON.stringify(widgetPreferences)
    );
  }, [widgetPreferences]);

  /** transações para widgets */
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
    setTransactions(txs);
  };

  const handleDeleteTransactions = async (ids: number[]) => {
    setTransactions((prev) => prev.filter((tx) => !ids.includes(tx._id)));
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
            <CardBalance user={data.user} balance={data.balance} />

            {widgetPreferences.spendingAlert && (
              <SpendingAlertWidget limit={2000} transactions={transactions} />
            )}

            {widgetPreferences.savingsGoal && (
              <SavingsGoalWidget goal={3000} transactions={transactions} />
            )}

            <CardsOtherService />
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
