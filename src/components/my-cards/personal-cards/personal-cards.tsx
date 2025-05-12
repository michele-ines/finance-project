"use client";
import {
  Box,
  React,
  cardNewTransactionStyles as styles,
} from "../../ui";

export default function PersonalCards() {
  return (
    <Box className={`${styles.cardTransacao} cardTransacao w-full min-h-[478px]`}>
      <h3 className={styles.transacaoTitle}>Meus Cartões</h3>
    </Box>
  );
}
