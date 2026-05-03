/**
 * LoadingSkeleton — Animated placeholder for loading states.
 */
export default function LoadingSkeleton({ type = 'card', count = 3 }) {
  if (type === 'card') {
    return (
      <div aria-busy="true" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 100, borderRadius: 'var(--radius-xl)' }} />
        ))}
        <span className="sr-only">Loading content...</span>
      </div>
    );
  }

  return (
    <div aria-busy="true">
      <div className="skeleton skeleton-heading" />
      <div className="skeleton skeleton-text" style={{ width: '90%' }} />
      <div className="skeleton skeleton-text" style={{ width: '75%' }} />
      <div className="skeleton skeleton-text" style={{ width: '60%' }} />
      <span className="sr-only">Loading content...</span>
    </div>
  );
}
