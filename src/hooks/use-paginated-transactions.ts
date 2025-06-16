// src/hooks/usePaginatedTransactions.ts
"use client";
import { Transaction } from "interfaces/dashboard";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const PAGE_SIZE = 20;

export function usePaginatedTransactions() {
  /* páginas já carregadas */
  const [pages, setPages] = useState<Transaction[][]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /* total de registros informado pela API */
  const total = useRef<number | null>(null);

  /* nº da próxima página (mantido em ref p/ não “congelar” no callback) */
  const nextPage = useRef(1);

  const fetchPage = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    const res = await fetch(
      `/api/transacao?page=${nextPage.current}&limit=${PAGE_SIZE}`
    );
    const { transacoes, total: all } = await res.json();

    /* salva total vindo do backend */
    total.current = all;

    /* ➜ acrescenta apenas transações ainda não vistas */
    setPages((prev) => {
      const knownIds = new Set(prev.flat().map((t) => t._id));
      const onlyNew = transacoes.filter((t: Transaction) => !knownIds.has(t._id));
      return [...prev, onlyNew];
    });

    nextPage.current += 1;      // incrementa p/ a próxima requisição
    setIsLoading(false);
  }, [isLoading]);

  /* primeira página na montagem */
  useEffect(() => {
    fetchPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* lista achatada, mas **memoriza** entre renders  */
  const transactions = useMemo(() => pages.flat(), [pages]);

  const hasMore =
    total.current === null ? true : transactions.length < total.current;

  return { transactions, fetchPage, hasMore, isLoading };
}
