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
    onMicClick: () => void;
    filters: SearchFilters;
    onFilterChange: (key: keyof SearchFilters, value: any) => void;
    sortBy: string;
    onSortChange: (sort: string) => void;
}

export default function SearchBar({
    query,
    onQueryChange,
    onMicClick,
    filters,
    onFilterChange,
    sortBy,
    onSortChange
}: SearchBarProps) {
    const filterBtnRef = useRef<HTMLButtonElement>(null);
    const sortBtnRef = useRef<HTMLButtonElement>(null);

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
        <AnimatePresence>
            <motion.div className="relative w-full backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}>
                <div className="flex items-center border-2 border-primary rounded-xl bg-highlight px-3 py-1 w-full gap-2">
                    <Search className="text-normal shrink-0" size={16} />

                    <input
                        type="text"
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                        placeholder="Search jewelry..."
                        className="flex-1 min-w-0 bg-transparent outline-none text-normal placeholder:text-normal focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />

                    <button onClick={onMicClick || startSpeechRecognition} className="text-normal shrink-0">
                        <Mic size={16} />
                    </button>

                    <div className="relative">
                        <button ref={filterBtnRef}
                            className="text-normal shrink-0 flex items-center justify-center"
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
                            className="text-normal shrink-0 flex items-center justify-center"
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
            </motion.div>
        </AnimatePresence>
    );
}
