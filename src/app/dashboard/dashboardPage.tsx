/* app/dashboard/page.tsx */
"use client";

import React, { useState } from "react";
import dashboardData from "../../constants/dashboardData.json";
import type { DashboardData, Transaction } from "../../types/dashboard";
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Input,
  Button,
} from "../../components/ui";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import styles from "./dashboarPage.module.scss";
import { formatBRL, parseBRL } from "utils/currency";
import clsx from "clsx";          // npm i clsx (ou use template string)

export default function DashboardPage() {
  const data = dashboardData as DashboardData;

  const [isEditing, setIsEditing] = useState(false);
  const [editableTransactions, setEditableTransactions] = useState<Transaction[]>(
    data.transactions.map((t) => ({ ...t }))
  );

  const getCurrentDate = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: "long" };
    const today = new Date();
    const weekday = today.toLocaleDateString("pt-BR", options);
    const formattedDate = today.toLocaleDateString("pt-BR");
    return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${formattedDate}`;
  };

  const handleEditClick = () => setIsEditing(true);

  const handleCancelClick = () => {
    setEditableTransactions(data.transactions.map((t) => ({ ...t })));
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    console.log("Salvando transações:", editableTransactions);
    setIsEditing(false);
  };

  const handleTransactionChange = (
    index: number,
    field: keyof Pick<Transaction, "type" | "date" | "amount">,
    value: string
  ) => {
    setEditableTransactions((trans) =>
      trans.map((tx, i) => {
        if (i !== index) return tx;
        if (field === "amount") return { ...tx, amount: parseBRL(value) };
        return { ...tx, [field]: value };
      })
    );
  };

  return (
    <Box className="w-full min-h-screen px-4 py-6 lg:px-12 bg-[var(--byte-bg-dashboard)]">
      <Box className="font-sans max-w-screen-xl mx-auto">
        <Box className="flex flex-col gap-6 lg:flex-row">
          {/* COLUNA ESQUERDA (Saldo + Nova Transação) */}
          <Box className="flex flex-col gap-6 w-full lg:w-2/3">
            {/* CARD SALDO */}
            <Box className={`${styles.cardSaldo} w-full min-h-[402px]`}>
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
            <Box className={`${styles.cardTransacao} w-full min-h-[478px]`}>
              <h3 className={styles.transacaoTitle}>Nova Transação</h3>
  
              <FormControl className={styles.transacaoFormControl}>
                <Select displayEmpty defaultValue="" className={styles.transacaoSelect}>
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
                <Input placeholder="00,00" className={`${styles.transacaoInput} mb-8`} />
              </FormControl>
  
              <Button className={styles.transacaoButton}>Concluir Transação</Button>
            </Box>
          </Box>
  
          {/* COLUNA DIREITA (Extrato) */}
          <Box className="w-full lg:w-1/3">
            <Box className={`${styles.cardExtrato} w-full min-h-[512px]`}>
              <Box className={styles.extratoHeader}>
                <h3 className={styles.extratoTitle}>Extrato</h3>
                <Box className={styles.extratoActions}>
                  {!isEditing && (
                    <IconButton className={styles.actionBtn} onClick={handleEditClick}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                  <IconButton className={styles.actionBtn}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
  
              <ul className="space-y-4">
                {editableTransactions.map((tx, index) => (
                  <li key={tx.id}>
                    <Box className={styles.extratoItem} style={{ gap: isEditing ? '0px' : undefined }}>
                      <p className={styles.mesLabel}>{tx.month}</p>
  
                      <Box className={styles.txRow}>
                        {isEditing ? (
                          <Input
                            disableUnderline
                            className={styles.txType}
                            value={tx.type}
                            onChange={(e) => handleTransactionChange(index, "type", e.target.value)}
                          />
                        ) : (
                          <span className={styles.txType}>{tx.type}</span>
                        )}
  
                        {isEditing ? (
                          <Input
                            disableUnderline
                            className={styles.txDate}
                            value={tx.date}
                            onChange={(e) => handleTransactionChange(index, "date", e.target.value)}
                          />
                        ) : (
                          <span className={styles.txDate}>{tx.date}</span>
                        )}
                      </Box>
  
                      {isEditing ? (
                        <Input
                          disableUnderline
                          className={clsx(styles.txValue, styles.txValueEditable)}   // ↞ borda completa
                          value={formatBRL(tx.amount)}
                          onChange={(e) => handleTransactionChange(index, "amount", e.target.value)}
                          inputProps={{ inputMode: "numeric" }}
                        />
                      ) : (
                        <span className={styles.txValue}>
                          {tx.amount < 0 ? "-" : ""}
                          {formatBRL(Math.abs(tx.amount))}
                        </span>
                      )}
                    </Box>
                  </li>
                ))}
              </ul>
  
              {isEditing && (
                <Box className="flex gap-2 justify-between">
                  <Button onClick={handleSaveClick} className={styles.botaoSalvar}>
                    Salvar
                  </Button>
                  <Button onClick={handleCancelClick} className={styles.botaoCancelar}>
                    Cancelar
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
  
}
