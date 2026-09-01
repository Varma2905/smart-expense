import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-8xl font-black text-brand-500 tracking-widest">404</h1>
      <h2 className="text-2xl font-bold text-white mt-4">Page Not Found</h2>
      <p className="text-slate-400 text-sm max-w-sm mt-2">
        The requested page does not exist or has been moved.
      </p>

      <NavLink
        to="/dashboard"
        className="mt-6 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-xl shadow-brand-600/30 transition-all flex items-center gap-2"
      >
        <Home className="w-4 h-4" />
        Return to Dashboard
      </NavLink>
    </div>
  );
};
