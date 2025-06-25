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
  Typography,
} from "../../ui";
import { transactionValidations } from "../../../utils/forms-validations/formValidations";
import {
  CardNewTransactionProps,
  NewTransactionData,
} from "interfaces/dashboard";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { maskCurrency } from "../../../utils/currency-formatte/currency-formatte";
import { useState } from "react";

export default function CardNewTransaction({
  onSubmit,
  isLoading,
}: CardNewTransactionProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<NewTransactionData>();

  /* preview de nomes de arquivos ------------------------------------ */
  const [fileNames, setFileNames] = useState<string[]>([]);

  return (
    <Box
      className={`${styles.cardTransacao} cardTransacao w-full min-h-[520px]`}
    >
      <h3 className={styles.transacaoTitle}>Nova transação</h3>

      <form
        onSubmit={handleSubmit(async (data) => {
          await onSubmit(data); // delega ao componente pai
        })}
      >
        {/* ---------- SELECT Tipo ---------- */}
        <FormControl fullWidth className={styles.transacaoFormControl}>
          <Select
            fullWidth
            displayEmpty
            defaultValue=""
            variant="outlined"
            error={!!errors.tipo}
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
            <span className="text-red-500 text-sm">{errors.tipo.message}</span>
          )}
        </FormControl>

        {/* ---------- INPUT Valor ---------- */}
        <p className={styles.transacaoLabel}>Valor</p>
        <FormControl fullWidth className={styles.transacaoFormControl}>
          <Input
            placeholder="00,00"
            disableUnderline
            startAdornment={
              <InputAdornment position="start">R$</InputAdornment>
            }
            {...register("valor", transactionValidations.valor)}
            onChange={(e) => (e.target.value = maskCurrency(e.target.value))}
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
            <span className="text-red-500 text-sm">{errors.valor.message}</span>
          )}
        </FormControl>

        {/* ---------- INPUT FILES ---------- */}
        <p
          className={styles.transacaoLabel}
          style={{ color: "var(--byte-color-dash)" }}
        >
          Anexos (recibos / PDFs)
        </p>
        <input
          id="anexos-input"
          type="file"
          hidden
          multiple
          accept="image/*,application/pdf"
          {...register("anexos")}
          onChange={(e) => {
            const list = e.target.files;
            if (list) {
              setValue("anexos", list);
              setFileNames([...list].map((f) => f.name));
            }
          }}
        />
        <label htmlFor="anexos-input">
          <Button
            component="span"
            className="mb-2"
            style={{
              textDecoration: "underline", 
              textUnderlineOffset: "2px", 
            }}
          >
            Selecionar arquivos
          </Button>
        </label>

        {fileNames.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            {fileNames.join(", ")}
          </Typography>
        )}

        {/* ---------- BOTÃO ---------- */}
        <Box className="mt-4">
          <Button
            type="submit"
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
