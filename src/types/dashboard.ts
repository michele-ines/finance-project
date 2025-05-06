export interface User {
  name: string;
}
export interface Balance {
  account: string;
  value: number;
}
export interface Transaction {
  id: number;
  month: string;
  type: string;
  date: string;
  amount: number;
}
export interface Investment {
  id: number;
  label: string;
  value: number;
}
export interface DashboardData {
  user: User;
  balance: Balance;
  transactions: Transaction[];
  investments: Investment[];
}
export interface TransactionListProps {
  transactions: Transaction[];
  onSave?: (tx: Transaction[]) => void;
}
export interface CardBalanceProps {
  user: User;
  balance: Balance;
}
export interface CadInvestmentsProps {
  balance: Balance;
  investments: Investment[];
}
/* ---------- grupo de flags que o Header precisa ---------- */export interface HeaderFlags {
  /** rotas */
  isHome: boolean;
  isDashboard: boolean;
  isInvestments: boolean;
  /** mostra links públicos (Sobre, Serviços…) */
  showPublicLinks: boolean;
  /** mostra links internos (Início, Cartões…) */
  showInternalLinks: boolean;
  /** mostra botão “Dashboard” fora do app logado */
  showDashboardBtn: boolean;
}
