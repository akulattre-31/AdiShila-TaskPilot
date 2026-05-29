import React, { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { useTimer } from '../../hooks/useTimer';
import { storage } from '../../lib/storage';

const Header = () => {
  const { apiCall } = useApi();
  const profile = storage.get('taskpilot_profile') || {};
  const teamId = profile.team_id || 'OPERATOR';
  const [tip, setTip] = useState('Awaiting tactical instruction...');
  const { formatted } = useTimer();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    apiCall('/api/tip').then(res => setTip(res.tip)).catch(() => {});
  }, [apiCall]);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      if (searchQuery.trim() === '') return;
      window.alert(`Search Core offline. Query '${searchQuery}' buffered for next sync.`);
      setSearchQuery('');
    }
  };

  return (
    <header className="fixed top-0 w-full z-30 flex justify-between items-center px-gutter py-4 liquid-glass ml-72 max-w-[calc(100%-18rem)]">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-2xl neon-glow animate-[spin_10s_linear_infinite]">hexagon</span>
          <span className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary uppercase tracking-tighter">Business Lab</span>
        </div>
        <div className="h-6 w-[1px] bg-white/10 hidden md:block"></div>
        <div className="hidden md:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
          <span className="material-symbols-outlined text-on-surface-variant text-sm">timer</span>
          <span className="font-label-caps text-label-caps text-primary">Session: {formatted}</span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative group hidden lg:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50">search</span>
          <input 
            className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:ring-1 focus:ring-primary focus:border-primary w-64 transition-all duration-300 font-body-md text-sm outline-none" 
            placeholder="Search parameters..." 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
        <div className="flex items-center gap-4">
          <button className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
          </button>
          <div className="w-10 h-10 rounded-full border-2 border-primary/30 p-0.5">
            <img alt="User avatar" className="w-full h-full rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0nma5FxtFtHvsShKdmkk03ifdZrbf-Hs08kofnylWogMz-J7POa2LysN5pJNZSM34vIdJVZNZeZLFeERhg7ve3sFgbZn5fzFWHyQdbGXv_O8tlyRGxBwfAl6xRxcaSTVau_AmDXeFwiGuboOKZhiCXd9-u_Sq6RpV54LQB3bObjiCULETG0i-Y-ks6Ko7n_n8GXuTcmjHfIx9uZ6Luom7FzMJY2Nt0ETIh0kZNiFAxIVW3iGsaUR6uXjEI72kT-nOUGoj_52FWMo"/>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
