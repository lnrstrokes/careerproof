import React from 'react';
import { BookOpen, FileText, LayoutDashboard, ShieldCheck } from 'lucide-react';

export type AppTab = 'assessment' | 'noc-directory' | 'ref-letter';

interface HeaderProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const tabs: Array<{ id: AppTab; label: string; icon: React.ElementType }> = [
    { id: 'assessment', label: 'Application Alignment', icon: LayoutDashboard },
    { id: 'noc-directory', label: 'NOC Reference', icon: BookOpen },
    { id: 'ref-letter', label: 'Reference Letter Guide', icon: FileText },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <button
            onClick={() => onTabChange('assessment')}
            className="flex items-center space-x-3 text-left focus:outline-none"
          >
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
          </button>

          <nav className="hidden md:flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-slate-800 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile tab bar */}
        <div className="flex md:hidden items-center py-2 border-t border-slate-800/80 space-x-1 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition flex items-center space-x-1 shrink-0 ${
                  isActive
                    ? 'bg-slate-800 text-sky-300 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
