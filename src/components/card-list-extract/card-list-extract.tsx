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
} from "../../components/ui";
import type { Transaction, TransactionListProps } from "../../types/dashboard";
import clsx from "clsx";
import { formatBRL, parseBRL } from "../../utils/currency";

export default function CardListExtract({
  transactions,
  onSave,
}: TransactionListProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableTransactions, setEditableTransactions] = useState<
    Transaction[]
  >(() => transactions.map((t) => ({ ...t })));

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
          <li key={tx.id}>
            <Box
              className={styles.extratoItem}
              style={{ gap: isEditing ? "0px" : undefined }}
            >
              <p className={styles.mesLabel}>{tx.month}</p>

              <Box className={styles.txRow}>
                {isEditing ? (
                  <Input
                    disableUnderline
                    className={styles.txType}
                    value={tx.type}
                    onChange={(e) =>
                      handleTransactionChange(index, "type", e.target.value)
                    }
                  />
                ) : (
                  <span className={styles.txType}>{tx.type}</span>
                )}

                {isEditing ? (
                  <Input
                    disableUnderline
                    className={styles.txDate}
                    value={tx.date}
                    onChange={(e) =>
                      handleTransactionChange(index, "date", e.target.value)
                    }
                  />
                ) : (
                  <span className={styles.txDate}>{tx.date}</span>
                )}
              </Box>

              {isEditing ? (
                <Input
                  disableUnderline
                  className={clsx(styles.txValue, styles.txValueEditable)}
                  value={formatBRL(tx.amount)}
                  onChange={(e) =>
                    handleTransactionChange(index, "amount", e.target.value)
                  }
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
  );
}
