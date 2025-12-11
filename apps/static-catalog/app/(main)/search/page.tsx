"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import MiniSearch from "minisearch"
import ProductCard from "@/components/ProductCard"
import { Product, SearchFilters } from "@/types/catalog"
import { Funnel, ArrowUpDown, Search, Mic } from "lucide-react"


export default function JewelrySearch() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const urlQuery = decodeURIComponent(searchParams.get("q") || "").trim()

    const [query, setQuery] = useState(urlQuery)
    const [searchIndex, setSearchIndex] = useState<MiniSearch<Product> | null>(null)
    const [filters, setFilters] = useState<SearchFilters>({})
    const [sortBy, setSortBy] = useState("best-match")
    const [isLoading, setIsLoading] = useState(true)

    const [showFilters, setShowFilters] = useState(false)
    const [showSort, setShowSort] = useState(false)

    const filterRef = useRef<HTMLDivElement>(null)
    const sortRef = useRef<HTMLDivElement>(null)
    const filterBtnRef = useRef<HTMLButtonElement>(null)
    const sortBtnRef = useRef<HTMLButtonElement>(null)

    useEffect(() => setQuery(urlQuery), [urlQuery])

    const handleQueryChange = (value: string) => {
        setQuery(value)
        router.replace(`/search?q=${encodeURIComponent(value.trim())}`)
    }

    // Load search index
    useEffect(() => {
        const loadIndex = async () => {
            try {
                setIsLoading(true)
                const response = await fetch("/data/search-index.json")
                const indexString = await response.text()
                const mini = MiniSearch.loadJSON<Product>(indexString, {
                    fields: ["name", "keywords", "type", "category", "for", "purity", "highlights"]
                })
                setSearchIndex(mini)
            } finally {
                setIsLoading(false)
            }
        }
        loadIndex()
    }, [])

    // Close panels on outside click or Esc
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node) && filterBtnRef.current && !filterBtnRef.current.contains(event.target as Node)) {
                setShowFilters(false)
            }
            if (sortRef.current && !sortRef.current.contains(event.target as Node) && sortBtnRef.current && !sortBtnRef.current.contains(event.target as Node)) {
                setShowSort(false)
            }
        }
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setShowFilters(false)
                setShowSort(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("keydown", handleEsc)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("keydown", handleEsc)
        }
    }, [])

    const results = useMemo(() => {
        if (!searchIndex) return []

        let items: Product[] = []

        if (query.trim()) {
            const res = searchIndex.search(query)
            items = res.map(r => ({
                id: r.id as number,
                name: r.name as string,
                weight: r.weight as number,
                purity: r.purity as string,
                images: r.images as string[],
                category: r.category as string,
                slug: r.slug as string,
                for: r.for as string,
                type: r.type as string[],
                newArrival: r.newArrival as boolean,
                highlights:["",""],
                keywords:""
            }))
        }

        if (filters.minWeight) items = items.filter(p => p.weight >= filters.minWeight!)
        if (filters.maxWeight) items = items.filter(p => p.weight <= filters.maxWeight!)
        if (filters.forWhom) items = items.filter(p => p.for === filters.forWhom)

        switch (sortBy) {
            case "name-asc":
                items = items.sort((a, b) => a.name.localeCompare(b.name))
                break
            case "name-desc":
                items = items.sort((a, b) => b.name.localeCompare(a.name))
                break
            case "weight-asc":
                items = items.sort((a, b) => a.weight - b.weight)
                break
            case "weight-desc":
                items = items.sort((a, b) => b.weight - a.weight)
                break
            case "best-match":
            default:
                break
        }

        return items
    }, [searchIndex, query, filters, sortBy])

    const updateFilter = (key: keyof SearchFilters, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    const startSpeechRecognition = () => {
        if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
            alert("Speech recognition is not supported in this browser.")
            return
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        const recognition = new SpeechRecognition()
        recognition.lang = "en-US"
        recognition.interimResults = false
        recognition.maxAlternatives = 1

        recognition.onresult = (event: any) => {
            const spokenText = event.results[0][0].transcript
            handleQueryChange(spokenText)
        }

        recognition.start()
    }

    return (
        <div className="min-h-screen bg-surface relative">
            <div className="container mx-auto">

                {/* Search + Buttons Row */}
                <div className="flex items-center gap-2 mb-4 relative">
                    <div className="flex items-center border-2 border-primary rounded-xl bg-accent px-3 py-0 w-full max-w-lg">
                        {/* Left Search Icon */}
                        <Search className="text-normal mr-2 shrink-0" size={16} />

                        {/* Text Input */}
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => handleQueryChange(e.target.value)}
                            placeholder="Search jewelry..."
                            className="flex-1 min-w-0 bg-transparent outline-none text-normal placeholder:text-normal"
                        />

                        {/* Mic Button */}
                        <button
                            onClick={startSpeechRecognition}
                            aria-label="Speak your search"
                            className="ml-2 text-normal shrink-0"
                        >
                            <Mic size={16} />
                        </button>

                        {/* Filter Button */}
                        <button
                            ref={filterBtnRef}
                            onClick={() => { setShowFilters(!showFilters); setShowSort(false) }}
                            className="ml-2 text-normal shrink-0" title="Filter search results"
                        >
                            <Funnel size={16} />
                        </button>

                        {/* Sort Button */}
                        <button
                            ref={sortBtnRef}
                            onClick={() => { setShowSort(!showSort); setShowFilters(false) }}
                            className="ml-2 text-normal shrink-0" title="Sort search results"
                        >
                            <ArrowUpDown size={16} />
                        </button>
                    </div>



                    {/* FILTER PANEL */}
                    {showFilters && (
                        <div
                            ref={filterRef}
                            className="absolute right-0 top-full mt-2 w-72 bg-surface border border-theme rounded-xl shadow-lg z-50 p-4"
                        >
                            <h3 className="font-semibold mb-3 text-primary">Filters</h3>
                            <div className="grid grid-cols-1 gap-3">
                                <input
                                    type="number"
                                    placeholder="Min Weight (g)"
                                    value={filters.minWeight || ""}
                                    onChange={(e) => updateFilter("minWeight", e.target.value ? parseFloat(e.target.value) : undefined)}
                                    className="p-2 border border-theme rounded bg-accent text-normal"
                                />
                                <input
                                    type="number"
                                    placeholder="Max Weight (g)"
                                    value={filters.maxWeight || ""}
                                    onChange={(e) => updateFilter("maxWeight", e.target.value ? parseFloat(e.target.value) : undefined)}
                                    className="p-2 border border-theme rounded bg-accent text-normal"
                                />
                                <select
                                    value={filters.forWhom || ""}
                                    onChange={(e) => updateFilter("forWhom", e.target.value || undefined)}
                                    className="p-2 border border-theme rounded bg-accent text-normal"
                                >
                                    <option value="">For Everyone</option>
                                    <option value="her">For Her</option>
                                    <option value="him">For Him</option>
                                    <option value="kids">For Kids</option>
                                    <option value="unisex">Unisex</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* SORT PANEL */}
                    {showSort && (
                        <div
                            ref={sortRef}
                            className="absolute right-0 top-full mt-2 w-72 bg-surface border border-theme rounded-xl shadow-lg z-50 p-4"
                        >
                            <h3 className="font-semibold mb-3 text-primary">Sort By</h3>
                            <div className="grid grid-cols-1 gap-2">
                                <button
                                    onClick={() => setSortBy("best-match")}
                                    className={`p-2 border border-theme rounded ${sortBy === "best-match" ? "bg-accent text-primary" : "bg-surface text-normal"}`}
                                >
                                    Best Match
                                </button>
                                <button
                                    onClick={() => setSortBy("name-asc")}
                                    className={`p-2 border border-theme rounded ${sortBy === "name-asc" ? "bg-accent text-primary" : "bg-surface text-normal"}`}
                                >
                                    Product Name A–Z
                                </button>
                                <button
                                    onClick={() => setSortBy("name-desc")}
                                    className={`p-2 border border-theme rounded ${sortBy === "name-desc" ? "bg-accent text-primary" : "bg-surface text-normal"}`}
                                >
                                    Product Name Z–A
                                </button>
                                <button
                                    onClick={() => setSortBy("weight-asc")}
                                    className={`p-2 border border-theme rounded ${sortBy === "weight-asc" ? "bg-accent text-primary" : "bg-surface text-normal"}`}
                                >
                                    Weight Low → High
                                </button>
                                <button
                                    onClick={() => setSortBy("weight-desc")}
                                    className={`p-2 border border-theme rounded ${sortBy === "weight-desc" ? "bg-accent text-primary" : "bg-surface text-normal"}`}
                                >
                                    Weight High → Low
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results */}
                <div className="mb-4 text-normal font-medium">
                    {query && <span className="text-primary">Search: "{query}" — </span>}
                    {results.length} products found
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {results.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {!isLoading && results.length === 0 && (
                    <div className="text-center py-20 text-normal">No results found.</div>
                )}
            </div>
        </div>
    )
}
