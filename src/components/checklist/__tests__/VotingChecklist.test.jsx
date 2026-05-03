import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock Firebase before component imports
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
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(() => Promise.resolve({ exists: () => false, data: () => ({}) })),
  setDoc: vi.fn(() => Promise.resolve()),
  getFirestore: vi.fn(),
  collection: vi.fn(),
}));

import VotingChecklist from '../VotingChecklist';
import { AuthProvider } from '../../../contexts/AuthContext';
import { ThemeProvider } from '../../../contexts/ThemeContext';

function renderChecklist() {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <VotingChecklist />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

describe('VotingChecklist', () => {
  it('renders all checklist steps', async () => {
    renderChecklist();
    expect(await screen.findByText('Check Your Name on Electoral Roll')).toBeInTheDocument();
    expect(screen.getByText(/Home Voting Eligibility/i)).toBeInTheDocument();
    expect(screen.getByText('Know Your Candidates')).toBeInTheDocument();
    expect(screen.getByText('Find Your Polling Booth')).toBeInTheDocument();
    expect(screen.getByText('Cast Your Vote!')).toBeInTheDocument();
  });

  it('shows progress bar at 0% initially', async () => {
    renderChecklist();
    const progressBar = await screen.findByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });

  it('has proper list role with accessible label', async () => {
    renderChecklist();
    expect(await screen.findByRole('list', { name: /voting steps/i })).toBeInTheDocument();
  });

  it('shows sign-in prompt for anonymous users', async () => {
    renderChecklist();
    expect(await screen.findByText(/sign in to save/i)).toBeInTheDocument();
  });

  it('expands a checklist item on click', async () => {
    renderChecklist();
    const buttons = await screen.findAllByRole('button');
    // First item header button
    const firstHeader = buttons.find((b) => b.getAttribute('aria-expanded') === 'false');
    expect(firstHeader).toBeTruthy();
    fireEvent.click(firstHeader);
    expect(firstHeader).toHaveAttribute('aria-expanded', 'true');
  });

  it('collapses an already-expanded item on second click', async () => {
    renderChecklist();
    const buttons = await screen.findAllByRole('button');
    const firstHeader = buttons.find((b) => b.getAttribute('aria-expanded') === 'false');
    fireEvent.click(firstHeader);
    expect(firstHeader).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(firstHeader);
    expect(firstHeader).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggles a checkbox item via keyboard (Space key)', async () => {
    renderChecklist();
    const checkboxes = await screen.findAllByRole('checkbox');
    const first = checkboxes[0];
    expect(first).toHaveAttribute('aria-checked', 'false');
    fireEvent.keyDown(first, { key: ' ', code: 'Space' });
    expect(first).toHaveAttribute('aria-checked', 'true');
  });

  it('progress bar has an accessible label', async () => {
    renderChecklist();
    const bar = await screen.findByRole('progressbar');
    expect(bar).toHaveAttribute('aria-label');
  });
});
