import { useState, useEffect, useRef } from 'react';
import { initCalendarApi, createTokenClient, addEventToCalendar } from '../../lib/calendarApi';

/**
 * AddToCalendar — Button to add election dates to Google Calendar.
 */
export default function AddToCalendar({ summary, description, date }) {
  const [status, setStatus] = useState('idle'); // idle, loading, ready, success, error
  const [apiReady, setApiReady] = useState(false);
  const tokenClientRef = useRef(null);

  useEffect(() => {
    initCalendarApi()
      .then(() => setApiReady(true))
      .catch(() => setApiReady(false));
  }, []);

  const handleClick = async () => {
    if (status === 'loading') return;
    setStatus('loading');

    try {
      if (!apiReady) {
        await initCalendarApi();
        setApiReady(true);
      }

      // Check if we have a token
      const token = window.gapi?.client?.getToken();
      if (!token) {
        // Need to request access
        await new Promise((resolve, reject) => {
          tokenClientRef.current = createTokenClient(resolve, reject);
          if (tokenClientRef.current) {
            tokenClientRef.current.requestAccessToken({ prompt: '' });
          } else {
            reject(new Error('Could not create token client'));
          }
        });
      }

      await addEventToCalendar({ summary, description, date });
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error('Calendar error:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const label = status === 'success'
    ? '✓ Added'
    : status === 'error'
    ? 'Error'
    : status === 'loading'
    ? '...'
    : '📅 Add to Calendar';

  return (
    <button
      className={`btn btn-sm ${status === 'success' ? 'btn-ghost' : 'btn-secondary'}`}
      onClick={handleClick}
      disabled={status === 'loading' || status === 'success'}
      aria-label={`Add "${summary}" on ${date} to your Google Calendar`}
      style={{ whiteSpace: 'nowrap', minWidth: 140 }}
    >
      {status === 'loading' && <span className="btn-spinner" aria-hidden="true" />}
      {label}
    </button>
  );
}
