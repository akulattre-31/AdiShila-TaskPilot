import React, { useState, useMemo, useEffect } from 'react';
import { tasks as ALL_TASKS } from '../../lib/taskDatabase';
import { Search } from 'lucide-react';
import BriefGenerator from './BriefGenerator';
import { useTracker } from '../../hooks/useTracker';

const TaskExplorer = () => {
  const [search, setSearch] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const { trackAction } = useTracker();

  useEffect(() => {
    trackAction('VIEW_TASK_EXPLORER');
  }, [trackAction]);

  // Extract all unique tags
  const tags = useMemo(() => {
    const allTags = new Set();
    ALL_TASKS.forEach(t => t.tags?.forEach(tag => allTags.add(tag)));
    return Array.from(allTags).slice(0, 8); // Take top 8
  }, []);

  const filteredTasks = useMemo(() => {
    return ALL_TASKS.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                            t.category.toLowerCase().includes(search.toLowerCase());
      const matchesTag = selectedTag ? t.tags?.includes(selectedTag) : true;
      return matchesSearch && matchesTag;
    });
  }, [search, selectedTag]);

  if (selectedTask) {
    return <BriefGenerator task={selectedTask} onBack={() => setSelectedTask(null)} />;
  }

  return (
    <div className="w-full h-full flex flex-col relative z-10 gap-8">
      {/* Header section with sticky glass effect */}
      <div className="sticky top-28 z-40 backdrop-blur-[40px] bg-black/40 border-b border-primary/20 pb-6 rounded-3xl p-8 shadow-clay-glow">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-primary text-4xl drop-shadow-[0_0_10px_rgba(255,85,0,0.8)]">explore</span>
            <div>
              <h2 className="font-headline-lg text-3xl text-white tracking-wide">Task Explorer</h2>
              <p className="text-on-surface-variant font-label-caps text-[11px] uppercase tracking-widest mt-2">All available modules</p>
            </div>
          </div>
          
          <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/70">search</span>
            <input 
              type="text" 
              placeholder="Query task catalogue..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/60 border border-primary/30 rounded-full py-3.5 pl-12 pr-6 text-white placeholder-on-surface-variant/50 focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(255,85,0,0.3)] transition-all font-body-md"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-5 py-2.5 rounded-full font-label-caps text-[11px] tracking-widest transition-all duration-300 flex items-center gap-2 ${
                selectedTag === tag 
                  ? 'bg-primary text-black shadow-[0_0_15px_rgba(255,85,0,0.4)]' 
                  : 'liquid-glass border border-white/10 text-on-surface hover:border-primary/50 hover:text-primary'
              }`}
            >
              {selectedTag === tag && <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse"></div>}
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 pb-12">
        {filteredTasks.map((t) => (
          <div key={t.id} className="liquid-glass rounded-2xl p-6 flex flex-col gap-4 hover:shadow-[0_0_40px_rgba(255,85,0,0.15)] hover:border-primary/50 hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden backdrop-blur-[40px]">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10 flex justify-between items-start">
              <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/40 text-primary shadow-clay">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
              </div>
              <span className="font-label-caps text-[10px] px-3 py-1.5 rounded-full bg-black/40 text-primary border border-primary/20 uppercase shadow-inner tracking-widest">
                {t.grade || 'Standard'}
              </span>
            </div>
            
            <div className="relative z-10 mt-2 flex-1">
              <h3 className="font-headline-lg-mobile text-[18px] text-white mb-2 group-hover:text-primary transition-colors duration-300 leading-tight">{t.title}</h3>
              <p className="font-body-md text-on-surface-variant line-clamp-2 text-sm leading-relaxed mb-4">{t.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {t.tags?.slice(0, 3).map(tag => (
                  <span key={tag} className="font-label-caps text-[9px] text-on-surface-variant/70 border border-white/5 rounded-full px-2.5 py-1 bg-black/30">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/10 mt-auto relative z-10 bg-black/20 rounded-xl px-4 my-2">
              <div>
                <p className="font-label-caps text-[10px] text-on-surface-variant uppercase mb-1 tracking-widest">Yield</p>
                <p className="font-headline-lg-mobile text-[16px] text-primary drop-shadow-[0_0_5px_rgba(255,85,0,0.5)]">{t.gbp}</p>
              </div>
              <div>
                <p className="font-label-caps text-[10px] text-on-surface-variant uppercase mb-1 tracking-widest">Est. Time</p>
                <p className="font-headline-lg-mobile text-[16px] text-white">{t.timeHours}h</p>
              </div>
            </div>
            
            <button 
              className="relative z-10 clay-button w-full py-3.5 rounded-xl text-black bg-primary/80 font-bold font-label-caps text-[11px] tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-primary hover:brightness-125 transition-all overflow-hidden"
              onClick={() => {
                trackAction('SELECT_TASK_FROM_EXPLORER', { taskId: t.id, title: t.title });
                setSelectedTask(t);
              }}
            >
              VIEW PROTOCOL DETAILS
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskExplorer;
