import React, { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { storage } from '../../lib/storage';
import { rankLocally } from '../../lib/scorer';
import { tasks as ALL_TASKS } from '../../lib/taskDatabase';
import BriefGenerator from './BriefGenerator';
import { useTracker } from '../../hooks/useTracker';
import { Cpu, Globe, Activity, Code, Database, Zap } from 'lucide-react';

const Dashboard = () => {
  const { apiCall } = useApi();
  const profile = storage.get('taskpilot_profile') || {};
  const [loading, setLoading] = useState(true);
  const [aiTasks, setAiTasks] = useState([]);
  const [localTasks, setLocalTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const { trackAction } = useTracker();

  useEffect(() => {
    trackAction('VIEW_DASHBOARD', { profile: profile.name });
    
    // Generate local fallback first
    const ranked = rankLocally(ALL_TASKS, profile).slice(0, 3);
    setLocalTasks(ranked);

    // Call API for Gemini-powered rankings
    apiCall('/api/recommend', 'POST', { 
      profile, 
      completed_task_ids: storage.get('taskpilot_task_history')?.map(t => t.id) || [], 
      skipped_task_ids: [] 
    })
      .then(res => {
        if (res.rankings) {
          // Merge API data with static task info
          const merged = res.rankings.map(r => {
            const staticInfo = ALL_TASKS.find(t => t.id === r.taskId) || {};
            return { ...staticInfo, ...r };
          });
          setAiTasks(merged);
        }
      })
      .catch(err => console.error("AI recommend failed", err))
      .finally(() => setLoading(false));
  }, [apiCall, trackAction, profile.name]);

  const recommendedIds = new Set(aiTasks.map(t => t.id));
  const otherTasks = ALL_TASKS.filter(t => !recommendedIds.has(t.id));
  const displayTasks = aiTasks.length > 0 ? [...aiTasks, ...otherTasks] : ALL_TASKS;

  if (selectedTask) {
    return <BriefGenerator task={selectedTask} onBack={() => setSelectedTask(null)} />;
  }

  return (
    <div className="w-full h-full flex flex-col gap-16 relative">
      {/* Immersive HUD Hero Banner */}
      <section className="relative w-full overflow-hidden rounded-3xl group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-black/80 z-0"></div>
        <img alt="Core Space Void" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen scale-105 group-hover:scale-100 transition-transform duration-[3s]" src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1600&q=80"/>
        
        {/* Neon Doodles */}
        <div className="absolute inset-0 z-[5] pointer-events-none overflow-hidden">
          <Cpu className="absolute top-[10%] left-[15%] text-primary/40 animate-[spin_10s_linear_infinite] drop-shadow-[0_0_10px_rgba(255,85,0,0.8)]" size={48} />
          <Globe className="absolute bottom-[20%] right-[10%] text-primary/30 animate-pulse drop-shadow-[0_0_15px_rgba(255,85,0,0.5)]" size={64} />
          <Activity className="absolute top-[30%] right-[25%] text-primary/50 animate-bounce drop-shadow-[0_0_8px_rgba(255,85,0,0.9)]" size={32} />
          <Code className="absolute bottom-[15%] left-[20%] text-primary/20 animate-pulse drop-shadow-[0_0_12px_rgba(255,85,0,0.4)]" size={56} />
          <Database className="absolute top-[50%] left-[5%] text-primary/30 animate-[spin_15s_linear_infinite_reverse] drop-shadow-[0_0_10px_rgba(255,85,0,0.6)]" size={40} />
          <Zap className="absolute top-[15%] right-[5%] text-primary/60 animate-pulse drop-shadow-[0_0_20px_rgba(255,85,0,1)]" size={36} />
        </div>

        <div className="relative z-10 liquid-glass p-12 md:p-16 border-l-4 border-l-primary flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl backdrop-blur-md bg-black/20 p-8 rounded-2xl shadow-clay-glow border border-white/5">
            <span className="font-label-caps text-label-caps text-primary tracking-[0.3em] mb-4 block flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#ff5500]"></div>
              SYSTEM STATUS: NOMINAL
            </span>
            <h1 className="font-headline-xl text-5xl text-white mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Adishila Core Active</h1>
            <p className="font-body-lg text-lg text-on-surface-variant leading-relaxed">
              The core is processing high-yield market signals. Optimization protocols are ready for deployment in your current operational sector. Awaiting operator input.
            </p>
            <div className="mt-8 flex gap-6">
              <button className="clay-button px-10 py-4 rounded-full text-on-primary-container font-bold font-label-caps tracking-widest hover:scale-105 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined">query_stats</span>
                VIEW ANALYTICS
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Predictables Spatial Grid */}
      <section className="relative z-10">
        <div className="flex items-center justify-between mb-10 border-b border-primary/20 pb-4">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-primary text-4xl drop-shadow-[0_0_10px_rgba(255,85,0,0.8)]">radar</span>
            <h2 className="font-headline-lg text-3xl text-white tracking-wide">Mission Catalogue</h2>
          </div>
          <div className="flex gap-2">
            <div className="px-4 py-2 rounded-full liquid-glass border border-primary/30 font-label-caps text-[11px] text-primary uppercase shadow-[0_0_15px_rgba(255,85,0,0.2)] flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
              {loading ? 'Syncing...' : `${displayTasks.length} Signals Detected`}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {displayTasks.map((t, idx) => (
            <div key={t.id || idx} className="liquid-glass rounded-2xl p-6 flex flex-col gap-4 hover:shadow-[0_0_40px_rgba(255,85,0,0.15)] hover:border-primary/50 hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden backdrop-blur-[40px]">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex justify-between items-start">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/40 text-primary shadow-clay">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>dataset</span>
                </div>
                <span className="font-label-caps text-[10px] px-3 py-1.5 rounded-full bg-black/40 text-primary border border-primary/20 uppercase shadow-inner tracking-widest">
                  {t.grade || 'Priority'}
                </span>
              </div>
              <div className="relative z-10 mt-2">
                <h3 className="font-headline-lg-mobile text-[18px] text-white mb-2 group-hover:text-primary transition-colors duration-300 leading-tight">{t.title}</h3>
                {t.fitReason && (
                  <div className="p-3 mt-3 bg-black/60 border border-primary/10 rounded-xl shadow-[inset_0_2px_15px_rgba(0,0,0,0.8)] backdrop-blur-md">
                    <p className="font-body-md text-[12px] text-primary/80 italic flex gap-2 items-start leading-relaxed">
                      <span className="material-symbols-outlined text-[14px] mt-0.5 text-primary">auto_awesome</span>
                      {t.fitReason}
                    </p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/10 mt-auto relative z-10 bg-black/20 rounded-xl px-4 my-2">
                <div>
                  <p className="font-label-caps text-[10px] text-on-surface-variant uppercase mb-1 tracking-widest">Expected Yield</p>
                  <p className="font-headline-lg-mobile text-[16px] text-primary drop-shadow-[0_0_5px_rgba(255,85,0,0.5)]">{t.gbp}</p>
                </div>
                <div>
                  <p className="font-label-caps text-[10px] text-on-surface-variant uppercase mb-1 tracking-widest">Est. Time</p>
                  <p className="font-headline-lg-mobile text-[16px] text-white">{t.timeHours}h</p>
                </div>
              </div>
              <button 
                className="relative z-10 clay-button w-full py-3.5 rounded-xl text-black bg-primary font-bold font-label-caps text-[11px] tracking-[0.2em] flex items-center justify-center gap-2 hover:brightness-125 transition-all overflow-hidden"
                onClick={() => {
                  trackAction('SELECT_RECOMMENDED_TASK', { taskId: t.id, title: t.title });
                  setSelectedTask(t);
                }}
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity"></div>
                EXECUTE PROTOCOL
                <span className="material-symbols-outlined text-[16px]">bolt</span>
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Dashboard;
