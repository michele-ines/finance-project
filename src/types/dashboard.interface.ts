export interface User { name: string; }
export interface Balance { account: string; value: number; }
export interface Transaction {
  id: number;
  month: string;
  type: string;
  date: string;
  amount: number;
}
export interface Investment { id: number; label: string; value: number; }
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

export interface HeaderFlags {
  isHome: boolean;
  isDashboard: boolean;
  isInvestments: boolean;
  showPublicLinks: boolean;   // "/" | "/home" | "/login" | "/cadastro"
  showInternalLinks: boolean; // após login
  showDashboardBtn: boolean;  // botão Dashboard fora da área logada
}
