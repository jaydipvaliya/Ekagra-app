import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const Logo = () => (
  <svg width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="17" stroke="currentColor" strokeWidth="1" strokeDasharray="3 5" className="text-ink-light dark:text-chalk-dim" />
    <circle cx="20" cy="20" r="11" stroke="currentColor" strokeWidth="1.5" className="text-ink dark:text-chalk" />
    <circle cx="20" cy="20" r="3.5" fill="currentColor" className="text-accent" />
  </svg>
);

const MENU_ITEMS = [
  { name: 'Day Planner', icon: 'fa-calendar-day' },
  { name: 'Habit Tracker', icon: 'fa-repeat' },
  { name: 'Matrix View', icon: 'fa-table-cells-large' },
  { name: 'Motivation', icon: 'fa-lightbulb' },
  { name: 'Ambience', icon: 'fa-music' },
];

const BOTTOM_ITEMS = [
  { name: 'Calendar View', icon: 'fa-calendar-alt' },
  { name: 'Goal Countdown', icon: 'fa-hourglass-half' },
];

export function Sidebar({ activeTab, setActiveTab, onOpenSettings }) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavButton = ({ item }) => {
    const active = activeTab === item.name;
    return (
      <button
        onClick={() => { setActiveTab(item.name); setMobileOpen(false); }}
        className={`w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-150 font-body text-[13px] rounded-sketch-md relative ${
          active
            ? 'text-accent font-bold bg-accent/[0.05]'
            : 'text-ink-light dark:text-chalk-dim hover:text-ink dark:hover:text-chalk hover:bg-ink/[0.02] dark:hover:bg-chalk/[0.02]'
        }`}
      >
        <i className={`fas ${item.icon} w-4 text-center text-[11px] ${active ? 'text-accent' : 'opacity-40'}`}></i>
        <span>{item.name}</span>
        {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-accent rounded-r-sm"></span>}
      </button>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-56 bg-paper-mid dark:bg-paper-deep flex-col h-full z-40 border-r border-ink-faint/60 dark:border-ink-light/15 margin-line">
        <div className="p-5 pb-3 flex items-center gap-3">
          <Logo />
          <div>
            <h1 className="text-xl font-heading font-bold text-ink dark:text-chalk tracking-tight leading-none">Ekagra</h1>
            <p className="text-[8px] font-body text-ink-light dark:text-chalk-dim uppercase tracking-[0.2em] mt-0.5">focus mode</p>
          </div>
        </div>

        <div className="sketch-divider mx-5 mb-3"></div>

        <nav className="flex-1 px-3 space-y-0.5">
          {[...MENU_ITEMS, ...BOTTOM_ITEMS].map((item) => (
            <NavButton key={item.name} item={item} />
          ))}
        </nav>

        <div className="p-3 border-t border-ink-faint/40 dark:border-ink-light/10 space-y-1.5">
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 px-4 py-2 text-ink-light dark:text-chalk-dim hover:text-ink dark:hover:text-chalk transition-all font-body text-[13px] rounded-sketch-md"
          >
            <i className="fas fa-sliders w-4 text-center text-[11px] opacity-40"></i>
            <span>Settings</span>
          </button>

          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-sketch-md border border-ink-faint/40 dark:border-ink-light/10 bg-ink/[0.02] dark:bg-chalk/[0.02]">
            <div className="w-7 h-7 rounded-full border border-ink-light/30 dark:border-chalk-dim/30 flex items-center justify-center font-heading font-bold text-xs text-ink dark:text-chalk shrink-0">
              {(user?.name || '?').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-body font-bold text-ink dark:text-chalk truncate">{user?.name}</p>
              <p className="text-[9px] text-ink-light dark:text-chalk-dim truncate font-body">{user?.email}</p>
            </div>
            <button onClick={logout} title="Log out" className="text-ink-light dark:text-chalk-dim hover:text-accent transition-colors shrink-0">
              <i className="fas fa-right-from-bracket text-[10px]"></i>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between p-3.5 bg-paper-mid dark:bg-paper-deep border-b border-ink-faint/60 dark:border-ink-light/15 z-40">
        <div className="flex items-center gap-2.5">
          <Logo />
          <h1 className="text-lg font-heading font-bold text-ink dark:text-chalk tracking-tight">Ekagra</h1>
        </div>
        <button onClick={() => setMobileOpen((v) => !v)} className="text-ink dark:text-chalk p-2">
          <i className={`fas ${mobileOpen ? 'fa-times' : 'fa-bars'} text-base`}></i>
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-ink/20 dark:bg-ink/40" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute top-0 left-0 h-full w-60 bg-paper-mid dark:bg-paper-deep p-5 space-y-0.5 border-r border-ink-faint/60 dark:border-ink-light/15 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 mb-4">
              <Logo />
              <h1 className="text-lg font-heading font-bold text-ink dark:text-chalk">Ekagra</h1>
            </div>
            <div className="sketch-divider mb-3"></div>
            {[...MENU_ITEMS, ...BOTTOM_ITEMS].map((item) => (
              <NavButton key={item.name} item={item} />
            ))}
            <div className="sketch-divider my-2"></div>
            <button
              onClick={() => { onOpenSettings(); setMobileOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2 text-ink-light dark:text-chalk-dim hover:text-ink dark:hover:text-chalk transition-all font-body text-[13px]"
            >
              <i className="fas fa-sliders w-4 text-center text-[11px] opacity-40"></i>
              Settings
            </button>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-2 text-accent transition-all font-body text-[13px]"
            >
              <i className="fas fa-right-from-bracket w-4 text-center text-[11px]"></i>
              Log out
            </button>
          </div>
        </div>
      )}
    </>
  );
}
