import { memo } from 'react';

/**
 * MilestoneNode — Individual milestone circle in the election journey timeline.
 *
 * Implements the ARIA tab pattern — each node is a `role="tab"` button inside
 * a `role="tablist"` container (JourneyMap). Uses roving tabindex for keyboard
 * navigation managed by the parent.
 *
 * @param {Object}   props
 * @param {Object}   props.milestone     - Milestone data object
 * @param {boolean}  props.isSelected    - Whether this node is the active tab
 * @param {Function} props.onClick       - Click handler (calls parent handleSelect)
 * @param {number}   props.tabIndex      - Roving tabindex value (0 or -1)
 */
function MilestoneNode({ milestone, isSelected, onClick, tabIndex }) {
  return (
    <button
      className={`milestone milestone--${milestone.id}`}
      role="tab"
      aria-selected={isSelected}
      aria-controls={`panel-${milestone.id}`}
      aria-label={`${milestone.title}: ${milestone.shortDesc}`}
      data-milestone-id={milestone.id}
      tabIndex={tabIndex}
      onClick={onClick}
      id={`tab-${milestone.id}`}
    >
      <div className="milestone__circle">
        <span aria-hidden="true">{milestone.icon}</span>
        <div className="milestone__pulse" aria-hidden="true" />
      </div>
      <span className="milestone__label">{milestone.title}</span>
      <span className="milestone__status">{milestone.shortDesc}</span>
    </button>
  );
}

MilestoneNode.displayName = 'MilestoneNode';
export default memo(MilestoneNode);
