/**
 * useKeyboardNavigation — Arrow key navigation for timeline and focus trap for modals.
 */
import { useCallback } from 'react';

/**
 * Handles arrow key navigation within a set of items (roving tabindex pattern).
 * @param {Array} items - Array of item IDs
 * @param {string} currentId - Currently focused item ID
 * @param {Function} onSelect - Callback when item is selected
 * @returns {Function} keyDown handler
 */
export function useKeyboardNavigation(items, currentId, onSelect) {
  const handleKeyDown = useCallback((e) => {
    const idx = items.indexOf(currentId);
    let newIdx = idx;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        newIdx = (idx + 1) % items.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        newIdx = (idx - 1 + items.length) % items.length;
        break;
      case 'Home':
        e.preventDefault();
        newIdx = 0;
        break;
      case 'End':
        e.preventDefault();
        newIdx = items.length - 1;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onSelect(items[idx]);
        return;
      default:
        return;
    }

    onSelect(items[newIdx]);
    // Focus the new element
    const el = document.querySelector(`[data-milestone-id="${items[newIdx]}"]`);
    el?.focus();
  }, [items, currentId, onSelect]);

  return handleKeyDown;
}

/**
 * Traps focus within a container element (for modals).
 * @param {HTMLElement} container - The container to trap focus within
 */
export function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];

  function handler(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  container.addEventListener('keydown', handler);
  first?.focus();

  return () => container.removeEventListener('keydown', handler);
}
