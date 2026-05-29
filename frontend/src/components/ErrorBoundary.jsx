import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-void text-ember p-8 font-mono">
          <h1 className="text-3xl text-danger mb-4">SYSTEM FAILURE: FATAL RENDER EXCEPTION</h1>
          <p className="mb-4">Adishila Core encountered an unhandled exception during rendering.</p>
          <div className="bg-base p-4 rounded border border-danger overflow-auto max-h-96 text-sm text-text-hot">
            <h2 className="text-danger font-bold">Error:</h2>
            <pre className="mb-4 whitespace-pre-wrap">{this.state.error?.toString()}</pre>
            <h2 className="text-danger font-bold">Component Stack:</h2>
            <pre className="whitespace-pre-wrap">{this.state.errorInfo?.componentStack}</pre>
          </div>
          <button 
            className="mt-6 bg-danger text-void px-4 py-2 rounded hover:opacity-80 transition-opacity"
            onClick={() => window.location.reload()}
          >
            REBOOT SYSTEM
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
