
"use client";

import {
  Box,
  Button,
  DeleteIcon,
  EditIcon,
  IconButton,
  Input,
  TextField,
  MenuItem,
  Checkbox,
  Typography,
  ReceiptLongOutlinedIcon,
  CardListExtractStyles as styles,
  Select,
} from "../../ui";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import type { Transaction } from "../../../interfaces/dashboard";
import {
  formatBRL,
  formatTipo,
  maskCurrency,
  parseBRL,
} from "../../../utils/currency-formatte/currency-formatte";
import {
  formatDateBR,
  parseDateBR,
} from "../../../utils/date-formatte/date-formatte";
import SkeletonListExtract from "../../ui/skeleton-list-extract/skeleton-list-extract";
import { usePaginatedTransactions } from "../../../hooks/use-paginated-transactions";
import InfiniteScrollSentinel from "../../infinite-scroll-sentinel/infinite-scroll-sentinel";

/* ▸ novos imports para paginação ------------------------- */

/* -------------------------------------------------------- */
/*  Propriedades (não recebe mais “transactions”)           */
/* -------------------------------------------------------- */
interface CardListExtractProps {
  transactions: Transaction[]; // A lista vem do pai
  fetchPage: () => void;      // A função de buscar vem do pai
  hasMore: boolean;          // O controle se há mais páginas vem do pai
  isPageLoading: boolean;    // O status de carregamento vem do pai
  onSave?: (transactions: Transaction[]) => void;
  onDelete?: (transactionIds: number[]) => Promise<void>;
  atualizaSaldo?: () => Promise<void>;
}

/* ======================================================== */
/*  Componente                                              */
/* ======================================================== */
export default function CardListExtract({
  transactions, // recebendo a lista
  fetchPage,    // recebendo a função
  hasMore,
  isPageLoading,
  onSave,
  onDelete,
  atualizaSaldo,
}: CardListExtractProps) {
  /* ------------------------------------------------------ */
  /*  1. Paginação / dados da API                           */
  /* ------------------------------------------------------ */
  // Removido o uso duplicado de usePaginatedTransactions

  /* ------------------------------------------------------ */
  /*  2. Estados locais (edição)                            */
  /* ------------------------------------------------------ */
  const [editableTransactions, setEditableTransactions] = useState<
    Transaction[]
  >([]);

  /* ------------------------------------------------------ */
  /*  3. Carrega/atualiza lista editável                    */
  /* ------------------------------------------------------ */
  useEffect(() => {
    setEditableTransactions(
      transactions.map((t) => ({
        ...t,
        valor: typeof t.valor === "string" ? parseBRL(t.valor) : t.valor,
      }))
    );
  }, [transactions]);

  /* ------------------------------------------------------ */
  /*  4. UI e controles                                     */
  /* ------------------------------------------------------ */
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState<number[]>(
    []
  );
  const [isDeletingInProgress, setIsDeletingInProgress] = useState(false);

  /* ▸ Filtros/Busca -------------------------------------- */
  const [typeFilter, setTypeFilter] = useState< "all" | "deposito" | "cambio"| "transferencia" >(
    "all"
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  /* ▸ Filtragem ------------------------------------------ */
  const filteredTransactions = useMemo(() => {
    return editableTransactions.filter((tx) => {

      const matchesType = typeFilter === "all" || tx.tipo === typeFilter;

      const txDate = new Date(tx.createdAt);
      const matchesStart =
        !startDate || txDate >= new Date(startDate + "T00:00");
      const matchesEnd = !endDate || txDate <= new Date(endDate + "T23:59:59");

      return matchesType && matchesStart && matchesEnd;
    });
  }, [editableTransactions, typeFilter, startDate, endDate]);

  /* ▸ Alterna modos -------------------------------------- */
  const handleEditClick = () => {
    setEditableTransactions((prev) =>
      prev.map((tx) => ({ ...tx, updatedAt: formatDateBR(tx.updatedAt) }))
    );
    setIsEditing(true);
  };

  const handleCancelClick = () => {
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

  /* ▸ Salvar / Excluir ----------------------------------- */
  const handleSaveClick = async () => {
    if (isEditing) {
      const payload = editableTransactions.map((tx) => ({
        ...tx,
        updatedAt: parseDateBR(tx.updatedAt),
      }));
      onSave?.(payload);
      setIsEditing(false);
      return;
    }

    if (isDeleting) {
      if (selectedTransactions.length === 0) return;
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

  /* ▸ Handlers auxiliares -------------------------------- */
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

  /* ====================================================== */
  /*                     RENDER                             */
  /* ====================================================== */
  const loadingFirstPage = isPageLoading && editableTransactions.length === 0;
  const hasTransactions =
    !loadingFirstPage && editableTransactions.length > 0;

  return (
    <Box className={`${styles.cardExtrato} cardExtrato w-full min-h-[512px]`}>
      {/* -------------------------------------------------- */}
      {/*  Header + Actions                                  */}
      {/* -------------------------------------------------- */}
      <Box className={styles.extratoHeader}>
        <h3 className={styles.extratoTitle}>Extrato</h3>

        {hasTransactions && !isEditing && !isDeleting && (
          <Box className={styles.extratoActions}>
            <IconButton
              aria-label="editar"
              className={styles.actionBtn}
              onClick={handleEditClick}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              aria-label="excluir"
              className={styles.actionBtn}
              onClick={handleDeleteClick}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* -------------------------------------------------- */}
      {/*  Barra de Filtro e Busca                           */}
      {/* -------------------------------------------------- */}
      {hasTransactions && (
        <Box
          className="flex flex-col md:flex-row gap-4 pb-2"
          sx={{
            borderBottom: "1px solid var(--byte-color-green-50)",
            flexWrap: "wrap",
          }}
        >
          <Select
            size="small"
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value as "all" | "deposito" | "cambio"| "transferencia" )
            }
            sx={{ width: { xs: "100%", md: 150 } }}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="deposito">Deposito</MenuItem>
            <MenuItem value="cambio">Cambio</MenuItem>
            <MenuItem value="transferencia">Transferência</MenuItem>
          </Select>

          <TextField
            label="De"
            type="date"
            size="small"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ flex: 1, minWidth: { xs: "calc(50% - 4px)", md: 120 } }}
          />
          <TextField
            label="Até"
            type="date"
            size="small"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ flex: 1, minWidth: { xs: "calc(50% - 4px)", md: 120 } }}
          />
        </Box>
      )}

      {/* -------------------------------------------------- */}
      {/*  Lista / Skeleton / Empty-state                    */}
      {/* -------------------------------------------------- */}
      {loadingFirstPage ? (
        <SkeletonListExtract rows={5} />
      ) : filteredTransactions.length === 0 ? (
        <Box className="flex flex-col items-center justify-center text-center gap-4 py-10">
          <ReceiptLongOutlinedIcon
            sx={{ fontSize: 56, color: "text.secondary" }}
          />
          <Typography variant="h6">Nenhuma transação encontrada</Typography>
          <Typography variant="body2" color="text.secondary">
            Ajuste os filtros ou adicione uma nova transação para começar.
          </Typography>
        </Box>
      ) : (
        <>
          <ul className="space-y-4">
            {filteredTransactions.map((tx, index) => (
              <li key={tx._id ?? `tx-${index}`}>
                <Box
                  className={styles.extratoItem}
                  style={{ gap: isEditing ? "0px" : undefined }}
                >
                  {/* Linha: tipo + data */}
                  <Box className={styles.txRow}>
                    {isEditing ? (
                      <Input
                        disableUnderline
                        className={styles.txType}
                        fullWidth
                        value={formatTipo(tx.tipo)}
                        onChange={(e) =>
                          handleTransactionChange(
                            index,
                            "tipo",
                            e.target.value
                          )
                        }
                        inputProps={{ style: { textAlign: "left" } }}
                      />
                    ) : (
                      <span className={styles.txType}>
                        {formatTipo(tx.tipo)}
                      </span>
                    )}

                    <span className={styles.txDate}>
                      {formatDateBR(tx.createdAt)}
                    </span>
                  </Box>

                  {/* Valor */}
                  {isEditing ? (
                    <Input
                      disableUnderline
                      className={clsx(
                        styles.txValue,
                        styles.txValueEditable
                      )}
                      value={formatBRL(tx.valor)}
                      onChange={(e) =>
                        handleTransactionChange(
                          index,
                          "valor",
                          maskCurrency(e.target.value)
                        )
                      }
                      inputProps={{
                        inputMode: "decimal",
                        title: "Até 999.999,99 (máx. 1 casa decimal)",
                      }}
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

          {/* Sentinel – carrega próxima página */}
          <InfiniteScrollSentinel
            onVisible={fetchPage}
            disabled={!hasMore || isPageLoading}
          />

          {/* Skeleton da página seguinte */}
          {isPageLoading && <SkeletonListExtract rows={5} />}
        </>
      )}

      {/* -------------------------------------------------- */}
      {/*  Botões Salvar / Cancelar                           */}
      {/* -------------------------------------------------- */}
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
