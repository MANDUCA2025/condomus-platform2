import React from 'react';

export const Card = ({ children, className = "", onClick }) => (
  <div onClick={onClick} className={`bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-6 rounded-2xl shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 ${onClick ? 'cursor-pointer hover:-translate-y-1 hover:border-emerald-500/30' : ''} ${className}`}>
    {children}
  </div>
);

export const ButtonPrimary = ({ children, onClick, className = "" }) => (
  <button onClick={onClick} className={`w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-900/20 transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 ${className}`}>
    {children}
  </button>
);

export const Badge = ({ children, type = 'default' }) => {
  const styles = { 
    default: "bg-slate-700/50 text-slate-300 border-slate-600", 
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", 
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20", 
    alert: "bg-red-500/10 text-red-400 border-red-500/20",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/20"
  };
  return <span className={`px-2.5 py-1 rounded-lg border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${styles[type]}`}>{children}</span>;
};