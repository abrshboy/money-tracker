
import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Transaction, CashAccount, CashTransaction, DailySnapshot, PaymentMethod, Category, CashSource, TransactionType } from '../types';
import { getDayKey } from '../utils/formatters';

export const useAppState = () => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
  const [cashTransactions, setCashTransactions] = useLocalStorage<CashTransaction[]>('cash_txs', []);
  const [cashAccount, setCashAccount] = useLocalStorage<CashAccount>('cash_account', { balance: 0, lastUpdated: Date.now() });
  const [snapshots, setSnapshots] = useLocalStorage<DailySnapshot[]>('snapshots', []);

  // Sync snapshot for current day if it doesn't exist
  useMemo(() => {
    const today = getDayKey();
    if (!snapshots.find(s => s.date === today)) {
      setSnapshots(prev => [...prev, { date: today, expectedBalance: cashAccount.balance }]);
    }
  }, [snapshots, cashAccount.balance, setSnapshots]);

  const addTransaction = useCallback((data: { amount: number, category: Category, note: string, paymentMethod: PaymentMethod, type: TransactionType }) => {
    const newTx: Transaction = {
      id: crypto.randomUUID(),
      ...data,
      timestamp: Date.now()
    };

    setTransactions(prev => [newTx, ...prev]);

    if (data.paymentMethod === 'Cash') {
      // If Income, balance goes up. If Expense, balance goes down.
      const multiplier = data.type === 'Income' ? 1 : -1;
      const updatedBalance = cashAccount.balance + (data.amount * multiplier);
      
      setCashAccount({
        balance: updatedBalance,
        lastUpdated: Date.now()
      });

      // Track as a cash transaction
      const cashTx: CashTransaction = {
        id: crypto.randomUUID(),
        amount: data.amount * multiplier,
        source: 'Other', 
        note: `${data.type}: ${data.category}`,
        timestamp: Date.now()
      };
      setCashTransactions(prev => [cashTx, ...prev]);
      
      // Update today's snapshot
      const today = getDayKey();
      setSnapshots(prev => prev.map(s => s.date === today ? { ...s, expectedBalance: updatedBalance } : s));
    }
  }, [cashAccount.balance, setTransactions, setCashAccount, setCashTransactions, setSnapshots]);

  const addCash = useCallback((amount: number, source: CashSource, note: string) => {
    const updatedBalance = cashAccount.balance + amount;
    setCashAccount({
      balance: updatedBalance,
      lastUpdated: Date.now()
    });

    const cashTx: CashTransaction = {
      id: crypto.randomUUID(),
      amount,
      source,
      note,
      timestamp: Date.now()
    };
    setCashTransactions(prev => [cashTx, ...prev]);

    const today = getDayKey();
    setSnapshots(prev => prev.map(s => s.date === today ? { ...s, expectedBalance: updatedBalance } : s));
  }, [cashAccount.balance, setCashAccount, setCashTransactions, setSnapshots]);

  const reconcileCash = useCallback((actualAmount: number) => {
    const diff = actualAmount - cashAccount.balance;
    const today = getDayKey();

    setSnapshots(prev => prev.map(s => s.date === today ? { 
      ...s, 
      actualBalance: actualAmount,
      difference: diff
    } : s));

    if (diff !== 0) {
      addCash(diff, 'Adjustment', 'Reconciliation adjustment');
    }
  }, [cashAccount.balance, addCash, setSnapshots]);

  return {
    transactions, // renamed from expenses
    cashTransactions,
    cashAccount,
    snapshots,
    addTransaction,
    addCash,
    reconcileCash
  };
};
