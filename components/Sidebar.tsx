
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSettings: () => void;
}

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-pulse">
    <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 4" className="text-indigo dark:text-indigo-400" />
    <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="2" className="text-indigo dark:text-indigo-400" />
    <circle cx="20" cy="20" r="4" fill="#f59e0b" />
  </svg>
);

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onOpenSettings }) => {
  const menuItems = [
    { name: 'Day Planner', icon: 'fa-calendar-day' },
    { name: 'Habit Tracker', icon: 'fa-repeat' },
    { name: 'Matrix View', icon: 'fa-table-cells-large' },
    { name: 'Motivation', icon: 'fa-lightbulb' },
    { name: 'Ambience', icon: 'fa-music' },
  ];

  const bottomItems = [
    { name: 'Calendar View', icon: 'fa-calendar-alt' },
    { name: 'Goal Countdown', icon: 'fa-hourglass-half' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col h-full transition-all duration-300 z-40">
        <div className="p-8 flex items-center gap-4">
          <Logo />
          <div>
            <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tighter uppercase">Ekagra</h1>
            <p className="text-[8px] font-black text-indigo-500 uppercase tracking-[0.3em] leading-none mt-1">Focus Mode</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-4">
          {[...menuItems, ...bottomItems].map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative ${
                activeTab === item.name 
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 shadow-sm' 
                  : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <i className={`fas ${item.icon} text-lg md:text-base w-6 text-center group-hover:scale-110 transition-transform`}></i>
              <span className="font-bold text-sm">{item.name}</span>
              {activeTab === item.name && (
                <div className="absolute left-0 w-1 h-6 bg-indigo-600 dark:bg-indigo-400 rounded-r-full"></div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button 
            onClick={onOpenSettings}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-all group active:scale-95"
          >
            <i className="fas fa-cog text-lg w-6 text-center group-hover:rotate-45 transition-transform duration-300"></i>
            <span className="font-bold text-sm">Settings</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 h-20 glass-nav rounded-[2.5rem] border border-white/20 dark:border-slate-800 shadow-2xl flex items-center justify-around px-6 z-50">
        {[...menuItems.slice(0, 3), { name: 'Ambience', icon: 'fa-music' }].map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={`flex flex-col items-center justify-center p-3 rounded-full transition-all active:scale-90 ${
              activeTab === item.name ? 'text-indigo-600 dark:text-indigo-400 scale-110' : 'text-slate-400 dark:text-slate-600'
            }`}
          >
            <i className={`fas ${item.icon} text-xl`}></i>
          </button>
        ))}
        <button 
          onClick={onOpenSettings}
          className="w-12 h-12 bg-indigo-600 text-white rounded-2xl shadow-lg flex items-center justify-center active:scale-90 transition-all"
        >
          <i className="fas fa-sliders"></i>
        </button>
      </nav>
    </>
  );
};
