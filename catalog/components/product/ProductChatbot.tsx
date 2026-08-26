"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Sparkles, Bot } from "lucide-react";
import type { Product } from "@/types/catalog";

interface Message {
  role: "user" | "bot";
  text: string;
}

interface ProductChatbotProps {
  product: Product;
}

export default function ProductChatbot({ product }: ProductChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    `Is this pure 925 silver?`,
    `What are the delivery charges?`,
    `Can I get this customized?`,
  ];

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input.trim();
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
          currentProduct: {
            name: product.name,
            purity: product.purity || "925 Silver",
            weight: product.weight,
            available: product.available,
            makingCharges: product.makingCharges,
            highlights: product.highlights,
            description: product.description,
          },
        }),
      });

      const data = await res.json();
      setMessages([...nextMessages, { role: "bot", text: data.reply }]);
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: "bot",
          text: "Unable to connect right now. Please reach out via WhatsApp.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      aria-label="Product AI Assistant"
      className="my-6 rounded-2xl border border-theme/40 bg-surface/90 p-4 sm:p-5 shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-theme/20 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
          <h3 className="text-sm sm:text-base font-semibold text-foreground">
            Ask AI about this Jewellery
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          {isOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <MessageSquare className="h-4 w-4" />
          )}
          {isOpen ? "Close Chat" : "Open Assistant"}
        </button>
      </div>

      {/* Suggested Quick Questions */}
      <div className="mt-3 flex flex-wrap gap-2">
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              if (!isOpen) setIsOpen(true);
              handleSend(q);
            }}
            className="btn rounded-full border border-theme/60 bg-background px-3 py-1 text-xs text-foreground/80 hover:border-primary hover:text-primary transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Volatile Collapsible Multi-Chat */}
      {isOpen && (
        <div className="mt-4 flex flex-col h-[320px] rounded-xl border border-theme/40 bg-background overflow-hidden">
          <div
            ref={chatScrollRef}
            className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs sm:text-sm"
          >
            {messages.length === 0 && (
              <p className="text-center text-muted-foreground pt-8">
                Ask anything regarding dimensions, purity, dispatch timelines,
                or policies.
              </p>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-2 ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.role === "bot" && (
                  <Bot className="h-4 w-4 text-primary shrink-0 mt-1" />
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 leading-relaxed ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-xs"
                      : "bg-surface border border-theme/30 text-foreground rounded-tl-xs"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-muted-foreground text-xs italic">
                <Bot className="h-4 w-4 animate-bounce text-primary" />
                <span>Generating answer...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center border-t border-theme/20 bg-surface p-2 gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about this product..."
              className="flex-1 bg-background border border-theme/40 rounded-lg px-3 py-1.5 text-xs sm:text-sm outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send query"
              className="p-2 rounded-lg bg-primary text-white disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
