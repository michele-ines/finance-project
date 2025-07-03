"use client";
import { useEffect, useRef } from "react";
import { Box } from "@mui/material"; 

interface Props {
  onVisible: () => void;
  isLoading: boolean; 
  disabled?: boolean;
}

export default function InfiniteScrollSentinel({
  onVisible,
  isLoading,
  disabled,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (disabled || isLoading) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
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
      <Box
        component="div"
        aria-live="polite" 
        sx={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {isLoading && "Carregando mais transações..."}
      </Box>
    </div>
  );
}
