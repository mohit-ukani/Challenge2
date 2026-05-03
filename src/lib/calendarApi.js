/**
 * Google Calendar API integration.
 * Provides functions to load GAPI, request calendar access, and add events.
 */

const SCOPES = 'https://www.googleapis.com/auth/calendar.events';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

let gapiLoaded = false;
let gisLoaded = false;
let tokenClient = null;

/**
 * Loads the Google API client library script.
 * @returns {Promise<void>}
 */
export function loadGapiScript() {
  return new Promise((resolve, reject) => {
    if (gapiLoaded) { resolve(); return; }
    if (document.getElementById('gapi-script')) { resolve(); return; }
    const script = document.createElement('script');
    script.id = 'gapi-script';
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => { gapiLoaded = true; resolve(); };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * Loads the Google Identity Services script.
 * @returns {Promise<void>}
 */
export function loadGisScript() {
  return new Promise((resolve, reject) => {
    if (gisLoaded) { resolve(); return; }
    if (document.getElementById('gis-script')) { resolve(); return; }
    const script = document.createElement('script');
    script.id = 'gis-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = () => { gisLoaded = true; resolve(); };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * Initializes the GAPI client with Calendar API discovery doc.
 * @returns {Promise<void>}
 */
export async function initCalendarApi() {
  await loadGapiScript();
  await loadGisScript();

  await new Promise((resolve, reject) => {
    window.gapi.load('client', { callback: resolve, onerror: reject });
  });

  await window.gapi.client.init({
    apiKey: import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
}

/**
 * Creates a token client for requesting calendar access.
 * @param {Function} onSuccess - Callback on successful token acquisition
 * @param {Function} onError - Callback on error
 * @returns {Object} Token client
 */
export function createTokenClient(onSuccess, onError) {
  if (!window.google?.accounts?.oauth2) {
    onError?.(new Error('Google Identity Services not loaded'));
    return null;
  }

  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: import.meta.env.VITE_GOOGLE_CALENDAR_CLIENT_ID,
    scope: SCOPES,
    callback: (response) => {
      if (response.error) {
        onError?.(response);
      } else {
        onSuccess?.(response);
      }
    },
  });

  return tokenClient;
}

/**
 * Requests calendar access by prompting the user.
 */
export function requestCalendarAccess() {
  if (tokenClient) {
    tokenClient.requestAccessToken({ prompt: 'consent' });
  }
}

/**
 * Adds an event to the user's primary Google Calendar.
 * @param {Object} eventDetails - Event details
 * @param {string} eventDetails.summary - Event title
 * @param {string} eventDetails.description - Event description
 * @param {string} eventDetails.date - Event date (YYYY-MM-DD)
 * @param {string} [eventDetails.timeZone] - Timezone (defaults to America/New_York)
 * @returns {Promise<Object>} Created event
 */
export async function addEventToCalendar(eventDetails) {
  const { summary, description, date, timeZone = 'America/New_York' } = eventDetails;

  const event = {
    summary,
    description,
    start: { date, timeZone },
    end: { date, timeZone },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 1440 }, // 1 day before
        { method: 'popup', minutes: 10080 }, // 1 week before
      ],
    },
  };

  const response = await window.gapi.client.calendar.events.insert({
    calendarId: 'primary',
    resource: event,
  });

  return response.result;
}
