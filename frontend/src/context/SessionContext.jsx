import React, { createContext, useState, useEffect } from 'react';
import { storage } from '../lib/storage';

export const SessionContext = createContext(null);

export const SessionProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const initSession = async (name, teamId) => {
    try {
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, team_id: teamId })
      };
      
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/session`, options);
      if (!res.ok) throw new Error('Session creation failed');
      const data = await res.json();
      setToken(data.token);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const profile = storage.get('taskpilot_profile');
    if (profile) initSession(profile.name, profile.teamId);
  }, []);

  return (
    <SessionContext.Provider value={{ token, initSession }}>
      {children}
    </SessionContext.Provider>
  );
};
