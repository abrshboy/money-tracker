
import React from 'react';
import { Category } from './types';

export const CATEGORIES: Category[] = ['Food', 'Transport', 'Bills', 'Fun', 'Salary', 'Side Hustle', 'Gift', 'Other'];

export const CATEGORY_COLORS: Record<Category, string> = {
  Food: 'bg-orange-100 text-orange-700 border-orange-200',
  Transport: 'bg-blue-100 text-blue-700 border-blue-200',
  Bills: 'bg-purple-100 text-purple-700 border-purple-200',
  Fun: 'bg-pink-100 text-pink-700 border-pink-200',
  Salary: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Side Hustle': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  Gift: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Other: 'bg-slate-100 text-slate-700 border-slate-200',
};

export const Icons = {
  Food: () => <span>🍕</span>,
  Transport: () => <span>🛹</span>,
  Bills: () => <span>💸</span>,
  Fun: () => <span>🎡</span>,
  Salary: () => <span>💰</span>,
  'Side Hustle': () => <span>🚀</span>,
  Gift: () => <span>🎁</span>,
  Other: () => <span>✨</span>,
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  Wallet: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  History: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
};
