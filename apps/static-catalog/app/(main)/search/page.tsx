"use client"
import { useState, useEffect, useMemo } from 'react'
import MiniSearch from 'minisearch'
import ProductCard from "@/components/ProductCard"
import { Product, SearchFilters } from "@/types/catalog"


export default function JewelrySearch() {
    const [searchIndex, setSearchIndex] = useState<MiniSearch<Product> | null>(null)
    const [query, setQuery] = useState('')
    const [filters, setFilters] = useState<SearchFilters>({})
    const [isLoading, setIsLoading] = useState(true)

    // Initialize search index
    useEffect(() => {
        const initializeSearch = async () => {
            try {
                setIsLoading(true)

                // In production, fetch from your generated index file:
                const response = await fetch('/data/search-index.json')
                const indexString = await response.text()

                const miniSearch = MiniSearch.loadJSON<Product>(indexString, {
                    fields: ['name', 'keywords', 'type', 'category', 'for', 'purity', 'highlights']
                })
                setSearchIndex(miniSearch)
            } catch (error) {
                console.error('Failed to load search index:', error)
            } finally {
                setIsLoading(false)
            }
        }

        initializeSearch()
    }, [])

    // Search and filter products - computed from searchIndex and inputs
    const results = useMemo(() => {
        if (!searchIndex) return []

        let products: Product[]

        if (query.trim()) {
            // Perform search - MiniSearch returns SearchResult with all storeFields
            const searchResults = searchIndex.search(query)
            console.log(searchResults);
            // Extract the product data from search results
            products = searchResults.map(result => {
                const product: Product = {
                    id: result.id as number,
                    name: result.name as string,
                    weight: result.weight as number,
                    purity: result.purity as string,
                    images: result.images as string[],
                    category: result.category as string,
                    slug: result.slug as string,
                    for: result.for as string,
                    type: result.type as string | string[],
                    newArrival: result.newArrival as boolean
                }
                return product
            })
        } else {
            // No query - return all products
            products = [];
        }

        if (filters.minWeight !== undefined && filters.minWeight > 0) {
            products = products.filter(p => p.weight >= filters.minWeight!)
        }

        if (filters.maxWeight !== undefined && filters.maxWeight > 0) {
            products = products.filter(p => p.weight <= filters.maxWeight!)
        }
        if (filters.forWhom) {
            products = products.filter(p => p.for === filters.forWhom)
        }

        return products
    }, [searchIndex, query, filters])

    const updateFilter = (key: keyof SearchFilters, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="text-lg text-gray-600">Loading jewelry catalog...</div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
            <div className="container mx-auto p-6 max-w-7xl">

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search jewelry (e.g., सोने की चूड़ी, bangles, चांदी, ring)"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full p-4 pr-12 text-lg border-2 border-yellow-400 rounded-xl focus:border-yellow-500 focus:outline-none shadow-lg"
                        />
                        <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    <input
                        type="number"
                        placeholder="Min Weight (g)"
                        value={filters.minWeight || ''}
                        onChange={(e) => updateFilter('minWeight', e.target.value ? parseFloat(e.target.value) : undefined)}
                        className="p-3 border-2 border-gray-200 rounded-lg focus:border-yellow-400 focus:outline-none"
                    />

                    <input
                        type="number"
                        placeholder="Max Weight (g)"
                        value={filters.maxWeight || ''}
                        onChange={(e) => updateFilter('maxWeight', e.target.value ? parseFloat(e.target.value) : undefined)}
                        className="p-3 border-2 border-gray-200 rounded-lg focus:border-yellow-400 focus:outline-none"
                    />
                    <select
                        value={filters.forWhom || ''}
                        onChange={(e) => setFilters({ ...filters, forWhom: e.target.value || undefined })}
                        className="p-2 border rounded"
                    >
                        <option value="">For Everyone</option>
                        <option value="her">For Her</option>
                        <option value="him">For Him</option>
                        <option value="kids">For Kids</option>
                        <option value="unisex">Unisex</option>
                    </select>
                </div>

                {/* Results Count */}
                <div className="mb-4 text-gray-700 font-medium">
                    {query && <span className="text-yellow-600">Search: "{query}" - </span>}
                    {results.length} products found
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {results.map(product => (
                        <ProductCard key={product.id}
                            product={product}
                        />
                    ))}
                </div>

                {/* No Results */}
                {results.length === 0 && !isLoading && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-xl text-gray-600 mb-2">No products found</p>
                        <p className="text-gray-400">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    )
}