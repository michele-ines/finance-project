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
export interface TransactionListProps {
  transactions: Transaction[];
  onSave?: (tx: Transaction[]) => void;
}

export interface DashboardData {
  user: User;
  balance: Balance;
  transactions: Transaction[];
}


export interface BalanceCardProps {
  user: User;
  balance: Balance;
}