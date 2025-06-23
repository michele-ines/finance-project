import {
  Box,
  Button,
  FormControl,
  Input,
  InputAdornment,
  MenuItem,
  Select,
  cardNewTransactionStyles as styles,
} from "../../ui";
import { transactionValidations } from "../../../utils/forms-validations/formValidations";
import {
  CardNewTransactionProps,
  NewTransactionData,
} from "interfaces/dashboard";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { maskCurrency } from "../../../utils/currency-formatte/currency-formatte";

export default function CardNewTransaction({
  onSubmit,
  isLoading,
}: Readonly<CardNewTransactionProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewTransactionData>();

  return (
    <Box
      className={`${styles.cardTransacao} cardTransacao w-full min-h-[478px]`}
    >
      <h3 className={styles.transacaoTitle}>Nova transação</h3>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ---------- SELECT ---------- */}
        <FormControl
          fullWidth
          className={styles.transacaoFormControl}
          sx={{ width: "100%", boxSizing: "border-box" }}
        >
          <Select
            fullWidth
            displayEmpty
            defaultValue=""
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              border: "1px solid",
              borderColor: errors.tipo ? "#ef4444" : "#e5e7eb",
              borderRadius: 2,
              "&.Mui-focused": {
                borderColor: errors.tipo ? "#ef4444" : "#22c55e",
                boxShadow: `0 0 0 2px ${errors.tipo ? "#fecaca" : "#6ee7b7"}`,
              },
              width: "100%",
            }}
            error={!!errors.tipo}
            {...register("tipo", transactionValidations.tipo)}
          >
            <MenuItem value="" disabled>
              Selecione o tipo de transação
            </MenuItem>
            <MenuItem value="cambio">Câmbio (Entrada)</MenuItem>
            <MenuItem value="deposito">Depósito (Saída)</MenuItem>
            <MenuItem value="transferencia">Transferência (Saída)</MenuItem>
          </Select>
          {errors.tipo && (
            <span className="text-red-500 text-sm">{errors.tipo.message}</span>
          )}
        </FormControl>

        {/* ---------- INPUT ---------- */}
        <p className={styles.transacaoLabel}>Valor</p>
        <FormControl
          fullWidth
          className={styles.transacaoFormControl}
          sx={{ width: "100%", boxSizing: "border-box" }}
        >
          <Input
            fullWidth
            placeholder="00,00"
            disableUnderline
            sx={{
              border: "1px solid",
              borderColor: errors.valor ? "#ef4444" : "#e5e7eb",
              borderRadius: 2,
              pl: 1.5,
              py: 1,
              my: 3,
              width: "100%",
              boxSizing: "border-box",
              "&:focus-within": {
                borderColor: errors.valor ? "#ef4444" : "#22c55e",
                boxShadow: `0 0 0 2px ${errors.valor ? "#fecaca" : "#6ee7b7"}`,
              },
            }}
            startAdornment={
              <InputAdornment position="start">R$</InputAdornment>
            }
            {...register("valor", transactionValidations.valor)}
            onChange={(e) => {
              const value = e.target.value;
              e.target.value = maskCurrency(value);
            }}
          />
          {errors.valor && (
            <span className="text-red-500 text-sm">{errors.valor.message}</span>
          )}
        </FormControl>

        {/* ---------- BOTÃO ---------- */}
        <Box className="mt-4">
          <Button
            type="submit"
            className={clsx(styles.transacaoButton, {
              "opacity-50 cursor-not-allowed bg-gray-400 hover:bg-gray-400":
                isLoading,
            })}
            disabled={isLoading}
            aria-disabled={isLoading}
          >
            {isLoading ? "Concluindo Transação…" : "Concluir Transação"}
          </Button>
        </Box>
      </form>
    </Box>
  );
}