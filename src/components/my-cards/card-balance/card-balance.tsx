"use client";

import {
  Box,
  CardBalanceStyles as styles,
  React,
  useState,
  VisibilityIcon,
  VisibilityOffIcon,
} from "../../ui";

import { CardBalanceProps } from "interfaces/dashboard";
import { formatBRL } from "../../../utils/currency-formatte/currency-formatte";


export default function CardBalance({ user, balance }: CardBalanceProps) {
  const [showBalance, setShowBalance] = useState<boolean>(true);

  const handleToggleBalance = () => setShowBalance((prev) => !prev);

  const getCurrentDate = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: "long" };
    const today = new Date();
    const weekday = today.toLocaleDateString("pt-BR", options);
    const formattedDate = today.toLocaleDateString("pt-BR");
    return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)}, ${formattedDate}`;
  };

  return (
    <Box className={`${styles.cardSaldo} min-h-[402px]`}>
      <Box>
        <h1 className={styles.nameTitle}>
          Olá, {user.name.split(" ")[0]} :)
        </h1>
        <p className={styles.dateText}>{getCurrentDate()}</p>
      </Box>

      <Box className={styles.balanceSection}>
        <div className={styles.saldoHeader}>
          <p className={styles.saldoTitle}>
            Saldo&nbsp;
            {showBalance ? (
              <VisibilityIcon
                fontSize="small"
                className={styles.eyeIcon}
                onClick={handleToggleBalance}
                role="button"
                aria-label="Ocultar saldo"
              />
            ) : (
              <VisibilityOffIcon
                fontSize="small"
                className={styles.eyeIcon}
                onClick={handleToggleBalance}
                role="button"
                aria-label="Mostrar saldo"
              />
            )}
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