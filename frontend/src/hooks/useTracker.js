import { useCallback } from 'react';
import { useApi } from './useApi';

export const useTracker = () => {
  const { apiCall } = useApi();

  const trackAction = useCallback((actionType, details = {}) => {
    apiCall('/api/track', 'POST', {
      action: actionType,
      details,
      timestamp: new Date().toISOString()
    }).catch(err => {
      // Silently fail tracking if network issues occur so it doesn't break UX
      console.warn('Action tracking failed:', err);
    });
  }, [apiCall]);

  return { trackAction };
};
