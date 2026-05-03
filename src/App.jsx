import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './components/ui/Toast';
import ErrorBoundary from './components/ui/ErrorBoundary';
import SkipLink from './components/ui/SkipLink';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ChatAssistant from './components/chat/ChatAssistant';

// Code-split page components — each page is loaded only when navigated to,
// reducing initial bundle size and improving load performance (Efficiency).
const LandingPage = lazy(() => import('./pages/LandingPage'));
const JourneyPage = lazy(() => import('./pages/JourneyPage'));
const FinderPage = lazy(() => import('./pages/FinderPage'));
const ChecklistPage = lazy(() => import('./pages/ChecklistPage'));

/**
 * PageLoader — Accessible loading skeleton shown during lazy page load.
 */
function PageLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 40,
          height: 40,
          border: '3px solid var(--border-color, #e2e8f0)',
          borderTop: '3px solid var(--color-primary, #2563eb)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <span style={{ color: 'var(--text-secondary, #64748b)', fontSize: '0.875rem' }}>
        Loading…
      </span>
    </div>
  );
}

/**
 * App — Root component with routing, auth, theme, and error boundary providers.
 *
 * Architecture:
 * - ErrorBoundary: catches render-time errors, shows recovery UI
 * - ThemeProvider: light/dark/high-contrast theme with localStorage persistence
 * - AuthProvider: Firebase Google Auth state
 * - ToastProvider: global notification system
 * - Lazy routes: code-split pages for better initial load performance
 */
export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <div className="app" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <SkipLink />
                <Header />
                <main id="main-content" tabIndex={-1} style={{ flex: 1 }} role="main">
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/journey" element={<JourneyPage />} />
                      <Route path="/finder" element={<FinderPage />} />
                      <Route path="/checklist" element={<ChecklistPage />} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
                <ChatAssistant />
              </div>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
