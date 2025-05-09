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
  Checkbox,
  CardListExtractStyles as styles,
} from "../../ui";
import type { Transaction } from "../../../interfaces/dashboard";

// Extended props interface to include onDelete callback
interface CardListExtractProps {
  transactions: Transaction[];
  onSave?: (transactions: Transaction[]) => void;
  onDelete?: (transactionIds: number[]) => Promise<void>;
}
import clsx from "clsx";
import { formatBRL, parseBRL } from "../../../utils/currency-formatte/currency-formatte";
import { useEffect } from "react";
import { formatDateBR, getMonthNameBR } from "../../../utils/date-formatte/date-formatte";
import  SkeletonListExtract  from "../../ui/skeleton-list-extract/skeleton-list-extract";
export default function CardListExtract({
  transactions,
  onSave,
  onDelete,
}: CardListExtractProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editableTransactions, setEditableTransactions] = useState<Transaction[]>([]);
  const [selectedTransactions, setSelectedTransactions] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Estado de carregamento
  const [isDeletingInProgress, setIsDeletingInProgress] = useState(false);

  // Sincroniza editableTransactions com transactions sempre que transactions mudar
  useEffect(() => {
    setIsLoading(true); 
    const timeout = setTimeout(() => {
      setEditableTransactions(transactions.map((t) => ({ ...t })));
      setIsLoading(false); // Desativa o estado de carregamento
    }, 1000); // Simula um atraso no carregamento (ajuste conforme necessário)

    return () => clearTimeout(timeout); // Limpa o timeout ao desmontar
  }, [transactions]);

  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => {
    setEditableTransactions(transactions.map((t) => ({ ...t })));
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    setIsDeleting(true);
    setSelectedTransactions([]);
  };

  const handleCancelDeleteClick = () => {
    setIsDeleting(false);
    setSelectedTransactions([]);
  };

  const handleSaveClick = async () => {
    if (isEditing) {
      // Modo de edição
      onSave?.(editableTransactions);
      setIsEditing(false);
    } else if (isDeleting) {
      // Modo de exclusão
      if (selectedTransactions.length === 0) {
        setIsDeleting(false);
        return;
      }

      setIsDeletingInProgress(true);

      try {
        // Chamar o método de exclusão do componente pai
        if (onDelete) {
          await onDelete(selectedTransactions);
        }
      } catch (error) {
        console.error("Erro ao excluir transações:", error);
      } finally {
        setIsDeletingInProgress(false);
        setIsDeleting(false);
        setSelectedTransactions([]);
      }
    }
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedTransactions((prev) => {
      if (prev.includes(id)) {
        return prev.filter((txId) => txId !== id);
      } else {
        return [...prev, id];
      }
    });
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
          {!isEditing && !isDeleting && (
            <IconButton className={styles.actionBtn} onClick={handleEditClick}>
              <EditIcon fontSize="small" />
            </IconButton>
          )}
          {!isEditing && !isDeleting && (
            <IconButton className={styles.actionBtn} onClick={handleDeleteClick}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>

      {isLoading ? (
        <SkeletonListExtract rows={5} />
      ) : (
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
                      value={tx.createdAt || ''}
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
                  <Box className="flex items-center">
                    {isDeleting && (
                      <Checkbox
                        checked={selectedTransactions.includes(tx._id)}
                        onChange={() => handleCheckboxChange(tx._id)}
                        size="small"
                        className="mr-2"
                      />
                    )}
                    <span className={styles.txValue}>
                      {tx.valor < 0 ? "-" : ""}
                      {formatBRL(Math.abs(tx.valor))}
                    </span>
                  </Box>
                )}
              </Box>
            </li>
          ))}
        </ul>
      )}

      {(isEditing || isDeleting) && (
        <Box className="flex gap-2 justify-between mt-4">
          <Button 
            onClick={handleSaveClick} 
            className={styles.botaoSalvar}
            disabled={isDeleting && (isDeletingInProgress || selectedTransactions.length === 0)}
          >
            {isEditing ? 'Salvar' : 
              isDeletingInProgress ? 'Excluindo...' : 'Excluir'}
          </Button>
          <Button 
            onClick={isEditing ? handleCancelClick : handleCancelDeleteClick} 
            className={styles.botaoCancelar}
            disabled={isDeleting && isDeletingInProgress}
          >
            Cancelar
          </Button>
        </Box>
      )}
    </Box>
  );
}
