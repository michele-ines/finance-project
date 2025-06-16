"use client";
import { Box } from "@mui/material";
import { SpendingAlertProps } from "interfaces/dashboard";

function calculateTotalExpenses(
  transactions: SpendingAlertProps["transactions"]
): number {
  return transactions
    .filter((tx) => tx.tipo === "saida")
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
      className="p-4 rounded-2xl shadow-md bg-white text-gray-900"
      style={{ border: "2px solid var(--byte-color-dash)" }}
    >
      {" "}
      <h3 className="text-lg font-semibold">Alerta de Gastos</h3>
      <p>Limite mensal: R$ {limit}</p>
      <p>Total gasto: R$ {gastos}</p>
      {alert ? (
        <p className="text-red-600 font-bold mt-2">
          ⚠ Você ultrapassou o limite!
        </p>
      ) : (
        <p className="text-green-600 font-semibold mt-2">
          Gastos dentro do limite
        </p>
      )}
    </Box>
  );
}
