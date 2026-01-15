
import React, { useState } from 'react';
import { useAppState } from './hooks/useAppState';
import Dashboard from './components/Dashboard';
import AddExpenseModal from './components/AddExpenseModal';
import CashPanel from './components/CashPanel';
import History from './components/History';
import { Icons } from './constants';

type Tab = 'dashboard' | 'history' | 'cash';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { 
    transactions, 
    cashAccount, 
    loading,
    error,
    addTransaction, 
    addCash, 
    reconcileCash 
  } = useAppState();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="text-4xl mb-4 animate-bounce">💸</div>
        <h1 className="text-xl font-black italic tracking-tighter uppercase">Initializing Clout...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-8 flex flex-col items-center">
      <header className="w-full max-w-2xl px-6 pt-10 pb-6 flex items-center justify-between">
        <h1 className="text-3xl font-black italic tracking-tighter text-slate-950">
          CLOUT<span className="text-pink-500">KEEPER</span>
        </h1>
        <div className="bg-slate-950 px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-800">
          <div className={`w-1.5 h-1.5 rounded-full ${error ? 'bg-red-500' : 'bg-blue-400 animate-pulse'}`}></div>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">
            {error ? 'Sync Error' : 'Cloud Sync'}
          </span>
        </div>
      </header>

      {error && (
        <div className="w-full max-w-2xl px-6 mb-4">
          <div className="bg-red-50 border border-red-200 p-4 rounded-2xl text-red-700 text-xs font-bold uppercase tracking-tight">
            ⚠️ Firebase Error: {error} 
            <br/> 
            <span className="font-normal normal-case opacity-70">Please check your Firestore Security Rules and ensure the database is created.</span>
          </div>
        </div>
      )}

      <main className="w-full max-w-2xl px-6 flex-1 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {activeTab === 'dashboard' && <Dashboard transactions={transactions} />}
        {activeTab === 'history' && <History transactions={transactions} />}
        {activeTab === 'cash' && (
          <CashPanel 
            cashAccount={cashAccount} 
            onAddCash={addCash} 
            onReconcile={reconcileCash} 
          />
        )}
      </main>

      {/* Persistent Floating Action Button */}
      <div className="fixed bottom-28 right-6 md:bottom-12 md:right-12 z-40">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-16 h-16 bg-slate-950 hover:bg-slate-900 text-white rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-center transition-all hover:scale-110 active:scale-95 border-4 border-white"
          aria-label="Add Transaction"
        >
          <Icons.Plus />
        </button>
      </div>

      {/* Navigation Bar */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/90 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] z-30 px-8 py-4 flex items-center justify-between">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'dashboard' ? 'text-slate-950 scale-110' : 'text-slate-300 hover:text-slate-500'}`}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Home</span>
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'history' ? 'text-slate-950 scale-110' : 'text-slate-300 hover:text-slate-500'}`}
        >
          <Icons.History />
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Flow</span>
        </button>
        <button 
          onClick={() => setActiveTab('cash')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'cash' ? 'text-slate-950 scale-110' : 'text-slate-300 hover:text-slate-500'}`}
        >
          <Icons.Wallet />
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Cash</span>
        </button>
      </nav>

      {/* Modal */}
      {isModalOpen && (
        <AddExpenseModal 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={addTransaction} 
        />
      )}
    </div>
  );
};

export default App;
