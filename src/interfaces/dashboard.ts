
export interface Entity { id: number }
export interface ValueField { value: number }
export interface Labelled { label: string }

export interface User { name: string }

export interface Balance extends ValueField {
  account: string
}

export interface Transaction {
  _id: number
  tipo: string
  valor: number
  createdAt: string
  updatedAt: string
}

export interface SavingsGoalProps {
  goal: number;
  transactions: Transaction[];
}

export interface SpendingAlertProps {
  limit: number;
  transactions: Transaction[];
}



export interface Investment extends Entity, Labelled, ValueField {}

export interface DashboardData {
  user: User
  balance: Balance
  transactions: Transaction[]
  investments: Investment[]
}

export interface ListProps<T extends Entity> {
  items: T[]
  onSave?: (items: T[]) => void
}
export interface TransactionListProps {
  transactions: Transaction[]
  onSave?: (transactions: Transaction[]) => void
}

export interface CadInvestmentsProps {
  balance: Balance;
  investments: Investment[];
}
export interface CardBalanceProps {
  user: User
  balance: Balance
}

export interface CardNewTransactionProps {
  onSubmit: (data: NewTransactionData) => Promise<void>;
  isLoading: boolean;
}

export interface EmailField {
  email: string
}

export type ForgotPasswordData = EmailField

export interface LoginData extends EmailField {
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
  terms: boolean
}

export interface UserInfo  {
  name: string;
  email: string;
  password: string;
};

export interface NewTransactionData {
  tipo: string;
  valor: string;
}
export interface HeaderFlags {
  isHome: boolean
  isDashboard: boolean
  isInvestments: boolean
  
  showPublicLinks: boolean
  showInternalLinks: boolean
  showDashboardBtn: boolean
}
