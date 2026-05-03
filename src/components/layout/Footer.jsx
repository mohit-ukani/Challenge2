import { memo } from 'react';

/**
 * Footer — App footer with accessibility statement and non-partisan disclaimer.
 *
 * References the Election Commission of India (ECI) as the authoritative source
 * for official election information. Includes a "back to top" skip mechanism.
 *
 * @returns {JSX.Element}
 */
function Footer() {
  return (
    <footer role="contentinfo" style={footerStyle}>
      <div className="container" style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
          <strong>The Voter's Journey</strong> — An educational, non-partisan guide to the Indian election process.
        </p>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-2)' }}>
          This application is for informational purposes only. Always verify official election information
          with the Election Commission of India at{' '}
          <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer">eci.gov.in</a>.
        </p>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
          Built with accessibility in mind (WCAG 2.1 AA) • Keyboard navigable • Screen reader compatible •{' '}
          <button
            onClick={() => document.getElementById('main-content')?.focus()}
            style={{ background: 'none', border: 'none', color: 'var(--text-link)', cursor: 'pointer', fontSize: 'inherit', fontFamily: 'inherit', textDecoration: 'underline' }}
            aria-label="Return to main content"
          >
            Back to top
          </button>
        </p>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 'var(--space-3)' }}>
          © {new Date().getFullYear()} The Voter's Journey. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

Footer.displayName = 'Footer';
export default memo(Footer);

const footerStyle = {
  padding: 'var(--space-8) 0',
  borderTop: '1px solid var(--border-color)',
  background: 'var(--bg-secondary)',
  marginTop: 'auto',
};
