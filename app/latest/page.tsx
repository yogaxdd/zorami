'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import AnimeCard from '@/components/AnimeCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import Pagination from '@/components/Pagination'
import { Play, Calendar } from 'lucide-react'
import { fetchLatestAnime, AnimeItem, ApiResponse } from '@/lib/api'

export default function LatestPage() {
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
      const results = await fetchLatestAnime(page)
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
      console.error('Error loading latest anime:', error)
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
                <Play className="text-white" size={24} />
              </div>
              <h1 className="text-4xl font-bold gradient-text">Anime Terbaru</h1>
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Nikmati episode terbaru dari anime favorit Anda. Diperbarui setiap hari dengan kualitas terbaik.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 text-center">
              <Calendar className="text-aozora-blue-400 mx-auto mb-2" size={32} />
              <h3 className="text-2xl font-bold text-white mb-1">Hari Ini</h3>
              <p className="text-gray-400">Episode terbaru</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 text-center">
              <Play className="text-green-400 mx-auto mb-2" size={32} />
              <h3 className="text-2xl font-bold text-white mb-1">HD Quality</h3>
              <p className="text-gray-400">Kualitas terbaik</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 text-center">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <span className="text-white font-bold">∞</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">Unlimited</h3>
              <p className="text-gray-400">Streaming tanpa batas</p>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="text-gray-400 mt-4">Memuat anime terbaru...</p>
              </div>
            </div>
          )}

          {/* Anime Grid */}
          {!loading && animeList.length > 0 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8">
                {animeList.map((anime) => (
                  <AnimeCard key={anime.animeId} anime={anime} showEpisode={true} />
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
                <Play className="text-gray-600" size={40} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Belum ada anime terbaru</h3>
              <p className="text-gray-400">Silakan coba lagi nanti</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
