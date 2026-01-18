"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Mic } from "lucide-react";

interface SearchBarProps {
  initialQuery?: string;
}

export default function SearchBar({ initialQuery = "" }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q");
  const [query, setQuery] = useState(initialQuery);

  /* Animated placeholder suggestions */

  const SUGGESTED_QUERIES = [
    "Golden ring",
    "Sawariya Seth Ring",
    "Mahadev Kada",
    "Bridal Necklace Set",
    "Daily wear bangles",
    "Lightweight mangalsutra",
  ];

  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    if (query.trim() !== "") return;

    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % SUGGESTED_QUERIES.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [query]);

  /* Placeholder animation */

  /* -------------------------------------------
     Sync once from URL (on mount / URL change)
  ------------------------------------------- */
  useEffect(() => {
    if (urlQuery !== null && urlQuery !== query) {
      setQuery(urlQuery);
    }
  }, [urlQuery]);


  /* -------------------------------------------
     Execute search (single source of truth)
  ------------------------------------------- */
  const executeSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    router.push(`/search?q=${encodeURIComponent(trimmed)}`, {
      scroll: false,
    });
  };

  /* -------------------------------------------
     Keyboard handler
  ------------------------------------------- */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executeSearch();
    }
  };

  /* -------------------------------------------
     Voice search
  ------------------------------------------- */
  const startSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice search is not supported on this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const spokenText = event.results[0][0].transcript;
      setQuery(spokenText);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      alert("Microphone access denied or unavailable.");
    };

    recognition.start();
  };

  /* -------------------------------------------
     UI
  ------------------------------------------- */
  return (
    <div className="relative w-full min-w-0">
      <div className="flex w-full items-center gap-0 rounded-xl bg-light
      px-1 py-1 min-w-0 ring-1 ring-[var(--border)]
      focus-within:ring-2 focus-within:ring-[var(--primary)] transition"
      >
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={SUGGESTED_QUERIES[placeholderIndex]}
          inputMode="search"
          className="flex-1 w-0 min-w-0 bg-transparent outline-none p-1
             placeholder:text-muted"
        />

        <button className="w-8 h-9 shrink-0 flex items-center justify-center">
          <Mic size={18} />
        </button>

        <button className="w-8 h-9 shrink-0 flex items-center justify-center">
          <Search size={18} />
        </button>
      </div>
    </div>
  );
}
