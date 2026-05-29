import React, { useState } from 'react';
import { useSession } from '../../hooks/useSession';
import { storage } from '../../lib/storage';
import { Briefcase, Code, Brain, ChevronRight, Check } from 'lucide-react';

const SKILLS = [
  "Python", "JavaScript", "React", "FastAPI", "Data Analysis",
  "Prompt Engineering", "AI/ML", "Cybersecurity", "Market Research",
  "Content Writing", "Video Editing", "Graphic Design",
  "Business Strategy", "Financial Modelling", "Public Speaking"
];

const ALLOWED_TEAM_IDS = ["9008","4701","4678","9002","4767","9014","4244","9011","9019","9015","9012","8048","4703","4709","4839","4952","4867","4716","4965","8066","5084","4239","5057","8047","8056","9018","9007","4802","1111","4722","4723","8051","8060","8064","8065","4672","8050","4663","4688","4866","5049","5074","9009","9013","8052","4785","4855","5027","5106","4245","4750","5121","10001","4724","4851","8054","9006","9017","4775","4667","8046","9004","4708","8049","8061","4240","4242","9010","4901"];

const OnboardingWizard = ({ onComplete }) => {
  const { initSession } = useSession();
  const [step, setStep] = useState(1);
  const [authError, setAuthError] = useState(false);
  const [isDirectLogin, setIsDirectLogin] = useState(false);
  const [profile, setProfile] = useState({
    name: '', team_id: '', cohort: '',
    track: 'Both',
    skills: [], hours_per_week: 10, experience: 'Intermediate',
    prefer_high_gbp: false, prefer_low_time: false, prefer_new_tasks: true
  });

  const update = (k, v) => setProfile(prev => ({ ...prev, [k]: v }));
  
  const toggleSkill = (skill) => {
    setProfile(p => {
      const skills = p.skills.includes(skill)
        ? p.skills.filter(s => s !== skill)
        : [...p.skills, skill].slice(0, 15);
      return { ...p, skills };
    });
  };

  const handleComplete = async () => {
    storage.set('taskpilot_profile', profile);
    storage.set('taskpilot_onboarded', true);
    await initSession(profile.name, profile.team_id);
    onComplete();
  };

  const handleStep1Next = () => {
    if (!ALLOWED_TEAM_IDS.includes(profile.team_id)) {
      setAuthError(true);
    } else {
      setAuthError(false);
      setStep(2);
    }
  };

  const handleDirectLogin = async () => {
    if (!ALLOWED_TEAM_IDS.includes(profile.team_id)) {
      setAuthError(true);
    } else {
      setAuthError(false);
      const defaultProfile = {
        ...profile,
        name: `Operator ${profile.team_id}`,
        cohort: 'I',
        track: 'Both',
        skills: ['Business Strategy', 'Python'],
        hours_per_week: 20,
        experience: 'Intermediate',
        prefer_high_gbp: false, prefer_low_time: false, prefer_new_tasks: true
      };
      storage.set('taskpilot_profile', defaultProfile);
      storage.set('taskpilot_onboarded', true);
      await initSession(defaultProfile.name, defaultProfile.team_id);
      onComplete();
    }
  };

  const isStep1Valid = profile.name.length >= 2 && /^\d{4,5}$/.test(profile.team_id) && /^[IVX]{1,4}$/.test(profile.cohort);
  const isDirectLoginValid = /^\d{4,5}$/.test(profile.team_id);
  const isStep3Valid = profile.skills.length >= 1;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-2xl p-8 relative rounded-xl">
        <h2 className="text-headline-lg font-headline-lg text-center mb-2">Welcome to TaskPilot</h2>
        
        <div className="flex justify-between items-center mb-8">
          <div className="text-on-surface-variant text-sm uppercase tracking-widest">
            {isDirectLogin ? 'Direct Authentication' : 'Initialization Protocol'}
          </div>
          <button 
            onClick={() => { setIsDirectLogin(!isDirectLogin); setAuthError(false); }}
            className="text-[#FF4D00] hover:text-white text-sm transition-colors border-b border-[#FF4D00]/50 hover:border-white"
          >
            {isDirectLogin ? 'New Operator? Register' : 'Already have a Team ID? Log in'}
          </button>
        </div>
        
        {/* Progress Bar */}
        {!isDirectLogin && (
          <div className="flex gap-2 mb-8">
            {[1,2,3,4].map(i => (
              <div key={i} className={`h-1 flex-1 rounded ${i <= step ? 'bg-[#FF4D00]' : 'bg-white/10'}`} />
            ))}
          </div>
        )}

        {isDirectLogin ? (
          <div className="space-y-6">
            <div>
              <label className="block text-label-md font-label-md text-on-surface-variant mb-2">Team ID (4 digits)</label>
              <input 
                className="w-full bg-[#0A0A0A] border border-white/10 p-3 rounded-md text-white focus:border-[#FF4D00] focus:ring-1 focus:ring-[#FF4D00]/20 outline-none transition-all"
                value={profile.team_id} onChange={e => update('team_id', e.target.value)}
                placeholder="Enter authorized Team ID"
                autoFocus
              />
            </div>
            <div className="flex justify-end pt-4">
              <button 
                className="px-6 py-2 bg-[#FF4D00] text-white rounded-md hover:bg-[#e64500] hover:shadow-[0_0_15px_rgba(255,77,0,0.4)] transition-all flex items-center" 
                disabled={!isDirectLoginValid} 
                onClick={handleDirectLogin}
              >
                Login <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
            {authError && (
              <div className="mt-4 p-4 border border-[#FF4D00]/50 rounded-md bg-[#300] text-center">
                <div className="text-[#FF4D00] font-bold mb-3">No record found. Not a member.</div>
                <a href="mailto:support@adishila.com?subject=TaskPilot%20Access%20Request" className="px-4 py-2 bg-transparent border border-[#FF4D00] text-[#FF4D00] hover:bg-[#FF4D00] hover:text-white rounded-md transition-colors inline-block text-sm">Raise a Query</a>
              </div>
            )}
          </div>
        ) : step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-label-md font-label-md text-on-surface-variant mb-2">Operator Name</label>
              <input 
                className="w-full bg-[#0A0A0A] border border-white/10 p-3 rounded-md text-white focus:border-[#FF4D00] focus:ring-1 focus:ring-[#FF4D00]/20 outline-none transition-all"
                value={profile.name} onChange={e => update('name', e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-label-md font-label-md text-on-surface-variant mb-2">Team ID (4 digits)</label>
                <input 
                  className="w-full bg-[#0A0A0A] border border-white/10 p-3 rounded-md text-white focus:border-[#FF4D00] focus:ring-1 focus:ring-[#FF4D00]/20 outline-none transition-all"
                  value={profile.team_id} onChange={e => update('team_id', e.target.value)}
                  placeholder="1042"
                />
              </div>
              <div>
                <label className="block text-label-md font-label-md text-on-surface-variant mb-2">Cohort (Roman)</label>
                <input 
                  className="w-full bg-[#0A0A0A] border border-white/10 p-3 rounded-md text-white focus:border-[#FF4D00] focus:ring-1 focus:ring-[#FF4D00]/20 outline-none transition-all"
                  value={profile.cohort} onChange={e => update('cohort', e.target.value)}
                  placeholder="IV"
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button className="px-6 py-2 bg-[#FF4D00] text-white rounded-md hover:bg-[#e64500] hover:shadow-[0_0_15px_rgba(255,77,0,0.4)] transition-all flex items-center" disabled={!isStep1Valid} onClick={handleStep1Next}>
                Next Phase <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
            {authError && (
              <div className="mt-4 p-4 border border-danger/50 rounded-md bg-[#300] text-center">
                <div className="text-danger font-bold mb-3">No record found. Not a member.</div>
                <a href="mailto:support@adishila.com?subject=TaskPilot%20Access%20Request" className="px-4 py-2 bg-transparent border border-danger text-danger hover:bg-danger hover:text-white rounded-md transition-colors inline-block text-sm">Raise a Query</a>
              </div>
            )}
          </div>
        )}

        {!isDirectLogin && step === 2 && (
          <div className="space-y-6">
            <h3 className="text-headline-md font-headline-md mb-4 text-center">Select Primary Track</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'Tech', icon: <Code size={24} />, desc: 'Engineering & Data' },
                { id: 'Business', icon: <Briefcase size={24} />, desc: 'Strategy & Ops' },
                { id: 'Both', icon: <Brain size={24} />, desc: 'Multidisciplinary' }
              ].map(t => (
                <div 
                  key={t.id}
                  onClick={() => update('track', t.id)}
                  className={`glass-panel p-6 flex flex-col items-center justify-center cursor-pointer text-center gap-3 transition-all ${profile.track === t.id ? 'border-[#FF4D00] shadow-[0_0_15px_rgba(255,77,0,0.2)]' : 'border-white/5 hover:border-white/20'}`}
                >
                  <div className={profile.track === t.id ? 'text-[#FF4D00]' : 'text-on-surface-variant'}>{t.icon}</div>
                  <div className="text-label-md font-label-md">{t.id}</div>
                  <div className="text-label-sm font-label-sm text-on-surface-variant">{t.desc}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-4">
              <button className="text-on-surface-variant hover:text-white uppercase text-xs transition-colors" onClick={() => setStep(1)}>Back</button>
              <button className="px-6 py-2 bg-[#FF4D00] text-white rounded-md hover:bg-[#e64500] hover:shadow-[0_0_15px_rgba(255,77,0,0.4)] transition-all flex items-center" onClick={() => setStep(3)}>Next Phase <ChevronRight size={16} className="ml-1" /></button>
            </div>
          </div>
        )}

        {!isDirectLogin && step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-label-md font-label-md text-on-surface-variant mb-3">Core Competencies (Select up to 15)</label>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map(s => (
                  <div 
                    key={s} 
                    onClick={() => toggleSkill(s)}
                    className={`px-3 py-1.5 rounded-full text-xs cursor-pointer border transition-all ${profile.skills.includes(s) ? 'bg-[#FF4D00] text-white border-[#FF4D00] font-bold' : 'bg-[#0A0A0A] text-on-surface-variant border-white/10 hover:border-[#FF4D00]/50'}`}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-label-md font-label-md text-on-surface-variant mb-2">Weekly Availability ({profile.hours_per_week}h)</label>
                <input 
                  type="range" min="1" max="60" 
                  className="w-full accent-[#FF4D00]"
                  value={profile.hours_per_week} onChange={e => update('hours_per_week', parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-label-md font-label-md text-on-surface-variant mb-2">Experience Level</label>
                <select 
                  className="w-full bg-[#0A0A0A] border border-white/10 p-2 rounded-md text-white outline-none focus:border-[#FF4D00]"
                  value={profile.experience} onChange={e => update('experience', e.target.value)}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <button className="text-on-surface-variant hover:text-white uppercase text-xs transition-colors" onClick={() => setStep(2)}>Back</button>
              <button className="px-6 py-2 bg-[#FF4D00] text-white rounded-md hover:bg-[#e64500] hover:shadow-[0_0_15px_rgba(255,77,0,0.4)] transition-all flex items-center" disabled={!isStep3Valid} onClick={() => setStep(4)}>Next Phase <ChevronRight size={16} className="ml-1" /></button>
            </div>
          </div>
        )}

        {!isDirectLogin && step === 4 && (
          <div className="space-y-6">
            <h3 className="text-headline-md font-headline-md mb-4">Task Preferences</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer p-3 border border-white/10 rounded-md hover:border-[#FF4D00]/50 transition-colors bg-[#0A0A0A]">
                <input type="checkbox" className="accent-[#FF4D00] w-4 h-4" checked={profile.prefer_high_gbp} onChange={e => update('prefer_high_gbp', e.target.checked)} />
                <span className="text-label-md">Prioritize High GBP Yield (≥300)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-3 border border-white/10 rounded-md hover:border-[#FF4D00]/50 transition-colors bg-[#0A0A0A]">
                <input type="checkbox" className="accent-[#FF4D00] w-4 h-4" checked={profile.prefer_low_time} onChange={e => update('prefer_low_time', e.target.checked)} />
                <span className="text-label-md">Prioritize Quick Wins (≤5h)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-3 border border-white/10 rounded-md hover:border-[#FF4D00]/50 transition-colors bg-[#0A0A0A]">
                <input type="checkbox" className="accent-[#FF4D00] w-4 h-4" checked={profile.prefer_new_tasks} onChange={e => update('prefer_new_tasks', e.target.checked)} />
                <span className="text-label-md">Hide previously completed tasks</span>
              </label>
            </div>
            <div className="flex justify-between pt-4">
              <button className="text-on-surface-variant hover:text-white uppercase text-xs transition-colors" onClick={() => setStep(3)}>Back</button>
              <button className="px-6 py-2 bg-[#FF4D00] text-white rounded-md hover:bg-[#e64500] hover:shadow-[0_0_15px_rgba(255,77,0,0.4)] transition-all flex items-center" onClick={handleComplete}><Check size={16} className="mr-1"/> Initialize Dashboard</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingWizard;
