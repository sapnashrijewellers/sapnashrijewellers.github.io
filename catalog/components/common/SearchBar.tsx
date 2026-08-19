"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Mic } from "lucide-react";

interface SearchBarProps {
  initialQuery?: string;
}

const SUGGESTED_QUERIES = [
  "Sawariya Seth Ring",
  "Mahadev Kada",
  "Lightweight mangalsutra",
];

/* -------------------------------------------------------------------------- */
/* Speech Recognition Types                                                   */
/* -------------------------------------------------------------------------- */

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;

  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;

  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

interface WindowWithSpeechRecognition extends Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

/* -------------------------------------------------------------------------- */
/* Search Bar                                                                 */
/* -------------------------------------------------------------------------- */

export default function SearchBar({
  initialQuery = "",
}: SearchBarProps) {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q");

  /*
   * The key forces SearchBarInput to remount when the URL query changes.
   *
   * This replaces:
   *
   * useEffect(() => {
   *   setQuery(urlQuery);
   * }, [urlQuery]);
   *
   * and avoids setState() inside an effect.
   */
  return (
    <SearchBarInput
      key={urlQuery ?? "__no_query__"}
      initialQuery={urlQuery ?? initialQuery}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Actual Search Input                                                        */
/* -------------------------------------------------------------------------- */

function SearchBarInput({
  initialQuery = "",
}: SearchBarProps) {
  const router = useRouter();

  const [query, setQuery] = useState(initialQuery);
  const [listening, setListening] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    if (query.trim() !== "") {
      return;
    }

    const intervalId = window.setInterval(() => {
      setPlaceholderIndex(
        (value) => (value + 1) % SUGGESTED_QUERIES.length
      );
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [query]);

  const executeSearch = () => {
    const trimmed = query.trim();

    if (!trimmed) {
      return;
    }

    router.push(
      `/search?q=${encodeURIComponent(trimmed)}`,
      { scroll: false }
    );
  };

  const startSpeechRecognition = () => {
    const speechWindow = window as WindowWithSpeechRecognition;

    const SpeechRecognition =
      speechWindow.SpeechRecognition ??
      speechWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice search is not supported on this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = query.match(/[\u0900-\u097F]/)
      ? "hi-IN"
      : "en-IN";

    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = (event) => {
      setListening(false);

      if (event.error === "not-allowed") {
        alert("Please allow microphone access to use voice search.");
      } else if (event.error === "no-speech") {
        alert("No speech detected. Try again.");
      }
    };

    recognition.onresult = (event) => {
      const spokenText =
        event.results[0][0].transcript.trim();

      if (!spokenText) {
        return;
      }

      setQuery(spokenText);

      router.push(
        `/search?q=${encodeURIComponent(spokenText)}`,
        { scroll: false }
      );
    };

    recognition.start();
  };

  return (
    <div className="relative w-full">
      <div
        className="
          flex items-center
          h-11
          rounded-xl
          bg-light
          ring-1 ring-[var(--border)]
          focus-within:ring-2 focus-within:ring-[var(--primary)]
          transition
        "
      >
        {/* SEARCH INPUT */}
        <input
          aria-label="Search jewellery"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              executeSearch();
            }
          }}
          placeholder={SUGGESTED_QUERIES[placeholderIndex]}
          inputMode="search"
          className={`
            ${listening ? "animate-pulse text-primary" : ""}
            flex-1
            h-full
            bg-transparent
            border-0
            outline-none
            px-3
            text-sm
            placeholder:text-muted
            rounded-none
          `}
        />

        {/* MIC */}
        <button
          type="button"
          onClick={startSpeechRecognition}
          aria-label="Voice search"
          className="
            h-full
            px-2
            flex items-center justify-center
            text-muted
            hover:text-[var(--primary)]
            transition
          "
        >
          <Mic size={18} />
        </button>

        {/* SEARCH */}
        <button
          type="button"
          onClick={executeSearch}
          aria-label="Search"
          className="
            h-full
            px-3
            flex items-center justify-center
            text-muted
            hover:text-[var(--primary)]
            transition
          "
        >
          <Search size={18} />
        </button>
      </div>
    </div>
  );
}