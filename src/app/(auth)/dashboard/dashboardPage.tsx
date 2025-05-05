"use client";

import React from "react";
import dashboardData from "../../../constants/dashboardData.json";
import type { DashboardData, Transaction } from "../../../types/dashboard";
import {
  Box,

} from "../../../components/ui";
import { useRouter } from "next/navigation";
import TransactionList from "../../../components/transaction-list/transactionList";
import CardBalance from "components/card-balance/card-balance";
import CardNewTransaction from "components/card-new-transaction/card-new-transaction";

export default function DashboardPage() {
  const data = dashboardData as DashboardData;
  const router = useRouter();

  const handleSaveTransactions = (tx: Transaction[]) => {
    console.log("Transações editadas no extrato:", tx);
    // Enviar p/ API ou atualizar contexto.
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const formObject = Object.fromEntries(formData.entries());
    const jsonPayload = JSON.stringify(formObject);

    try {
      const res = await fetch("/api/transacaoService", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: jsonPayload,
      });

      if (!res.ok) throw new Error("Falha ao adicionar transação");

      const { message } = await res.json();
      alert(message);
      router.push("../");
    } catch (error) {
      console.error("Erro ao adicionar transação:", error);
      alert("Falha ao adicionar transação");
    }
  };

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
            <TransactionList
              transactions={data.transactions}
              onSave={handleSaveTransactions}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
