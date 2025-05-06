"use client";

import {
  React,
  Box,
  cardNewTransactionStyles as styles,
} from "../ui";


export default function MyCards() {
  return (
    <Box className={`${styles.cardTransacao} cardTransacao w-full min-h-[478px]`}>
      <h3 className={styles.transacaoTitle}>Meus Cartões</h3>

    </Box>
  );
}
