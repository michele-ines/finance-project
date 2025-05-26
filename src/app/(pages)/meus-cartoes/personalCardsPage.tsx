"use client";

import CardBalance from "components/my-cards/card-balance/card-balance";
import CardListExtract from "components/my-cards/card-list-extract/card-list-extract";
import PersonalCards from "components/my-cards/personal-cards/personal-cards";

import { Box } from "../../../components/ui";
import type { DashboardData, Transaction } from "../../../interfaces/dashboard";
import dashboardData from "../../../mocks/dashboard-data.json";
import { useEffect, useState } from "react";
import { handleRequest } from "utils/error-handlers/error-handle";

export default function PersonalCardsPage() {
  const data = dashboardData as DashboardData;
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchTransactions = async () => {
    await handleRequest(async () => {
      const res = await fetch("/api/transacao");
      if (!res.ok) throw new Error("Falha ao buscar transações");
      const { transacoes } = await res.json();
      setTransactions(transacoes);
    });
  };

  const handleSaveTransactions = (tx: Transaction[]) => {
    console.log("Transações editadas no extrato:", tx);
    setTransactions(tx);
    // Aqui poderia ter uma lógica para enviar as alterações para a API
  };

  const handleDeleteTransactions = async (transactionIds: number[]) => {
    try {
      // Realizar as chamadas DELETE para cada transação selecionada
      const deletePromises = transactionIds.map(async (id) => {
        const response = await fetch(`/api/transacao/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`Erro ao excluir transação ${id}`);
        }

        return response.json();
      });

      await Promise.all(deletePromises);

      const updatedTransactions = transactions.filter(
        (tx) => !transactionIds.includes(tx._id)
      );

      setTransactions(updatedTransactions);
      console.log("Transações excluídas com sucesso:", transactionIds);
    } catch (error) {
      console.error("Erro ao excluir transações:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);
  return (
    <Box className="w-full min-h-screen px-4 py-6 lg:px-12 bg-[var(--byte-bg-dashboard)]">
      <Box className="font-sans max-w-screen-xl mx-auto">
        <Box className="flex flex-col lg:flex-row gap-y-6 lg:gap-x-6 lg:ml-8">
          {/* COLUNA ESQUERDA */}
          <Box className="flex flex-col gap-6 w-full max-w-full lg:w-[calc(55.666%-12px)]">
            <CardBalance user={data.user} balance={data.balance} />
            <PersonalCards />
          </Box>

          {/* COLUNA DIREITA */}
          <Box className="w-full max-w-full lg:w-[calc(44.334%-12px)]">
            <CardListExtract
              transactions={transactions}
              onSave={handleSaveTransactions}
              onDelete={handleDeleteTransactions}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
