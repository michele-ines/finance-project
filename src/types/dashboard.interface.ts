
// --- Tipos Básicos ---
export interface Entity { id: number }
export interface ValueField { value: number }
export interface Labelled { label: string }

// --- Modelos de Dados do Dashboard ---
export interface User {
  name: string;
}

export interface Balance extends ValueField {
  account: string;
}

export interface Transaction extends Entity {
  month: string;
  type: string;
  date: string;
  amount: number;
}

export interface Investment extends Entity, Labelled, ValueField {}

export interface DashboardData {
  user: User;
  balance: Balance;
  transactions: Transaction[];
  investments: Investment[];
}

// --- Props de Componentes Genéricos ---
export interface ListProps<T extends Entity> {
  items: T[];
  onSave?: (items: T[]) => void;
}

export type TransactionListProps = ListProps<Transaction>;
export type CadInvestmentsProps = ListProps<Investment>;

export interface CardBalanceProps {
  user: User;
  balance: Balance;
}

// --- Tipos de Formulário ---
export interface EmailField {
  email: string;
}

export type ForgotPasswordData = EmailField;

export interface LoginData extends EmailField {
  password: string;
}

// --- Flags de Navegação / Layout ---
export interface HeaderFlags {
  isHome: boolean;
  isDashboard: boolean;
  isInvestments: boolean;
  showPublicLinks: boolean;
  showInternalLinks: boolean;
  showDashboardBtn: boolean;
}
