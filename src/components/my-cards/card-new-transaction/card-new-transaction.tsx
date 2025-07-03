"use client";
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

/* 🆕 utilidade de classe para esconder labels visuais mas mantê-los para leitores de tela */
const srOnly = "absolute -m-px w-px h-px overflow-hidden clip-[rect(0,0,0,0)]";

export default function CardNewTransaction({
  onSubmit,
  isLoading,
}: CardNewTransactionProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewTransactionData>();

  return (
    /* 🆕 role=form descreve o container do formulário */
    <Box
      role="form"
      aria-labelledby="nova-transacao-titulo"
      className={`${styles.cardTransacao} cardTransacao w-full min-h-[520px]`}
    >
      <h3 id="nova-transacao-titulo" className={styles.transacaoTitle}>
        Nova transação
      </h3>

      <form
        onSubmit={handleSubmit(async (data) => {
          await onSubmit(data);
        })}
      >
        {/* ---------- SELECT Tipo ---------- */}
        <FormControl fullWidth className={styles.transacaoFormControl}>
          {/* 🆕 label somente-leitor para Select */}
          <label htmlFor="tipo-select" className={srOnly}>
            Tipo de transação
          </label>

          <Select
            id="tipo-select"
            fullWidth
            displayEmpty
            defaultValue=""
            variant="outlined"
            error={!!errors.tipo}
            /* 🆕 atributos ARIA */
            inputProps={{
              "aria-label": "Tipo de transação",
              "aria-required": "true",
              "aria-invalid": !!errors.tipo,
              "aria-describedby": errors.tipo ? "erro-tipo" : undefined,
            }}
            {...register("tipo", transactionValidations.tipo)}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              border: "1px solid",
              borderColor: errors.tipo ? "#ef4444" : "#e5e7eb",
              borderRadius: 2,
              width: "100%",
              "&.Mui-focused": {
                borderColor: errors.tipo ? "#ef4444" : "#22c55e",
                boxShadow: `0 0 0 2px ${errors.tipo ? "#fecaca" : "#6ee7b7"}`,
              },
            }}
          >
            <MenuItem value="" disabled>
              Selecione o tipo de transação
            </MenuItem>
            <MenuItem value="cambio">Câmbio (Entrada)</MenuItem>
            <MenuItem value="deposito">Depósito (Saída)</MenuItem>
            <MenuItem value="transferencia">Transferência (Saída)</MenuItem>
          </Select>
          {errors.tipo && (
            /* 🆕 role=alert faz o leitor de tela anunciar a mensagem imediatamente */
            <span
              id="erro-tipo"
              role="alert"
              className="text-red-500 text-sm"
            >
              {errors.tipo.message}
            </span>
          )}
        </FormControl>

        {/* ---------- INPUT Valor ---------- */}
        <p className={styles.transacaoLabel}>Valor</p>
        <FormControl fullWidth className={styles.transacaoFormControl}>
          {/* 🆕 label visualmente escondida */}
          <label htmlFor="valor-input" className={srOnly}>
            Valor em Reais
          </label>

          <Input
            id="valor-input"
            placeholder="00,00"
            disableUnderline
            startAdornment={
              <InputAdornment position="start">R$</InputAdornment>
            }
            {...register("valor", transactionValidations.valor)}
            onChange={(e) => (e.target.value = maskCurrency(e.target.value))}
            /* 🆕 atributos de acessibilidade diretamente no input */
            inputProps={{
              "aria-label": "Valor em reais",
              inputMode: "decimal",
              "aria-required": "true",
              "aria-invalid": !!errors.valor,
              "aria-describedby": errors.valor ? "erro-valor" : undefined,
            }}
            sx={{
              border: "1px solid",
              borderColor: errors.valor ? "#ef4444" : "#e5e7eb",
              borderRadius: 2,
              pl: 1.5,
              py: 1,
              my: 3,
              "&:focus-within": {
                borderColor: errors.valor ? "#ef4444" : "#22c55e",
                boxShadow: `0 0 0 2px ${errors.valor ? "#fecaca" : "#6ee7b7"}`,
              },
            }}
          />
          {errors.valor && (
            <span
              id="erro-valor"
              role="alert"
              className="text-red-500 text-sm"
            >
              {errors.valor.message}
            </span>
          )}
        </FormControl>

        {/* ---------- BOTÃO ---------- */}
        <Box className="mt-4">
          <Button
            type="submit"
            /* 🆕 atributos de estado para leitores de tela */
            aria-busy={isLoading ? "true" : undefined}
            aria-disabled={isLoading ? "true" : undefined}
            className={clsx(styles.transacaoButton, {
              "opacity-50 cursor-not-allowed bg-gray-400 hover:bg-gray-400":
                isLoading,
            })}
            disabled={isLoading}
          >
            {isLoading ? "Concluindo…" : "Concluir Transação"}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
