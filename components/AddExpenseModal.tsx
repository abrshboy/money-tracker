
import React, { useState } from 'react';
import { Category, PaymentMethod, TransactionType } from '../types';
import { CATEGORIES, Icons } from '../constants';

interface AddExpenseModalProps {
  onClose: () => void;
  onSubmit: (data: { amount: number, category: Category, note: string, paymentMethod: PaymentMethod, type: TransactionType }) => void;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ onClose, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('Expense');
  const [category, setCategory] = useState<Category>('Food');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;
    onSubmit({
      amount: parseFloat(amount),
      category,
      note,
      paymentMethod,
      type
    });
    onClose();
  };

  // Filter categories based on type for better UX
  const incomeCats: Category[] = ['Salary', 'Side Hustle', 'Gift', 'Other'];
  const expenseCats: Category[] = ['Food', 'Transport', 'Bills', 'Fun', 'Other'];
  const visibleCategories = type === 'Income' ? incomeCats : expenseCats;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-black italic text-slate-900 tracking-tighter">SECURE THE BAG</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Type Toggle */}
          <div className="flex p-1 bg-slate-100 rounded-2xl">
            {(['Income', 'Expense'] as TransactionType[]).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setType(t);
                  setCategory(t === 'Income' ? 'Salary' : 'Food');
                }}
                className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                  type === t 
                    ? (t === 'Income' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-pink-500 text-white shadow-lg')
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Amount Input */}
          <div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-black text-slate-300">Br</span>
              <input
                type="number"
                step="0.01"
                autoFocus
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-12 pr-4 py-6 bg-slate-50 border-none focus:ring-4 focus:ring-blue-100 rounded-[2rem] text-4xl font-black italic text-slate-900 outline-none transition-all placeholder:text-slate-200"
                required
              />
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Vibe / Category</label>
            <div className="grid grid-cols-4 gap-2">
              {visibleCategories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all ${
                    category === cat 
                      ? 'border-slate-900 bg-slate-900 text-white' 
                      : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-100'
                  }`}
                >
                  <span className="text-xl">{React.createElement(Icons[cat])}</span>
                  <span className="text-[9px] font-black uppercase truncate w-full text-center">{cat}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method & Note */}
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Source</label>
                <select 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-sm text-slate-700 outline-none"
                >
                  <option value="Cash">Cash (Physical)</option>
                  <option value="Non-cash">Digital (Bank)</option>
                </select>
             </div>
             <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Note</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Low-key context..."
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none placeholder:font-medium placeholder:text-slate-300"
                />
             </div>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-950 hover:bg-slate-900 text-white py-5 rounded-[2rem] font-black text-lg italic shadow-2xl shadow-slate-200 active:scale-[0.98] transition-all uppercase tracking-tighter"
          >
            Log {type}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
