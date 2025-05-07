"use client";

import {
  React,
  Box,
  VisibilityIcon,
  VisibilityOffIcon,
  CardBalanceStyles as styles,
  useState,
} from "../../components/ui";
import { formatBRL } from "../../utils/currency";
import { CardBalanceProps } from "types/dashboard.interface";

export default function CardBalance({ user, balance }: CardBalanceProps) {
  /* controla se o saldo está visível */
  const [showBalance, setShowBalance] = useState<boolean>(true);

  /* alterna o estado ao clicar no ícone */
  const handleToggleBalance = () => setShowBalance((prev) => !prev);

  /* data de hoje, capitalizando o dia da semana */
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
            {/* ícone muda conforme o estado */}
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

        {/* conta corrente sempre aparece */}
        <p className={styles.contaCorrenteTitle}>{balance.account}</p>

        {/* valor do saldo aparece ou não, dependendo do estado */}
        <p className={styles.valorSaldoText}>
          {showBalance ? formatBRL(balance.value) : "••••••"}
        </p>
      </Box>
    </Box>
  );
}