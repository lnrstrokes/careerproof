import React from 'react';
import { ShieldCheck } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-sky-700/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
                Career<span className="text-sky-400 font-medium">Proof</span>
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                Canada Application Alignment - evidence you can check
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export { Header };
