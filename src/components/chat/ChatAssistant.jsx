import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { chatRateLimiter } from '../../lib/rateLimiter';
import { validateChatMessage } from '../../lib/validators';
import '../../styles/chat.css';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

/**
 * ChatAssistant — Floating AI-powered election assistant chat widget.
 *
 * Security features:
 * - Rate limiting: max 10 messages/minute via RateLimiter
 * - Input validation: max 500 chars, XSS sanitization via validateChatMessage
 * - API key guard: graceful mock mode if key is absent
 *
 * @returns {JSX.Element}
 */
function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: 'Hello! I am your Indian Election Assistant. Ask me anything about voter registration, polling, or the electoral process.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimitError, setRateLimitError] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSend = useCallback(
    async (e) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;

      // 1. Validate & sanitize message
      const validation = validateChatMessage(input);
      if (!validation.valid) {
        setRateLimitError(validation.error);
        return;
      }
      const userMessage = validation.sanitized;

      // 2. Enforce rate limit
      const rateCheck = chatRateLimiter.check();
      if (!rateCheck.allowed) {
        const seconds = Math.ceil(rateCheck.retryAfterMs / 1000);
        setRateLimitError(
          `You're sending messages too fast. Please wait ${seconds} second${seconds !== 1 ? 's' : ''} before trying again.`
        );
        return;
      }

      setRateLimitError('');
      setInput('');
      setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
      setIsLoading(true);

      try {
        if (!API_KEY || API_KEY === 'dummy') {
          // Mock response when API key is not configured
          await new Promise((resolve) => setTimeout(resolve, 800));
          setMessages((prev) => [
            ...prev,
            {
              role: 'bot',
              text: `(Demo Mode) You asked: "${userMessage}". Configure VITE_GEMINI_API_KEY for live AI responses about the Indian electoral process.`,
            },
          ]);
          return;
        }

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const systemPrompt = `You are an expert Indian Election Assistant.
Rules:
1. ONLY answer questions related to Indian elections, voting process, voter registration, ECI rules, EVMs, VVPATs, or democratic participation.
2. If asked anything UNRELATED to elections or voting, respond: "I'm sorry, I can only help with questions related to the Indian election and voting process."
3. Keep answers concise, factual, and non-partisan.
4. Use polite language.

User Question: ${userMessage}`;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();

        setMessages((prev) => [...prev, { role: 'bot', text }]);
      } catch (error) {
        // Log in dev only — avoid exposing internals in production
        if (import.meta.env.DEV) {
          console.error('AI Error:', error);
        }
        
        const errorMsg = error.message || '';
        let displayError = 'Sorry, I am having trouble connecting. Please check your internet and try again.';
        
        if (errorMsg.includes('403') || errorMsg.toLowerCase().includes('api key')) {
          displayError = 'Authentication failed. Please verify that your Gemini API key is valid and has not been restricted or leaked.';
        } else if (errorMsg.includes('404') && errorMsg.includes('model')) {
          displayError = 'The AI model is currently undergoing maintenance. Please try again shortly.';
        }

        setMessages((prev) => [
          ...prev,
          {
            role: 'error',
            text: displayError,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading]
  );

  const handleInputChange = useCallback((e) => {
    setInput(e.target.value);
    setRateLimitError('');
  }, []);

  const handleToggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  return (
    <div className="chat-container">
      {/* Toggle Button */}
      <button
        className="chat-toggle"
        onClick={handleToggle}
        aria-label={isOpen ? 'Close Chat' : 'Open Election Assistant Chat'}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        {isOpen ? '✕' : '💬'}
        {!isOpen && <span className="chat-toggle__badge" aria-hidden="true" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="chat-window"
          role="dialog"
          aria-label="AI Election Assistant"
          aria-modal="true"
        >
          <div className="chat-header">
            <div className="chat-header__info">
              <div className="chat-header__title">Election AI</div>
              <div className="chat-header__status" aria-label="Assistant is online">
                ● Online
              </div>
            </div>
            <button
              className="chat-header__close"
              onClick={handleClose}
              aria-label="Close chat assistant"
            >
              ✕
            </button>
          </div>

          <div
            className="chat-messages"
            role="log"
            aria-live="polite"
            aria-label="Chat messages"
            aria-relevant="additions"
          >
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message chat-message--${msg.role}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="chat-message chat-message--bot" aria-label="Assistant is typing">
                <div className="typing" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            {rateLimitError && (
              <div
                className="chat-rate-limit-error"
                role="alert"
                aria-live="assertive"
                style={{
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.75rem',
                  color: 'var(--color-error, #dc2626)',
                  background: 'var(--color-error-bg, #fef2f2)',
                  borderTop: '1px solid var(--color-error-border, #fecaca)',
                }}
              >
                ⚠️ {rateLimitError}
              </div>
            )}
            <form className="chat-form" onSubmit={handleSend} aria-label="Send a message">
              <input
                ref={inputRef}
                type="text"
                className="chat-input"
                placeholder="Ask about voting..."
                value={input}
                onChange={handleInputChange}
                disabled={isLoading}
                maxLength={500}
                aria-label="Type your election question"
                aria-describedby={rateLimitError ? 'chat-rate-error' : undefined}
              />
              <button
                type="submit"
                className="chat-send"
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
              >
                ✈️
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

ChatAssistant.displayName = 'ChatAssistant';
export default memo(ChatAssistant);
