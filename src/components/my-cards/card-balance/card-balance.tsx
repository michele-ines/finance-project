// src/components/my-cards/card-balance/card-balance.tsx
"use client";

import React, { useState, KeyboardEvent } from "react";
import {
  Box,
  CardBalanceStyles as styles,
  VisibilityIcon,
  VisibilityOffIcon,
} from "../../ui";
import { CardBalanceProps } from "interfaces/dashboard";
import { formatBRL } from "../../../utils/currency-formatte/currency-formatte";

export default function CardBalance({ user, balance }: CardBalanceProps) {
  const [showBalance, setShowBalance] = useState<boolean>(true);

  const handleToggleBalance = () => setShowBalance((prev) => !prev);

  const handleKeyToggle = (e: KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggleBalance();
    }
  };

  const getCurrentDate = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: "long" };
    const today = new Date();
    const weekday = today
      .toLocaleDateString("pt-BR", options)
      .replace(/^\w/, (c) => c.toUpperCase());
    const formattedDate = today.toLocaleDateString("pt-BR");
    return `${weekday}, ${formattedDate}`;
  };

  return (
    <Box className={`${styles.cardSaldo} min-h-[402px]`}>
      {/* Saudação e data */}
      <Box>
        <h1 className={styles.nameTitle}>
          Olá, {user.name.split(" ")[0]} :)
        </h1>
        <p className={styles.dateText}>{getCurrentDate()}</p>
      </Box>

      {/* Seção de saldo */}
      <Box className={styles.balanceSection}>
        <div className={styles.saldoHeader}>
          <p className={styles.saldoTitle}>
            Saldo&nbsp;
            <span
              tabIndex={0}
              role="button"
              aria-pressed={showBalance}
              aria-label={showBalance ? "Ocultar saldo" : "Mostrar saldo"}
              onClick={handleToggleBalance}
              onKeyDown={handleKeyToggle}
              className={styles.eyeIcon}
            >
              {showBalance ? (
                <VisibilityIcon fontSize="small" />
              ) : (
                <VisibilityOffIcon fontSize="small" />
              )}
            </span>
          </p>
          <hr className={styles.hrOrange} />
        </div>

        <p className={styles.contaCorrenteTitle}>{balance.account}</p>
        <p className={styles.valorSaldoText}>
          {showBalance
            ? typeof balance.value === "number"
              ? formatBRL(balance.value)
              : "Carregando..."
            : "••••••"}
        </p>
      </Box>
    </Box>
  );
}
