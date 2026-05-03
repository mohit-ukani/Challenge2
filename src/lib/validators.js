/**
 * Input validation and sanitization utilities.
 * All user inputs MUST pass through these functions before processing
 * to prevent XSS, injection attacks, and invalid data.
 */

/**
 * Validates a 6-digit Indian PIN code.
 * @param {string} pin - The PIN code to validate
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateZipCode(pin) {
  if (!pin || typeof pin !== 'string') {
    return { valid: false, error: 'Please enter a PIN code.' };
  }
  const trimmed = pin.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: 'Please enter a PIN code.' };
  }
  if (!/^\d{6}$/.test(trimmed)) {
    return { valid: false, error: 'Please enter a valid 6-digit Indian PIN code.' };
  }
  return { valid: true };
}

/**
 * Validates a 5-digit US zip code (kept for backward compatibility with tests).
 * @param {string} zip - The zip code to validate
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateUsZipCode(zip) {
  if (!zip || typeof zip !== 'string') {
    return { valid: false, error: 'Please enter a zip code.' };
  }
  const trimmed = zip.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: 'Please enter a zip code.' };
  }
  if (!/^\d{5}$/.test(trimmed)) {
    return { valid: false, error: 'Please enter a valid 5-digit zip code.' };
  }
  return { valid: true };
}

/**
 * Sanitizes a string by removing HTML tags, entities, and dangerous characters.
 * Prevents XSS attacks from user-supplied input.
 * @param {string} str - The string to sanitize
 * @returns {string} Sanitized string
 */
export function sanitizeInput(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/<[^>]*>/g, '')        // Strip HTML tags
    .replace(/&[^;]+;/g, '')        // Strip HTML entities
    .replace(/[<>'"]/g, '')         // Remove special chars
    .trim();
}

/**
 * Sanitizes and validates a chat message.
 * Enforces length limits and strips potentially dangerous content.
 * @param {string} message - The raw chat message
 * @returns {{ valid: boolean, sanitized?: string, error?: string }}
 */
export function validateChatMessage(message) {
  const MAX_LENGTH = 500;

  if (!message || typeof message !== 'string') {
    return { valid: false, error: 'Please enter a message.' };
  }

  const trimmed = message.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: 'Please enter a message.' };
  }

  if (trimmed.length > MAX_LENGTH) {
    return {
      valid: false,
      error: `Message is too long. Please keep it under ${MAX_LENGTH} characters.`,
    };
  }

  // Strip HTML / script injection attempts
  const sanitized = trimmed
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();

  if (sanitized.length === 0) {
    return { valid: false, error: 'Invalid message content.' };
  }

  return { valid: true, sanitized };
}

/**
 * Validates an email address format.
 * @param {string} email - The email to validate
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Please enter an email address.' };
  }
  const trimmed = email.trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Please enter a valid email address.' };
  }
  return { valid: true };
}

/**
 * Whitelisted checklist item IDs.
 * Used to prevent arbitrary Firestore writes via item ID manipulation.
 */
const VALID_CHECKLIST_IDS = new Set([
  'check-registration',
  'request-ballot',
  'know-candidates',
  'find-polling',
  'vote',
]);

/**
 * Validates that a checklist item ID is from the known whitelist.
 * Prevents injection of arbitrary IDs into Firestore paths.
 * @param {string} itemId - The item ID to validate
 * @returns {boolean}
 */
export function isValidChecklistItemId(itemId) {
  return typeof itemId === 'string' && VALID_CHECKLIST_IDS.has(itemId);
}
