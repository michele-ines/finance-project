import {
  Box,
  Button,
  FormControl,
  Input,
  InputAdornment,
  MenuItem,
  Select,
  Autocomplete,
  TextField,
  cardNewTransactionStyles as styles,
} from "../../ui";
import { transactionValidations } from "../../../utils/forms-validations/formValidations";
import {
  CardNewTransactionProps,
  NewTransactionData,
} from "interfaces/dashboard";
import { useForm, Controller } from "react-hook-form";
import clsx from "clsx";
import { maskCurrency } from "../../../utils/currency-formatte/currency-formatte";
import { useEffect, useState } from "react";

/* ------------------------------------------------------------------ */
/* Categorias — use id para valor interno e label para exibição        */
/* ------------------------------------------------------------------ */
const categoriasDespesa = [
  { id: "alimentacao", label: "Alimentação" },
  { id: "transporte", label: "Transporte" },
  { id: "moradia", label: "Moradia" },
  { id: "saude", label: "Saúde" },
  { id: "lazer", label: "Lazer" },
  { id: "educacao", label: "Educação" },
  { id: "compras", label: "Compras" },
  { id: "contas", label: "Contas Fixas (água, luz, internet)" },
  { id: "outras_despesas", label: "Outras Despesas" },
];

const categoriasReceita = [
  { id: "salario", label: "Salário" },
  { id: "servicos", label: "Serviços/Freelance" },
  { id: "investimentos", label: "Rendimentos/Investimentos" },
  { id: "presente_doacao", label: "Presente/Doação" },
  { id: "reembolso", label: "Reembolso" },
  { id: "outras_receitas", label: "Outras Receitas" },
];

const todasCategorias = [...categoriasReceita, ...categoriasDespesa];

/* ------------------------------------------------------------------ */
/* Componente                                                          */
/* ------------------------------------------------------------------ */
export default function CardNewTransaction({
  onSubmit,
  isLoading,
}: Readonly<CardNewTransactionProps>) {
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm<NewTransactionData>({
    defaultValues: {
      tipo: "",
      valor: "",
      categoria: "",
    },
  });

  /* ---------------- Opções de categoria dinâmicas ---------------- */
  const tipoTransacao = watch("tipo");
  const [opcoesCategoria, setOpcoesCategoria] = useState(todasCategorias);

  useEffect(() => {
    if (tipoTransacao === "deposito") {
      setOpcoesCategoria(categoriasReceita);
    } else if (tipoTransacao === "saque" || tipoTransacao === "transferencia") {
      setOpcoesCategoria(categoriasDespesa);
    } else {
      setOpcoesCategoria(todasCategorias);
    }
    // limpa categoria quando tipo muda
    setValue("categoria", "");
  }, [tipoTransacao, setValue]);

  return (
    <Box
      className={`${styles.cardTransacao} cardTransacao w-full min-h-[570px]`}
    >
      <h3 className={styles.transacaoTitle}>Nova transação</h3>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ---------- SELECT TIPO ---------- */}
        <FormControl
          fullWidth
          className={styles.transacaoFormControl}
          sx={{ width: "100%", boxSizing: "border-box", mb: 2.5 }}
        >
          <Controller
            name="tipo"
            control={control}
            rules={transactionValidations.tipo}
            render={({ field }) => (
              <Select
                {...field}
                fullWidth
                displayEmpty
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  border: "1px solid",
                  borderColor: errors.tipo
                    ? "var(--byte-color-error, #ef4444)"
                    : "#e5e7eb",
                  borderRadius: 2,
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline, &.Mui-focused":
                    {
                      borderColor: errors.tipo
                        ? "var(--byte-color-error, #ef4444)"
                        : "var(--byte-color-success, #22c55e)",
                      boxShadow: `0 0 0 2px ${
                        errors.tipo
                          ? "var(--byte-color-error-light, #fecaca)"
                          : "var(--byte-color-success-light, #6ee7b7)"
                      }`,
                    },
                }}
                error={!!errors.tipo}
              >
                <MenuItem value="" disabled>
                  Selecione o tipo de transação
                </MenuItem>
                <MenuItem value="deposito">Depósito (Entrada)</MenuItem>
                <MenuItem value="saque">Saque (Saída)</MenuItem>
                <MenuItem value="transferencia">Transferência (Saída)</MenuItem>
                <MenuItem value="cambio">Câmbio</MenuItem>
              </Select>
            )}
          />
          {errors.tipo && (
            <span className="text-red-500 text-sm mt-1">
              {errors.tipo.message}
            </span>
          )}
        </FormControl>

        {/* ---------- AUTOCOMPLETE CATEGORIA ---------- */}
        <FormControl
          fullWidth
          className={styles.transacaoFormControl}
          sx={{ width: "100%", boxSizing: "border-box", mb: 2.5 }}
        >
          <Controller
            name="categoria"
            control={control}
            rules={transactionValidations.categoria}
            render={({ field }) => (
              <Autocomplete
                options={opcoesCategoria}
                getOptionLabel={(opt) =>
                  typeof opt === "string" ? opt : opt.label
                }
                onChange={(_, data) => field.onChange(data ? data.id : "")}
                value={opcoesCategoria.find(
                  (opt) => opt.id === field.value
                ) || null}
                isOptionEqualToValue={(option, value) =>
                  option.id === value?.id
                }
                disabled={!tipoTransacao}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={
                      !tipoTransacao
                        ? "Selecione o tipo primeiro"
                        : "Categoria"
                    }
                    variant="outlined"
                    error={!!errors.categoria}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: errors.categoria
                            ? "var(--byte-color-error, #ef4444)"
                            : "#e5e7eb",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: errors.categoria
                            ? "var(--byte-color-error, #ef4444)"
                            : "var(--byte-color-success, #22c55e)",
                          boxShadow: `0 0 0 2px ${
                            errors.categoria
                              ? "var(--byte-color-error-light, #fecaca)"
                              : "var(--byte-color-success-light, #6ee7b7)"
                          }`,
                        },
                      },
                    }}
                  />
                )}
                ref={field.ref}
                onBlur={field.onBlur}
              />
            )}
          />
          {errors.categoria && (
            <span className="text-red-500 text-sm mt-1">
              {errors.categoria.message}
            </span>
          )}
        </FormControl>

        {/* ---------- INPUT VALOR ---------- */}
        <p
          className={styles.transacaoLabel}
          style={{ marginBottom: "4px" }}
        >
          Valor
        </p>
        <FormControl fullWidth className={styles.transacaoFormControl}>
          <Controller
            name="valor"
            control={control}
            rules={transactionValidations.valor}
            render={({ field: { onChange, onBlur, value, name, ref } }) => (
              <Input
                fullWidth
                placeholder="0,00"
                disableUnderline
                value={value || ""}
                onBlur={onBlur}
                name={name}
                inputRef={ref}
                sx={{
                  border: "1px solid",
                  borderColor: errors.valor
                    ? "var(--byte-color-error, #ef4444)"
                    : "#e5e7eb",
                  borderRadius: 2,
                  pl: 1.5,
                  py: 1,
                  width: "100%",
                  boxSizing: "border-box",
                  "&:focus-within": {
                    borderColor: errors.valor
                      ? "var(--byte-color-error, #ef4444)"
                      : "var(--byte-color-success, #22c55e)",
                    boxShadow: `0 0 0 2px ${
                      errors.valor
                        ? "var(--byte-color-error-light, #fecaca)"
                        : "var(--byte-color-success-light, #6ee7b7)"
                    }`,
                  },
                }}
                startAdornment={
                  <InputAdornment position="start">R$</InputAdornment>
                }
                onChange={(e) => {
                  const valorDigitado = e.target.value
                    .replace("R$", "")
                    .trim();
                  const valorMascarado = maskCurrency(valorDigitado);
                  onChange(valorMascarado ? `R$ ${valorMascarado}` : "");
                }}
              />
            )}
          />
          {errors.valor && (
            <span className="text-red-500 text-sm mt-1">
              {errors.valor.message}
            </span>
          )}
        </FormControl>

        {/* ---------- BOTÃO ---------- */}
        <Box className="mt-6">
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
