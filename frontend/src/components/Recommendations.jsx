import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApi } from '../hooks/useApi';
import { Zap, PlayCircle, Target } from 'lucide-react';

export function Recommendations({ profile }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { apiCall } = useApi();

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await apiCall('/api/recommend', 'POST', {
          profile,
          completed_task_ids: [],
          skipped_task_ids: []
        });
        if (res?.rankings) setTasks(res.rankings);
      } catch (e) {
        console.warn('Failed to load recommendations');
        // Fallback for visual testing if backend is off
        setTasks([
          { taskId: 'TASK_T15', rank: 1, fitReason: 'Perfect match for React & FastAPI.', firstAction: 'Initialize repo', successProbability: 95 },
          { taskId: 'TASK_T11', rank: 2, fitReason: 'Strong alignment with Prompt Engineering.', firstAction: 'Draft prompts', successProbability: 82 }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, [profile, apiCall]);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', color: 'var(--gold-primary)', fontFamily: 'Cinzel', fontSize: '1.5rem', letterSpacing: '2px' }}><motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>Calibrating AI Matches...</motion.div></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <header style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 300, marginBottom: '0.5rem' }}>Curated For You</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Based on your {profile.track} track and {profile.experience} experience.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {tasks.map((task, i) => (
          <motion.div 
            key={task.taskId} 
            className="card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: i === 0 ? 'linear-gradient(90deg, rgba(212,160,23,0.1), var(--bg-surface))' : 'var(--bg-surface)', borderLeft: i === 0 ? '3px solid var(--gold-primary)' : '1px solid var(--border-dim)' }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span className="code-id">{task.taskId}</span>
                {i === 0 && <span className="chip active" style={{ padding: '4px 8px', fontSize: '10px' }}><Zap size={12} /> Top Match ({task.successProbability}%)</span>}
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{task.fitReason}</h3>
              <p style={{ color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px' }}><Target size={14} /> Action: {task.firstAction}</p>
            </div>
            <button className="btn-primary" style={{ padding: '8px 16px' }}><PlayCircle size={18} /> Brief</button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
