import { memo } from 'react';
import AddToCalendar from '../calendar/AddToCalendar';

/**
 * MilestoneDashboard — Expandable panel showing full details for a selected milestone.
 *
 * Implements the ARIA tabpanel pattern — paired with its MilestoneNode (`role="tab"`)
 * via `aria-labelledby`. Receives focus when opened (tabIndex={0}).
 *
 * @param {Object} props
 * @param {Object} props.milestone - The active milestone data object
 * @param {string} props.id        - The tabpanel's DOM id (e.g. "panel-registration")
 */
function MilestoneDashboard({ milestone, id }) {
  const colorVar = milestone.colorVar;

  return (
    <div
      className="dashboard animate-fade-in-up"
      role="tabpanel"
      id={id}
      aria-labelledby={`tab-${milestone.id}`}
      tabIndex={0}
    >
      {/* Header */}
      <div className="dashboard__header">
        <div
          className="dashboard__icon"
          style={{ background: `var(${colorVar})` }}
          aria-hidden="true"
        >
          {milestone.icon}
        </div>
        <h3 className="dashboard__title">{milestone.title}</h3>
      </div>

      {/* Description */}
      <p className="dashboard__description">{milestone.description}</p>

      {/* Primary Action Link */}
      {milestone.actionUrl && (
        <a
          href={milestone.actionUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{
            marginBottom: 'var(--space-8)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
          }}
          aria-label={`${milestone.actionLabel || 'Visit Official Website'} (opens in new tab)`}
        >
          🌐 {milestone.actionLabel || 'Visit Official Website'}
        </a>
      )}

      {/* Detail Sections */}
      <div className="dashboard__sections">
        {milestone.sections.map((section, idx) => (
          <div className="dashboard__section" key={idx}>
            <h4 className="dashboard__section-title">{section.title}</h4>
            <ul className="dashboard__section-list" role="list">
              {section.items.map((item, i) => (
                <li className="dashboard__section-item" key={i} role="listitem">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Key Dates with Calendar Integration */}
      {milestone.keyDates && milestone.keyDates.length > 0 && (
        <div className="dashboard__dates">
          <h4
            style={{
              marginBottom: 'var(--space-3)',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--weight-semibold)',
            }}
          >
            📅 Key Dates
          </h4>
          {milestone.keyDates.map((dateItem, idx) => (
            <div className="dashboard__date-item" key={idx}>
              <div>
                <div className="dashboard__date-label">{dateItem.label}</div>
                <div className="dashboard__date-value">{dateItem.description}</div>
              </div>
              <AddToCalendar
                summary={dateItem.label}
                description={dateItem.description}
                date={dateItem.date}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

MilestoneDashboard.displayName = 'MilestoneDashboard';
export default memo(MilestoneDashboard);
