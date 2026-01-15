
import React, { useState } from 'react';
import { CashAccount, CashSource } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface CashPanelProps {
  cashAccount: CashAccount;
  onAddCash: (amount: number, source: CashSource, note: string) => void;
  onReconcile: (actual: number) => void;
}

const CashPanel: React.FC<CashPanelProps> = ({ cashAccount, onAddCash, onReconcile }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isReconciling, setIsReconciling] = useState(false);
  
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState<CashSource>('Withdrawal');
  const [note, setNote] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCash(parseFloat(amount), source, note);
    setIsAdding(false);
    setAmount('');
    setNote('');
  };

  const handleReconcileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onReconcile(parseFloat(amount));
    setIsReconciling(false);
    setAmount('');
  };

  return (
    <div className="space-y-6">
      {/* Cash Status Card */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-slate-400 text-sm font-medium uppercase tracking-widest">Cash on Hand</span>
          <h2 className="text-5xl font-bold mt-2 mb-4">{formatCurrency(cashAccount.balance)}</h2>
          <div className="flex items-center text-slate-400 text-xs">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Last activity: {formatDate(cashAccount.lastUpdated)}
          </div>
        </div>
        {/* Abstract decor */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full -ml-8 -mb-8 blur-xl"></div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => { setIsAdding(true); setIsReconciling(false); }}
          className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col items-center gap-2 hover:bg-slate-50 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-slate-700">Add Cash</span>
        </button>
        <button 
          onClick={() => { setIsReconciling(true); setIsAdding(false); }}
          className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col items-center gap-2 hover:bg-slate-50 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-slate-700">Reconcile</span>
        </button>
      </div>

      {/* Forms Section */}
      {(isAdding || isReconciling) && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm animate-in fade-in duration-300">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            {isAdding ? 'Deposit Cash' : 'Count Your Cash'}
          </h3>
          <form onSubmit={isAdding ? handleAddSubmit : handleReconcileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Amount</label>
              <input
                type="number"
                step="0.01"
                required
                autoFocus
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {isAdding && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Source</label>
                  <select 
                    value={source} 
                    onChange={(e) => setSource(e.target.value as CashSource)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="Salary">Salary</option>
                    <option value="Withdrawal">Withdrawal from Bank</option>
                    <option value="Gift">Gift / Bonus</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Note</label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Short description"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </>
            )}
            {isReconciling && (
              <p className="text-sm text-slate-500 italic">
                Enter the exact amount of physical cash you have. The app will adjust the balance automatically if there's a difference.
              </p>
            )}
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors">
                {isAdding ? 'Confirm Deposit' : 'Update Balance'}
              </button>
              <button 
                type="button" 
                onClick={() => { setIsAdding(false); setIsReconciling(false); setAmount(''); }}
                className="px-4 py-3 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Snapshot Awareness */}
      <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl">
        <h4 className="text-blue-900 font-semibold mb-2 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Why track cash?
        </h4>
        <p className="text-blue-700 text-sm leading-relaxed">
          Tracking physical cash helps anchor your spending in reality. When you count your bills, expenses feel real, not just digital numbers.
        </p>
      </div>
    </div>
  );
};

export default CashPanel;
