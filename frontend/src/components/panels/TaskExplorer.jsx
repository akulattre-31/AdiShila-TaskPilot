import React, { useState, useMemo, useEffect } from 'react';
import { tasks as ALL_TASKS } from '../../lib/taskDatabase';
import { Search, Filter, X } from 'lucide-react';
import BriefGenerator from './BriefGenerator';
import { useTracker } from '../../hooks/useTracker';

const TaskExplorer = () => {
  const [search, setSearch] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const { trackAction } = useTracker();

  useEffect(() => {
    trackAction('VIEW_TASK_EXPLORER');
  }, [trackAction]);

  const filteredTasks = useMemo(() => {
    return ALL_TASKS.filter(t => 
      t.title.toLowerCase().includes(search.toLowerCase()) || 
      t.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  if (selectedTask) {
    return <BriefGenerator task={selectedTask} onBack={() => setSelectedTask(null)} />;
  }

  return (
    <div className="max-w-6xl mx-auto flex h-[calc(100vh-140px)] gap-6">
      
      {/* Left side: List */}
      <div className="flex-1 flex flex-col bg-surface border border-border-dim rounded-lg overflow-hidden relative z-10 clay-card">
        <div className="p-4 border-b border-border-dim flex items-center gap-4 bg-base">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
            <input 
              type="text" 
              placeholder="Search database..."
              className="w-full bg-void border border-border-ghost rounded pl-10 pr-4 py-2 text-text-hot outline-none focus:border-ember transition-colors"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="p-2 border border-border-ghost rounded text-text-dim hover:text-ember">
            <Filter size={18} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTasks.map((t) => (
            <div key={t.id} className="liquid-glass rounded-xl p-4 flex flex-col gap-3 hover:shadow-clay-glow hover:border-primary/50 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex justify-between items-start">
                <div className="p-2 rounded-lg bg-primary-container/10 border border-primary/30 text-primary shadow-clay">
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>dataset</span>
                </div>
                <span className="font-label-caps text-[9px] px-2 py-1 rounded-md bg-white/5 text-on-surface-variant border border-white/10 uppercase shadow-inner">
                  {t.grade || 'Priority'}
                </span>
              </div>
              <div className="relative z-10 flex-1">
                <h3 className="font-headline-lg-mobile text-[15px] text-on-surface mb-1 group-hover:text-primary transition-colors">{t.title}</h3>
                <p className="font-body-md text-[12px] text-on-surface-variant line-clamp-3 leading-snug">{t.description}</p>
              </div>
              
              <div className="relative z-10 grid grid-cols-2 gap-2 py-2 border-y border-white/5 mt-auto">
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
                className="clay-button relative z-10 w-full py-2.5 rounded-full text-on-primary-container font-bold font-label-caps text-[9px] tracking-widest flex items-center justify-center gap-1.5 hover:translate-y-[-1px]"
                onClick={() => {
                  trackAction('SELECT_TASK_FROM_EXPLORER', { taskId: t.id, title: t.title });
                  setSelectedTask(t);
                }}
              >
                GENERATE EXECUTION BRIEF
                <span className="material-symbols-outlined text-sm">bolt</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskExplorer;
