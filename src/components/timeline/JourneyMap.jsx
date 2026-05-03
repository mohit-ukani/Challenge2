import { useState, useRef } from 'react';
import MilestoneNode from './MilestoneNode';
import MilestoneDashboard from './MilestoneDashboard';
import { MILESTONES } from '../../data/electionData';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import '../../styles/timeline.css';

/**
 * JourneyMap — The interactive election timeline with clickable milestones.
 * Uses tablist/tab/tabpanel ARIA pattern for accessibility.
 */
export default function JourneyMap() {
  const [selectedId, setSelectedId] = useState(null);
  const milestoneIds = MILESTONES.map((m) => m.id);
  const timelineRef = useRef(null);

  const handleKeyDown = useKeyboardNavigation(milestoneIds, selectedId || milestoneIds[0], setSelectedId);

  const handleSelect = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const selectedMilestone = MILESTONES.find((m) => m.id === selectedId);

  // Calculate progress line width
  const selectedIdx = selectedId ? milestoneIds.indexOf(selectedId) : -1;
  const progressPercent = selectedIdx >= 0 ? (selectedIdx / (milestoneIds.length - 1)) * 100 : 0;

  return (
    <section className="journey-map" aria-label="Election Process Timeline">
      <div className="container">
        <h2 className="journey-map__title">Your Voter's Journey</h2>
        <p className="journey-map__subtitle">
          Click on each milestone to explore the election process step by step
        </p>

        <div
          className="timeline"
          role="tablist"
          aria-label="Election milestones"
          ref={timelineRef}
          onKeyDown={handleKeyDown}
        >
          {/* Connecting Line */}
          <div className="timeline__line" aria-hidden="true">
            <div
              className="timeline__line-progress"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Milestone Nodes */}
          {MILESTONES.map((milestone, index) => (
            <MilestoneNode
              key={milestone.id}
              milestone={milestone}
              isSelected={selectedId === milestone.id}
              onClick={() => handleSelect(milestone.id)}
              tabIndex={selectedId === milestone.id || (!selectedId && index === 0) ? 0 : -1}
            />
          ))}
        </div>

        {/* Dashboard Panel */}
        {selectedMilestone && (
          <MilestoneDashboard
            milestone={selectedMilestone}
            id={`panel-${selectedMilestone.id}`}
          />
        )}
      </div>
    </section>
  );
}
