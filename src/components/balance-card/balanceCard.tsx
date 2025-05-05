import React from "react";
import { Box } from "../ui";
import VisibilityIcon from "@mui/icons-material/Visibility";
import styles from "../../app/(auth)/dashboard/dashboarPage.module.scss";
import { formatBRL } from "../../utils/currency";
import type { BalanceCardProps } from "../../types/dashboard";

export const BalanceCard: React.FC<BalanceCardProps> = ({ user, balance }) => {
  const getCurrentDate = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: "long" };
    const today = new Date();
    const weekday = today.toLocaleDateString("pt-BR", options);
    const formattedDate = today.toLocaleDateString("pt-BR");
    return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${formattedDate}`;
  };

  return (
    <Box className={`${styles.cardSaldo} card-saldo min-h-[402px] mx-auto`}>
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
};

export default BalanceCard;
