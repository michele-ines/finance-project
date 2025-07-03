"use client";
import { useEffect, useRef } from "react";
import { Box } from "@mui/material"; // Usando Box do Material-UI para consistência

interface Props {
  onVisible: () => void;
  isLoading: boolean; // <-- Prop CRÍTICA para anunciar o status
  disabled?: boolean;
}

export default function InfiniteScrollSentinel({ onVisible, isLoading, disabled }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Não observar se estiver desabilitado ou se já estiver carregando
    if (disabled || isLoading) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onVisible();
        }
      },
      { rootMargin: "256px 0px" }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [onVisible, isLoading, disabled]);

  return (
    <div ref={ref} style={{ height: 1, width: "100%" }}>
      {/* ✅ A11Y: Região Viva para Acessibilidade.
        Informa aos leitores de tela que o conteúdo está sendo carregado.
      */}
      <Box
        component="div"
        aria-live="polite" // Anuncia de forma não-intrusiva
        // Estilos para esconder visualmente, mas manter acessível para leitores de tela
        sx={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        {isLoading && "Carregando mais transações..."}
      </Box>
    </div>
  );
}