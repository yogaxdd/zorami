'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import AnimeCard from '@/components/AnimeCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import Pagination from '@/components/Pagination'
import { TrendingUp, Star, Flame } from 'lucide-react'
import { fetchPopularAnime, AnimeItem, PaginatedResponse } from '@/lib/api'

export default function PopularPage() {
  const [animeList, setAnimeList] = useState<PaginatedResponse<AnimeItem>>({
    data: [],
    pagination: { currentPage: 1, totalPages: 1, hasNext: false, hasPrev: false }
  })
  const [loading, setLoading] = useState(true)

  const loadAnime = async (page: number = 1) => {
    setLoading(true)
    try {
      const results = await fetchPopularAnime(page)
      setAnimeList(results)
    } catch (error) {
      console.error('Error loading popular anime:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnime()
  }, [])

  const handlePageChange = (page: number) => {
    loadAnime(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-600/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent" />
      </div>
      
      <div className="relative z-10">
        <Navbar />
        
        <div className="pt-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-500/30 rounded-full mb-6">
                <TrendingUp className="w-5 h-5 text-purple-400 mr-2" />
                <span className="text-sm font-medium text-purple-300">Most Popular</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black mb-4">
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Anime Terpopuler
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Temukan anime paling populer yang sedang trending dan disukai oleh jutaan penggemar di seluruh dunia.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Flame className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Trending</h3>
                <p className="text-gray-400">Paling populer saat ini</p>
              </div>
              <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Star className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Top Rated</h3>
                <p className="text-gray-400">Rating tertinggi</p>
              </div>
              <div className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Most Viewed</h3>
                <p className="text-gray-400">Paling banyak ditonton</p>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <LoadingSpinner size="lg" />
                  <p className="text-gray-300 mt-6 text-lg">Memuat anime populer...</p>
                </div>
              </div>
            )}

            {/* Anime Grid */}
            {!loading && animeList.data.length > 0 && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-12">
                  {animeList.data.map((anime, index) => (
                    <div 
                      key={anime.id} 
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <AnimeCard anime={anime} showEpisode={false} />
                    </div>
                  ))}
                </div>
                
                <Pagination
                  currentPage={animeList.pagination.currentPage}
                  totalPages={animeList.pagination.totalPages}
                  hasNext={animeList.pagination.hasNext}
                  hasPrev={animeList.pagination.hasPrev}
                  onPageChange={handlePageChange}
                />
              </>
            )}

            {/* Empty State */}
            {!loading && animeList.data.length === 0 && (
              <div className="text-center py-20">
                <div className="w-32 h-32 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="text-gray-400" size={48} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Belum ada anime populer</h3>
                <p className="text-gray-400 text-lg">Silakan coba lagi nanti</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
