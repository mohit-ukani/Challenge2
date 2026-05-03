import { useState, useCallback, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SignInButton from '../auth/SignInButton';
import { useTheme } from '../../contexts/ThemeContext';

const NAV_ITEMS = [
  { path: '/', label: 'Home' },
  { path: '/journey', label: 'Journey Map' },
  { path: '/finder', label: 'Polling Finder' },
  { path: '/checklist', label: 'Checklist' },
];

const THEME_ICONS = { light: '☀️', dark: '🌙', 'high-contrast': '🔲' };
const THEME_LABELS = { light: 'Light', dark: 'Dark', 'high-contrast': 'High Contrast' };

/**
 * Header — App navigation bar with theme toggle, auth button, and responsive mobile menu.
 *
 * Accessibility:
 * - `role="banner"` landmark
 * - `aria-current="page"` on active nav link
 * - Mobile menu button with `aria-expanded` and `aria-controls`
 * - Theme toggle button with descriptive aria-label
 *
 * Responsive behaviour is handled via the CSS class `header--menu-open` and
 * a media-query stylesheet in `src/styles/` (no runtime DOM injection).
 *
 * @returns {JSX.Element}
 */
function Header() {
  const { theme, cycleTheme } = useTheme();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = useCallback(() => setMenuOpen((prev) => !prev), []);
  const handleMenuClose = useCallback(() => setMenuOpen(false), []);

  return (
    <header className={`header ${menuOpen ? 'header--menu-open' : ''}`} role="banner">
      <div
        className="container"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}
      >
        {/* Logo */}
        <Link to="/" className="header__logo" aria-label="The Voter's Journey — Home">
          <span aria-hidden="true" style={{ fontSize: '1.5rem' }}>🗳️</span>
          <span style={{ fontWeight: 800, fontSize: '1.125rem' }}>The Voter's Journey</span>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Main navigation" className="header__nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="header__nav-link"
              style={{
                color:
                  location.pathname === item.path
                    ? 'var(--color-primary)'
                    : 'var(--text-secondary)',
                fontWeight: location.pathname === item.path ? 600 : 500,
              }}
              aria-current={location.pathname === item.path ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Theme Toggle */}
          <button
            className="btn btn-icon btn-ghost"
            onClick={cycleTheme}
            aria-label={`Switch theme. Current theme: ${THEME_LABELS[theme] || theme}`}
            title={`Theme: ${THEME_LABELS[theme] || theme}`}
          >
            {THEME_ICONS[theme]}
          </button>

          <SignInButton />

          {/* Mobile Menu Toggle */}
          <button
            className="btn btn-icon btn-ghost header__hamburger"
            onClick={handleMenuToggle}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav
        id="mobile-nav"
        aria-label="Mobile navigation"
        className="header__mobile-nav"
        hidden={!menuOpen}
      >
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={handleMenuClose}
            className="header__mobile-link"
            style={{
              color:
                location.pathname === item.path
                  ? 'var(--color-primary)'
                  : 'var(--text-secondary)',
            }}
            aria-current={location.pathname === item.path ? 'page' : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

Header.displayName = 'Header';
export default memo(Header);
