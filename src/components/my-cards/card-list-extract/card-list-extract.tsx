
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
    Link,
} from "../../ui";

import AttachFileIcon from "@mui/icons-material/AttachFile";
import Tooltip from "@mui/material/Tooltip";

import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import type { Transaction, Attachment } from "../../../interfaces/dashboard";
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
import InfiniteScrollSentinel from "../../infinite-scroll-sentinel/infinite-scroll-sentinel";
import { Chip } from "@mui/material";

/* ------------------------------------------------------------------ */
/*  Types auxiliares                                                  */
/* ------------------------------------------------------------------ */
export interface TxWithFiles extends Transaction {
  novosAnexos?: File[];              // anexos recém-selecionados
}

interface CardListExtractProps {
  transactions?: Transaction[];
  fetchPage: () => void;
  hasMore: boolean;
  isPageLoading: boolean;
  onSave?: (transactions: Transaction[]) => void;
  onDelete?: (transactionIds: number[]) => Promise<void>;
  atualizaSaldo?: () => Promise<void>;
}

/* ------------------------------------------------------------------ */
/*  Componente                                                        */
/* ------------------------------------------------------------------ */
export default function CardListExtract({
  transactions,
  fetchPage,
  hasMore,
  isPageLoading,
  onDelete,
  atualizaSaldo,
}: CardListExtractProps) {
  /* --------------------------- state ------------------------------ */
  const [editableTransactions, setEditableTransactions] =
    useState<TxWithFiles[]>([]);
  useEffect(() => {
    if (!transactions) return;
    setEditableTransactions(
      transactions.map((tx) => ({
        ...tx,
        valor: typeof tx.valor === "string" ? parseBRL(tx.valor) : tx.valor,
      }))
    );
  }, [transactions]);

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [selectedTransactions, setSelectedTransactions] = useState<number[]>(
    []
  );
  const [isDeletingInProgress, setIsDeletingInProgress] = useState(false);

  /* filtros --------------------------------------------------------- */
  const [typeFilter, setTypeFilter] = useState<"all" | "entrada" | "saida">(
    "all"
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateError, setDateError] = useState(false);

  const isValidDate = (v: string) => v === "" || !Number.isNaN(Date.parse(v));

  /* ------------------- lista filtrada ------------------------------ */
  const filteredTransactions = useMemo(() => {
    const tiposEntrada = ["cambio", "deposito"];
    const tiposSaida = ["transferencia"];

    return editableTransactions.filter((tx) => {
      const matchesType =
        typeFilter === "all" ||
        (typeFilter === "entrada" && tiposEntrada.includes(tx.tipo)) ||
        (typeFilter === "saida" && tiposSaida.includes(tx.tipo));

      const txDate = new Date(tx.createdAt);
      const matchesStart =
        !startDate || txDate >= new Date(`${startDate}T00:00`);
      const matchesEnd =
        !endDate || txDate <= new Date(`${endDate}T23:59:59`);
      return matchesType && matchesStart && matchesEnd;
    });
  }, [editableTransactions, typeFilter, startDate, endDate]);

  /* ------------------- helpers de edição --------------------------- */
  const handleEditClick = () => {
    setEditableTransactions((p) =>
      p.map((tx) => ({ ...tx, updatedAt: formatDateBR(tx.updatedAt) }))
    );
    setIsEditing(true);
  };
  const handleCancelClick = () => {
    setIsEditing(false);
    setEditableTransactions(transactions ?? []);
  };
  const handleDeleteClick = () => {
    setIsDeleting(true);
    setSelectedTransactions([]);
  };
  const handleCancelDeleteClick = () => {
    setIsDeleting(false);
    setSelectedTransactions([]);
  };
  const handleCheckboxChange = (id: number) =>
    setSelectedTransactions((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );

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

  /* ------------------- salva ou exclui ----------------------------- */
  const handleSaveClick = async () => {
    if (isEditing) {
      for (const tx of editableTransactions) {
        /* ---------- envia possíveis novos anexos ---------- */
        if (tx.novosAnexos?.length) {
          const fd = new FormData();
          fd.append("tipo", tx.tipo);
          fd.append("valor", tx.valor.toString());
          fd.append("updatedAt", parseDateBR(tx.updatedAt));
          tx.novosAnexos.forEach((f) => fd.append("anexos", f));
          await fetch(`/api/transacao/${tx._id}`, { method: "PUT", body: fd });
        } else {
          await fetch(`/api/transacao/${tx._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tipo: tx.tipo,
              valor: tx.valor,
              updatedAt:typeof tx.updatedAt === "string" && /^\d{2}\/\d{2}\/\d{4}$/.test(tx.updatedAt)
                      ? parseDateBR(tx.updatedAt)
                      : tx.updatedAt,
            }),
          });
        }
      }
      await fetchPage();           // recarrega página p/ anexos virem do backend
      setIsEditing(false);
      await atualizaSaldo?.();
      return;
    }

    /* --------------------- exclusão ---------------------- */
    if (isDeleting) {
      if (!selectedTransactions.length) return;
      setIsDeletingInProgress(true);
      try {
        await onDelete?.(selectedTransactions);
      } finally {
        setIsDeletingInProgress(false);
        setIsDeleting(false);
        setSelectedTransactions([]);
        await atualizaSaldo?.();
      }
    }
  };

  /* ---------------- helpers de data ------------------------------- */
  const handleStartDateChange = (v: string) => {
    setStartDate(v);
    setDateError(!isValidDate(v));
  };
  const handleEndDateChange = (v: string) => {
    setEndDate(v);
    setDateError(!isValidDate(v));
  };

  /* ------------------------- render ------------------------------- */
  const loadingFirstPage = isPageLoading && editableTransactions.length === 0;
  const hasTransactions = !loadingFirstPage && editableTransactions.length > 0;

  return (
    <Box className={`${styles.cardExtrato} cardExtrato w-full min-h-[512px]`}>
      {/* cabeçalho ---------------------------------------------------- */}
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

      {/* filtros ------------------------------------------------------ */}
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
              setTypeFilter(e.target.value as "all" | "entrada" | "saida")
            }
            sx={{ flex: 1, minWidth: { xs: "calc(50% - 4px)", md: 120 } }}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="entrada">Entrada</MenuItem>
            <MenuItem value="saida">Saída</MenuItem>
          </Select>

          <TextField
            label="De"
            type="date"
            size="small"
            value={startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            error={dateError}
            helperText={dateError ? "Data inválida" : ""}
            InputLabelProps={{ shrink: true }}
            sx={{ flex: 1, minWidth: { xs: "calc(50% - 4px)", md: 120 } }}
          />
          <TextField
            label="Até"
            type="date"
            size="small"
            value={endDate}
            onChange={(e) => handleEndDateChange(e.target.value)}
            error={dateError}
            helperText={dateError ? "Data inválida" : ""}
            InputLabelProps={{ shrink: true }}
            sx={{ flex: 1, minWidth: { xs: "calc(50% - 4px)", md: 120 } }}
          />
        </Box>
      )}

      {/* lista / estados vazios -------------------------------------- */}
      {loadingFirstPage ? (
        <SkeletonListExtract rows={5} />
      ) : dateError || !filteredTransactions.length ? (
        <Box className="flex flex-col items-center justify-center text-center gap-4 py-10">
          {dateError ? (
            <>
              <Typography variant="h6" color="error">
                Data inválida
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Verifique o formato da data inserida.
              </Typography>
            </>
          ) : (
            <>
              <ReceiptLongOutlinedIcon
                sx={{ fontSize: 56, color: "text.secondary" }}
              />
              <Typography variant="h6">Nenhuma transação encontrada</Typography>
              <Typography variant="body2" color="text.secondary">
                Ajuste os filtros ou adicione uma nova transação para começar.
              </Typography>
            </>
          )}
        </Box>
      ) : (
        <>
          {/* -------------------------------- lista -------------------- */}
          <ul className="space-y-4">
            {filteredTransactions.map((tx, idx) => (
              <li key={tx._id ?? `tx-${idx}`}>
                <Box
                  className={styles.extratoItem}
                  style={{ gap: isEditing ? 0 : undefined }}
                >
                  {/* tipo + data -------------------------------------- */}
                  <Box className={styles.txRow}>
                    {isEditing ? (
                      <Input
                        disableUnderline
                        className={styles.txType}
                        fullWidth
                        value={formatTipo(tx.tipo)}
                        onChange={(e) =>
                          handleTransactionChange(idx, "tipo", e.target.value)
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

                  {/* valor + anexos quando em edição ----------------- */}
                  {isEditing ? (
                    <Box className="flex items-center gap-2 w-full">
                      {/* valor ------------------------------------ */}
                      <Input
                        disableUnderline
                        className={clsx(
                          styles.txValue,
                          styles.txValueEditable
                        )}
                        sx={{ flex: 1 }}
                        value={formatBRL(tx.valor)}
                        onChange={(e) =>
                          handleTransactionChange(
                            idx,
                            "valor",
                            maskCurrency(e.target.value)
                          )
                        }
                        inputProps={{
                          inputMode: "decimal",
                          title: "Até 999.999,99",
                        }}
                      />

                      {/* input file oculto ----------------------- */}
                      <input
                        hidden
                        multiple
                        accept="image/*,application/pdf"
                        id={`edit-anexos-${tx._id}`}
                        type="file"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files) {
                            setEditableTransactions((curr) =>
                              curr.map((c) =>
                                c._id === tx._id
                                  ? { ...c, novosAnexos: Array.from(files) }
                                  : c
                              )
                            );
                          }
                        }}
                      />

                      {/* botão para anexar ----------------------- */}
                      <label htmlFor={`edit-anexos-${tx._id}`}>
                        <Tooltip title="Anexar arquivos">
                          <IconButton
                            component="span"
                            size="small"
                            color="primary"
                            aria-label="Anexar arquivos"
                          >
                            <AttachFileIcon fontSize="inherit" />
                          </IconButton>
                        </Tooltip>
                      </label>
                    </Box>
                  ) : (
                    /* visualização normal ------------------------- */
                    <Box className="flex items-center">
                      {isDeleting && (
                        <Checkbox
                          checked={selectedTransactions.includes(tx._id)}
                          onChange={() => handleCheckboxChange(tx._id)}
                          size="small"
                          className="mr-2"
                          sx={{
                            color: "var(--byte-color-dash)",
                            "&.Mui-checked": {
                              color: "var(--byte-color-dash)",
                            },
                          }}
                        />
                      )}

                      <span className={styles.txValue}>
                        {tx.valor < 0 && "-"}
                        {formatBRL(tx.valor)}
                      </span>

                      {tx.anexos?.length ? (
                        <Tooltip title={`${tx.anexos.length} anexo(s)`}>
                          <AttachFileIcon
                            sx={{
                              fontSize: 16,
                              ml: 0.5,
                              color: "var(--byte-color-dash)",
                            }}
                          />
                        </Tooltip>
                      ) : null}
                    </Box>
                  )}
                </Box>

                {/* ------------------- LISTA DE ANEXOS ------------------ */}
                {(tx.anexos?.length || tx.novosAnexos?.length) && (
                  <Box className="flex flex-wrap gap-2 mt-2 ml-2">
                    {/* anexos já gravados ------------------------- */}
                    {tx.anexos?.map((a: Attachment) => (
                      <Chip
                        key={a.url}
                        component={Link}
                        href={a.url}
                        label={a.name}
                        target="_blank"
                        clickable
                        size="small"
                        sx={{
                          backgroundColor: "var(--byte-color-green-50)",
                          ":hover": { bgcolor: "var(--byte-color-green-100)" },
                        }}
                        icon={<AttachFileIcon sx={{ fontSize: 14 }} />}
                      />
                    ))}

                    {/* anexos recém-selecionados (ainda não salvos) */}
                    {isEditing &&
                      tx.novosAnexos?.map((f, i) => (
                        <Chip
                          key={i}
                          label={f.name}
                          size="small"
                          color="info"
                          variant="outlined"
                          icon={<AttachFileIcon sx={{ fontSize: 14 }} />}
                        />
                      ))}
                  </Box>
                )}
              </li>
            ))}
          </ul>

          <InfiniteScrollSentinel
            onVisible={fetchPage}
            disabled={!hasMore || isPageLoading}
          />
          {isPageLoading && <SkeletonListExtract rows={5} />}
        </>
      )}

      {/* botões Salvar / Cancelar ------------------------------------ */}
      {(isEditing || isDeleting) && (
        <Box className="flex gap-2 justify-between mt-4">
          <Button
            onClick={handleSaveClick}
            className={clsx(
              styles.botaoSalvar,
              isDeleting &&
                (isDeletingInProgress || !selectedTransactions.length) &&
                "opacity-50 cursor-not-allowed"
            )}
            disabled={
              isDeleting &&
              (isDeletingInProgress || !selectedTransactions.length)
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
