import { BarChart, ModeStandby } from "@mui/icons-material";
import {
  Box,
  Modal,
  FormControlLabel,
  Checkbox,
  Typography,
} from "@mui/material";
import { useWidgetPreferences } from "app/hooks/useWidgetPreferences";
import { useEffect } from "react";

type WidgetSettingsModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function WidgetSettingsModal({
  open,
  onClose,
}: Readonly<WidgetSettingsModalProps>) {
  const { preferences, togglePreference } = useWidgetPreferences();

  // Fechar modal com Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="widget-modal-title"
      aria-describedby="widget-modal-description"
    >
      <Box
        aria-modal="true"
        className="bg-white p-6 rounded-2xl shadow-md text-gray-800 focus:outline-none overflow-y-auto"
        sx={{
          width: "100%",
          maxWidth: 480,
          mx: "auto",
          mt: "2%",
          maxHeight: "90vh",
          overflowY: "auto",
          outline: "none",
          transition: "all 0.2s ease",
        }}
      >
        <Typography
          id="widget-modal-title"
          component="h2"
          variant="h6"
          fontWeight="bold"
          marginBottom={2}
        >
          Personalizar Widgets
        </Typography>
        <p className="text-xs text-gray-700 mb-4">
          Escolha quais widgets deseja exibir no painel
        </p>
        {/* CARD: Alerta de Gastos */}
        <Box
          className={`border rounded-lg p-4 mb-3 transition-all cursor-pointer ${
            preferences.spendingAlert
              ? "border-blue-600 bg-[#f8faff]"
              : "border-gray-300 bg-white"
          } hover:border-gray-400 shadow-sm`}
          onClick={() => togglePreference("spendingAlert")}
          tabIndex={0}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") &&
            togglePreference("spendingAlert")
          }
        >
          <Box className="flex justify-between items-center">
            <Typography fontWeight="bold">Alerta de gastos</Typography>

            <FormControlLabel
              control={
                <Checkbox
                  checked={preferences.spendingAlert}
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePreference("spendingAlert");
                  }}
                  sx={{
                    color: "var(--byte-color-dash)",
                    "&.Mui-checked": { color: "var(--byte-color-dash)" },
                    transition: "all 0.2s ease",
                  }}
                  tabIndex={-1}
                />
              }
              label={""}
            />
          </Box>

          <Typography variant="body2" className="text-gray-600">
            Monitore seus gastos mensais e receba alertas quando se aproximar do
            limite definido. Ideal para controle de orçamento pessoal.{" "}
          </Typography>

          <Box
            className={`border rounded-lg p-4 my-3 border-gray-300 bg-white flex flex-col gap-4`}
          >
            <Typography
              fontWeight="bold"
              fontSize={14}
              className="flex gap-2 items-end"
            >
              <BarChart />
              Prévia do widget
            </Typography>

            <Typography fontSize={12} className="text-gray-600">
              Visualize seus gastos em tempo real com barras de progresso e
              notificações quando atingir 80% do limite.
            </Typography>

            <Box className="flex justify-between">
              <Typography
                variant="body2"
                fontSize={10}
                className="text-gray-500"
              >
                Limite atual:{" "}
                <span className="font-bold text-gray-900">R$ 2.000</span>
              </Typography>
              <Typography
                variant="body2"
                fontSize={10}
                className="text-gray-500"
              >
                Gasto: <span className="font-bold text-red-600">R$ 0</span>
              </Typography>
            </Box>
          </Box>
        </Box>
        {/* -------------------------------------------- */}
        {/* CARD: Meta de Economia */}
        <Box
          className={`border rounded-lg p-4 transition-all cursor-pointer ${
            preferences.savingsGoal
              ? "border-blue-600 bg-[#f8faff]"
              : "border-gray-300 bg-white"
          } hover:border-gray-400 shadow-sm`}
          onClick={() => togglePreference("savingsGoal")}
          tabIndex={0}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") &&
            togglePreference("savingsGoal")
          }
        >
          <Box className="flex justify-between items-center">
            <Typography fontWeight="bold">Meta de economia</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={preferences.savingsGoal}
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePreference("savingsGoal");
                  }}
                  sx={{
                    color: "var(--byte-color-dash)",
                    "&.Mui-checked": { color: "var(--byte-color-dash)" },
                    transition: "all 0.2s ease",
                  }}
                  tabIndex={-1}
                />
              }
              label={""}
            />
          </Box>
          <Typography variant="body2" className="text-gray-600">
            Defina metas de economia e acompanhe seu progresso com visualizações
            motivacionais. Perfeito para alcançar objetivos financeiros.
          </Typography>

          <Box
            className={`border rounded-lg p-4 my-3 border-gray-300 bg-white flex flex-col gap-4`}
          >
            <Typography
              fontWeight="bold"
              fontSize={14}
              className="flex gap-2 items-end"
            >
              <ModeStandby fontSize="small" />
              Prévia do widget
            </Typography>

            <Typography fontSize={12} className="text-gray-600">
              Acompanhe o progresso das suas metas com barra de progresso
              animadas e celebre cada conquista alcançada.
            </Typography>

            <Box className="flex justify-between">
              <Typography
                variant="body2"
                fontSize={10}
                className="text-gray-500"
              >
                Meta atual:{" "}
                <span className="font-bold text-gray-900">R$ 3.000</span>
              </Typography>
              <Typography
                variant="body2"
                fontSize={10}
                className="text-gray-500"
              >
                Economizado:{" "}
                <span className="font-bold text-green-600">R$ 0</span>
              </Typography>
            </Box>
          </Box>
        </Box>
        {/* -------------------------------------------- */}
        <Box className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white rounded cursor-pointer"
            style={{ backgroundColor: "var(--byte-color-dash)" }}
          >
            Fechar
          </button>
        </Box>
      </Box>
    </Modal>
  );
}
