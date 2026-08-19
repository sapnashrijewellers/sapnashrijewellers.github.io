"use client";

import { useEffect, useState, useCallback, useId, Suspense } from "react";
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
/* Speech Recognition Web API Types                                           */
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
/* Main SearchBar Component                                                   */
/* -------------------------------------------------------------------------- */

export default function SearchBar({ initialQuery = "" }: SearchBarProps) {
  return (
    <Suspense
      fallback={
        <div className="h-11 w-full rounded-xl bg-light/50 border border-theme animate-pulse" />
      }
    >
      <SearchBarConsumer initialQuery={initialQuery} />
    </Suspense>
  );
}

function SearchBarConsumer({ initialQuery = "" }: SearchBarProps) {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q");

  return (
    <SearchBarInput
      key={urlQuery ?? "__no_query__"}
      initialQuery={urlQuery ?? initialQuery}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Search Input Form                                                          */
/* -------------------------------------------------------------------------- */

function SearchBarInput({ initialQuery = "" }: SearchBarProps) {
  const router = useRouter();
  const inputId = useId();

  const [query, setQuery] = useState(initialQuery);
  const [listening, setListening] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    if (query.trim() !== "") return;

    const intervalId = window.setInterval(() => {
      setPlaceholderIndex((val) => (val + 1) % SUGGESTED_QUERIES.length);
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [query]);

  const executeSearch = useCallback(() => {
    const trimmed = query.trim();
    if (!trimmed) return;

    router.push(`/search?q=${encodeURIComponent(trimmed)}`, { scroll: false });
  }, [query, router]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    executeSearch();
  };

  const startSpeechRecognition = useCallback(() => {
    const speechWindow = window as WindowWithSpeechRecognition;
    const SpeechRecognition =
      speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice search is not supported on this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = query.match(/[\u0900-\u097F]/) ? "hi-IN" : "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onerror = (event) => {
      setListening(false);
      if (event.error === "not-allowed") {
        alert("Please allow microphone access to use voice search.");
      } else if (event.error === "no-speech") {
        alert("No speech detected. Try again.");
      }
    };

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0]?.transcript?.trim();
      if (!spokenText) return;

      setQuery(spokenText);
      router.push(`/search?q=${encodeURIComponent(spokenText)}`, {
        scroll: false,
      });
    };

    recognition.start();
  }, [query, router]);

  const currentPlaceholder = SUGGESTED_QUERIES[placeholderIndex];

  return (
    <form
      role="search"
      aria-label="Sitewide jewellery catalog search"
      onSubmit={handleFormSubmit}
      className="relative w-full"
    >
      <label htmlFor={inputId} className="sr-only">
        खोजें या बोलें (Search jewellery catalog)
      </label>

      {/* Screen-reader live status for voice feedback */}
      <div className="sr-only" aria-live="polite">
        {listening
          ? "Microphone is listening. Speak to search."
          : `Search jewellery catalog. Suggested query: ${currentPlaceholder}`}
      </div>

      <div
        className="
          flex items-center
          h-11
          rounded-xl
          bg-light
          border border-theme
          focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent
          transition-[border-color,box-shadow] duration-150 ease-out
          will-change-[box-shadow]
        "
      >
        {/* Search Input */}
        <input
          id={inputId}
          type="search"
          name="q"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={currentPlaceholder}
          inputMode="search"
          aria-label="Search jewellery by name, design, or category"
          className={`
            flex-1
            h-full
            bg-transparent
            border-0
            outline-none
            px-3.5
            text-sm
            text-foreground
            placeholder:text-muted-foreground/70
            rounded-l-xl
            transition-opacity duration-150
            ${listening ? "animate-pulse text-primary font-medium" : ""}
          `}
        />

        {/* Voice Search Button */}
        <button
          type="button"
          onClick={startSpeechRecognition}
          aria-label={
            listening
              ? "Listening for voice input..."
              : "Voice search: search jewellery using microphone"
          }
          aria-pressed={listening}
          className="
            h-full
            px-2.5
            inline-flex items-center justify-center
            text-muted-foreground
            hover:text-primary
            focus:outline-none focus:text-primary
            transition-colors duration-150
          "
        >
          <Mic
            className={`w-[18px] h-[18px] ${listening ? "text-primary animate-bounce" : ""}`}
            aria-hidden="true"
          />
          <span className="sr-only">Voice search</span>
        </button>

        {/* Search Submit Button */}
        <button
          type="submit"
          aria-label="Submit search query"
          className="
            h-full
            px-3.5
            inline-flex items-center justify-center
            text-muted-foreground
            hover:text-primary
            focus:outline-none focus:text-primary
            transition-colors duration-150
          "
        >
          <Search className="w-[18px] h-[18px]" aria-hidden="true" />
          <span className="sr-only">Search</span>
        </button>
      </div>
    </form>
  );
}