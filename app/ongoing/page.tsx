'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import AnimeCard from '@/components/AnimeCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import Pagination from '@/components/Pagination'
import { Calendar, TrendingUp, Clock } from 'lucide-react'
import { fetchOngoingAnime, AnimeItem, PaginatedResponse } from '@/lib/api'

export default function OngoingPage() {
  const [animeList, setAnimeList] = useState<PaginatedResponse<AnimeItem>>({
    data: [],
    pagination: { currentPage: 1, totalPages: 1, hasNext: false, hasPrev: false }
  })
  const [loading, setLoading] = useState(true)

  const loadAnime = async (page: number = 1) => {
    setLoading(true)
    try {
      const results = await fetchOngoingAnime(page)
      setAnimeList({
        data: results.data.animeList,
        pagination: {
          currentPage: results.pagination?.currentPage || 1,
          totalPages: results.pagination?.totalPages || 1,
          hasNext: results.pagination?.hasNextPage || false,
          hasPrev: results.pagination?.hasPrevPage || false
        }
      })
    } catch (error) {
      console.error('Error loading ongoing anime:', error)
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Navbar />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Calendar className="text-white" size={24} />
              </div>
              <h1 className="text-4xl font-bold gradient-text">Anime Sedang Tayang</h1>
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Ikuti anime yang sedang berlangsung dan jangan sampai ketinggalan episode terbaru dari series favorit Anda.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 text-center">
              <TrendingUp className="text-green-400 mx-auto mb-2" size={32} />
              <h3 className="text-2xl font-bold text-white mb-1">Ongoing</h3>
              <p className="text-gray-400">Sedang tayang</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 text-center">
              <Clock className="text-blue-400 mx-auto mb-2" size={32} />
              <h3 className="text-2xl font-bold text-white mb-1">Weekly</h3>
              <p className="text-gray-400">Update mingguan</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 text-center">
              <Calendar className="text-purple-400 mx-auto mb-2" size={32} />
              <h3 className="text-2xl font-bold text-white mb-1">Schedule</h3>
              <p className="text-gray-400">Jadwal rilis</p>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="text-gray-400 mt-4">Memuat anime ongoing...</p>
              </div>
            </div>
          )}

          {/* Anime Grid */}
          {!loading && animeList.data.length > 0 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8">
                {animeList.data.map((anime) => (
                  <AnimeCard key={anime.id} anime={anime} showEpisode={true} />
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
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-gray-600" size={40} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Belum ada anime ongoing</h3>
              <p className="text-gray-400">Silakan coba lagi nanti</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
