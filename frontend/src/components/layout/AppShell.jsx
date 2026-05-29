import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from '../panels/Dashboard';
import TaskExplorer from '../panels/TaskExplorer';
import Chatbot from './Chatbot';

const AppShell = () => {
  const [view, setView] = useState('dashboard');

  return (
    <div className="font-body text-text-warm antialiased min-h-screen flex w-full bg-void overflow-hidden">
      <Sidebar currentView={view} setView={setView} />
      
      <main className="flex-1 ml-0 md:ml-72 flex flex-col min-h-screen relative max-h-screen overflow-y-auto bg-base">
        <Header />
        
        <div className="p-gutter md:p-8 flex-1 space-y-16 relative">
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
