"use client";
import {
  React,
  useState,
  Box,
  Button,
  Input,
  IconButton,
  EditIcon,
  DeleteIcon,
  CardListExtractStyles as styles,
} from "../../ui";
import type { Transaction, TransactionListProps } from "../../../interfaces/dashboard";
import clsx from "clsx";
import { formatBRL, parseBRL } from "../../../utils/currency-formatte/currency-formatte";
import { useEffect } from "react";
import { formatDateBR, getMonthNameBR } from "../../../utils/date-formatte/date-formatte";

export default function CardListExtract({
  transactions,
  onSave,
}: TransactionListProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableTransactions, setEditableTransactions] = useState<Transaction[]>([]);

  // Sincroniza editableTransactions com transactions sempre que transactions mudar
  useEffect(() => {
    setEditableTransactions(transactions.map((t) => ({ ...t })));
  }, [transactions]);

  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => {
    setEditableTransactions(transactions.map((t) => ({ ...t })));
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    onSave?.(editableTransactions);
    setIsEditing(false);
  };

  const handleTransactionChange = (
    index: number,
    field: keyof Pick<Transaction, "tipo" | "updatedAt" | "valor">,
    value: string
  ) => {
    setEditableTransactions((trans) =>
      trans.map((tx, i) => {
        if (i !== index) return tx;
        if (field === "valor") return { ...tx, valor: parseBRL(value) };
        return { ...tx, [field]: value };
      })
    );
  };

  return (
    <Box className={`${styles.cardExtrato} cardExtrato w-full min-h-[512px]`}>
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
          <li key={tx._id}>
            <Box
              className={styles.extratoItem}
              style={{ gap: isEditing ? "0px" : undefined }}
            >
              <p className={styles.mesLabel}>{getMonthNameBR(tx.updatedAt)}</p>

              <Box className={styles.txRow}>
                {isEditing ? (
                  <Input
                    disableUnderline
                    className={styles.txType}
                    value={tx.tipo}
                    onChange={(e) =>
                      handleTransactionChange(index, "tipo", e.target.value)
                    }
                  />
                ) : (
                  <span className={styles.txType}>{tx.tipo}</span>
                )}

                {isEditing ? (
                  <Input
                    disableUnderline
                    className={styles.txDate}
                    value={tx.createdAt}
                    onChange={(e) =>
                      handleTransactionChange(index, "updatedAt", e.target.value)
                    }
                  />
                ) : (
                  <span className={styles.txDate}>{formatDateBR(tx.updatedAt)}</span>
                )}
              </Box>

              {isEditing ? (
                <Input
                  disableUnderline
                  className={clsx(styles.txValue, styles.txValueEditable)}
                  value={formatBRL(tx.valor)}
                  onChange={(e) =>
                    handleTransactionChange(index, "valor", e.target.value)
                  }
                  inputProps={{ inputMode: "numeric" }}
                />
              ) : (
                <span className={styles.txValue}>
                  {tx.valor < 0 ? "-" : ""}
                  {formatBRL(Math.abs(tx.valor))}
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
  );
}