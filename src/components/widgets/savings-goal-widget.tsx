import { Box, LinearProgress } from "@mui/material";
import { SavingsGoalProps } from "interfaces/dashboard";

export default function SavingsGoalWidget({
  goal,
  transactions,
}: SavingsGoalProps) {
  const saved = transactions
    .filter(tx => tx.tipo === "entrada")      // ajuste se usar outro termo
    .reduce((total, tx) => total + tx.valor, 0);

  const percentage = Math.min((saved / goal) * 100, 100);

  return (
    /*  ⬇️ Seção identificável para quem usa leitor de tela */
    <Box
      component="section"
      aria-labelledby="savings-goal-heading"
      className="p-4 rounded-2xl shadow-md bg-white text-gray-900"
      style={{ border: "2px solid var(--byte-color-dash)" }}
    >
      {/* cabeçalho semanticamente correto */}
      <h3 id="savings-goal-heading" className="text-lg font-semibold">
        Meta de Economia
      </h3>

      {/* valores falados corretamente – use aria-live se esses números puderem mudar em tempo real */}
      <p>Meta: <span aria-label={`Meta de R$ ${goal}`}>R$ {goal}</span></p>
      <p>Economizado: <span aria-label={`Economizado R$ ${saved}`}>R$ {saved}</span></p>

      {/* barra de progresso com rótulo claro para leitores de tela */}
      <LinearProgress
        role="progressbar"
        aria-label="Progresso da meta de economia"
        aria-valuenow={Number(percentage.toFixed(1))}
        aria-valuemin={0}
        aria-valuemax={100}
        variant="determinate"
        value={percentage}
        sx={{ height: 10, borderRadius: 5, mt: 1, mb: 1 }}
      />

      {/* mensagem final – o emoji agora tem descrição  */}
      <p className="text-sm mt-1" aria-live="polite">
        {percentage >= 100 ? (
          <>
            <span role="img" aria-label="Festa">🎉</span>{" "}
            Parabéns! Você atingiu sua meta!
          </>
        ) : (
          `Progresso: ${percentage.toFixed(1)}%`
        )}
      </p>
    </Box>
  );
}
