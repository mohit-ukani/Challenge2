import { useState, useCallback, memo } from 'react';
import ChecklistItem from './ChecklistItem';
import { useChecklist } from '../../hooks/useChecklist';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/checklist.css';

/**
 * VotingChecklist — Personalized step-by-step voting checklist with progress tracking.
 *
 * Features:
 * - Syncs with Firestore for signed-in users, localStorage for anonymous
 * - Accordion-style expandable items with full keyboard support
 * - ARIA progressbar with live progress updates
 * - Celebratory completion state at 100%
 *
 * @returns {JSX.Element}
 */
function VotingChecklist() {
  const { completed, toggleItem, progress, loading, items } = useChecklist();
  const { user } = useAuth();
  const [expandedId, setExpandedId] = useState(null);

  const handleToggleExpand = useCallback((id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  if (loading) {
    return (
      <section className="checklist" aria-busy="true" aria-label="Loading voting checklist">
        <div className="container">
          <div className="skeleton skeleton-heading" style={{ margin: '0 auto' }} />
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: 80, marginBottom: 12 }} />
          ))}
          <span className="sr-only">Loading your checklist…</span>
        </div>
      </section>
    );
  }

  return (
    <section className="checklist" aria-label="Personalized Voting Checklist">
      <div className="container">
        <div className="checklist__header">
          <h2>Your Voting Checklist</h2>
          <p>Complete each step to be fully prepared for Election Day</p>
          {!user && (
            <p
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-warning)',
                marginTop: 'var(--space-2)',
              }}
            >
              💡 Sign in to save your progress across devices
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="checklist__progress">
          <div className="checklist__progress-label">
            <span>Progress</span>
            <span className="checklist__progress-pct" aria-hidden="true">
              {progress}%
            </span>
          </div>
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Checklist completion: ${progress}%`}
          >
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Checklist Items */}
        <div className="checklist__items" role="list" aria-label="Voting steps">
          {items.map((item) => (
            <ChecklistItem
              key={item.id}
              item={item}
              isCompleted={!!completed[item.id]}
              isExpanded={expandedId === item.id}
              onToggleComplete={() => toggleItem(item.id)}
              onToggleExpand={() => handleToggleExpand(item.id)}
            />
          ))}
        </div>

        {/* Completion Celebration */}
        {progress === 100 && (
          <div
            style={{ textAlign: 'center', marginTop: 'var(--space-8)', animation: 'scaleIn 500ms ease-out' }}
            role="status"
            aria-live="polite"
          >
            <p style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)' }} aria-hidden="true">
              🎉
            </p>
            <p
              style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--weight-bold)',
                color: 'var(--color-success)',
              }}
            >
              You're all set to vote!
            </p>
            <p style={{ color: 'var(--text-secondary)' }}>
              You've completed all the steps. Make your voice heard!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

VotingChecklist.displayName = 'VotingChecklist';
export default memo(VotingChecklist);
