'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import AnimeCard from '@/components/AnimeCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import Pagination from '@/components/Pagination'
import { Search, Filter } from 'lucide-react'
import { searchAnime, AnimeItem, PaginatedResponse } from '@/lib/api'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  
  const [searchResults, setSearchResults] = useState<PaginatedResponse<AnimeItem>>({
    data: [],
    pagination: { currentPage: 1, totalPages: 1, hasNext: false, hasPrev: false }
  })
  const [loading, setLoading] = useState(false)
  const [searchInput, setSearchInput] = useState(query)
  const [currentPage, setCurrentPage] = useState(1)

  const handleSearch = async (searchQuery: string, page: number = 1) => {
    if (!searchQuery.trim()) return
    
    setLoading(true)
    try {
      const results = await searchAnime(searchQuery, page)
      setSearchResults({
        data: results.data.animeList,
        pagination: {
          currentPage: results.pagination?.currentPage || 1,
          totalPages: results.pagination?.totalPages || 1,
          hasNext: results.pagination?.hasNextPage || false,
          hasPrev: results.pagination?.hasPrevPage || false
        }
      })
      setCurrentPage(page)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (query) {
      handleSearch(query)
    }
  }, [query])

  const handlePageChange = (page: number) => {
    handleSearch(searchInput, page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      window.history.pushState({}, '', `/search?q=${encodeURIComponent(searchInput.trim())}`)
      handleSearch(searchInput.trim())
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Navbar />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Search Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              <span className="gradient-text">Pencarian Anime</span>
            </h1>
            <p className="text-gray-400 mb-6">
              Temukan anime favorit Anda dari ribuan koleksi kami
            </p>
            
            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Masukkan judul anime..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full px-6 py-4 pl-12 bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl focus:outline-none focus:border-aozora-blue-500 text-white placeholder-gray-400 text-lg"
                />
                <Search className="absolute left-4 top-4 text-gray-400" size={24} />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bg-aozora-blue-600 hover:bg-aozora-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                >
                  Cari
                </button>
              </div>
            </form>
          </div>

          {/* Search Results */}
          {query && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  Hasil pencarian untuk: <span className="text-aozora-blue-400">"{query}"</span>
                </h2>
                {searchResults.data.length > 0 && (
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Filter size={16} />
                    <span>{searchResults.data.length} hasil ditemukan</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="text-gray-400 mt-4">Mencari anime...</p>
              </div>
            </div>
          )}

          {/* Search Results Grid */}
          {!loading && searchResults.data.length > 0 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8">
                {searchResults.data.map((anime) => (
                  <AnimeCard key={anime.id} anime={anime} />
                ))}
              </div>
              
              <Pagination
                currentPage={searchResults.pagination.currentPage}
                totalPages={searchResults.pagination.totalPages}
                hasNext={searchResults.pagination.hasNext}
                hasPrev={searchResults.pagination.hasPrev}
                onPageChange={handlePageChange}
              />
            </>
          )}

          {/* No Results */}
          {!loading && query && searchResults.data.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-gray-600" size={40} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tidak ada hasil ditemukan</h3>
              <p className="text-gray-400 mb-6">
                Coba gunakan kata kunci yang berbeda atau periksa ejaan Anda
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>Tips pencarian:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Gunakan kata kunci yang lebih umum</li>
                  <li>Periksa ejaan kata kunci</li>
                  <li>Coba gunakan judul bahasa Inggris atau Jepang</li>
                </ul>
              </div>
            </div>
          )}

          {/* Popular Searches */}
          {!query && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-6">Pencarian Populer</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  'Attack on Titan',
                  'Demon Slayer',
                  'One Piece',
                  'Naruto',
                  'Dragon Ball',
                  'Jujutsu Kaisen',
                  'My Hero Academia',
                  'Death Note'
                ].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchInput(term)
                      window.history.pushState({}, '', `/search?q=${encodeURIComponent(term)}`)
                      handleSearch(term)
                    }}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors duration-200"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
