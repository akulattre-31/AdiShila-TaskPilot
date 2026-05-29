import React, { useState, useEffect } from 'react';

export function SecureEntry({ onAccessGranted }) {
  const [teamId, setTeamId] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [orbPos, setOrbPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setOrbPos({
        x: e.clientX - 150,
        y: e.clientY - 150
      });
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (teamId && accessKey) {
      onAccessGranted(teamId);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-on-surface bg-[#030303] overflow-hidden w-full absolute top-0 left-0">
      <div 
        className="gold-glow-orb absolute w-[300px] h-[300px] opacity-15 transition-transform duration-100 ease-out pointer-events-none"
        style={{ transform: `translate(${orbPos.x}px, ${orbPos.y}px)` }}
      />
      <div className="gold-glow-orb top-[-10%] left-[-10%]"></div>
      <div className="gold-glow-orb bottom-[-10%] right-[-10%]"></div>
      
      <main className="relative z-10 w-full max-w-[1440px] px-container-padding-mobile md:px-container-padding-desktop flex items-center justify-center">
        <section className="heavy-clay-card w-full max-w-lg p-10 md:p-14">
          <header className="text-center mb-12">
            <h1 className="font-display-lg text-display-lg text-primary uppercase tracking-[0.2em] mb-2">
              TaskPilot
            </h1>
            <p className="font-label-caps text-label-caps text-outline tracking-widest uppercase">
              Elite Level Access Terminal
            </p>
          </header>
          
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-3 text-left">
              <label className="block font-label-caps text-label-caps text-primary/80 ml-4">Team Identification</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-outline/50 group-focus-within:text-primary transition-colors z-10">
                  group
                </span>
                <input 
                  className="w-full h-14 pl-14 pr-4 bg-[#0A0A0A] border border-white/10 text-white rounded-lg focus:outline-none focus:border-[#FF4D00] focus:ring-1 focus:ring-[#FF4D00]/20 transition-all font-mono-data text-mono-data placeholder:text-outline-variant/40" 
                  placeholder="ENTER TEAM ID" 
                  type="text"
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-3 text-left">
              <label className="block font-label-caps text-label-caps text-primary/80 ml-4">Access Key</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-outline/50 group-focus-within:text-primary transition-colors z-10">
                  vpn_key
                </span>
                <input 
                  className="w-full h-14 pl-14 pr-4 bg-[#0A0A0A] border border-white/10 text-white rounded-lg focus:outline-none focus:border-[#FF4D00] focus:ring-1 focus:ring-[#FF4D00]/20 transition-all font-mono-data text-mono-data placeholder:text-outline-variant/40" 
                  placeholder="••••••••••••" 
                  type="password"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-start gap-3 py-4 border-y border-outline-variant/10 text-left">
              <span className="material-symbols-outlined text-primary/60 scale-75" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified_user
              </span>
              <p className="font-body-md text-body-md text-on-surface-variant/70 italic leading-tight">
                Encrypted quantum-link established. All operations are logged within the secure terminal environment.
              </p>
            </div>
            
            <button className="w-full h-16 bg-[#FF4D00] text-white rounded-lg hover:bg-[#e64500] hover:shadow-[0_0_15px_rgba(255,77,0,0.4)] transition-all font-title-md text-title-md flex items-center justify-center gap-3" type="submit">
              <span>SECURE ENTRY</span>
              <span className="material-symbols-outlined">
                arrow_forward
              </span>
            </button>
          </form>
          
          <footer className="mt-12 text-center space-y-4">
            <a className="inline-block font-label-caps text-label-caps text-outline hover:text-primary transition-colors duration-300" href="#">
              Request Emergency Override
            </a>
            <div className="flex justify-center items-center gap-6 pt-6 opacity-30">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary"></div>
              <span className="font-mono-data text-[10px] text-primary tracking-widest uppercase">System v4.2.0</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary"></div>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}
