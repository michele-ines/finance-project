"use client";
import type { DashboardData, Transaction } from "../../../types/dashboard";
import { Box } from "../../../components/ui";
import dashboardData from "../../../constants/dashboardData.json";
import CardBalance from "components/card-balance/card-balance";
import CardListExtract from "components/card-list-extract/card-list-extract";
import MyCards from "components/my-cards/my-cards";

export default function MyCardsPage() {
  const data = dashboardData as DashboardData;

  const transactionsData: Transaction[] = [
    { id: 1, month: "Abril", type: "Compra de Ações", date: "15/04/2025", amount: -1500 },
    { id: 2, month: "Abril", type: "Dividendos", date: "20/04/2025", amount: 350 },
    { id: 3, month: "Março", type: "Tesouro Direto", date: "10/03/2025", amount: -2000 },
    { id: 4, month: "Março", type: "Resgate CDB", date: "05/03/2025", amount: 1200 },
  ];

  const handleSaveTransactions = (tx: Transaction[]): void => {
    console.log("Salvando transações de investimentos:", tx);
  };

  return (
    <Box className="w-full min-h-screen px-4 py-6 lg:px-12 bg-[var(--byte-bg-dashboard)]">
      <Box className="font-sans max-w-screen-xl mx-auto">
        <Box className="flex flex-col lg:flex-row gap-y-6 lg:gap-x-6 lg:ml-8">
          {/* COLUNA ESQUERDA */}
          <Box className="flex flex-col gap-6 w-full max-w-full lg:w-[calc(55.666%-12px)]">
            <CardBalance user={data.user} balance={data.balance} />
            <MyCards />
          </Box>

          {/* COLUNA DIREITA */}
          <Box className="w-full max-w-full lg:w-[calc(44.334%-12px)]">
            <CardListExtract
              transactions={transactionsData}
              onSave={handleSaveTransactions}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
