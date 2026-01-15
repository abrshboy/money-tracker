
export type Category = 'Food' | 'Transport' | 'Bills' | 'Fun' | 'Other' | 'Salary' | 'Side Hustle' | 'Gift';
export type PaymentMethod = 'Cash' | 'Non-cash';
export type CashSource = 'Salary' | 'Gift' | 'Withdrawal' | 'Other' | 'Adjustment';
export type TransactionType = 'Income' | 'Expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: Category;
  note: string;
  paymentMethod: PaymentMethod;
  timestamp: number;
}

// Keeping Expense alias for backward compatibility or ease of use
export type Expense = Transaction;

export interface CashTransaction {
  id: string;
  amount: number; // positive for addition, negative for deduction
  source: CashSource;
  note: string;
  timestamp: number;
}

export interface CashAccount {
  balance: number;
  lastUpdated: number;
}

export interface DailySnapshot {
  date: string; // YYYY-MM-DD
  expectedBalance: number;
  actualBalance?: number;
  difference?: number;
}
