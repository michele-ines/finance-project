// components/infinite-scroll-sentinel.tsx
"use client";
import { useEffect, useRef } from "react";

interface Props {
  onVisible: () => void;
  disabled?: boolean;
}

export default function InfiniteScrollSentinel({ onVisible, disabled }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (disabled) return;                       // OK → devolve undefined (permitido)

    const el = ref.current;
    if (!el) return;                           // evita observer em elemento inexistente

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onVisible();
      },
      { rootMargin: "256px 0px" }
    );

    observer.observe(el);

    // ✅ cleanup SEM null
    return () => {
      observer.disconnect();                   // ou observer.unobserve(el)
    };
  }, [onVisible, disabled]);

  return <div ref={ref} style={{ height: 1 }} />;
}
