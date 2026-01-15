
import React, { useState } from 'react';
import { Transaction, Category } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { CATEGORY_COLORS, Icons } from '../constants';

interface HistoryProps {
  transactions: Transaction[];
}

const History: React.FC<HistoryProps> = ({ transactions }) => {
  const [filterMonth, setFilterMonth] = useState<number>(new Date().getMonth());

  const filtered = transactions.filter(e => {
    const d = new Date(e.timestamp);
    return d.getMonth() === filterMonth;
  });

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black italic tracking-tighter text-slate-950 uppercase">The Receipts</h2>
        <div className="flex gap-2">
          <select 
            value={filterMonth}
            onChange={(e) => setFilterMonth(parseInt(e.target.value))}
            className="text-xs font-black uppercase bg-white border border-slate-200 rounded-xl px-3 py-1.5 outline-none"
          >
            {months.map((m, i) => (
              <option key={m} value={i}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(tx => (
          <div 
            key={tx.id} 
            className="group bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${CATEGORY_COLORS[tx.category]}`}>
              {React.createElement(Icons[tx.category])}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <h4 className="font-black text-slate-900 truncate text-sm uppercase tracking-tight">{tx.category}</h4>
                <span className={`font-black italic text-sm ${tx.type === 'Income' ? 'text-emerald-500' : 'text-slate-900'}`}>
                  {tx.type === 'Income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <span className="truncate max-w-[150px]">{tx.note || 'No description provided'}</span>
                <div className="flex items-center gap-2">
                  <span className={`px-1.5 py-0.5 rounded-lg border ${tx.paymentMethod === 'Cash' ? 'border-amber-200 text-amber-600' : 'border-slate-100 text-slate-400'}`}>
                    {tx.paymentMethod}
                  </span>
                  <span>{formatDate(tx.timestamp)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-20 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-black italic uppercase tracking-widest text-xs">Zero clout found for this month.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
