
import React from 'react';
import { Transaction, Category } from '../types';
import { formatCurrency } from '../utils/formatters';
import { CATEGORY_COLORS } from '../constants';

interface DashboardProps {
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyTxs = transactions.filter(e => {
    const d = new Date(e.timestamp);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalIncome = monthlyTxs
    .filter(t => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = monthlyTxs
    .filter(t => t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netFlow = totalIncome - totalExpense;

  const expenseBreakdown = monthlyTxs
    .filter(t => t.type === 'Expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<Category, number>);

  return (
    <div className="space-y-6">
      {/* Primary Figures */}
      <div className="bg-slate-950 p-6 rounded-[2rem] shadow-2xl border border-slate-800 text-white overflow-hidden relative">
        <div className="relative z-10">
          <span className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-1 block">Monthly Profit</span>
          <h2 className={`text-4xl font-black italic tracking-tight ${netFlow >= 0 ? 'text-emerald-400' : 'text-pink-500'}`}>
            {netFlow >= 0 ? '+' : ''}{formatCurrency(netFlow)}
          </h2>
          
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-800 pt-6">
            <div>
              <span className="text-slate-500 text-[10px] font-bold uppercase block mb-1">Total In</span>
              <span className="text-emerald-400 font-bold text-lg">{formatCurrency(totalIncome)}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] font-bold uppercase block mb-1">Total Out</span>
              <span className="text-pink-400 font-bold text-lg">{formatCurrency(totalExpense)}</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl select-none">💸</div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-4">Spending Breakdown</h3>
        <div className="space-y-3">
          {Object.entries(expenseBreakdown).sort((a, b) => (b[1] as number) - (a[1] as number)).map(([cat, amount]) => (
            <div key={cat} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${CATEGORY_COLORS[cat as Category].split(' ')[0]}`}></span>
                <span className="text-slate-600 font-medium text-sm">{cat}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-slate-900 font-black text-sm">{formatCurrency(amount as number)}</span>
                <div className="w-24 bg-slate-100 h-1 rounded-full overflow-hidden mt-1">
                  <div 
                    className={`h-full ${CATEGORY_COLORS[cat as Category].split(' ')[0]}`}
                    style={{ width: `${((amount as number) / (totalExpense || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
          {Object.keys(expenseBreakdown).length === 0 && (
            <div className="text-center py-4 text-slate-400 text-sm italic italic uppercase tracking-tighter font-bold opacity-50">No spend yet. Zero clout used.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
