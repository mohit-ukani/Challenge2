/**
 * useChecklist — Manages voting checklist state with Firestore + localStorage sync.
 *
 * - Authenticated users: progress is persisted to Firestore (cloud sync).
 * - Anonymous users: progress is persisted to localStorage.
 * - Security: item IDs are validated against a whitelist before any write.
 * - Resilience: Firestore failures fall back to localStorage silently.
 */
import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { CHECKLIST_ITEMS } from '../data/electionData';
import { isValidChecklistItemId } from '../lib/validators';

const LOCAL_KEY = 'voters-journey-checklist';

/**
 * Safely parses a JSON string from localStorage.
 * Returns an empty object on failure instead of throwing.
 * @param {string|null} raw - Raw JSON string
 * @returns {Object}
 */
function safeParse(raw) {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    // Ensure the result is a plain object (prevent prototype pollution)
    if (typeof parsed !== 'object' || Array.isArray(parsed) || parsed === null) return {};
    return parsed;
  } catch {
    return {};
  }
}

/**
 * @typedef {Object} ChecklistState
 * @property {Object.<string, boolean>} completed - Map of item ID → completed status
 * @property {Function} toggleItem - Toggle completion for an item ID
 * @property {number} progress - Completion percentage (0–100)
 * @property {boolean} loading - Whether initial data is being fetched
 * @property {Array} items - The ordered list of checklist item definitions
 */

/**
 * @returns {ChecklistState}
 */
export function useChecklist() {
  const { user } = useAuth();
  const [completed, setCompleted] = useState({});
  const [loading, setLoading] = useState(true);

  // Load checklist state on mount or when auth state changes
  useEffect(() => {
    let cancelled = false;

    async function loadChecklist() {
      setLoading(true);
      try {
        if (user) {
          const docRef = doc(db, 'users', user.uid, 'checklist', 'progress');
          const docSnap = await getDoc(docRef);
          if (!cancelled && docSnap.exists()) {
            setCompleted(docSnap.data().completed || {});
          }
        } else {
          const stored = localStorage.getItem(LOCAL_KEY);
          if (!cancelled) setCompleted(safeParse(stored));
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('Error loading checklist:', err);
        }
        // Graceful fallback to localStorage on any error
        const stored = localStorage.getItem(LOCAL_KEY);
        if (!cancelled) setCompleted(safeParse(stored));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadChecklist();
    return () => { cancelled = true; };
  }, [user]);

  /**
   * Toggle a checklist item's completion state.
   * Validates the item ID against the whitelist before persisting.
   * @param {string} itemId
   */
  const toggleItem = useCallback(
    async (itemId) => {
      // Security: only allow toggling known item IDs
      if (!isValidChecklistItemId(itemId)) {
        if (import.meta.env.DEV) {
          console.warn(`Blocked toggle for unknown checklist item ID: "${itemId}"`);
        }
        return;
      }

      setCompleted((prev) => {
        const next = { ...prev, [itemId]: !prev[itemId] };

        // Always persist to localStorage as the source of truth for anonymous users
        localStorage.setItem(LOCAL_KEY, JSON.stringify(next));

        // Additionally sync to Firestore for authenticated users
        if (user) {
          const docRef = doc(db, 'users', user.uid, 'checklist', 'progress');
          setDoc(docRef, { completed: next }, { merge: true }).catch((err) => {
            if (import.meta.env.DEV) console.error('Firestore sync error:', err);
          });
        }

        return next;
      });
    },
    [user]
  );

  const progress =
    CHECKLIST_ITEMS.length > 0
      ? Math.round(
          (Object.values(completed).filter(Boolean).length / CHECKLIST_ITEMS.length) * 100
        )
      : 0;

  return { completed, toggleItem, progress, loading, items: CHECKLIST_ITEMS };
}
