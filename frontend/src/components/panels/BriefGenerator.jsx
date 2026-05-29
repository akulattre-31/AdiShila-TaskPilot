import React, { useEffect, useState, useMemo } from 'react';
import { useApi } from '../../hooks/useApi';
import { storage } from '../../lib/storage';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, CheckCircle, Terminal } from 'lucide-react';
import { useTracker } from '../../hooks/useTracker';

const BriefGenerator = ({ task, onBack }) => {
  const { apiCall } = useApi();
  const profile = useMemo(() => storage.get('taskpilot_profile') || {}, []);
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [sourceCode, setSourceCode] = useState('');
  const [gitRepo, setGitRepo] = useState('');
  const { trackAction } = useTracker();

  useEffect(() => {
    trackAction('GENERATE_BRIEF', { taskId: task.id });
    apiCall('/api/brief', 'POST', { task_id: task.id, profile, task })
      .then(res => setBrief(res.brief))
      .catch(err => {
        // Offline Fallback Brief
        const fallbackText = `
### 🛡️ LOCAL SECURE BRIEF
*System operating in local extraction mode. Presenting standard mission parameters.*

#### 🎯 Objective
${task?.description || task?.title || 'Unknown'}

#### 🛠️ Tech Stack & Skills
${(Array.isArray(task?.skills) ? task.skills : [task?.skills].filter(Boolean)).map(s => `- ${s}`).join('\n')}

#### 📋 Proof Required
${(Array.isArray(task?.proofRequired) ? task.proofRequired : [task?.proofRequired].filter(Boolean)).map(p => `- ${p}`).join('\n')}
        `;
        setBrief(fallbackText);
        setError(null);
      })
      .finally(() => setLoading(false));
  }, [apiCall, task, trackAction, profile]);

  const handleComplete = () => {
    trackAction('COMPLETE_TASK', { taskId: task.id, sourceCode, gitRepo });
    const history = storage.get('taskpilot_task_history') || [];
    history.push({ ...task, completedAt: new Date().toISOString() });
    storage.set('taskpilot_task_history', history);
    
    let streak = storage.get('taskpilot_streak') || 0;
    storage.set('taskpilot_streak', streak + 1);
    
    setCompleted(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onBack} className="flex items-center text-text-dim hover:text-ember mb-6 text-sm uppercase tracking-wide">
        <ArrowLeft size={16} className="mr-2" /> Return
      </button>

      <div className="liquid-glass border-t border-l border-primary/30 rounded-2xl p-8 relative overflow-hidden shadow-[0_0_40px_rgba(255,85,0,0.15)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="flex justify-between items-start mb-8 border-b border-primary/20 pb-6 relative z-10">
          <div>
            {task?.grade && <span className="font-label-caps text-[10px] px-3 py-1.5 rounded-md bg-white/5 text-primary border border-primary/30 uppercase shadow-inner mb-4 inline-block">{task.grade} Priority</span>}
            <h1 className="font-headline-xl text-on-surface drop-shadow-md">{task?.title || 'Unknown Mission'}</h1>
          </div>
          <div className="text-right flex flex-col items-end">
            <div className="font-headline-lg text-primary neon-glow">{task?.gbp || 0} GBP</div>
            <div className="font-label-caps text-on-surface-variant mt-2 px-3 py-1 bg-black/30 rounded-md border border-white/5">{task?.timeHours || 0} Hours Est.</div>
          </div>
        </div>

        {loading && (
          <div className="py-20 flex flex-col items-center justify-center text-primary/70 relative z-10">
            <Terminal size={40} className="animate-pulse mb-6 drop-shadow-[0_0_15px_rgba(255,85,0,0.5)]" />
            <div className="font-label-caps tracking-[0.2em] uppercase text-xs">Generating AI Execution Brief...</div>
          </div>
        )}

        {error && (
          <div className="py-8 text-on-error border border-error/50 p-6 rounded-xl bg-error-container/20 shadow-inner relative z-10">
            Brief Generation Failed: {error}
          </div>
        )}

        {brief && !loading && (
          <div className="relative z-10 p-6 rounded-xl bg-black/40 border border-white/5 shadow-[inset_0_2px_15px_rgba(0,0,0,0.6)] mb-8">
            <div className="prose prose-invert prose-orange max-w-none font-body-md text-on-surface-variant leading-relaxed space-y-6">
              <ReactMarkdown>
                {brief}
              </ReactMarkdown>
            </div>
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-primary/20 relative z-10">
          {completed ? (
            <div className="flex justify-end">
              <button className="clay-button !bg-green-600 px-8 py-4 rounded-full text-white font-bold font-label-caps text-[11px] tracking-widest flex items-center gap-3 cursor-default">
                <CheckCircle size={18} /> Mission Accomplished
              </button>
            </div>
          ) : (
            <div className="liquid-glass p-8 rounded-xl border border-primary/20 shadow-clay">
              <h3 className="font-headline-lg-mobile text-primary mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined neon-glow">upload_file</span>
                Mission Submission
              </h3>
              <div className="space-y-5 mb-8">
                <div>
                  <label className="block font-label-caps text-on-surface-variant text-[10px] uppercase tracking-wider mb-2">Source Code (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="Link to deployed app or sandbox..."
                    className="w-full bg-black/50 border border-white/10 text-on-surface p-3 rounded-lg focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(255,85,0,0.2)] transition-all font-body-md"
                    value={sourceCode}
                    onChange={(e) => setSourceCode(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-label-caps text-on-surface-variant text-[10px] uppercase tracking-wider mb-2">Git Repository URL (Required)</label>
                  <input 
                    type="text" 
                    placeholder="https://github.com/..."
                    className="w-full bg-black/50 border border-white/10 text-on-surface p-3 rounded-lg focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(255,85,0,0.2)] transition-all font-body-md"
                    value={gitRepo}
                    onChange={(e) => setGitRepo(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button 
                  className="clay-button px-8 py-4 rounded-full text-on-primary-container font-bold font-label-caps text-[11px] tracking-widest disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
                  onClick={handleComplete}
                  disabled={loading || !!error || !gitRepo.trim()}
                >
                  Submit & Mark Complete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BriefGenerator;
