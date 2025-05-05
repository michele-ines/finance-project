"use client";

import React from "react";
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Input,
  Button,
} from "../../components/ui";
import styles from "./card-new-transaction.module.scss";

interface CardNewTransactionProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function CardNewTransaction({ onSubmit }: CardNewTransactionProps) {
  return (
    <Box className={`${styles.cardTransacao} cardTransacao w-full min-h-[478px]`}>
      <h3 className={styles.transacaoTitle}>Nova Transação</h3>

      <form onSubmit={onSubmit}>
        <FormControl className={styles.transacaoFormControl}>
          <Select
            name="tipo"
            displayEmpty
            defaultValue=""
            className={styles.transacaoSelect}
          >
            <MenuItem value="" disabled>
              Selecione o tipo de transação
            </MenuItem>
            <MenuItem value="cambio">Câmbio de Moeda</MenuItem>
            <MenuItem value="deposito">DOC/TED</MenuItem>
            <MenuItem value="transferencia">Empréstimo e Financiamento</MenuItem>
          </Select>
        </FormControl>

        <p className={styles.transacaoLabel}>Valor</p>
        <FormControl className={styles.transacaoFormControl}>
          <Input
            name="valor"
            placeholder="00,00"
            className={`${styles.transacaoInput} mb-8`}
          />
        </FormControl>

        <Box className="mt-4">
          <Button type="submit" className={styles.transacaoButton}>
            Concluir Transação
          </Button>
        </Box>
      </form>
    </Box>
  );
}
