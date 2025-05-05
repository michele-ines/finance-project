/* app/dashboard/page.tsx */
"use client";

import React from "react";
import dashboardData from "../../../constants/dashboardData.json";
import type { DashboardData, Transaction } from "../../../types/dashboard";
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Input,
  Button,
} from "../../../components/ui";
import VisibilityIcon from "@mui/icons-material/Visibility";
import styles from "./dashboarPage.module.scss";
import { formatBRL } from "utils/currency";
import { useRouter } from "next/navigation";
import TransactionList from "components/transaction-list/transactionList";

export default function DashboardPage() {
  /* ───── Dados mockados ───── */
  const data = dashboardData as DashboardData;
  const router = useRouter();

  /* ───── Helpers ───── */
  const getCurrentDate = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: "long" };
    const today = new Date();
    const weekday = today.toLocaleDateString("pt-BR", options);
    const formattedDate = today.toLocaleDateString("pt-BR");
    return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${formattedDate}`;
  };

  /* ───── Callback do TransactionList ───── */
  const handleSaveTransactions = (tx: Transaction[]) => {
    console.log("Transações editadas no extrato:", tx);
    // …enviar p/ API, atualizar contexto, etc.
  };

  /* ───── Submit Nova Transação ───── */
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

  /* ───── UI ───── */
  return (
    <Box className="w-full min-h-screen px-4 py-6 lg:px-12 bg-[var(--byte-bg-dashboard)]">
      <Box className="font-sans max-w-screen-xl mx-auto">
        <Box className="flex flex-col gap-6 lg:flex-row">
          {/* COLUNA ESQUERDA (Saldo + Nova Transação) */}
          <Box className="flex flex-col gap-6 w-full lg:w-2/3">
            {/* CARD SALDO */}
            <Box className={`${styles.cardSaldo} card-saldo min-h-[402px] mx-auto`}>
            <Box>
                <h1 className={styles.nameTitle}>Olá, {data.user.name.split(" ")[0]} :)</h1>
                <p className={styles.dateText}>{getCurrentDate()}</p>
              </Box>

              <Box className={styles.balanceSection}>
                <div className={styles.saldoHeader}>
                  <p className={styles.saldoTitle}>
                    Saldo&nbsp;
                    <VisibilityIcon fontSize="small" className={styles.eyeIcon} />
                  </p>
                  <hr className={styles.hrOrange} />
                </div>
                <p className={styles.contaCorrenteTitle}>{data.balance.account}</p>
                <p className={styles.valorSaldoText}>{formatBRL(data.balance.value)}</p>
              </Box>
            </Box>

            {/* CARD NOVA TRANSAÇÃO */}
            <Box className={`${styles.cardTransacao} cardTransacao w-full min-h-[478px] mx-auto`}>
              <h3 className={styles.transacaoTitle}>Nova Transação</h3>

              <form onSubmit={onSubmit}>
                <FormControl className={styles.transacaoFormControl}>
                  <Select
                    name="tipo"
                    displayEmpty
                    defaultValue=""
                    className={styles.transacaoSelect}
                  >
                    <MenuItem value="" disabled>
                      Selecione o tipo de transação
                    </MenuItem>
                    <MenuItem value="cambio">Câmbio de Moeda</MenuItem>
                    <MenuItem value="deposito">DOC/TED</MenuItem>
                    <MenuItem value="transferencia">Empréstimo e Financiamento</MenuItem>
                  </Select>
                </FormControl>

                <p className={styles.transacaoLabel}>Valor</p>
                <FormControl className={styles.transacaoFormControl}>
                  <Input
                    name="valor"
                    placeholder="00,00"
                    className={`${styles.transacaoInput} mb-8`}
                  />
                </FormControl>

                <Box className="mt-4">
                  <Button type="submit" className={styles.transacaoButton}>
                    Concluir Transação
                  </Button>
                </Box>
              </form>
            </Box>
          </Box>

          {/* COLUNA DIREITA (Extrato) */}
          <Box className="w-full lg:w-1/3">
            <TransactionList
              transactions={data.transactions}     // ← prop correta
              onSave={handleSaveTransactions}       // opcional, se quiser capturar edição
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
