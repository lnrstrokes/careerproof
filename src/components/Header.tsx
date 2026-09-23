import React from 'react';
import { ShieldCheck, Compass, Sparkles, BookOpen, FileText, LayoutDashboard, FileCheck } from 'lucide-react';

export type AppTab = 'assessment' | 'noc-directory' | 'ref-letter' | 'ats-cv';

interface HeaderProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  onOpenPremiumModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenPremiumModal,
}) => {
  const tabs = [
    { id: 'assessment' as AppTab, label: 'Job Assessment', icon: LayoutDashboard },
    { id: 'noc-directory' as AppTab, label: 'NOC 2021 Matrix', icon: BookOpen, color: 'text-sky-400' },
    { id: 'ref-letter' as AppTab, label: 'IRCC Ref Letter', icon: FileText, color: 'text-amber-400' },
    { id: 'ats-cv' as AppTab, label: 'Canadian ATS CV', icon: FileCheck, color: 'text-emerald-400' },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Brand & Logo */}
          <button
            onClick={() => onTabChange('assessment')}
            className="flex items-center space-x-3 text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-lg bg-red-700/20 border border-red-500/40 flex items-center justify-center text-red-500 font-bold text-lg shadow-inner shrink-0">
              🍁
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
                  CanTech <span className="text-red-400 font-medium">NavEngine</span>
                </h1>
                <span className="hidden lg:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
                  <ShieldCheck className="w-3 h-3 mr-1" /> Truthful NOC Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Job Search Optimization &amp; Immigration Pathway Protection
              </p>
            </div>
          </button>

          {/* Desktop Tab Navigation */}
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
                  <Icon className={`w-3.5 h-3.5 ${tab.color || 'text-slate-300'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Premium CTA */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenPremiumModal}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-md transition flex items-center space-x-1.5 border border-red-500/30 shrink-0"
            >
              <Compass className="w-3.5 h-3.5 text-amber-200" />
              <span className="hidden sm:inline">Immigration Insurance</span>
              <span className="sm:hidden">Premium</span>
            </button>
          </div>
        </div>

        {/* Mobile Tab Bar */}
        <div className="flex md:hidden items-center justify-between border-t border-slate-800/80 py-2 overflow-x-auto space-x-1 no-scrollbar">
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
                <Icon className={`w-3 h-3 ${tab.color || ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
