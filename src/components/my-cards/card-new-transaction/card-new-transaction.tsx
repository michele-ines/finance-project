
import { Box, Button, FormControl, Input, MenuItem, Select } from "../../ui";
import { cardNewTransactionStyles as styles } from "../../ui";
import { transactionValidations } from "utils/forms-validations/formValidations";
import { CardNewTransactionProps, NewTransactionData } from "interfaces/dashboard";
import { useForm } from "react-hook-form";
import clsx from "clsx";

export default function CardNewTransaction({ onSubmit, isLoading }: CardNewTransactionProps) {
const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewTransactionData>();

  const handleFormSubmit = (data: NewTransactionData) => {
  onSubmit(data);
};

  return (
    <Box
      className={`${styles.cardTransacao} cardTransacao w-full min-h-[478px]`}
    >
      <h3 className={styles.transacaoTitle}>Nova Transação</h3>

    <form onSubmit={handleSubmit(handleFormSubmit)}>
        <FormControl className={styles.transacaoFormControl}>
          <Select
            displayEmpty
            defaultValue=""
            className={clsx(`${styles.transacaoSelect}`, {
              "bg-gray-100 border border-gray-200 focus-within:ring-green-500":
                !errors.tipo,
              "bg-gray-100 border border-red-500 focus-within:ring-red-300":
                !!errors.tipo,
            })}
            {...register("tipo", transactionValidations.tipo)}
            // className={styles.transacaoSelect}
          >
            <MenuItem value="" disabled>
              Selecione o tipo de transação
            </MenuItem>
            <MenuItem value="cambio">Câmbio de Moeda</MenuItem>
            <MenuItem value="deposito">DOC/TED</MenuItem>
            <MenuItem value="transferencia">
              Empréstimo e Financiamento
            </MenuItem>
          </Select>
          {/* {errors.tipo && (
            <Typography color="error" variant="caption">
              {errors.tipo.message}
            </Typography>
          )} */}
          {errors.tipo && (
            <span className="text-red-500 text-sm">{errors.tipo.message}</span>
          )}
        </FormControl>

        <p className={styles.transacaoLabel}>Valor</p>
        <FormControl className={styles.transacaoFormControl}>
          <Input
            placeholder="00,00"
            className={clsx(`${styles.transacaoInput}`, {
              "bg-gray-100 border border-gray-200 focus-within:ring-green-500":
                !errors.valor,
              "bg-gray-100 border border-red-500 focus-within:ring-red-300":
                !!errors.valor,
            })}
            {...register("valor", transactionValidations.valor)}
          />
          {errors.valor && (
            <span className="text-red-500 text-sm">{errors.valor.message}</span>
          )}
        </FormControl>

        <Box className="mt-4">
          <Button
            type="submit"
            className={clsx(styles.transacaoButton, {
              "bg-gray-400 cursor-not-allowed": isLoading,
              "hover:bg-gray-400": isLoading, // Prevent hover effects when disabled
            })}
            disabled={isLoading}
            aria-disabled={isLoading} // Add ARIA attribute for accessibility
          >
            {isLoading ? "Concluindo Transação…" : "Concluir Transação"}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
