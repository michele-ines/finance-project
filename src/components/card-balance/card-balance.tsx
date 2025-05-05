"use client";

import React from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import styles from "./card-balance.module.scss";
import { formatBRL } from "../../utils/currency";
import { Box } from "@mui/material";
import { CardBalanceProps } from "types/dashboard";


export default function CardBalance({ user, balance }: CardBalanceProps ) {
  const getCurrentDate = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: "long" };
    const today = new Date();
    const weekday = today.toLocaleDateString("pt-BR", options);
    const formattedDate = today.toLocaleDateString("pt-BR");
    return `${
      weekday.charAt(0).toUpperCase() + weekday.slice(1)
    }, ${formattedDate}`;
  };

  return (
    <Box className={`${styles.cardSaldo} card-saldo min-h-[402px]`}>
      <Box>
        <h1 className={styles.nameTitle}>Olá, {user.name.split(" ")[0]} :)</h1>
        <p className={styles.dateText}>{getCurrentDate()}</p>
      </Box>

      <Box className={styles.balanceSection}>
        <div className={styles.saldoHeader}>
          <p className={styles.saldoTitle}>
            Saldo&nbsp;
            <VisibilityIcon fontSize="small" className={styles.eyeIcon} />
          </p>
          <hr className={styles.hrOrange} />
        </div>
        <p className={styles.contaCorrenteTitle}>{balance.account}</p>
        <p className={styles.valorSaldoText}>{formatBRL(balance.value)}</p>
      </Box>
    </Box>
  );
}
