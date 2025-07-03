"use client";
import { Box } from "@mui/material";
import { SpendingAlertProps } from "interfaces/dashboard";

function calculateTotalExpenses(
  transactions: SpendingAlertProps["transactions"]
): number {
  return transactions
    .filter(tx => tx.tipo === "saida")
    .reduce((total, tx) => total + tx.valor, 0);
}

export default function SpendingAlertWidget({
  limit,
  transactions,
}: SpendingAlertProps) {
  const gastos = calculateTotalExpenses(transactions);
  const alert = gastos > limit;

  return (
    <Box
      component="section"                 /* região identificável */
      aria-labelledby="spending-alert-heading"
      className="p-4 rounded-2xl shadow-md bg-white text-gray-900"
      style={{ border: "2px solid var(--byte-color-dash)" }}
    >
      <h3 id="spending-alert-heading" className="text-lg font-semibold">
        Alerta de Gastos
      </h3>

      <p>
        Limite mensal:
        {/* rótulo lido corretamente por leitores de tela */}
        <span aria-label={`Limite de R$ ${limit}`}> R$ {limit}</span>
      </p>

      <p>
        Total gasto:
        <span aria-label={`Total gasto R$ ${gastos}`}> R$ {gastos}</span>
      </p>

      {alert ? (
        <p
          className="text-red-600 font-bold mt-2"
          role="alert"                  /* avisado imediatamente */
          aria-live="assertive"
        >
          <span role="img" aria-label="Alerta">⚠</span>{" "}
          Você ultrapassou o limite!
        </p>
      ) : (
        <p className="text-green-600 font-semibold mt-2" aria-live="polite">
          Gastos dentro do limite
        </p>
      )}
    </Box>
  );
}
