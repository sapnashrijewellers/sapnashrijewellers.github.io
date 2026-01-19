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
    const i = setInterval(
      () => setPlaceholderIndex(v => (v + 1) % SUGGESTED_QUERIES.length),
      3000
    );
    return () => clearInterval(i);
  }, [query]);

  useEffect(() => {
    if (urlQuery !== null && urlQuery !== query) {
      setQuery(urlQuery);
    }
  }, [urlQuery]);

  const executeSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`, { scroll: false });
  };

  return (
    <div className="relative w-full">
      {/* SINGLE visual control */}
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
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && executeSearch()}
          placeholder={SUGGESTED_QUERIES[placeholderIndex]}
          inputMode="search"
          className="
            flex-1
            h-full
            bg-transparent
            border-0
            outline-none
            px-3
            text-sm
            placeholder:text-muted
            rounded-none
          "
        />

        {/* MIC */}
        <button
          type="button"
          onClick={() => {}}
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
