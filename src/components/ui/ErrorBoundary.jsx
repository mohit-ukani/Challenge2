/**
 * ErrorBoundary — React class component that catches rendering errors gracefully.
 *
 * Wraps the application to prevent blank screens on unhandled JS errors.
 * Shows a friendly recovery UI with a retry option.
 * In development, logs full error details; in production, suppresses internals.
 */
import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorId: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Only log full stack traces in development
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary] Caught error:', error, info.componentStack);
    }
    // Generate a short error reference ID for support
    this.setState({ errorId: Date.now().toString(36).toUpperCase() });
  }

  handleReset = () => {
    this.setState({ hasError: false, errorId: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            padding: '2rem',
            textAlign: 'center',
            fontFamily: 'var(--font-sans, system-ui, sans-serif)',
          }}
        >
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }} aria-hidden="true">
            ⚠️
          </p>
          <h2 style={{ marginBottom: '0.5rem', color: 'var(--text-primary, #111)' }}>
            Something went wrong
          </h2>
          <p style={{ color: 'var(--text-secondary, #555)', maxWidth: 480, marginBottom: '1.5rem' }}>
            An unexpected error occurred. Your data is safe — please try reloading the page.
          </p>
          {this.state.errorId && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary, #888)', marginBottom: '1.5rem' }}>
              Error reference: <code>{this.state.errorId}</code>
            </p>
          )}
          <button
            onClick={this.handleReset}
            style={{
              padding: '0.625rem 1.5rem',
              background: 'var(--color-primary, #2563eb)',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
