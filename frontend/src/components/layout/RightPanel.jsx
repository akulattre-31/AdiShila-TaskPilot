import React from 'react';
import { storage } from '../../lib/storage';

const RightPanel = () => {
  const profile = storage.get('taskpilot_profile') || {};
  const history = storage.get('taskpilot_task_history') || [];
  const streak = storage.get('taskpilot_streak') || 0;

  const totalGbp = history.reduce((sum, t) => sum + t.gbp, 0);

  return (
    <div className="h-full bg-base border-l border-border-dim p-6 flex flex-col">
      <h3 className="uppercase text-sm tracking-widest text-text-dim mb-6 border-b border-border-dim pb-2">Operator Identity</h3>
      
      <div className="clay-card p-4 mb-6">
        <div className="text-xs text-text-dim uppercase mb-1">ID: {profile.team_id}</div>
        <div className="text-xl font-bold text-text-hot mb-1">{profile.name}</div>
        <div className="text-sm text-ember-pale">Cohort {profile.cohort} • {profile.track} Track</div>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-end">
          <div className="text-xs uppercase text-text-dim">Yield (GBP)</div>
          <div className="gbp-value text-2xl">{totalGbp}</div>
        </div>
        <div className="flex justify-between items-end">
          <div className="text-xs uppercase text-text-dim">Ops Completed</div>
          <div className="metric-number text-xl text-text-hot">{history.length}</div>
        </div>
        <div className="flex justify-between items-end">
          <div className="text-xs uppercase text-text-dim">Streak</div>
          <div className="metric-number text-xl text-ember">{streak} Days</div>
        </div>
      </div>

      <h3 className="uppercase text-sm tracking-widest text-text-dim mb-4 border-b border-border-dim pb-2">Active Directives</h3>
      {/* Mini notification center */}
      <div className="flex-1 overflow-y-auto space-y-3">
        <div className="p-3 border border-border-ghost rounded bg-overlay">
          <div className="text-xs text-ember mb-1">System Update</div>
          <div className="text-sm">V3.0 deployed successfully. Security protocols engaged.</div>
        </div>
        <div className="p-3 border border-border-ghost rounded bg-overlay">
          <div className="text-xs text-warning mb-1">Pending Review</div>
          <div className="text-sm">Task B02 requires Chief Admin sign-off.</div>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
