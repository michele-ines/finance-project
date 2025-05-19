"use client";

import { useCallback, useEffect, useState } from "react";
import CardBalance from "components/my-cards/card-balance/card-balance";
import CardListExtract from "components/my-cards/card-list-extract/card-list-extract";
import CardNewTransaction from "components/my-cards/card-new-transaction/card-new-transaction";

import { Box } from "../../../components/ui";
import type { DashboardData, NewTransactionData, Transaction } from "../../../interfaces/dashboard";
import { handleRequest } from "utils/error-handlers/error-handle";
import dashboardData from "../../../mocks/dashboard-data.json";

export default function DashboardPage() {
  const data: DashboardData = dashboardData;

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransaction, setLoadingTransaction] = useState<boolean>(false);

  const fetchTransactions = async () => {
    await handleRequest(async () => {
      const res = await fetch("/api/transacao");
      if (!res.ok) throw new Error("Falha ao buscar transações");
      const { transacoes } = await res.json();
      setTransactions(transacoes);
    });
  };

    const [balanceValue, setBalanceValue] = useState<number | null>(null);

  // Função para buscar o saldo atualizado
  const fetchBalance = useCallback(async () => {
    await handleRequest(async () => {
      const res = await fetch("/api/transacao/soma-depositos");
      if (!res.ok) throw new Error("Falha ao buscar o saldo");
      const { total } = await res.json();
      setBalanceValue(total);
    });
  }, []);

  const handleSaveTransactions = async (txs: Transaction[]) => {
    await handleRequest(async () => {
      for (const tx of txs) {
        await handleRequest(async () => {
          await fetch(`/api/transacao/${tx._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tipo: tx.tipo,
              valor: tx.valor,
              // adicione outros campos se necessário
            }),
          });
        });
      }
      setTransactions(txs);
      fetchBalance();
    });
  };

  const handleDeleteTransactions = async (transactionIds: number[]) => {
    try {
      // Realizar as chamadas DELETE para cada transação selecionada
      const deletePromises = transactionIds.map(async (id) => {
        const response = await fetch(`/api/transacao/${id}`, {
          method: 'DELETE',
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
      setLoadingTransaction(false);
      alert(message);
      setTransactions((prev) => [...prev, transacao]);
    });
  };

  useEffect(() => {
    fetchTransactions();
    fetchBalance();
  }, []);

  return (
    <Box className="w-full min-h-screen px-4 py-6 lg:px-12 bg-[var(--byte-bg-dashboard)]">
      <Box className="font-sans max-w-screen-xl mx-auto">
        <Box className="flex flex-col lg:flex-row gap-y-6 lg:gap-x-6 lg:ml-8">
          {/* COLUNA ESQUERDA (Saldo + Nova Transação) */}
          <Box className="flex flex-col gap-6 w-full max-w-full lg:w-[calc(55.666%-12px)]">
            {/* CARD SALDO como componente separado */}
           <CardBalance user={data.user} balance={{ ...data.balance, value: balanceValue ?? data.balance.value }} />

            {/* CARD NOVA TRANSAÇÃO (mantido como antes) */}
            <CardNewTransaction onSubmit={onSubmit} isLoading={loadingTransaction} />

          </Box>

          {/* COLUNA DIREITA (Extrato) */}
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
