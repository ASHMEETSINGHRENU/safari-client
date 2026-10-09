import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface State {
  error: Error | null;
}

// Last line of defence: a thrown render error would otherwise white-screen the whole
// app. Keep it dependency-free and non-styled-by-design so it renders even if the
// rest of the bundle is broken.
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4 bg-white border border-forest/15 rounded-3xl shadow-xl p-10">
          <AlertTriangle className="w-10 h-10 text-earth mx-auto" />
          <h1 className="font-serif text-2xl font-bold text-forest">Something went wrong</h1>
          <p className="text-xs text-forest/70">
            A part of the page failed to load. Reloading usually fixes it — if it keeps happening,
            reach us at concierge@shutterandstripes.com.
          </p>
          <button
            onClick={() => window.location.assign('/')}
            className="px-6 py-3 bg-forest text-sand rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-forest/90 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }
}
