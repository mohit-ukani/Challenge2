import { memo } from 'react';

/**
 * PollingCard — Displays information for a single polling place result.
 *
 * Rendered as an `article` with `role="button"` semantics so it is selectable
 * from the results list and also keyboard-accessible (Enter/Space to select).
 *
 * @param {Object}  props
 * @param {Object}  props.place       - Polling place data object
 * @param {string}  props.place.id    - Unique place ID
 * @param {string}  props.place.name  - Name of the polling place
 * @param {string}  props.place.address - Street address
 * @param {string}  props.place.type  - "polling" or "dropbox"
 * @param {string}  props.place.hours - Operating hours string
 * @param {boolean} props.isSelected  - Whether this card is currently selected
 * @param {Function} props.onClick    - Selection handler
 */
function PollingCard({ place, isSelected, onClick }) {
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    place.address
  )}`;

  return (
    <article
      className={`polling-card ${isSelected ? 'polling-card--selected' : ''}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
      aria-label={`${place.name} — ${
        place.type === 'polling' ? 'Polling Place' : 'Drop Box'
      } at ${place.address}`}
      style={
        isSelected
          ? { borderColor: 'var(--color-primary)', boxShadow: 'var(--shadow-md)' }
          : {}
      }
    >
      <h3 className="polling-card__name">{place.name}</h3>
      <p className="polling-card__address">{place.address}</p>
      <div className="polling-card__meta">
        <span className={`polling-card__type polling-card__type--${place.type}`}>
          {place.type === 'polling' ? '🏛️ Polling Place' : '📦 Drop Box'}
        </span>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
          🕐 {place.hours}
        </span>
      </div>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="polling-card__directions"
        onClick={(e) => e.stopPropagation()}
        aria-label={`Get directions to ${place.name} (opens Google Maps in new tab)`}
        style={{ display: 'inline-block', marginTop: 'var(--space-2)' }}
      >
        Get Directions →
      </a>
    </article>
  );
}

PollingCard.displayName = 'PollingCard';
export default memo(PollingCard);
