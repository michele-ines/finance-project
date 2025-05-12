"use client";

import { useEffect, useState } from "react";
import CardBalance from "components/my-cards/card-balance/card-balance";
import CardListExtract from "components/my-cards/card-list-extract/card-list-extract";
import CardNewTransaction from "components/my-cards/card-new-transaction/card-new-transaction";

import { Box } from "../../../components/ui";
import type { DashboardData, Transaction } from "../../../interfaces/dashboard";
import { handleRequest } from "utils/error-handlers/error-handle";
import rawData from "../../../mocks/dashboard-data.json";

const data: DashboardData = {
  user: rawData.user,
  balance: rawData.balance,
  investments: rawData.investments,
  transactions: rawData.transactions.map((tx) => ({
    _id: tx.id,
    tipo: tx.type,
    valor: tx.amount,
    createdAt: tx.date,
    updatedAt: tx.date,
  })),
};

export default function DashboardPage() {
  // const data = dashboardData as DashboardData;
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
    // Enviar p/ API ou atualizar contexto.
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    await handleRequest(async () => {
      const formData = new FormData(event.currentTarget);
      const formObject = Object.fromEntries(formData.entries());
      const jsonPayload = JSON.stringify(formObject);
  
      const res = await fetch("/api/transacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: jsonPayload,
      });
  
      if (!res.ok) throw new Error("Falha ao adicionar transação");
  
      const { message, transacao } = await res.json();
      alert(message);
      setTransactions((prevTransactions) => [...prevTransactions, transacao]);
      // Retorne algo compatível
      return new Response(null, { status: 200 });
    });
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <Box className="w-full min-h-screen px-4 py-6 lg:px-12 bg-[var(--byte-bg-dashboard)]">
      <Box className="font-sans max-w-screen-xl mx-auto">
        <Box className="flex flex-col lg:flex-row gap-y-6 lg:gap-x-6 lg:ml-8">
          {/* COLUNA ESQUERDA (Saldo + Nova Transação) */}
          <Box className="flex flex-col gap-6 w-full max-w-full lg:w-[calc(55.666%-12px)]">
            {/* CARD SALDO como componente separado */}
            <CardBalance user={data.user} balance={data.balance} />

            {/* CARD NOVA TRANSAÇÃO (mantido como antes) */}
            <CardNewTransaction onSubmit={onSubmit} />

          </Box>

          {/* COLUNA DIREITA (Extrato) */}
          <Box className="w-full max-w-full lg:w-[calc(44.334%-12px)]">
            <CardListExtract
              transactions={transactions}
              onSave={handleSaveTransactions}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
