'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import AnimeCard from '@/components/AnimeCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import Pagination from '@/components/Pagination'
import { Film, Star, Clock } from 'lucide-react'
import { fetchMovies, AnimeItem, ApiResponse } from '@/lib/api'

export default function MoviePage() {
  const [animeList, setAnimeList] = useState<AnimeItem[]>([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  })
  const [loading, setLoading] = useState(true)

  const loadAnime = async (page: number = 1) => {
    setLoading(true)
    try {
      const results = await fetchMovies(page)
      setAnimeList(results.data.animeList)
      if (results.pagination) {
        setPagination({
          currentPage: results.pagination.currentPage,
          totalPages: results.pagination.totalPages,
          hasNextPage: results.pagination.hasNextPage,
          hasPrevPage: results.pagination.hasPrevPage
        })
      }
    } catch (error) {
      console.error('Error loading movie anime:', error)
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
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Film className="text-white" size={24} />
              </div>
              <h1 className="text-4xl font-bold gradient-text">Anime Movie</h1>
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Nikmati koleksi lengkap film anime terbaik dengan cerita yang memukau dan visual yang menakjubkan.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 text-center">
              <Film className="text-red-400 mx-auto mb-2" size={32} />
              <h3 className="text-2xl font-bold text-white mb-1">Movies</h3>
              <p className="text-gray-400">Film anime</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 text-center">
              <Star className="text-yellow-400 mx-auto mb-2" size={32} />
              <h3 className="text-2xl font-bold text-white mb-1">HD Quality</h3>
              <p className="text-gray-400">Kualitas tinggi</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 text-center">
              <Clock className="text-blue-400 mx-auto mb-2" size={32} />
              <h3 className="text-2xl font-bold text-white mb-1">Full Length</h3>
              <p className="text-gray-400">Durasi penuh</p>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="text-gray-400 mt-4">Memuat anime movie...</p>
              </div>
            </div>
          )}

          {/* Anime Grid */}
          {!loading && animeList.length > 0 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8">
                {animeList.map((anime) => (
                  <AnimeCard key={anime.animeId} anime={anime} showEpisode={false} />
                ))}
              </div>
              
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                hasNext={pagination.hasNextPage}
                hasPrev={pagination.hasPrevPage}
                onPageChange={handlePageChange}
              />
            </>
          )}

          {/* Empty State */}
          {!loading && animeList.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Film className="text-gray-600" size={40} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Belum ada anime movie</h3>
              <p className="text-gray-400">Silakan coba lagi nanti</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
