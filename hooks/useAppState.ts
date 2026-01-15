
import { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  doc, 
  setDoc, 
  query, 
  orderBy, 
  limit 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { Transaction, CashAccount, CashTransaction, DailySnapshot, PaymentMethod, Category, CashSource, TransactionType } from '../types';
import { getDayKey } from '../utils/formatters';

export const useAppState = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cashAccount, setCashAccount] = useState<CashAccount>({ balance: 0, lastUpdated: Date.now() });
  const [snapshots, setSnapshots] = useState<DailySnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync Transactions
  useEffect(() => {
    const q = query(collection(db, "transactions"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const txs: Transaction[] = [];
        snapshot.forEach((doc) => txs.push({ id: doc.id, ...doc.data() } as Transaction));
        setTransactions(txs);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Transactions sync error:", err);
        setError("Permission denied or DB not found. Check Firebase Console.");
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  // Sync Cash Account (Singleton doc)
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "settings", "cash_account"), 
      (snapshot) => {
        if (snapshot.exists()) {
          setCashAccount(snapshot.data() as CashAccount);
        }
      },
      (err) => console.error("Cash account sync error:", err)
    );
    return unsubscribe;
  }, []);

  // Sync Snapshots
  useEffect(() => {
    const q = query(collection(db, "snapshots"), orderBy("date", "desc"), limit(30));
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const snaps: DailySnapshot[] = [];
        snapshot.forEach((doc) => snaps.push(doc.data() as DailySnapshot));
        setSnapshots(snaps);
      },
      (err) => console.error("Snapshots sync error:", err)
    );
    return unsubscribe;
  }, []);

  const addTransaction = useCallback(async (data: { amount: number, category: Category, note: string, paymentMethod: PaymentMethod, type: TransactionType }) => {
    const timestamp = Date.now();
    try {
      await addDoc(collection(db, "transactions"), {
        ...data,
        timestamp
      });

      if (data.paymentMethod === 'Cash') {
        const multiplier = data.type === 'Income' ? 1 : -1;
        const updatedBalance = cashAccount.balance + (data.amount * multiplier);
        
        await setDoc(doc(db, "settings", "cash_account"), {
          balance: updatedBalance,
          lastUpdated: timestamp
        });

        const today = getDayKey();
        await setDoc(doc(db, "snapshots", today), {
          date: today,
          expectedBalance: updatedBalance
        }, { merge: true });
      }
    } catch (err) {
      console.error("Error adding transaction:", err);
      alert("Action failed. Ensure Firestore is enabled in Firebase Console.");
    }
  }, [cashAccount.balance]);

  const addCash = useCallback(async (amount: number, source: CashSource, note: string) => {
    const timestamp = Date.now();
    const updatedBalance = cashAccount.balance + amount;
    try {
      await setDoc(doc(db, "settings", "cash_account"), {
        balance: updatedBalance,
        lastUpdated: timestamp
      });

      const today = getDayKey();
      await setDoc(doc(db, "snapshots", today), {
        date: today,
        expectedBalance: updatedBalance
      }, { merge: true });
    } catch (err) {
      console.error("Error adding cash:", err);
    }
  }, [cashAccount.balance]);

  const reconcileCash = useCallback(async (actualAmount: number) => {
    const diff = actualAmount - cashAccount.balance;
    const today = getDayKey();
    const timestamp = Date.now();
    try {
      await setDoc(doc(db, "snapshots", today), {
        date: today,
        actualBalance: actualAmount,
        difference: diff
      }, { merge: true });

      if (diff !== 0) {
        await setDoc(doc(db, "settings", "cash_account"), {
          balance: actualAmount,
          lastUpdated: timestamp
        });
      }
    } catch (err) {
      console.error("Error reconciling cash:", err);
    }
  }, [cashAccount.balance]);

  return {
    transactions,
    cashAccount,
    snapshots,
    loading,
    error,
    addTransaction,
    addCash,
    reconcileCash
  };
};
