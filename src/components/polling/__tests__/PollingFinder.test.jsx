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

// Mock ALL exports from @vis.gl/react-google-maps including hooks
vi.mock('@vis.gl/react-google-maps', () => ({
  APIProvider: ({ children }) => <div>{children}</div>,
  Map: ({ children }) => <div data-testid="map">{children}</div>,
  AdvancedMarker: ({ children }) => <div>{children}</div>,
  Pin: () => <div />,
  useMap: vi.fn(() => null),
  useMapsLibrary: vi.fn(() => null),
}));

import PollingFinder from '../PollingFinder';
import { AuthProvider } from '../../../contexts/AuthContext';
import { ThemeProvider } from '../../../contexts/ThemeContext';

function renderPollingFinder() {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <PollingFinder />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

describe('PollingFinder', () => {
  it('renders search form with correct input placeholder', () => {
    renderPollingFinder();
    expect(screen.getByPlaceholderText(/PIN code/i)).toBeInTheDocument();
  });

  it('renders the empty state prompt initially', () => {
    renderPollingFinder();
    expect(screen.getAllByText(/Enter your PIN code to find/i)[0]).toBeInTheDocument();
  });

  it('has a search form with role="search"', () => {
    renderPollingFinder();
    expect(screen.getByRole('search')).toBeInTheDocument();
  });

  it('has a labelled search button', () => {
    renderPollingFinder();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('validates invalid short PIN code', () => {
    renderPollingFinder();
    const input = screen.getByPlaceholderText(/PIN code/i);
    const searchBtn = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: '123' } });
    fireEvent.click(searchBtn);

    expect(screen.getByText(/valid 6-digit/i)).toBeInTheDocument();
  });

  it('validates 5-digit PIN (too short for India)', () => {
    renderPollingFinder();
    const input = screen.getByPlaceholderText(/PIN code/i);
    const searchBtn = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: '12345' } });
    fireEvent.click(searchBtn);

    expect(screen.getByText(/valid 6-digit/i)).toBeInTheDocument();
  });

  it('prevents non-numeric characters in PIN input', () => {
    renderPollingFinder();
    const input = screen.getByPlaceholderText(/PIN code/i);
    fireEvent.change(input, { target: { value: 'abcdef' } });
    expect(input.value).toBe('');
  });

  it('limits input to 6 characters', () => {
    renderPollingFinder();
    const input = screen.getByPlaceholderText(/PIN code/i);
    fireEvent.change(input, { target: { value: '1234567890' } });
    expect(input.value).toBe('123456');
  });

  it('clears error when user starts typing again', () => {
    renderPollingFinder();
    const input = screen.getByPlaceholderText(/PIN code/i);
    const searchBtn = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: '123' } });
    fireEvent.click(searchBtn);
    expect(screen.getByText(/valid 6-digit/i)).toBeInTheDocument();

    fireEvent.change(input, { target: { value: '1234' } });
    expect(screen.queryByText(/valid 6-digit/i)).not.toBeInTheDocument();
  });

  it('renders within a section with a descriptive label', () => {
    renderPollingFinder();
    expect(screen.getByRole('region', { name: /polling place finder/i })).toBeInTheDocument();
  });

  it('has an aria-live results region', () => {
    renderPollingFinder();
    const liveRegion = document.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeTruthy();
  });
});
