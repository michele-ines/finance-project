"use client";

import React from "react";
import { Box } from "../../../components/ui";
import styles from "./investmentPage.module.scss";
import { PieChart } from "@mui/x-charts/PieChart";
import BalanceCard from "../../../components/balance-card/balanceCard";
import type { Balance, Transaction, User } from "../../../types/dashboard";
import TransactionList from "components/transaction-list/transactionList";

export default function InvestmentPage() {
  /* ------------------------------------------------------------------ */
  /* MOCK DATA (substitua por dados reais assim que houver API)          */
  /* ------------------------------------------------------------------ */
  const userData: User = { name: "Investidor Exemplo" };

  const balanceData: Balance = {
    account: "Conta Investimento",
    value: 50_000,
  };

  const transactionsData: Transaction[] = [
    { id: 1, month: "Abril", type: "Compra de Ações",  date: "15/04/2025", amount: -1500 },
    { id: 2, month: "Abril", type: "Dividendos",       date: "20/04/2025", amount:  350 },
    { id: 3, month: "Março", type: "Tesouro Direto",   date: "10/03/2025", amount: -2000 },
    { id: 4, month: "Março", type: "Resgate CDB",      date: "05/03/2025", amount: 1200 },
  ];

  const chartData = [
    { value: 5,  label: "Fundos de investimento" },
    { value: 10, label: "Tesouro Direto" },
    { value: 15, label: "Previdência Privada" },
    { value: 20, label: "Bolsa de Valores" },
  ];

  /* ------------------------------------------------------------------ */
  const chartSize = { width: 126, height: 126 };

  const handleSaveTransactions = (tx: Transaction[]): void => {
    console.log("Salvando transações de investimentos:", tx);
  };

  /* ------------------------------------------------------------------ */
  /* RENDER                                                              */
  /* ------------------------------------------------------------------ */
  return (
    <Box className="w-full min-h-screen px-4 py-6 lg:px-12 bg-[var(--byte-bg-dashboard)]">
      <Box className="font-sans max-w-screen-xl mx-auto">
        <Box className="flex flex-col gap-6 lg:flex-row">
          {/* COLUNA ESQUERDA ------------------------------------------------ */}
          <Box className="flex flex-col gap-6 w-full lg:w-2/3">
            <BalanceCard user={userData} balance={balanceData} />

            {/* CARD INVESTIMENTOS ----------------------------------------- */}
            <Box className={`${styles.cardTransacao} cardTransacao w-full gap-10 min-h-[478px] mx-auto`}>

              {/* BLOCO: Título / Total / Caixas --------------------------- */}
              <section className="flex flex-col gap-6 w-full">
                <h3 className={styles.investmentTitle}>Investimentos</h3>

                <p className={styles.totalLabel}>
                  Total:&nbsp;
                  {balanceData.value.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>

                {/* Caixas de Renda: pilha no mobile, 2 colunas a partir de md */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Box className={`${styles.investmentBox} ${styles.investmentBoxType}`}>
                    <span className={styles.investmentBoxTitle}>Renda Fixa</span>
                    <span className={styles.investmentBoxValue}>R$ 36.000,00</span>
                  </Box>

                  <Box className={`${styles.investmentBox} ${styles.investmentBoxType}`}>
                    <span className={styles.investmentBoxTitle}>Renda variável</span>
                    <span className={styles.investmentBoxValue}>R$ 14.000,00</span>
                  </Box>
                </div>
              </section>

              {/* BLOCO: Estatísticas ------------------------------------- */}
              <section className="flex flex-col gap-6 w-full">
                <h4 className={styles.statsTitle}>Estatísticas</h4>
                <Box
                  className={`
                    ${styles.investmentBox}
                    ${styles.investmentBoxStats}
                    w-full
                    md:max-w-[610px]
                  `}
                >
                  <PieChart
                    series={[
                      { data: chartData, innerRadius: 40, cornerRadius: 50 },
                    ]}
                    {...chartSize}
                  />
                </Box>
              </section>
            </Box>
            {/* ------------------------------------------------------------- */}
          </Box>

          {/* COLUNA DIREITA ------------------------------------------------- */}
          <Box className="w-full lg:w-1/3">
            <TransactionList
              transactions={transactionsData}
              onSave={handleSaveTransactions}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
