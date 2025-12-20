"use client";

import { Search, Mic } from "lucide-react";

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  onSearch: () => void;
}

export default function SearchBar({
  query,
  onQueryChange,
  onSearch,
}: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch();
    }
  };

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
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      const spokenText = event.results[0][0].transcript;
      onQueryChange(spokenText);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      alert("Microphone access denied or unavailable.");
    };

    recognition.start();
  };

  return (
    <div className="relative w-full">
      <div className="
  flex items-center
  rounded-xl
  bg-highlight
  w-full
  gap-2
  px-2 py-1
  ring-1 ring-black/10
  focus-within:ring-2 focus-within:ring-primary
  transition
">
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search jewellery..."
          inputMode="search"
          className="flex-1 min-w-0 bg-transparent outline-none text-normal placeholder:text-normal focus:outline-none rounded-md px-2 py-2"
        />

        {/* Mic Button */}
        <button
          type="button"
          onClick={startSpeechRecognition}
          title="Speak to search"
          aria-label="Voice search"
          className="ssj-btn flex items-center justify-center min-w-[36px] min-h-[36px]"
        >
          <Mic size={18} />
        </button>

        {/* Search Button */}
        <button
          type="button"
          onClick={onSearch}
          title="Search"
          aria-label="Search"
          className="ssj-btn flex items-center justify-center min-w-[36px] min-h-[36px]"
        >
          <Search size={18} />
        </button>
      </div>
    </div>
  );
}
