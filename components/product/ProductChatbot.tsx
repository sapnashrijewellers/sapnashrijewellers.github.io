'use client';

import { useState, useRef, useEffect, useId } from 'react';
import { MessageSquare, Send, X, Sparkles, Bot, User, Loader2 } from 'lucide-react';
import type { Product } from '@/types/catalog';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

interface ProductChatbotProps {
  product: Product;
  className?: string;
}

/* -------------------------------------------------------------------------- */
/* Lightweight Markdown & Link Parser Component (Zero Extra Dependencies)    */
/* -------------------------------------------------------------------------- */

function FormattedMessage({ content }: { content: string }) {
  if (!content) return null;

  // Split content by explicit newlines or inline bullet points (* / -)
  const normalizedContent = content.replace(/\s\*\s\*\*/g, '\n* **');
  const lines = normalizedContent.split('\n').filter((l) => l.trim().length > 0);

  const renderInlineStyles = (text: string) => {
    // Regex matches:
    // 1. Markdown links: [anchor text](url)
    // 2. Bold text: **bold**
    // 3. Raw URLs: https://...
    const regex = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|https?:\/\/[^\s]+)/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (!part) return null;

      // Match Markdown Link: [label](url)
      const markdownLinkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (markdownLinkMatch) {
        const [, label, url] = markdownLinkMatch;
        return (
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-2 transition-opacity hover:opacity-80"
          >
            {label}
          </a>
        );
      }

      // Match Bold Text: **text**
      const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);
      if (boldMatch) {
        return (
          <strong key={index} className="text-foreground font-semibold">
            {boldMatch[1]}
          </strong>
        );
      }

      // Match Raw URLs: https://...
      if (part.startsWith('http://') || part.startsWith('https://')) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium break-all underline underline-offset-2 transition-opacity hover:opacity-80"
          >
            {part}
          </a>
        );
      }

      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="space-y-2 text-xs leading-relaxed sm:text-sm">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();

        // Check if line is a bullet item (* item or - item)
        const isBullet = trimmed.startsWith('* ') || trimmed.startsWith('- ');
        const bulletText = isBullet ? trimmed.replace(/^(\*|-)\s+/, '') : trimmed;

        if (isBullet) {
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-1">
              <span className="mt-0.5 font-bold select-none">•</span>
              <div className="min-w-0 flex-1">{renderInlineStyles(bulletText)}</div>
            </div>
          );
        }

        return <p key={lineIdx}>{renderInlineStyles(trimmed)}</p>;
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Product Chatbot Component                                             */
/* -------------------------------------------------------------------------- */

export default function ProductChatbot({ product, className = '' }: ProductChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const inputId = useId();

  const suggestedQuestions = [
    'Is this pure 925 silver?',
    'What is the return & exchange policy?',
    'What are the delivery charges?',
    'Can I get this customized on WhatsApp?',
  ];

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || loading) return;

    const userMessage: Message = { role: 'user', text: textToSend };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || '';
      const res = await fetch(`${workerUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages,
          currentProduct: product,
        }),
      });

      if (!res.ok) {
        throw new Error(`Worker returned status: ${res.status}`);
      }

      const data = await res.json();
      setMessages([...nextMessages, { role: 'bot', text: data.reply }]);
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: 'bot',
          text: 'I am unable to connect right now. Please reach out to us on WhatsApp at **+91 8234042231**.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      aria-label="Product AI Shopping Assistant"
      className={`bg-surface my-6 overflow-hidden rounded-2xl shadow-sm ${className}`}
    >
      {/* Header Bar */}
      <div className="bg-surface/90 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 rounded-lg p-1">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </div>
          <h3 className="text-foreground text-xl font-semibold">Ask AI</h3>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="ssj ssj-btn inline-flex items-center gap-1.5"
        >
          {isOpen ? <X className="h-3.5 w-3.5" /> : <MessageSquare className="h-3.5 w-3.5" />}
          <span className="">{isOpen ? 'Close Chat' : 'Ask Question'}</span>
        </button>
      </div>

      {/* Suggested Quick Questions */}
      <div className="bg-background p-3 sm:p-4">
        <p className="text-muted-foreground mb-2 text-[11px] font-medium">Suggested Questions:</p>
        <div className="flex flex-wrap gap-1.5">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (!isOpen) setIsOpen(true);
                handleSend(q);
              }}
              className="border-theme/60 bg-surface text-foreground/85 cursor-pointer rounded-full border px-3 py-1 text-[11px] transition-colors sm:text-xs"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Collapsible Chat Log Container */}
      {isOpen && (
        <div className="bg-background flex h-90 flex-col overflow-hidden">
          {/* Messages Area */}
          <div ref={chatScrollRef} className="flex-1 space-y-3 overflow-y-auto scroll-smooth p-3 sm:p-4">
            {messages.length === 0 && (
              <div className="text-muted-foreground flex h-full flex-col items-center justify-center space-y-1 p-4 text-center">
                <Bot className="mb-1 h-7 w-7" aria-hidden="true" />
                <p className="text-foreground text-xs font-medium sm:text-sm">How can I help you with this piece?</p>
                <p className="max-w-xs text-[11px]">
                  Ask regarding purity, dispatch timelines, custom name engraving, or store policies.
                </p>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'bot' && (
                  <div className="bg-primary/10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    <Bot className="h-3.5 w-3.5" aria-hidden="true" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-2xs ${
                    m.role === 'user'
                      ? 'bg-primary rounded-tr-xs'
                      : 'bg-surface border-theme/40 text-foreground rounded-tl-xs border'
                  }`}
                >
                  {m.role === 'bot' ? (
                    <FormattedMessage content={m.text} />
                  ) : (
                    <p className="text-xs leading-relaxed whitespace-pre-wrap sm:text-sm">{m.text}</p>
                  )}
                </div>

                {m.role === 'user' && (
                  <div className="bg-muted text-muted-foreground mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    <User className="h-3.5 w-3.5" aria-hidden="true" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="text-muted-foreground flex items-center gap-2 pl-1 text-xs italic">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Checking product details...</span>
              </div>
            )}
          </div>

          {/* Chat Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="border-theme/20 bg-surface flex items-center gap-2 border-t p-2"
          >
            <label htmlFor={inputId} className="sr-only">
              Ask AI a question about this product
            </label>
            <input
              id={inputId}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about dimensions, purity, dispatch..."
              disabled={loading}
              className="bg-background border-theme/40 text-foreground placeholder:text-muted-foreground/60 focus:ring-primary flex-1 rounded-xl border px-3.5 py-2 text-sm outline-none focus:ring-1 disabled:opacity-50 sm:text-sm"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send question"
              className="bg-primary hover:bg-primary/90 cursor-pointer rounded-xl p-2.5 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
