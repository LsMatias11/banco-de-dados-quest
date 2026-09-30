import React from 'react';
import { HelpCircle, Map, Grid, Skull } from 'lucide-react';

export default function MobileNav({ activeTab, setActiveTab, errorCount }) {
  const tabs = [
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
    { id: 'map', label: 'Mapa', icon: Map },
    { id: 'bingo', label: 'Bingo', icon: Grid },
    { id: 'sabotage', label: 'Sabotagem', icon: Skull, badge: errorCount > 0 ? `${errorCount}/3` : null }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 px-2 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-medium mt-0.5">{tab.label}</span>
              {tab.badge && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white font-mono text-[9px] px-1 py-0.2 rounded-full font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
