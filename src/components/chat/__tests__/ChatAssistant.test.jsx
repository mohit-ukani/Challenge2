import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock scrollIntoView (not implemented in jsdom)
window.HTMLElement.prototype.scrollIntoView = vi.fn();

// Mock the rate limiter — start with it allowing all requests
vi.mock('../../../lib/rateLimiter', () => ({
  chatRateLimiter: {
    check: vi.fn(() => ({ allowed: true, retryAfterMs: 0, remaining: 9 })),
  },
}));

// Mock Gemini AI
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn(() => ({
      generateContent: vi.fn(() =>
        Promise.resolve({
          response: { text: () => 'Here is info about voting in India.' },
        })
      ),
    })),
  })),
}));

import ChatAssistant from '../ChatAssistant';

function renderChat() {
  return render(
    <BrowserRouter>
      <ChatAssistant />
    </BrowserRouter>
  );
}

describe('ChatAssistant', () => {
  it('renders the toggle button initially', () => {
    renderChat();
    expect(
      screen.getByRole('button', { name: /open election assistant chat/i })
    ).toBeInTheDocument();
  });

  it('does not show the chat window initially', () => {
    renderChat();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens the chat window on toggle button click', () => {
    renderChat();
    fireEvent.click(screen.getByRole('button', { name: /open election assistant chat/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('shows the welcome message when opened', () => {
    renderChat();
    fireEvent.click(screen.getByRole('button', { name: /open election assistant chat/i }));
    expect(screen.getByText(/Indian Election Assistant/i)).toBeInTheDocument();
  });

  it('closes the chat window on close button click', () => {
    renderChat();
    fireEvent.click(screen.getByRole('button', { name: /open election assistant chat/i }));
    // Use the specific "Close chat assistant" button inside the dialog
    fireEvent.click(screen.getByRole('button', { name: /close chat assistant/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('send button is disabled when input is empty', () => {
    renderChat();
    fireEvent.click(screen.getByRole('button', { name: /open election assistant chat/i }));
    const sendBtn = screen.getByRole('button', { name: /send message/i });
    expect(sendBtn).toBeDisabled();
  });

  it('send button is enabled when input has text', () => {
    renderChat();
    fireEvent.click(screen.getByRole('button', { name: /open election assistant chat/i }));
    const input = screen.getByRole('textbox', { name: /type your election question/i });
    fireEvent.change(input, { target: { value: 'How do I register?' } });
    expect(screen.getByRole('button', { name: /send message/i })).not.toBeDisabled();
  });

  it('shows rate limit error when rate limiter blocks', async () => {
    const { chatRateLimiter } = await import('../../../lib/rateLimiter');
    chatRateLimiter.check
      .mockReturnValueOnce({ allowed: false, retryAfterMs: 30000, remaining: 0 });

    renderChat();
    fireEvent.click(screen.getByRole('button', { name: /open election assistant chat/i }));
    const input = screen.getByRole('textbox', { name: /type/i });

    // Attempt to send — should be blocked by rate limiter
    fireEvent.change(input, { target: { value: 'Some question' } });
    fireEvent.submit(input.closest('form'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('enforces 500 character max length on input', () => {
    renderChat();
    fireEvent.click(screen.getByRole('button', { name: /open election assistant chat/i }));
    const input = screen.getByRole('textbox', { name: /type/i });
    expect(input).toHaveAttribute('maxLength', '500');
  });

  it('chat messages region has aria-live="polite"', () => {
    renderChat();
    fireEvent.click(screen.getByRole('button', { name: /open election assistant chat/i }));
    const log = screen.getByRole('log');
    expect(log).toHaveAttribute('aria-live', 'polite');
  });

  it('toggle button has aria-expanded=false when closed', () => {
    renderChat();
    const btn = screen.getByRole('button', { name: /open election assistant chat/i });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });
});
