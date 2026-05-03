import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock Firebase
vi.mock('../../../lib/firebase', () => ({
  auth: { onAuthStateChanged: vi.fn((cb) => { cb(null); return vi.fn(); }) },
  db: {},
  googleProvider: {},
}));
vi.mock('firebase/auth', () => ({
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn((auth, cb) => { cb(null); return vi.fn(); }),
  GoogleAuthProvider: vi.fn(),
  getAuth: vi.fn(),
}));

import JourneyMap from '../JourneyMap';
import { AuthProvider } from '../../../contexts/AuthContext';
import { ThemeProvider } from '../../../contexts/ThemeContext';

function renderJourneyMap() {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <JourneyMap />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

describe('JourneyMap', () => {
  it('renders all four milestone nodes', () => {
    renderJourneyMap();
    expect(screen.getByText('Voter Registration')).toBeInTheDocument();
    expect(screen.getByText('Notification & Nominations')).toBeInTheDocument();
    expect(screen.getByText('General Election (Polling)')).toBeInTheDocument();
    expect(screen.getByText('Counting & Results')).toBeInTheDocument();
  });

  it('has proper ARIA tablist structure', () => {
    renderJourneyMap();
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(4);
  });

  it('opens dashboard when milestone is clicked', () => {
    renderJourneyMap();
    const registrationTab = screen.getByText('Voter Registration').closest('[role="tab"]');
    fireEvent.click(registrationTab);
    expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    expect(screen.getByText(/Voter registration is the essential first step/i)).toBeInTheDocument();
  });

  it('sets aria-selected on active tab', () => {
    renderJourneyMap();
    const tabs = screen.getAllByRole('tab');
    fireEvent.click(tabs[0]);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
  });

  it('toggles dashboard closed on second click of same tab', () => {
    renderJourneyMap();
    const tab = screen.getAllByRole('tab')[0];
    fireEvent.click(tab);
    expect(screen.queryByRole('tabpanel')).toBeInTheDocument();
    fireEvent.click(tab);
    expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument();
  });

  it('switches dashboard when a different tab is clicked', () => {
    renderJourneyMap();
    const tabs = screen.getAllByRole('tab');
    fireEvent.click(tabs[0]);
    expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    fireEvent.click(tabs[1]);
    // Panel should still be open but for a different milestone
    expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'false');
  });

  it('supports ArrowRight keyboard navigation', () => {
    renderJourneyMap();
    const tablist = screen.getByRole('tablist');
    const tabs = screen.getAllByRole('tab');
    // Click tab 0 to make it the "current"
    fireEvent.click(tabs[0]);
    // Fire ArrowRight on the tablist container
    fireEvent.keyDown(tablist, { key: 'ArrowRight' });
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('supports Home key to jump to first tab', () => {
    renderJourneyMap();
    const tablist = screen.getByRole('tablist');
    const tabs = screen.getAllByRole('tab');
    fireEvent.click(tabs[2]);
    fireEvent.keyDown(tablist, { key: 'Home' });
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('supports End key to jump to last tab', () => {
    renderJourneyMap();
    const tablist = screen.getByRole('tablist');
    const tabs = screen.getAllByRole('tab');
    fireEvent.click(tabs[0]);
    fireEvent.keyDown(tablist, { key: 'End' });
    expect(tabs[tabs.length - 1]).toHaveAttribute('aria-selected', 'true');
  });

  it('each tab has aria-controls pointing to a panel id', () => {
    renderJourneyMap();
    const tabs = screen.getAllByRole('tab');
    tabs.forEach((tab) => {
      expect(tab).toHaveAttribute('aria-controls');
    });
  });
});
