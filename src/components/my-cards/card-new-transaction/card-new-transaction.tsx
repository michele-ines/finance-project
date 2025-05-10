"use client";

import clsx from "clsx";
import {
  React,
  Box,
  FormControl,
  Select,
  MenuItem,
  Input,
  Button,
  cardNewTransactionStyles as styles,
} from "../../ui";
import { useForm } from "react-hook-form";
import { transactionValidations } from "utils/forms-validations/formValidations";

interface CardNewTransactionProps {
  onSubmit: (data: any) => void; // Ajuste o tipo conforme necessário
  isLoading: boolean;
}

export default function CardNewTransaction({ onSubmit,isLoading }: CardNewTransactionProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ tipo: string; valor: string }>();

  const handleFormSubmit = (data: any) => {
    onSubmit(data); // Envia apenas os dados do formulário
  };

  const onchange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value.replace(/\D/g, ""); // Remove non-numeric characters
      const formattedValue = (Number(value) / 100).toFixed(2).replace(".", ",");
      event.target.value = formattedValue;
    };

  return (
    <Box className={`${styles.cardTransacao} cardTransacao w-full min-h-[478px]`}>
      <h3 className={styles.transacaoTitle}>Nova Transação</h3>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        {/* Tipo de Transação */}
        <FormControl className={styles.transacaoFormControl}>
          <Select
            {...register("tipo",transactionValidations.tipo)}
            id="tipo"
            name="tipo"
            displayEmpty
            defaultValue=""
            className={clsx(`${styles.transacaoSelect}`, {
              "bg-gray-100 border border-gray-200 focus-within:ring-green-500":
                !errors.tipo,
              "bg-gray-100 border border-red-500 focus-within:ring-red-300":
                !!errors.tipo,
            })}
          >
            <MenuItem value="" disabled>
              Selecione o tipo de transação
            </MenuItem>
            <MenuItem value="cambio">Câmbio de Moeda</MenuItem>
            <MenuItem value="deposito">DOC/TED</MenuItem>
            <MenuItem value="transferencia">Empréstimo e Financiamento</MenuItem>
          </Select>
          {errors.tipo && (
            <span className="text-red-500 text-sm">{errors.tipo.message}</span>
          )}
        </FormControl>

        {/* Valor */}
        <p className={styles.transacaoLabel}>Valor</p>
        <FormControl className={`${styles.transacaoFormControl}`}>
          <Input
            {...register("valor", transactionValidations.valor)}
            name="valor"
            id="valor"
            placeholder="00,00"
            className={clsx(`${styles.transacaoInput}`, {
                      "bg-gray-100 border border-gray-200 focus-within:ring-green-500":
                        !errors.valor,
                      "bg-gray-100 border border-red-500 focus-within:ring-red-300":
                        !!errors.valor,
                    })}
            onChange={(event) => onchange(event)}
          />
          {errors.valor && (
            <span className="text-red-500 text-sm">{errors.valor.message}</span>
          )}
        </FormControl>

        {/* Botão de Submissão */}
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