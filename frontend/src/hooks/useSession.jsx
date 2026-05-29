import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { storage } from '../lib/storage';

const SessionContext = createContext(null);

export const SessionProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const initSession = useCallback(async (name, teamId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, team_id: teamId })
      });
      if (!res.ok) throw new Error('Failed to initialize session');
      const data = await res.json();
      setToken(data.token);
    } catch (err) {
      console.error("Session init failed", err);
    }
  }, []);

  useEffect(() => {
    const profile = storage.get('taskpilot_profile');
    if (profile?.name && profile?.team_id) {
      initSession(profile.name, profile.team_id);
    }
  }, [initSession]);

  return (
    <SessionContext.Provider value={{ token, initSession, setToken }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
