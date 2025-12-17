"use client";

import { Search, Mic, Funnel, ArrowUpDown } from "lucide-react";
import { FilterPanel } from "@/components/common/FilterPanel";
import { SortPanel } from "@/components/common/SortPanel";
import { SearchFilters } from "@/types/catalog";
import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
    query: string;
    onQueryChange: (q: string) => void;
    onSearch: () => void;
    filters: SearchFilters;
    onFilterChange: (k: keyof SearchFilters, v: any) => void;
    sortBy: string;
    onSortChange: (v: string) => void;
    onMicClick?: () => void;
}

export default function SearchBar({
    query,
    onQueryChange,
    onSearch,
    filters,
    onFilterChange,
    sortBy,
    onSortChange,
    onMicClick
}: SearchBarProps) {
    const filterBtnRef = useRef<HTMLButtonElement>(null);
    const sortBtnRef = useRef<HTMLButtonElement>(null);
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            onSearch();
        }
    };

    const startSpeechRecognition = () => {
        if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
            const spokenText = event.results[0][0].transcript;
            onQueryChange(spokenText);
        };

        recognition.start();
    };

    return (

        <div className="relative w-full">
            <div className="flex items-center border-2 border-primary rounded-xl bg-highlight w-full gap-1 p-0.5">
                <input
                    type="search"
                    value={query}
                    onChange={e => onQueryChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search jewellery..."
                    inputMode="search"
                    className="rounded-2xl flex-1 min-w-0 outline-none text-normal placeholder:text-normal focus:outline-none focus:ring-1 focus:ring-purple-500"

                />

                <button onClick={onMicClick || startSpeechRecognition}
                    className="ssj-btn text-normal shrink-0" title="Speak to search">
                    <Mic size={16} />
                </button>
                {/* Search Button (inside input) */}
                <button
                    type="button"
                    className="ssj-btn"
                    onClick={onSearch}
                    aria-label="Search"
                    title="Click to search"
                >
                    <Search className="text-normal shrink-0" size={16} />
                </button>

                <div className="relative">
                    <button ref={filterBtnRef}
                        className="ssj-btn text-normal shrink-0 flex items-center justify-center"
                        title="Filter search results">
                        <Funnel size={16} />
                    </button>
                    <FilterPanel
                        filters={filters}
                        onChange={onFilterChange}
                        triggerRef={filterBtnRef}
                    />
                </div>

                <div className="relative">
                    <button ref={sortBtnRef}
                        className="ssj-btn text-normal shrink-0 flex items-center justify-center"
                        title="Sort search results">
                        <ArrowUpDown size={16} />
                    </button>
                    <SortPanel
                        sortBy={sortBy}
                        onSortChange={onSortChange}
                        triggerRef={sortBtnRef}
                    />
                </div>
            </div>
        </div>

    );
}
