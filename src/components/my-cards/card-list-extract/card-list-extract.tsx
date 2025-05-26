"use client";

import {
  Box,
  Button,
  DeleteIcon,
  EditIcon,
  IconButton,
  Input,
  React, 
  useState, 
  Checkbox,
  Typography,        
  InputAdornment,    
  ReceiptLongOutlinedIcon,
  CardListExtractStyles as styles,
} from "../../ui"; 
import type { Transaction } from "../../../interfaces/dashboard";

// Extended props interface to include onDelete callback
interface CardListExtractProps {
  transactions: Transaction[];
  onSave?: (transactions: Transaction[]) => void;
  onDelete?: (transactionIds: number[]) => Promise<void>;
  atualizaSaldo?: () => Promise<void>;
}

import clsx from "clsx";
import {
  formatBRL,
  formatTipo,
  parseBRL,
} from "../../../utils/currency-formatte/currency-formatte";
import { useEffect } from "react";
import {
  formatDateBR, 
  parseDateBR, 
} from "../../../utils/date-formatte/date-formatte";
import SkeletonListExtract from "../../ui/skeleton-list-extract/skeleton-list-extract";

export default function CardListExtract({
  transactions,
  onSave,
  onDelete,
  atualizaSaldo
}: CardListExtractProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editableTransactions, setEditableTransactions] = useState<
    Transaction[]
  >([]);
  const [selectedTransactions, setSelectedTransactions] = useState<number[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingInProgress, setIsDeletingInProgress] = useState(false);

  /* -------------------------------------------------------------------- */
  /*  1.  Carrega dados vindos da API                                     */
  /* -------------------------------------------------------------------- */
  useEffect(() => {
    setIsLoading(true);

    const timeout = setTimeout(() => {
      setEditableTransactions(
        transactions.map((t) => ({
          ...t,
          valor: typeof t.valor === "string" ? parseBRL(t.valor) : t.valor,
          // mantém createdAt / updatedAt exatamente como a API devolveu (ISO)
        }))
      );
      setIsLoading(false);
    }, 1_000);

    return () => clearTimeout(timeout);
  }, [transactions]);

  /* -------------------------------------------------------------------- */
  /*  2.  Alterna modos                                                   */
  /* -------------------------------------------------------------------- */
  const handleEditClick = () => {
    /* Converte updatedAt p/ dd/MM/yyyy só para o estado de edição */
    setEditableTransactions((prev) =>
      prev.map((tx) => ({
        ...tx,
        updatedAt: formatDateBR(tx.updatedAt),
      }))
    );
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    /* Restaura dados crus (ISO + número) */
    setEditableTransactions(
      transactions.map((t) => ({
        ...t,
        valor: typeof t.valor === "string" ? parseBRL(t.valor) : t.valor,
      }))
    );
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

  /* -------------------------------------------------------------------- */
  /*  3.  Salvar / Excluir                                                */
  /* -------------------------------------------------------------------- */
  const handleSaveClick = async () => {
    if (isEditing) {
      /* Converte updatedAt de dd/MM/yyyy → ISO antes de enviar */
      const payload = editableTransactions.map((tx) => ({
        ...tx,
        updatedAt: parseDateBR(tx.updatedAt),
      }));
      onSave?.(payload);
      setIsEditing(false);
      return;
    }

    /* Modo de exclusão */
    if (isDeleting) {
      if (selectedTransactions.length === 0) {
        setIsDeleting(false);
        return;
      }

      setIsDeletingInProgress(true);
      try {
        await onDelete?.(selectedTransactions);
      } catch (error) {
        console.error("Erro ao excluir transações:", error);
      } finally {
        setIsDeletingInProgress(false);
        setIsDeleting(false);
        setSelectedTransactions([]);
        atualizaSaldo?.();
      }
    }
  };

  /* -------------------------------------------------------------------- */
  /*  4.  Handlers auxiliares                                             */
  /* -------------------------------------------------------------------- */
  const handleCheckboxChange = (id: number) => {
    setSelectedTransactions((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const handleTransactionChange = (
    index: number,
    field: keyof Pick<Transaction, "tipo" | "updatedAt" | "valor">,
    value: string
  ) => {
    setEditableTransactions((prev) =>
      prev.map((tx, i) => {
        if (i !== index) return tx;
        if (field === "valor") return { ...tx, valor: parseBRL(value) };
        return { ...tx, [field]: value };
      })
    );
  };

  /* -------------------------------------------------------------------- */
  /*  5.  Render                                                          */
  /* -------------------------------------------------------------------- */
  const hasTransactions = !isLoading && editableTransactions.length > 0;

  return (
    <Box className={`${styles.cardExtrato} cardExtrato w-full min-h-[512px]`}>
      {/* Header */}
      <Box className={styles.extratoHeader}>
        <h3 className={styles.extratoTitle}>Extrato</h3>

      {hasTransactions && !isEditing && !isDeleting && (

        <Box className={styles.extratoActions}>
          {!isEditing && !isDeleting && (
            <IconButton aria-label="editar" className={styles.actionBtn} onClick={handleEditClick}>
              <EditIcon fontSize="small" />
            </IconButton>
          )}
          {!isEditing && !isDeleting && (
            <IconButton
            aria-label="excluir" 
              className={styles.actionBtn}
              onClick={handleDeleteClick}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      )}
      </Box>

      {/* Lista / Skeleton */}
      {isLoading ? (
        <SkeletonListExtract rows={5} />
      ) : editableTransactions.length === 0 ? (
        /* Empty-state */
        <Box className="flex flex-col items-center justify-center text-center gap-4 py-10">
          <ReceiptLongOutlinedIcon
            sx={{ fontSize: 56, color: "text.secondary" }}
          />

          <Typography variant="h6">Nenhuma transação por aqui</Typography>

          <Typography variant="body2" color="text.secondary">
            Adicione uma Nova transação para começar.
          </Typography>
        </Box>
      ) : (
        <ul className="space-y-4">
          {editableTransactions.map((tx, index) => (
            <li key={tx._id ?? `tx-${index}`}>
              <Box
                className={styles.extratoItem}
                style={{ gap: isEditing ? "0px" : undefined }}
              >
                {/* linha: tipo + data */}
                <Box className={styles.txRow}>
                  {/* ---------- tipo ---------- */}
                  {isEditing ? (
                    <Input
                      disableUnderline
                      className={styles.txType}
                      fullWidth
                      value={formatTipo(tx.tipo)}
                      onChange={(e) =>
                        handleTransactionChange(index, "tipo", e.target.value)
                      }
                      inputProps={{ style: { textAlign: "left" } }}
                    />
                  ) : (
                    <span className={styles.txType}>{formatTipo(tx.tipo)}</span>
                  )}

                
                  <span className={styles.txDate}>
                    {formatDateBR(tx.createdAt)}
                  </span>
                </Box>

                {/* valor */}
                {isEditing ? (
                  <Input
                    disableUnderline
                    className={clsx(styles.txValue, styles.txValueEditable)}
                    value={tx.valor.toString().replace(".", ",")}
                    onChange={(e) =>
                      handleTransactionChange(index, "valor", e.target.value)
                    }
                    inputProps={{
                      inputMode: "decimal",
                      maxLength: 15, // 6 inteiros + vírgula/ponto + 1 decimais
                      pattern: "\\d{1,9}(?:[.,]\\d{0,2})?",
                      title: "Até 999.999,99 (máx. 1 casas decimais)",
                    }}
                    startAdornment={
                      <InputAdornment position="start">R$</InputAdornment>
                    }
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

      {/* Ações de salvar/cancelar */}
      {(isEditing || isDeleting) && (
        <Box className="flex gap-2 justify-between mt-4">
          <Button
            onClick={handleSaveClick}
            className={clsx(
              styles.botaoSalvar,
              isDeleting &&
                (isDeletingInProgress || selectedTransactions.length === 0) &&
                "opacity-50 cursor-not-allowed"
            )}
            disabled={
              isDeleting &&
              (isDeletingInProgress || selectedTransactions.length === 0)
            }
          >
            {isEditing
              ? "Salvar"
              : isDeletingInProgress
              ? "Excluindo..."
              : "Excluir"}
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
