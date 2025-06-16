import { Box, LinearProgress } from "@mui/material";
import { SavingsGoalProps } from "interfaces/dashboard";

export default function SavingsGoalWidget({
  goal,
  transactions,
}: SavingsGoalProps) {
  const saved = transactions
    .filter((tx) => tx.tipo === "entrada")
    .reduce((total, tx) => total + tx.valor, 0);

  const percentage = Math.min((saved / goal) * 100, 100);

  return (
<Box
  className="p-4 rounded-2xl shadow-md bg-white text-gray-900"
  style={{ border: "2px solid var(--byte-color-dash)" }}
>
    <h3 className="text-lg font-semibold">Meta de Economia</h3>
      <p>Meta: R$ {goal}</p>
      <p>Economizado: R$ {saved}</p>
      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{ height: 10, borderRadius: 5, mt: 1, mb: 1 }}
      />
      <p className="text-sm mt-1">
        {percentage >= 100
          ? "🎉 Parabéns! Você atingiu sua meta!"
          : `Progresso: ${percentage.toFixed(1)}%`}
      </p>
    </Box>
  );
}
