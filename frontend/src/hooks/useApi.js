import { useCallback } from 'react';
import { useSession } from './useSession';

export const useApi = () => {
  const { token } = useSession();

  const apiCall = useCallback(async (endpoint, method = 'GET', body = null) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${endpoint}`,
      {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        ...(body && { body: JSON.stringify(body) })
      }
    );
    
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Something went wrong. Please retry.');
    }
    
    return res.json();
  }, [token]);

  return { apiCall };
};
