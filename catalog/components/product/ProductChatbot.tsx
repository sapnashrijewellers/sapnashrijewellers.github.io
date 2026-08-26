"use client";

import { useState, useRef, useEffect, useId } from "react";
import { MessageSquare, Send, X, Sparkles, Bot, User, Loader2 } from "lucide-react";
import type { Product } from "@/types/catalog";

interface Message {
  role: "user" | "bot";
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
  const normalizedContent = content.replace(/\s\*\s\*\*/g, "\n* **");
  const lines = normalizedContent.split("\n").filter((l) => l.trim().length > 0);

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
            className="text-primary font-medium underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            {label}
          </a>
        );
      }

      // Match Bold Text: **text**
      const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);
      if (boldMatch) {
        return (
          <strong key={index} className="font-semibold text-foreground">
            {boldMatch[1]}
          </strong>
        );
      }

      // Match Raw URLs: https://...
      if (part.startsWith("http://") || part.startsWith("https://")) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-medium underline underline-offset-2 break-all hover:opacity-80 transition-opacity"
          >
            {part}
          </a>
        );
      }

      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="space-y-2 text-xs sm:text-sm leading-relaxed">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();

        // Check if line is a bullet item (* item or - item)
        const isBullet = trimmed.startsWith("* ") || trimmed.startsWith("- ");
        const bulletText = isBullet ? trimmed.replace(/^(\*|-)\s+/, "") : trimmed;

        if (isBullet) {
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-1">
              <span className="text-primary font-bold select-none mt-0.5">•</span>
              <div className="flex-1 min-w-0">{renderInlineStyles(bulletText)}</div>
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

export default function ProductChatbot({ product, className = "" }: ProductChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const inputId = useId();

  const suggestedQuestions = [
    "Is this pure 925 silver?",
    "What is the return & exchange policy?",
    "What are the delivery charges?",
    "Can I get this customized on WhatsApp?",
  ];

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || loading) return;

    const userMessage: Message = { role: "user", text: textToSend };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || "";
      const res = await fetch(`${workerUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          currentProduct: product,
        }),
      });

      if (!res.ok) {
        throw new Error(`Worker returned status: ${res.status}`);
      }

      const data = await res.json();
      setMessages([...nextMessages, { role: "bot", text: data.reply }]);
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: "bot",
          text: "I am unable to connect right now. Please reach out to us on WhatsApp at **+91 8234042231**.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      aria-label="Product AI Shopping Assistant"
      className={`my-6 rounded-2xl border border-theme/40 bg-surface shadow-sm overflow-hidden ${className}`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-theme/20 px-4 py-3 bg-surface/90">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </div>
          <h3 className="text-xs sm:text-sm font-semibold text-foreground">
            Ask AI about this Jewellery (AI सहायता)
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline focus:outline-none focus:ring-1 focus:ring-primary rounded px-1.5 py-0.5"
        >
          {isOpen ? <X className="h-3.5 w-3.5" /> : <MessageSquare className="h-3.5 w-3.5" />}
          <span>{isOpen ? "Close Chat" : "Ask Question"}</span>
        </button>
      </div>

      {/* Suggested Quick Questions */}
      <div className="p-3 sm:p-4 bg-background/50 border-b border-theme/10">
        <p className="text-[11px] text-muted-foreground font-medium mb-2">
          Suggested Questions:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (!isOpen) setIsOpen(true);
                handleSend(q);
              }}
              className="rounded-full border border-theme/60 bg-surface px-3 py-1 text-[11px] sm:text-xs text-foreground/85 hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Collapsible Chat Log Container */}
      {isOpen && (
        <div className="flex flex-col h-[360px] bg-background overflow-hidden">
          {/* Messages Area */}
          <div
            ref={chatScrollRef}
            className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 scroll-smooth"
          >
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center p-4 text-muted-foreground space-y-1">
                <Bot className="h-7 w-7 text-primary/60 mb-1" aria-hidden="true" />
                <p className="text-xs sm:text-sm font-medium text-foreground">
                  How can I help you with this piece?
                </p>
                <p className="text-[11px] max-w-xs">
                  Ask regarding purity, dispatch timelines, custom name engraving, or store policies.
                </p>
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.role === "bot" && (
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="h-3.5 w-3.5" aria-hidden="true" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-2xs ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-xs"
                      : "bg-surface border border-theme/40 text-foreground rounded-tl-xs"
                  }`}
                >
                  {m.role === "bot" ? (
                    <FormattedMessage content={m.text} />
                  ) : (
                    <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                      {m.text}
                    </p>
                  )}
                </div>

                {m.role === "user" && (
                  <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center shrink-0 mt-0.5">
                    <User className="h-3.5 w-3.5" aria-hidden="true" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-muted-foreground text-xs italic pl-1">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
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
            className="flex items-center border-t border-theme/20 bg-surface p-2 gap-2"
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
              className="flex-1 bg-background border border-theme/40 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send question"
              className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </form>
        </div>
      )}
    </section>
  );
}