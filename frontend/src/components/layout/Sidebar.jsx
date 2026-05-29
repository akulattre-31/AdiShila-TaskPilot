import React from 'react';
import { useSession } from '../../hooks/useSession';
import { storage } from '../../lib/storage';

const Sidebar = ({ currentView, setView }) => {
  const { setToken, teamId } = useSession();

  const handleLogout = () => {
    storage.clear();
    setToken(null);
  };

  const navs = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'explorer', icon: 'explore', label: 'Task Explorer' }
  ];

  return (
    <aside className="fixed left-0 top-0 h-full z-40 flex flex-col p-6 gap-8 bg-surface-container-low/40 backdrop-blur-[25px] border-r border-white/10 w-72 rounded-r-xl shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
      <div className="flex flex-col gap-1 mb-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary-container/20 border border-primary/30 mb-2">
          <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>hexagon</span>
        </div>
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">Hey, {teamId || '9010'}</h2>
        <p className="font-label-caps text-label-caps text-on-surface-variant/60">Business Lab</p>
      </div>
      
      <nav className="flex-1 flex flex-col gap-4">
        {navs.map(n => {
          const isActive = currentView === n.id;
          return (
            <button
              key={n.id}
              onClick={() => setView(n.id)}
              className={`text-left rounded-DEFAULT p-3 flex items-center gap-3 transition-all duration-200 hover:translate-x-1 ${
                isActive 
                  ? 'bg-primary text-on-primary-container shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.4)]'
                  : 'text-on-surface-variant hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>{n.icon}</span>
              <span className="font-label-caps text-label-caps uppercase tracking-wider">{n.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-4">
        <div className="flex flex-col gap-2 border-t border-white/5 pt-6">
          <button className="text-on-surface-variant/70 flex items-center gap-3 p-2 hover:text-primary transition-colors text-left w-full">
            <span className="material-symbols-outlined text-sm">help</span>
            <span className="font-label-caps text-label-caps">Help</span>
          </button>
          <button className="text-on-surface-variant/70 flex items-center gap-3 p-2 hover:text-primary transition-colors text-left w-full">
            <span className="material-symbols-outlined text-sm">settings</span>
            <span className="font-label-caps text-label-caps">Settings</span>
          </button>
        </div>
        <button onClick={handleLogout} className="clay-button w-full py-4 rounded-xl text-on-primary-container font-bold font-label-caps flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all">
          <span className="material-symbols-outlined">logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
