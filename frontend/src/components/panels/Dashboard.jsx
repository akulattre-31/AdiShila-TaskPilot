import React, { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { storage } from '../../lib/storage';
import { rankLocally } from '../../lib/scorer';
import { tasks as ALL_TASKS } from '../../lib/taskDatabase';
import BriefGenerator from './BriefGenerator';
import { useTracker } from '../../hooks/useTracker';

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
    <div className="max-w-7xl mx-auto flex flex-col gap-12">
      {/* Hero Banner */}
        <section className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent blur-2xl opacity-50 group-hover:opacity-75 transition duration-1000"></div>
          <div className="relative glass-card rounded-xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 border-l-4 border-l-primary overflow-hidden">
            <div className="z-10">
              <span className="font-label-caps text-label-caps text-primary tracking-[0.2em] mb-4 block">SYSTEM STATUS: NOMINAL</span>
              <h1 className="font-headline-xl text-headline-xl text-on-surface mb-4">Adishila Core Active</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                The core is processing high-yield market signals. Optimization protocols are ready for deployment in your current operational sector.
              </p>
              <div className="mt-8 flex gap-4">
                <button className="clay-button px-8 py-3 rounded-full text-on-primary-container font-bold font-label-caps hover:scale-105 transition-all">
                  VIEW ANALYTICS
                </button>
              </div>
            </div>
            <div className="relative w-full max-w-[320px] aspect-video rounded-lg overflow-hidden glass-card border border-white/20 shadow-2xl shrink-0">
              <img alt="Core Data Visualization" className="w-full h-full object-cover object-center opacity-80 mix-blend-screen" src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80"/>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
            </div>
          </div>
        </section>

        {/* Predictables Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-primary text-3xl">insights</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Mission Catalogue</h2>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 font-label-caps text-[10px] text-on-surface-variant uppercase">
                {loading ? 'Syncing...' : `${displayTasks.length} Tasks Pending`}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayTasks.map((t, idx) => (
              <div key={t.id || idx} className="liquid-glass rounded-xl p-4 flex flex-col gap-3 hover:shadow-clay-glow hover:border-primary/50 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 flex justify-between items-start">
                  <div className="p-2 rounded-lg bg-primary-container/10 border border-primary/30 text-primary shadow-clay">
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>dataset</span>
                  </div>
                  <span className="font-label-caps text-[9px] px-2 py-1 rounded-md bg-white/5 text-on-surface-variant border border-white/10 uppercase shadow-inner">
                    {t.grade || 'Priority'}
                  </span>
                </div>
                <div className="relative z-10">
                  <h3 className="font-headline-lg-mobile text-[15px] text-on-surface mb-1 group-hover:text-primary transition-colors">{t.title}</h3>
                  {t.fitReason && (
                    <div className="p-2 mt-2 bg-black/40 border border-primary/20 rounded-lg shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                      <p className="font-body-md text-[11px] text-primary/90 italic flex gap-1.5 items-start leading-snug">
                        <span className="material-symbols-outlined text-[12px] mt-0.5">auto_awesome</span>
                        {t.fitReason}
                      </p>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 py-2 border-y border-white/5 mt-auto">
                  <div>
                    <p className="font-label-caps text-[9px] text-on-surface-variant uppercase mb-0.5">Expected Yield</p>
                    <p className="font-headline-lg-mobile text-[14px] text-primary">{t.gbp}</p>
                  </div>
                  <div>
                    <p className="font-label-caps text-[9px] text-on-surface-variant uppercase mb-0.5">Est. Time</p>
                    <p className="font-headline-lg-mobile text-[14px] text-on-surface">{t.timeHours}h</p>
                  </div>
                </div>
                <button 
                  className="clay-button w-full py-2.5 rounded-full text-on-primary-container font-bold font-label-caps text-[9px] tracking-widest flex items-center justify-center gap-1.5 hover:translate-y-[-1px]"
                  onClick={() => {
                    trackAction('SELECT_RECOMMENDED_TASK', { taskId: t.id, title: t.title });
                    setSelectedTask(t);
                  }}
                >
                  GENERATE EXECUTION BRIEF
                  <span className="material-symbols-outlined text-sm">bolt</span>
                </button>
              </div>
            ))}
          </div>
        </section>

      </div>
  );
};

export default Dashboard;
