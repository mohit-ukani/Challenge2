import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * LandingPage — Hero section with features overview and CTA.
 */
export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="landing">
      {/* Hero Section */}
      <section style={heroStyle} aria-label="Welcome">
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className="animate-fade-in-up">
            <span style={{ fontSize: '4rem', display: 'block', marginBottom: 'var(--space-4)' }} aria-hidden="true">🗳️</span>
            <h1 style={{ marginBottom: 'var(--space-4)', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              The Voter's Journey
            </h1>
            <p style={{ fontSize: 'var(--text-xl)', maxWidth: 640, margin: '0 auto var(--space-8)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
              Your interactive guide to understanding the election process, timelines, and every step you need to take — from registration to casting your vote.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/journey" className="btn btn-primary btn-lg" id="start-journey-cta">
                Start Your Journey →
              </Link>
              <Link to="/checklist" className="btn btn-secondary btn-lg">
                View Checklist
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section" aria-label="Features">
        <div className="container">
          <div className="section-header">
            <h2>Everything You Need to Vote</h2>
            <p>Non-partisan, accessible, and easy-to-follow — we guide you through every step of the election cycle.</p>
          </div>

          <div style={featuresGridStyle}>
            {FEATURES.map((feature, idx) => (
              <div className="card" key={idx} style={{ animation: `fadeInUp ${300 + idx * 100}ms ease-out` }}>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: 'var(--space-4)' }} aria-hidden="true">
                  {feature.icon}
                </span>
                <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>{feature.title}</h3>
                <p style={{ fontSize: 'var(--text-sm)', margin: 0 }}>{feature.description}</p>
                <Link
                  to={feature.link}
                  style={{ display: 'inline-block', marginTop: 'var(--space-4)', fontSize: 'var(--text-sm)', fontWeight: 600 }}
                >
                  {feature.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section style={missionStyle} aria-label="Our Mission">
        <div className="container" style={{ textAlign: 'center', maxWidth: 700 }}>
          <h2 style={{ marginBottom: 'var(--space-4)' }}>Non-Partisan. Accessible. For Everyone.</h2>
          <p style={{ fontSize: 'var(--text-lg)', lineHeight: 'var(--leading-relaxed)' }}>
            The Voter's Journey is designed to help every eligible citizen understand and participate in the democratic process.
            We don't tell you who to vote for — we help you understand how, when, and where to vote.
          </p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', marginTop: 'var(--space-4)' }}>
            Built with WCAG 2.1 AA accessibility standards • Full keyboard navigation • Screen reader compatible • High-contrast mode
          </p>
        </div>
      </section>
    </div>
  );
}

const FEATURES = [
  {
    icon: '🗺️',
    title: 'Interactive Timeline Map',
    description: 'Explore each stage of the election cycle — from voter registration to inauguration — with clear, step-by-step guidance.',
    link: '/journey',
    cta: 'Explore Timeline',
  },
  {
    icon: '📍',
    title: 'Polling Place Finder',
    description: 'Enter your zip code to find nearby polling places and drop-box locations with Google Maps integration.',
    link: '/finder',
    cta: 'Find Your Polling Place',
  },
  {
    icon: '✅',
    title: 'Personalized Checklist',
    description: 'Track your progress with a step-by-step voting checklist. Sign in to save your progress across devices.',
    link: '/checklist',
    cta: 'Start Checklist',
  },
  {
    icon: '📅',
    title: 'Calendar Integration',
    description: 'Add key election dates — registration deadlines, early voting, and Election Day — directly to your Google Calendar.',
    link: '/journey',
    cta: 'View Key Dates',
  },
];

const heroStyle = {
  padding: 'var(--space-24) 0 var(--space-16)',
  background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 50%, #f3e8ff 100%)',
  position: 'relative',
  overflow: 'hidden',
};

const featuresGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: 'var(--space-6)',
};

const missionStyle = {
  padding: 'var(--space-16) 0',
  background: 'var(--bg-secondary)',
};
