'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Tag, Grid, ArrowRight } from 'lucide-react'
import { fetchGenres, Genre } from '@/lib/api'

export default function GenresPage() {
  const [genres, setGenres] = useState<Genre[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadGenres = async () => {
      setLoading(true)
      try {
        const response = await fetchGenres()
        setGenres(response)
      } catch (error) {
        console.error('Error loading genres:', error)
      } finally {
        setLoading(false)
      }
    }

    loadGenres()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Navbar />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Tag className="text-white" size={24} />
              </div>
              <h1 className="text-4xl font-bold gradient-text">Genre Anime</h1>
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Jelajahi anime berdasarkan genre favorit Anda. Temukan anime baru dengan mudah.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 text-center">
              <Tag className="text-purple-400 mx-auto mb-2" size={32} />
              <h3 className="text-2xl font-bold text-white mb-1">{genres.length}</h3>
              <p className="text-gray-400">Total Genre</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 text-center">
              <Grid className="text-blue-400 mx-auto mb-2" size={32} />
              <h3 className="text-2xl font-bold text-white mb-1">Organized</h3>
              <p className="text-gray-400">Terorganisir</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 text-center">
              <ArrowRight className="text-green-400 mx-auto mb-2" size={32} />
              <h3 className="text-2xl font-bold text-white mb-1">Easy Browse</h3>
              <p className="text-gray-400">Mudah dijelajahi</p>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="text-gray-400 mt-4">Memuat genre...</p>
              </div>
            </div>
          )}

          {/* Genres Grid */}
          {!loading && genres.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
              {genres.map((genre) => (
                <Link
                  key={genre.genreId}
                  href={`/genres/${genre.genreId}`}
                  className="group"
                >
                  <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-4 text-center hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
                      <Tag className="text-white" size={20} />
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors duration-300">
                      {genre.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && genres.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tag className="text-gray-600" size={40} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Belum ada genre</h3>
              <p className="text-gray-400">Silakan coba lagi nanti</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
