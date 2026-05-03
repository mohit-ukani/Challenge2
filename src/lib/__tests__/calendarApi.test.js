import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  loadGapiScript,
  loadGisScript,
  initCalendarApi,
  createTokenClient,
  requestCalendarAccess,
  addEventToCalendar
} from '../calendarApi';

describe('calendarApi', () => {
  beforeEach(() => {
    // Reset DOM
    document.head.innerHTML = '';
    
    // Mock window objects
    window.gapi = {
      load: vi.fn((name, config) => config.callback()),
      client: {
        init: vi.fn().mockResolvedValue(true),
        calendar: {
          events: {
            insert: vi.fn().mockResolvedValue({ result: { id: 'test-event-id' } })
          }
        }
      }
    };

    window.google = {
      accounts: {
        oauth2: {
          initTokenClient: vi.fn().mockReturnValue({
            requestAccessToken: vi.fn()
          })
        }
      }
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Script Loading', () => {
    it('loadGapiScript appends script to head', async () => {
      const promise = loadGapiScript();
      const script = document.getElementById('gapi-script');
      expect(script).toBeTruthy();
      expect(script.src).toBe('https://apis.google.com/js/api.js');
      
      // Simulate load
      script.onload();
      await promise;
    });

    it('loadGisScript appends script to head', async () => {
      const promise = loadGisScript();
      const script = document.getElementById('gis-script');
      expect(script).toBeTruthy();
      expect(script.src).toBe('https://accounts.google.com/gsi/client');
      
      // Simulate load
      script.onload();
      await promise;
    });
  });

  describe('Initialization', () => {
    it('initCalendarApi loads scripts and initializes client', async () => {
      // Create and load scripts immediately
      vi.spyOn(document.head, 'appendChild').mockImplementation((el) => {
        if (el.id === 'gapi-script' || el.id === 'gis-script') {
          setTimeout(() => el.onload(), 0);
        }
      });

      await initCalendarApi();
      expect(window.gapi.load).toHaveBeenCalledWith('client', expect.any(Object));
      expect(window.gapi.client.init).toHaveBeenCalled();
    });
  });

  describe('Token Client', () => {
    it('createTokenClient handles missing google object', () => {
      window.google = undefined;
      const onError = vi.fn();
      const client = createTokenClient(vi.fn(), onError);
      expect(client).toBeNull();
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });

    it('createTokenClient initializes correctly', () => {
      const onSuccess = vi.fn();
      const client = createTokenClient(onSuccess, vi.fn());
      expect(client).toBeTruthy();
      expect(window.google.accounts.oauth2.initTokenClient).toHaveBeenCalled();
    });

    it('requestCalendarAccess calls requestAccessToken', () => {
      const client = createTokenClient(vi.fn(), vi.fn());
      requestCalendarAccess();
      expect(client.requestAccessToken).toHaveBeenCalledWith({ prompt: 'consent' });
    });
  });

  describe('Calendar Events', () => {
    it('addEventToCalendar inserts event', async () => {
      const details = {
        summary: 'Test Event',
        description: 'Test Desc',
        date: '2024-01-01'
      };
      
      const result = await addEventToCalendar(details);
      expect(result).toEqual({ id: 'test-event-id' });
      expect(window.gapi.client.calendar.events.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          calendarId: 'primary',
          resource: expect.objectContaining({
            summary: 'Test Event',
            description: 'Test Desc',
            start: { date: '2024-01-01', timeZone: 'America/New_York' }
          })
        })
      );
    });
  });
});
