import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Briefcase, ChevronRight, Check } from 'lucide-react';

const ALLOWED_SKILLS = [
  "Python", "JavaScript", "React", "FastAPI", "Data Analysis",
  "Prompt Engineering", "AI/ML", "Cybersecurity", "Market Research",
  "Content Writing", "Video Editing", "Graphic Design",
  "Business Strategy", "Financial Modelling", "Public Speaking"
];

const ALLOWED_EXPERIENCE = ["Beginner", "Intermediate", "Advanced"];

export function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    name: '',
    teamId: '',
    cohort: 'I',
    track: 'Tech',
    skills: [],
    hoursPerWeek: 10,
    experience: 'Beginner',
    preferHighGbp: true,
    preferLowTime: false,
    preferNewTasks: true
  });

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
    else onComplete(profile);
  };

  const toggleSkill = (skill) => {
    setProfile(p => ({
      ...p,
      skills: p.skills.includes(skill)
        ? p.skills.filter(s => s !== skill)
        : [...p.skills, skill]
    }));
  };

  return (
    <div className="heavy-clay-card" style={{ maxWidth: '600px', width: '100%', margin: '0 auto', padding: '3rem' }}>
      {/* Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: step >= 1 ? 'var(--gold-primary)' : 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: step >= 1 ? '#000' : 'var(--text-secondary)', transition: 'all 0.3s' }}>
            {step > 1 ? <Check size={20} /> : 1}
          </div>
          <span className="label" style={{ color: step >= 1 ? 'var(--gold-primary)' : 'var(--text-dim)', transition: 'color 0.3s' }}>Identity</span>
        </div>
        <div className="stepper-line" style={{ margin: '0 16px', top: '-12px' }}>
          <div className="stepper-line-fill" style={{ width: step > 1 ? '100%' : '0%' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: step >= 2 ? 'var(--gold-primary)' : 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: step >= 2 ? '#000' : 'var(--text-secondary)', transition: 'all 0.3s' }}>
            2
          </div>
          <span className="label" style={{ color: step >= 2 ? 'var(--gold-primary)' : 'var(--text-dim)', transition: 'color 0.3s' }}>Skills</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <h1 style={{ marginBottom: '0.5rem', fontSize: '2.5rem' }}>Welcome to TaskPilot</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>Let's configure your executive profile.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label className="label" style={{ display: 'block', marginBottom: '8px' }}>Full Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={profile.name} 
                  onChange={e => setProfile({...profile, name: e.target.value})} 
                  placeholder="e.g. Alexander Pierce"
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: '8px' }}>Team ID</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={profile.teamId} 
                    onChange={e => setProfile({...profile, teamId: e.target.value})} 
                    placeholder="4-digit PIN"
                  />
                </div>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: '8px' }}>Cohort</label>
                  <select 
                    className="input-field" 
                    value={profile.cohort} 
                    onChange={e => setProfile({...profile, cohort: e.target.value})}
                  >
                    <option value="I">Cohort I</option>
                    <option value="II">Cohort II</option>
                    <option value="III">Cohort III</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label" style={{ display: 'block', marginBottom: '8px' }}>Professional Track</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {['Tech', 'Business', 'Both'].map(t => (
                    <div 
                      key={t}
                      onClick={() => setProfile({...profile, track: t})}
                      className={`chip ${profile.track === t ? 'active' : ''}`}
                    >
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <h1 style={{ marginBottom: '0.5rem', fontSize: '2.5rem' }}>Your Expertise</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>Select your core skills and set availability to calibrate recommendations.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <label className="label" style={{ display: 'block', marginBottom: '12px' }}>Core Skills Stack</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {ALLOWED_SKILLS.map(s => (
                    <div 
                      key={s}
                      onClick={() => toggleSkill(s)}
                      className={`chip ${profile.skills.includes(s) ? 'active' : ''}`}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label className="label">Availability</label>
                  <div style={{ color: 'var(--text-primary)' }}><span className="number-value" style={{ fontSize: '1.2rem' }}>{profile.hoursPerWeek}</span> hrs/wk</div>
                </div>
                <input 
                  type="range" 
                  min="2" max="40" 
                  value={profile.hoursPerWeek}
                  onChange={e => setProfile({...profile, hoursPerWeek: parseInt(e.target.value)})}
                  style={{ width: '100%', accentColor: 'var(--gold-primary)', height: '4px', background: 'var(--bg-elevated)', borderRadius: '2px', appearance: 'none' }}
                />
              </div>

              <div>
                <label className="label" style={{ display: 'block', marginBottom: '8px' }}>Experience Tier</label>
                <select 
                  className="input-field"
                  value={profile.experience}
                  onChange={e => setProfile({...profile, experience: e.target.value})}
                >
                  {ALLOWED_EXPERIENCE.map(exp => <option key={exp} value={exp}>{exp}</option>)}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ marginTop: '3rem', display: 'flex', justifyContent: step > 1 ? 'space-between' : 'flex-end' }}>
        {step > 1 && (
          <button className="btn-ghost" onClick={() => setStep(step - 1)}>
            Back
          </button>
        )}
        <button 
          className="btn-primary" 
          onClick={handleNext}
          disabled={step === 1 && (!profile.name || !profile.teamId || profile.teamId.length !== 4)}
        >
          {step === 2 ? 'Complete Setup' : 'Proceed'} <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
