import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Compass, Briefcase, FileText, Menu, AlertCircle, LogOut, Flame, Target, Trophy, Clock, Zap, User } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { Recommendations } from './Recommendations';
import Skeleton from './Skeleton';
import { storage } from '../lib/storage';

export default function Dashboard({ profile }) {
  const [activeTab, setActiveTab] = useState('recommendations');
  const [tip, setTip] = useState('Stay disciplined and prioritize tasks that compound your GBP.');
  const [loadingTip, setLoadingTip] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  
  const logout = () => {
    storage.remove('taskpilot_profile');
    window.location.reload();
  };
  const { apiCall } = useApi();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchTip = async () => {
      try {
        setLoadingTip(true);
        const res = await apiCall('/api/tip');
        if (res?.tip) setTip(res.tip);
      } catch (e) {
        console.warn('Could not fetch AI tip');
      } finally {
        setLoadingTip(false);
      }
    };
    fetchTip();
  }, [apiCall]);

  return (
    <div style={{ display: 'flex', width: '100%', maxWidth: '1440px', margin: '0 auto', gap: '3rem' }}>
      {/* Sidebar */}
      <aside style={{ width: '280px', flexShrink: 0 }} className="glass-panel card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '3rem' }}>
          <Zap size={24} color="var(--gold-primary)" />
          <h2 style={{ fontSize: '1.2rem', letterSpacing: '2px', color: 'var(--text-primary)' }}>TASKPILOT</h2>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="btn-ghost" 
            style={{ justifyContent: 'flex-start', background: activeTab === 'dashboard' ? 'rgba(212,160,23,0.1)' : 'transparent', border: activeTab === 'dashboard' ? '1px solid var(--border-gold)' : 'transparent', color: activeTab === 'dashboard' ? 'var(--gold-bright)' : 'var(--text-secondary)' }}
          >
            <LayoutDashboard size={18} /> Dashboard
          </div>
          <div 
            onClick={() => setActiveTab('recommendations')}
            className="btn-ghost" 
            style={{ justifyContent: 'flex-start', background: activeTab === 'recommendations' ? 'rgba(212,160,23,0.1)' : 'transparent', border: activeTab === 'recommendations' ? '1px solid var(--border-gold)' : 'transparent', color: activeTab === 'recommendations' ? 'var(--gold-bright)' : 'var(--text-secondary)' }}
          >
            <Compass size={18} /> Recommendations
          </div>
          <div 
            onClick={() => setActiveTab('explorer')}
            className="btn-ghost" 
            style={{ justifyContent: 'flex-start', background: activeTab === 'explorer' ? 'rgba(212,160,23,0.1)' : 'transparent', border: activeTab === 'explorer' ? '1px solid var(--border-gold)' : 'transparent', color: activeTab === 'explorer' ? 'var(--gold-bright)' : 'var(--text-secondary)' }}
          >
            <Menu size={18} /> Task Explorer
          </div>
          <div 
            onClick={() => setActiveTab('brief')}
            className="btn-ghost" 
            style={{ justifyContent: 'flex-start', background: activeTab === 'brief' ? 'rgba(212,160,23,0.1)' : 'transparent', border: activeTab === 'brief' ? '1px solid var(--border-gold)' : 'transparent', color: activeTab === 'brief' ? 'var(--gold-bright)' : 'var(--text-secondary)' }}
          >
            <FileText size={18} /> Brief Generator
          </div>
        </nav>
        <div className="mt-auto space-y-2">
          <button 
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 transition"
            onClick={() => alert("Issue reporting modal coming soon!")}
          >
            <AlertCircle size={20} />
            <span>Raise an Issue</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10">
          <h2 className="text-2xl font-serif text-[var(--aureate-gold)] tracking-wide uppercase">
            Good Morning, {profile?.name ? profile.name.split(' ')[0] : 'User'} 👋
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-white/50 text-sm tracking-widest flex items-center gap-2"><Clock size={16}/> {currentTime || '...'}</span>
            <div className="w-10 h-10 rounded-full bg-[var(--aureate-gold)] flex items-center justify-center text-black font-bold text-lg cursor-pointer hover:scale-105 transition shadow-lg">
              {profile?.name ? profile.name[0].toUpperCase() : 'U'}
            </div>
            <button onClick={logout} className="p-2 rounded-full hover:bg-white/10 transition text-white/50 hover:text-red-400">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-10 space-y-8">
            <div className="heavy-clay-card p-6 flex items-start space-x-4">
              <div className="p-3 bg-white/5 rounded-lg shrink-0 border border-white/10">
                <Compass className="text-[var(--aureate-gold)]" size={24} />
              </div>
              <div>
                <h3 className="text-white/90 font-medium mb-1 tracking-wide">Daily AI Insight</h3>
                {loadingTip ? (
                  <div className="space-y-2 mt-2">
                     <Skeleton width="100%" height="16px" />
                     <Skeleton width="80%" height="16px" />
                  </div>
                ) : (
                  <p className="text-white/50 text-sm leading-relaxed max-w-3xl">
                    "{tip}"
                  </p>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <div className="label" style={{ marginBottom: '8px' }}>Total GBP</div>
                  <div className="number-value" style={{ fontSize: '2.5rem' }}>£0</div>
                </motion.div>
                <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <div className="label" style={{ marginBottom: '8px' }}>Merit Points</div>
                  <div className="number-value" style={{ fontSize: '2.5rem' }}>0</div>
                </motion.div>
                <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <div className="label" style={{ marginBottom: '8px' }}>Tasks Completed</div>
                  <div className="number-value" style={{ fontSize: '2.5rem' }}>0</div>
                </motion.div>
              </div>

              <motion.div 
                className="card" 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'linear-gradient(135deg, var(--bg-surface), var(--bg-elevated))' }}
              >
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(212,160,23,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-bright)' }}>
                  <Flame size={28} />
                </div>
                <div>
                  <div className="number-value" style={{ fontSize: '1.8rem', lineHeight: 1, marginBottom: '4px' }}>5 Day</div>
                  <div className="label" style={{ color: 'var(--gold-muted)' }}>Hot Streak!</div>
                </div>
              </motion.div>
                {/* Fix broken array fragment and remove old leaderboard since it wasn't requested */}
            </div>
          </motion.div>
        )}

        {activeTab === 'recommendations' && (
          <Recommendations profile={profile} />
        )}

        {activeTab === 'explorer' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Menu size={48} color="var(--gold-dim)" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Task Explorer</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Full task database goes here.</p>
          </motion.div>
        )}

        {activeTab === 'brief' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <FileText size={48} color="var(--gold-dim)" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Brief Generator</h2>
            <p style={{ color: 'var(--text-secondary)' }}>AI-driven task briefs go here.</p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
