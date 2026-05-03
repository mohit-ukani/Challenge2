/**
 * Firebase mock for testing.
 * Replaces Firebase SDK with controllable test doubles.
 */
import { vi } from 'vitest';

export const mockUser = {
  uid: 'test-user-123',
  displayName: 'Test User',
  email: 'test@example.com',
  photoURL: 'https://example.com/photo.jpg',
};

// Mock auth
export const mockAuth = {
  currentUser: null,
  onAuthStateChanged: vi.fn((callback) => {
    callback(mockAuth.currentUser);
    return vi.fn(); // unsubscribe
  }),
  signInWithPopup: vi.fn(() => Promise.resolve({ user: mockUser })),
  signOut: vi.fn(() => Promise.resolve()),
};

// Mock Firestore
export const mockDoc = vi.fn();
export const mockGetDoc = vi.fn(() => Promise.resolve({ exists: () => false, data: () => ({}) }));
export const mockSetDoc = vi.fn(() => Promise.resolve());

// Setup module mock
vi.mock('../../lib/firebase', () => ({
  auth: mockAuth,
  db: {},
  googleProvider: {},
}));

vi.mock('firebase/auth', () => ({
  signInWithPopup: (...args) => mockAuth.signInWithPopup(...args),
  signOut: (...args) => mockAuth.signOut(...args),
  onAuthStateChanged: (...args) => mockAuth.onAuthStateChanged(...args),
  GoogleAuthProvider: vi.fn(),
  getAuth: vi.fn(() => mockAuth),
}));

vi.mock('firebase/firestore', () => ({
  doc: (...args) => mockDoc(...args),
  getDoc: (...args) => mockGetDoc(...args),
  setDoc: (...args) => mockSetDoc(...args),
  getFirestore: vi.fn(),
  collection: vi.fn(),
}));
