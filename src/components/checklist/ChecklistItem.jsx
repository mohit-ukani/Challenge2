import { memo } from 'react';

/**
 * ChecklistItem — Individual checklist step with expandable details.
 *
 * Uses the disclosure pattern (button with aria-expanded/aria-controls) for
 * the expand/collapse interaction, and a separate role="checkbox" for the
 * completion toggle — keeping these semantically distinct for screen readers.
 *
 * @param {Object}   props
 * @param {Object}   props.item              - Checklist item data
 * @param {boolean}  props.isCompleted       - Whether this step is marked complete
 * @param {boolean}  props.isExpanded        - Whether the details panel is open
 * @param {Function} props.onToggleComplete  - Called when the checkbox is activated
 * @param {Function} props.onToggleExpand    - Called when the header is clicked
 */
function ChecklistItem({ item, isCompleted, isExpanded, onToggleComplete, onToggleExpand }) {
  return (
    <div
      className={`checklist-item ${isCompleted ? 'checklist-item--completed' : ''}`}
      role="listitem"
    >
      <button
        className="checklist-item__header"
        onClick={onToggleExpand}
        aria-expanded={isExpanded}
        aria-controls={`checklist-content-${item.id}`}
        aria-label={`Step ${item.step}: ${item.title}${isCompleted ? ' (completed)' : ''}`}
        id={`checklist-header-${item.id}`}
      >
        {/* Checkbox — separate interactive element inside the button */}
        <div
          className="checklist-item__checkbox"
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              onToggleComplete();
            }
          }}
          role="checkbox"
          aria-checked={isCompleted}
          aria-label={`Mark "${item.title}" as ${isCompleted ? 'incomplete' : 'complete'}`}
          tabIndex={0}
        >
          {isCompleted && <span aria-hidden="true">✓</span>}
        </div>

        <div className="checklist-item__number" aria-hidden="true">
          {item.step}
        </div>

        <div className="checklist-item__info">
          <div className="checklist-item__title">
            <span aria-hidden="true">{item.icon}</span> {item.title}
          </div>
          <div className="checklist-item__subtitle">{item.subtitle}</div>
        </div>

        <span
          className={`checklist-item__expand ${isExpanded ? 'checklist-item__expand--open' : ''}`}
          aria-hidden="true"
        >
          ▼
        </span>
      </button>

      {isExpanded && (
        <div
          className="checklist-item__content"
          id={`checklist-content-${item.id}`}
          role="region"
          aria-labelledby={`checklist-header-${item.id}`}
        >
          <p>{item.description}</p>
          {item.actionUrl && (
            <a
              href={item.actionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{
                marginTop: 'var(--space-4)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                fontSize: 'var(--text-sm)',
              }}
            >
              🌐 {item.actionLabel || 'Visit Official Website'}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

ChecklistItem.displayName = 'ChecklistItem';
export default memo(ChecklistItem);
