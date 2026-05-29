import React from 'react';
import { LayoutDashboard, Compass, Settings, User, LogOut } from 'lucide-react';
import { useSession } from '../../hooks/useSession';
import { storage } from '../../lib/storage';

const FloatingDock = ({ currentView, setView }) => {
  const { session } = useSession();

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'explorer', name: 'Task Explorer', icon: Compass },
  ];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="liquid-glass rounded-full px-6 py-3 flex items-center gap-8 shadow-clay-glow border border-primary/20 backdrop-blur-[30px] transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,85,0,0.3)]">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex items-center gap-2 group transition-colors duration-300 relative ${
                isActive ? 'text-primary' : 'text-on-surface-variant hover:text-white'
              }`}
            >
              <item.icon
                size={20}
                className={`transition-all duration-300 ${
                  isActive ? 'drop-shadow-[0_0_8px_rgba(255,85,0,0.8)] scale-110' : 'group-hover:scale-110'
                }`}
              />
              <span className="text-sm font-label tracking-wider hidden md:block">
                {item.name.toUpperCase()}
              </span>
              {isActive && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary shadow-[0_0_8px_rgba(255,85,0,1)]" />
              )}
            </button>
          );
        })}

        <div className="w-px h-6 bg-white/10 mx-2" />

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User size={18} className="text-primary/70" />
            <span className="text-xs font-label text-on-surface/70 hidden sm:block">
              {session?.profile?.role || 'OPERATOR'}
            </span>
          </div>
          <button className="text-on-surface-variant hover:text-primary transition-colors">
            <Settings size={20} />
          </button>
          <button onClick={handleLogout} className="text-on-surface-variant hover:text-error transition-colors ml-2" title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default FloatingDock;
