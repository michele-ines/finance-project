"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Transaction } from "interfaces/dashboard";

const PAGE_SIZE = 10;

export function usePaginatedTransactions() {
  /* páginas já carregadas */
  const [pages, setPages] = useState<Transaction[][]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /* controle interno -------------------------------------------------- */
  const loadingRef = useRef(false);           // impede chamadas simultâneas
  const totalRef   = useRef<number | null>(null);
  const nextPage   = useRef(1);               // 1-based

  /* --------------------- BUSCA DE PÁGINA ---------------------------- */
  const fetchPage = useCallback(async () => {
    if (loadingRef.current) return;           // já tem requisição em curso
    loadingRef.current = true;
    setIsLoading(true);

    try {
      const res = await fetch(
        `/api/transacao?page=${nextPage.current}&limit=${PAGE_SIZE}`
      );
      const { transacoes, total } = await res.json();

      totalRef.current = total;               // salva total vindo do backend

      /* adiciona somente transações ainda não vistas */
      setPages(prev => {
        const knownIds = new Set(prev.flat().map(t => t._id));
        const onlyNew  = transacoes.filter((t: Transaction) => !knownIds.has(t._id));
        return [...prev, onlyNew];
      });

      nextPage.current += 1;                  // prepara a próxima página
    } catch (err) {
      console.error("Erro ao buscar página de transações:", err);
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  }, []);                                     // <— sem dependências!

  /* --------------------- UTILIDADES --------------------------------- */
  const prepend = useCallback((tx: Transaction) => {
    setPages(prev => [[tx], ...prev]);
    if (totalRef.current !== null) totalRef.current += 1;
  }, []);

  const refresh = useCallback(async () => {
    setPages([]);
    totalRef.current   = null;
    nextPage.current   = 1;
    await fetchPage();                         // carrega de novo a 1.ª página
  }, [fetchPage]);

  /* primeira página na montagem */
  useEffect(() => {
    fetchPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* lista achatada e memorizada */
  const transactions = useMemo(() => pages.flat(), [pages]);

  const hasMore =
    totalRef.current === null ? true : transactions.length < totalRef.current;

  return {
    transactions,
    fetchPage,
    prepend,
    refresh,
    hasMore,
    isLoading,
  };
}
