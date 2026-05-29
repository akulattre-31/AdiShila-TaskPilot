import React, { useState } from 'react';
import FloatingDock from './FloatingDock';
import Dashboard from '../panels/Dashboard';
import TaskExplorer from '../panels/TaskExplorer';
import Chatbot from './Chatbot';

const AppShell = () => {
  const [view, setView] = useState('dashboard');

  return (
    <div className="font-body text-text-warm antialiased min-h-screen flex w-full bg-void overflow-hidden relative">
      {/* Background ambient glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <FloatingDock currentView={view} setView={setView} />
      
      <main className="flex-1 w-full min-h-screen relative max-h-screen overflow-y-auto">
        <div className="pt-28 pb-12 px-4 md:px-12 max-w-[1600px] mx-auto min-h-full">
          {view === 'dashboard' && <Dashboard />}
          {view === 'explorer' && <TaskExplorer />}
          {view !== 'dashboard' && view !== 'explorer' && (
            <div className="h-full flex items-center justify-center text-text-dim">
              <p>Module '{view}' is currently offline or in development.</p>
            </div>
          )}
        </div>
      </main>
      
      <Chatbot />
    </div>
  );
};

export default AppShell;
