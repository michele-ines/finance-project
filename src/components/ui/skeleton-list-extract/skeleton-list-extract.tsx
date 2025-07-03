import { SkeletonProps } from "interfaces/dashboard";
import React from "react";

/**
 * Skeleton de lista de transações.
 * ♿ Inclui atributos ARIA para indicar carregamento/ocupado.
 */
export default function SkeletonListExtract({ rows = 5 }: SkeletonProps) {
  return (
    <ul
      className="space-y-4"
      role="list"                                // redundante, mas deixa explícito
      aria-busy="true"                          // informa que ainda está carregando
      aria-label="Carregando lista de transações"
    >
      {Array.from({ length: rows }).map((_, index) => (
        <li key={index} role="listitem">
          <div
            className="animate-pulse flex flex-col gap-2"
            role="status"                       // avisa que é uma área de status
            aria-label="Carregando…"            // descrição concisa
          >
            {/* Texto somente para leitores de tela */}
            <span className="sr-only">Carregando…</span>

            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          </div>
        </li>
      ))}
    </ul>
  );
}
