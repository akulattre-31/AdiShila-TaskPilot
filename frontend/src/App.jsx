import React, { useEffect, useState } from 'react';
import { SessionProvider, useSession } from './hooks/useSession';
import OnboardingWizard from './components/onboarding/OnboardingWizard';
import AppShell from './components/layout/AppShell';
import { storage } from './lib/storage';
import ErrorBoundary from './components/ErrorBoundary';

const AppContent = () => {
  const { token } = useSession();
  const [needsOnboarding, setNeedsOnboarding] = useState(true);

  useEffect(() => {
    const onboarded = storage.get('taskpilot_onboarded');
    if (onboarded && token) {
      setNeedsOnboarding(false);
    }
  }, [token]);

  if (!token || needsOnboarding) {
    return <OnboardingWizard onComplete={() => setNeedsOnboarding(false)} />;
  }

  return <AppShell />;
};

function App() {
  return (
    <ErrorBoundary>
      <SessionProvider>
        <AppContent />
      </SessionProvider>
    </ErrorBoundary>
  );
}

export default App;
