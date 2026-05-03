import { describe, it, expect } from 'vitest';
import {
  validateZipCode,
  validateUsZipCode,
  sanitizeInput,
  validateEmail,
  validateChatMessage,
  isValidChecklistItemId,
} from '../validators';

// ─────────────────────────────────────────────
// validateZipCode (Indian 6-digit PIN)
// ─────────────────────────────────────────────
describe('validateZipCode', () => {
  it('accepts a valid 6-digit PIN code', () => {
    expect(validateZipCode('110001').valid).toBe(true);
    expect(validateZipCode('400001').valid).toBe(true);
    expect(validateZipCode('700001').valid).toBe(true);
  });

  it('rejects a 5-digit code', () => {
    const result = validateZipCode('12345');
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/6-digit/i);
  });

  it('rejects a 7-digit code', () => {
    expect(validateZipCode('1234567').valid).toBe(false);
  });

  it('rejects non-numeric input', () => {
    expect(validateZipCode('abcdef').valid).toBe(false);
    expect(validateZipCode('11000A').valid).toBe(false);
  });

  it('rejects empty string', () => {
    const result = validateZipCode('');
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('rejects null / undefined', () => {
    expect(validateZipCode(null).valid).toBe(false);
    expect(validateZipCode(undefined).valid).toBe(false);
  });

  it('rejects non-string types', () => {
    expect(validateZipCode(110001).valid).toBe(false);
    expect(validateZipCode({}).valid).toBe(false);
  });

  it('trims surrounding whitespace', () => {
    expect(validateZipCode('  110001  ').valid).toBe(true);
  });
});

// ─────────────────────────────────────────────
// validateUsZipCode (US 5-digit zip — backward compat)
// ─────────────────────────────────────────────
describe('validateUsZipCode', () => {
  it('accepts a valid 5-digit US zip', () => {
    expect(validateUsZipCode('62701').valid).toBe(true);
    expect(validateUsZipCode('90210').valid).toBe(true);
  });

  it('rejects a 4-digit code', () => {
    expect(validateUsZipCode('1234').valid).toBe(false);
  });

  it('rejects a 6-digit code', () => {
    expect(validateUsZipCode('123456').valid).toBe(false);
  });

  it('returns an error message on failure', () => {
    const { error } = validateUsZipCode('abc');
    expect(typeof error).toBe('string');
    expect(error.length).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────
// sanitizeInput
// ─────────────────────────────────────────────
describe('sanitizeInput', () => {
  it('strips HTML tags', () => {
    expect(sanitizeInput('<script>alert(1)</script>')).toBe('alert(1)');
    expect(sanitizeInput('<b>hello</b>')).toBe('hello');
  });

  it('strips HTML entities', () => {
    expect(sanitizeInput('&lt;b&gt;test&lt;/b&gt;')).toBe('btest/b');
    expect(sanitizeInput('hello&nbsp;world')).toBe('helloworld');
  });

  it('removes angle brackets and quotes', () => {
    const result = sanitizeInput(`"hello" <world> 'test'`);
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
    expect(result).not.toContain('"');
    expect(result).not.toContain("'");
  });

  it('trims whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello');
  });

  it('returns empty string for null / undefined', () => {
    expect(sanitizeInput(null)).toBe('');
    expect(sanitizeInput(undefined)).toBe('');
    expect(sanitizeInput('')).toBe('');
  });

  it('returns empty string for non-string types', () => {
    expect(sanitizeInput(42)).toBe('');
    expect(sanitizeInput({})).toBe('');
  });

  it('preserves normal text', () => {
    expect(sanitizeInput('hello world')).toBe('hello world');
    expect(sanitizeInput('New Delhi, PIN 110001')).toContain('New Delhi');
  });
});

// ─────────────────────────────────────────────
// validateEmail
// ─────────────────────────────────────────────
describe('validateEmail', () => {
  it('accepts valid email addresses', () => {
    expect(validateEmail('user@example.com').valid).toBe(true);
    expect(validateEmail('user.name+tag@sub.domain.org').valid).toBe(true);
  });

  it('rejects emails without @', () => {
    expect(validateEmail('notanemail').valid).toBe(false);
  });

  it('rejects emails without a domain', () => {
    expect(validateEmail('user@').valid).toBe(false);
  });

  it('rejects emails without a TLD', () => {
    expect(validateEmail('user@domain').valid).toBe(false);
  });

  it('rejects null / empty', () => {
    expect(validateEmail(null).valid).toBe(false);
    expect(validateEmail('').valid).toBe(false);
  });

  it('returns a descriptive error on failure', () => {
    expect(validateEmail('bad').error).toBeTruthy();
  });
});

// ─────────────────────────────────────────────
// validateChatMessage
// ─────────────────────────────────────────────
describe('validateChatMessage', () => {
  it('accepts a normal message', () => {
    const result = validateChatMessage('How do I register to vote in India?');
    expect(result.valid).toBe(true);
    expect(result.sanitized).toBeTruthy();
  });

  it('rejects empty messages', () => {
    expect(validateChatMessage('').valid).toBe(false);
    expect(validateChatMessage('   ').valid).toBe(false);
  });

  it('rejects messages over 500 characters', () => {
    const longMsg = 'a'.repeat(501);
    const result = validateChatMessage(longMsg);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/500/);
  });

  it('accepts exactly 500 characters', () => {
    expect(validateChatMessage('a'.repeat(500)).valid).toBe(true);
  });

  it('strips script injection attempts', () => {
    const result = validateChatMessage('<script>alert("xss")</script>What is ECI?');
    // Script stripped but remaining text makes it valid
    expect(result.valid).toBe(true);
    expect(result.sanitized).not.toContain('<script>');
  });

  it('strips javascript: protocol', () => {
    const result = validateChatMessage('javascript:alert(1) Tell me about EVMs');
    expect(result.valid).toBe(true);
    expect(result.sanitized).not.toContain('javascript:');
  });

  it('rejects null / non-string', () => {
    expect(validateChatMessage(null).valid).toBe(false);
    expect(validateChatMessage(undefined).valid).toBe(false);
  });
});

// ─────────────────────────────────────────────
// isValidChecklistItemId
// ─────────────────────────────────────────────
describe('isValidChecklistItemId', () => {
  it('accepts all known checklist item IDs', () => {
    const validIds = [
      'check-registration',
      'request-ballot',
      'know-candidates',
      'find-polling',
      'vote',
    ];
    validIds.forEach((id) => {
      expect(isValidChecklistItemId(id)).toBe(true);
    });
  });

  it('rejects unknown IDs', () => {
    expect(isValidChecklistItemId('hack-attempt')).toBe(false);
    expect(isValidChecklistItemId('../users/admin')).toBe(false);
    expect(isValidChecklistItemId('')).toBe(false);
  });

  it('rejects non-string types', () => {
    expect(isValidChecklistItemId(null)).toBe(false);
    expect(isValidChecklistItemId(undefined)).toBe(false);
    expect(isValidChecklistItemId(123)).toBe(false);
    expect(isValidChecklistItemId({})).toBe(false);
  });
});
