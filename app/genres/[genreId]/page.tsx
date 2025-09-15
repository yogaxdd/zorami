'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import AnimeCard from '@/components/AnimeCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import Pagination from '@/components/Pagination'
import { Tag, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { fetchAnimeByGenre, AnimeItem } from '@/lib/api'

export default function GenreDetailPage() {
  const params = useParams()
  const genreId = params.genreId as string
  
  const [animeList, setAnimeList] = useState<AnimeItem[]>([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  })
  const [loading, setLoading] = useState(true)
  const [genreTitle, setGenreTitle] = useState('')

  const loadAnime = async (page: number = 1) => {
    setLoading(true)
    try {
      const results = await fetchAnimeByGenre(genreId, page)
      setAnimeList(results.data.animeList)
      if (results.pagination) {
        setPagination({
          currentPage: results.pagination.currentPage,
          totalPages: results.pagination.totalPages,
          hasNextPage: results.pagination.hasNextPage,
          hasPrevPage: results.pagination.hasPrevPage
        })
      }
      
      // Extract genre title from the first anime if available
      if (results.data.animeList.length > 0 && results.data.animeList[0].genreList) {
        const currentGenre = results.data.animeList[0].genreList.find(g => g.genreId === genreId)
        if (currentGenre) {
          setGenreTitle(currentGenre.title)
        }
      }
    } catch (error) {
      console.error('Error loading anime by genre:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (genreId) {
      loadAnime()
    }
  }, [genreId])

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
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Link
                href="/genres"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                <ArrowLeft size={20} />
                <span>Kembali ke Genre</span>
              </Link>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Tag className="text-white" size={24} />
                </div>
                <h1 className="text-4xl font-bold gradient-text">
                  {genreTitle || 'Genre Anime'}
                </h1>
              </div>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Jelajahi anime dengan genre {genreTitle || 'ini'}. Temukan anime favorit Anda.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 text-center">
              <Tag className="text-purple-400 mx-auto mb-2" size={32} />
              <h3 className="text-2xl font-bold text-white mb-1">{animeList.length}</h3>
              <p className="text-gray-400">Anime di halaman ini</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 text-center">
              <div className="text-blue-400 mx-auto mb-2 text-2xl font-bold">
                {pagination.currentPage}
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">of {pagination.totalPages}</h3>
              <p className="text-gray-400">Halaman</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 text-center">
              <div className="text-green-400 mx-auto mb-2 text-2xl font-bold">
                {genreTitle}
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">Genre</h3>
              <p className="text-gray-400">Kategori</p>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="text-gray-400 mt-4">Memuat anime...</p>
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
                <Tag className="text-gray-600" size={40} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Belum ada anime</h3>
              <p className="text-gray-400">Tidak ada anime untuk genre ini saat ini</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
