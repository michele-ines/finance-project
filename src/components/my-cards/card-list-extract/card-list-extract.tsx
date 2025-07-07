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
import { useEffect, useMemo, useState, useRef } from "react";
import type { Transaction, Attachment } from "../../../interfaces/dashboard";
import {
  formatBRL,
  formatTipo,
  maskCurrency,
  parseBRL,
} from "../../../utils/currency-formatte/currency-formatte";
import { formatDateBR } from "../../../utils/date-formatte/date-formatte";
import SkeletonListExtract from "../../ui/skeleton-list-extract/skeleton-list-extract";
import InfiniteScrollSentinel from "../../infinite-scroll-sentinel/infinite-scroll-sentinel";
import { Chip } from "@mui/material";

export interface TxWithFiles extends Transaction {
  novosAnexos?: File[];
}

interface CardListExtractProps {
  transactions: Transaction[];
  fetchPage: () => void;
  hasMore: boolean;
  isPageLoading: boolean;
  onSave: (transactions: TxWithFiles[]) => Promise<void>;
  onDelete: (transactionIds: number[]) => Promise<void>;
  atualizaSaldo: () => void;
}

export default function CardListExtract({
  transactions,
  fetchPage,
  hasMore,
  isPageLoading,
  onSave,
  onDelete,
  atualizaSaldo,
}: CardListExtractProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableTransactions, setEditableTransactions] = useState<TxWithFiles[]>([]);

  useEffect(() => {
    if (transactions) {
      setEditableTransactions(
        transactions.map((tx) => ({
          ...tx,
          valor: typeof tx.valor === "string" ? parseBRL(tx.valor) : tx.valor,
        }))
      );
    }
  }, [transactions]);

  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState<number[]>([]);
  const [isDeletingInProgress, setIsDeletingInProgress] = useState(false);
  const firstEditRef = useRef<HTMLInputElement>(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "entrada" | "saida">("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateError, setDateError] = useState(false);
  const isValidDate = (v: string) => v === "" || !Number.isNaN(Date.parse(v));

  const filteredTransactions = useMemo(() => {
    const tiposEntrada = ["cambio", "deposito"];
    const tiposSaida = ["transferencia"];
    return editableTransactions.filter((tx) => {
      const matchesType =
        typeFilter === "all" ||
        (typeFilter === "entrada" && tiposEntrada.includes(tx.tipo)) ||
        (typeFilter === "saida" && tiposSaida.includes(tx.tipo));
      const txDate = new Date(tx.createdAt);
      const matchesStart = !startDate || txDate >= new Date(`${startDate}T00:00`);
      const matchesEnd = !endDate || txDate <= new Date(`${endDate}T23:59:59`);
      return matchesType && matchesStart && matchesEnd;
    });
  }, [editableTransactions, typeFilter, startDate, endDate]);

  const handleEditClick = () => {
    setEditableTransactions((p) => p.map((tx) => ({ ...tx, updatedAt: formatDateBR(tx.updatedAt) })));
    setIsEditing(true);
    setTimeout(() => firstEditRef.current?.focus());
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

  const handleTransactionChange = (index: number, field: keyof Transaction, value: string) => {
    setEditableTransactions((prev) =>
      prev.map((tx, i) => {
        if (i !== index) return tx;
        if (field === "valor") return { ...tx, valor: parseBRL(value) };
        return { ...tx, [field]: value };
      })
    );
  };

  const handleAttachFiles = (transactionId: number, files: File[]) => {
    setEditableTransactions(currentTxs =>
      currentTxs.map(tx =>
        tx._id === transactionId ? { ...tx, novosAnexos: files } : tx
      )
    );
  };

  const handleRemoveAttachment = async (
    transactionId: number,
    attachmentIdentifier: string,
    isNew: boolean
  ) => {
    if (!isNew) {
      try {
        const fileName = attachmentIdentifier.substring(attachmentIdentifier.lastIndexOf('/') + 1);
        const response = await fetch(`/api/anexos/${encodeURIComponent(fileName)}`, {
          method: 'DELETE',
        });

        if (response.status !== 204 && response.status !== 200) {
          const errorData = await response.json() as { message?: string };
          alert(`Erro ao remover anexo: ${errorData.message ?? 'Erro desconhecido'}`);
          return;
        }
      } catch {
        alert('Erro de rede ao tentar remover o anexo.');
        return;
      }
    }

    setEditableTransactions(currentTxs =>
      currentTxs.map(tx => {
        if (tx._id !== transactionId) return tx;
        if (isNew) {
          return { ...tx, novosAnexos: tx.novosAnexos?.filter(f => f.name !== attachmentIdentifier) };
        } else {
          return { ...tx, anexos: tx.anexos?.filter(a => a.url !== attachmentIdentifier) };
        }
      })
    );
  };

  const handleSaveOrDeleteClick = async () => {
    if (isEditing) {
      await onSave(editableTransactions);
      setIsEditing(false);
      setStatusMsg("Transações salvas!");
      return;
    }
    if (isDeleting) {
      if (!selectedTransactions.length) return;
      setIsDeletingInProgress(true);
      setStatusMsg("Excluindo transações…");
      try {
        await onDelete(selectedTransactions);
        setStatusMsg("Transações excluídas!");
      } finally {
        setIsDeletingInProgress(false);
        setIsDeleting(false);
        setSelectedTransactions([]);
        atualizaSaldo();
        setTimeout(() => setStatusMsg(""), 4000);
      }
    }
  };

  const handleStartDateChange = (v: string) => { setStartDate(v); setDateError(!isValidDate(v)); };
  const handleEndDateChange = (v: string) => { setEndDate(v); setDateError(!isValidDate(v)); };

  const loadingFirstPage = isPageLoading && editableTransactions.length === 0;
  const hasTransactions = !loadingFirstPage && editableTransactions.length > 0;

  return (
    <Box className={`${styles.cardExtrato} cardExtrato w-full min-h-[512px]`} role="region" aria-labelledby="extrato-heading">
      <Box className={styles.extratoHeader}>
        <h3 id="extrato-heading" className={styles.extratoTitle}>Extrato</h3>
        {hasTransactions && !isEditing && !isDeleting && (
          <Box className={styles.extratoActions}>
            <IconButton aria-label="editar" className={styles.actionBtn} onClick={handleEditClick}><EditIcon fontSize="small" /></IconButton>
            <IconButton aria-label="excluir" className={styles.actionBtn} onClick={handleDeleteClick}><DeleteIcon fontSize="small" /></IconButton>
          </Box>
        )}
      </Box>
      {hasTransactions && (
        <Box className="flex flex-col md:flex-row gap-4 pb-2" sx={{ borderBottom: "1px solid var(--byte-color-green-50)", flexWrap: "wrap" }}>
          <Select size="small" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as "all" | "entrada" | "saida")} sx={{ flex: 1, minWidth: { xs: "calc(50% - 4px)", md: 120 } }}>
            <MenuItem value="all">Todos</MenuItem><MenuItem value="entrada">Entrada</MenuItem><MenuItem value="saida">Saída</MenuItem>
          </Select>
          <TextField label="De" type="date" size="small" value={startDate} onChange={(e) => handleStartDateChange(e.target.value)} error={dateError} helperText={dateError ? "Data inválida" : ""} InputLabelProps={{ shrink: true }} sx={{ flex: 1, minWidth: { xs: "calc(50% - 4px)", md: 120 } }} />
          <TextField label="Até" type="date" size="small" value={endDate} onChange={(e) => handleEndDateChange(e.target.value)} error={dateError} helperText={dateError ? "Data inválida" : ""} InputLabelProps={{ shrink: true }} sx={{ flex: 1, minWidth: { xs: "calc(50% - 4px)", md: 120 } }} />
        </Box>
      )}
      {loadingFirstPage ? (
        <Box aria-busy="true" aria-label="Carregando"><SkeletonListExtract rows={5} /></Box>
      ) : dateError || !filteredTransactions.length ? (
        <Box className="flex flex-col items-center justify-center text-center gap-4 py-10">
          {dateError ? (
            <><Typography variant="h6" color="error">Data inválida</Typography><Typography variant="body2" color="text.secondary">Verifique o formato da data inserida.</Typography></>
          ) : (
            <><ReceiptLongOutlinedIcon sx={{ fontSize: 56, color: "text.secondary" }} /><Typography variant="h6">Nenhuma transação encontrada</Typography><Typography variant="body2" color="text.secondary">Ajuste os filtros ou adicione uma nova transação para começar.</Typography></>
          )}
        </Box>
      ) : (
        <>
          <ul role="list" aria-busy={isPageLoading} className="space-y-4">
            {filteredTransactions.map((tx, idx) => {
              const hasExistingAttachment = (tx.anexos?.length ?? 0) > 0 || (tx.novosAnexos?.length ?? 0) > 0;

              return (
                <li key={tx._id ?? `tx-${idx}`}>
                  <Box className={styles.extratoItem} style={{ gap: isEditing ? 0 : undefined }}>
                    <Box className={styles.txRow}>
                      {isEditing ? (
                        <Input disableUnderline className={styles.txType} fullWidth value={formatTipo(tx.tipo)} onChange={(e) => handleTransactionChange(idx, "tipo", e.target.value)} inputProps={{ style: { textAlign: "left" } }} inputRef={idx === 0 ? firstEditRef : undefined} />
                      ) : (
                        <span className={styles.txType}>{formatTipo(tx.tipo)}</span>
                      )}
                      <span className={styles.txDate}>{formatDateBR(tx.createdAt)}</span>
                    </Box>
                    {isEditing ? (
                      <Box className="flex items-center gap-2 w-full">
                        <Input disableUnderline className={clsx(styles.txValue, styles.txValueEditable)} sx={{ flex: 1 }} value={formatBRL(tx.valor)} onChange={(e) => handleTransactionChange(idx, "valor", maskCurrency(e.target.value))} inputProps={{ inputMode: "decimal", title: "Até 999.999,99" }} />
                        <input hidden multiple accept="image/*,application/pdf" id={`edit-anexos-${tx._id}`} type="file" aria-label="Selecionar arquivos para anexar"
                          disabled={hasExistingAttachment}
                          onChange={(e) => { const files = e.target.files; if (files) { handleAttachFiles(tx._id, Array.from(files)); } }}
                        />
                        <label htmlFor={`edit-anexos-${tx._id}`}>
                          <Tooltip title={hasExistingAttachment ? "Remova o anexo atual para adicionar um novo" : "Anexar arquivos"}>
                            <span>
                              <IconButton component="span" size="small" color="primary" aria-label="Anexar arquivos" disabled={hasExistingAttachment}>
                                <AttachFileIcon fontSize="inherit" aria-hidden="true" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </label>
                      </Box>
                    ) : (
                      <Box className="flex items-center">
                        {isDeleting && (<Checkbox aria-label={`Selecionar transação ${formatBRL(Math.abs(tx.valor))}`} checked={selectedTransactions.includes(tx._id)} onChange={() => handleCheckboxChange(tx._id)} size="small" className="mr-2" sx={{ color: "var(--byte-color-dash)", "&.Mui-checked": { color: "var(--byte-color-dash)" } }} />)}
                        <span className={styles.txValue}>{tx.valor < 0 && "-"}{formatBRL(tx.valor)}</span>
                        {tx.anexos?.length ? (<Tooltip title={`${tx.anexos.length} anexo(s)`}><AttachFileIcon sx={{ fontSize: 16, ml: 0.5, color: "var(--byte-color-dash)" }} aria-hidden="true" /></Tooltip>) : null}
                      </Box>
                    )}
                  </Box>
                  {(tx.anexos?.length || tx.novosAnexos?.length) ? (
                    <Box className="flex flex-wrap gap-2 mt-2 ml-2">
                      {tx.anexos?.map((a: Attachment) => (
                        <Chip key={a.url} label={a.name} size="small" icon={<AttachFileIcon sx={{ fontSize: 14 }} />} component={!isEditing ? Link : "div"} href={!isEditing ? a.url : undefined} target={!isEditing ? "_blank" : undefined} clickable={!isEditing} onDelete={isEditing ? () => { void handleRemoveAttachment(tx._id, a.url, false); } : undefined} sx={{ backgroundColor: "var(--byte-color-green-50)", ":hover": { bgcolor: "var(--byte-color-green-100)" } }} />
                      ))}
                      {isEditing && tx.novosAnexos?.map((f, i) => (
                        <Chip key={i} label={f.name} size="small" color="info" variant="outlined" icon={<AttachFileIcon sx={{ fontSize: 14 }} />} onDelete={() => { void handleRemoveAttachment(tx._id, f.name, true); }} />
                      ))}
                    </Box>
                  ) : null}
                </li>
              )
            })}
          </ul>
          <Box aria-busy={isPageLoading}><InfiniteScrollSentinel onVisible={() => { void fetchPage(); }} disabled={!hasMore || isPageLoading} isLoading={isPageLoading} /></Box>
          {isPageLoading && editableTransactions.length > 0 && (<SkeletonListExtract rows={5} />)}
        </>
      )}
      {(isEditing || isDeleting) && (
        <Box className="flex gap-2 justify-between mt-4">
          <Button onClick={() => { void handleSaveOrDeleteClick(); }} className={clsx(styles.botaoSalvar, isDeleting && (isDeletingInProgress || !selectedTransactions.length) && "opacity-50 cursor-not-allowed")} disabled={isDeleting && (isDeletingInProgress || !selectedTransactions.length)}>
            {isEditing ? "Salvar" : isDeletingInProgress ? "Excluindo..." : "Excluir"}
          </Button>
          <Button onClick={isEditing ? handleCancelClick : handleCancelDeleteClick} className={styles.botaoCancelar} disabled={isDeleting && isDeletingInProgress}>Cancelar</Button>
        </Box>
      )}
      <Box role="status" aria-live="polite" sx={{ position: "absolute", left: -9999 }}>{statusMsg}</Box>
    </Box>
  );
}