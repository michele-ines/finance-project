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

export interface DashboardData {
  user: User;
  balance: Balance;
  transactions: Transaction[];
}
