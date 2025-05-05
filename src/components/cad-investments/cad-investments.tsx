"use client";

import { Box, React, PieChart, CadInvestmentsStyles as styles } from "../ui";
import { CadInvestmentsProps } from "types/dashboard";

export default function CadInvestments({ balance }: CadInvestmentsProps) {
  const chartData = [
    { value: 5, label: "Fundos de investimento" },
    { value: 10, label: "Tesouro Direto" },
    { value: 15, label: "Previdência Privada" },
    { value: 20, label: "Bolsa de Valores" },
  ];

  const chartSize = { width: 126, height: 126 };

  return (
    <Box className={`${styles.cardTransacao} cardTransacao w-full gap-10`}>
      {/* BLOCO: Título / Total / Caixas */}
      <section className="flex flex-col gap-6 w-full">
        <h3 className={styles.investmentTitle}>Investimentos</h3>
        <p className={styles.totalLabel}>
          Total:&nbsp;
          {balance.value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Box
            className={`${styles.investmentBox} ${styles.investmentBoxType}`}
          >
            <span className={styles.investmentBoxTitle}>Renda Fixa</span>
            <span className={styles.investmentBoxValue}>R$ 36.000,00</span>
          </Box>
          <Box
            className={`${styles.investmentBox} ${styles.investmentBoxType}`}
          >
            <span className={styles.investmentBoxTitle}>Renda variável</span>
            <span className={styles.investmentBoxValue}>R$ 14.000,00</span>
          </Box>
        </div>
      </section>

      {/* BLOCO: Estatísticas */}
      <section className="flex flex-col gap-6 w-full">
        <h4 className={styles.statsTitle}>Estatísticas</h4>
        <Box
          className={`${styles.investmentBox} ${styles.investmentBoxStats} w-full md:max-w-[610px]`}
        >
          <PieChart
            series={[{ data: chartData, innerRadius: 40, cornerRadius: 50 }]}
            {...chartSize}
          />
        </Box>
      </section>
    </Box>
  );
}
