'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Play, Star, Calendar, Clock, Users, Tag, Download, Share2, Heart, BookOpen } from 'lucide-react'
import { fetchAnimeDetail, AnimeDetail } from '@/lib/api'

export default function AnimeDetailPage() {
  const params = useParams()
  const id = params.id as string
  
  const [anime, setAnimeData] = useState<AnimeDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'episodes' | 'info'>('episodes')
  const [isFavorite, setIsFavorite] = useState(false)
  
  const sanitizeSlug = (value: string) => {
    try {
      if (/https?:\/\/?/i.test(value)) {
        const normalized = value.replace(/https?:\/\/?/i, (m) => (m.endsWith('//') ? m : m.replace(/\/?$/, '//')))
        const u = new URL(normalized)
        const parts = u.pathname.split('/').filter(Boolean)
        return parts.pop() || value
      }
      if (value.includes('/')) {
        const parts = value.split('/').filter(Boolean)
        return parts.pop() as string
      }
      return value
    } catch {
      return value
    }
  }

  useEffect(() => {
    const loadAnimeDetail = async () => {
      if (!id) return
      
      setLoading(true)
      try {
        const response = await fetchAnimeDetail(id)
        setAnimeData(response.data)
      } catch (error) {
        console.error('Error loading anime detail:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAnimeDetail()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="text-gray-400 mt-4">Memuat detail anime...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!anime) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Anime tidak ditemukan</h2>
            <Link href="/" className="text-aozora-blue-400 hover:text-aozora-blue-300">
              Kembali ke beranda
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Navbar forceSolid />
      
      <div className="pt-16">
        {/* Hero Section */}
        <div className="relative py-8 md:py-12 md:min-h-[28rem]">
          <div className="absolute inset-0">
            <Image
              src={anime.poster}
              alt={anime.title}
              fill
              className="object-cover blur-sm scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/40" />
          </div>
          
          <div className="relative z-10 flex items-end">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-16 w-full">
              <div className="flex flex-col md:flex-row items-start md:items-end space-y-6 md:space-y-0 md:space-x-8">
                {/* Poster */}
                <div className="flex-shrink-0">
                  <div className="relative w-32 h-48 md:w-48 md:h-72 rounded-lg overflow-hidden shadow-2xl">
                    <Image
                      src={anime.poster}
                      alt={anime.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 text-white">
                    {anime.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    {anime.score && (
                      <div className="flex items-center space-x-1 bg-yellow-500/20 px-3 py-1 rounded-full">
                        <Star className="text-yellow-400 fill-current" size={16} />
                        <span className="font-semibold">{typeof anime.score === 'object' ? anime.score.value : anime.score}</span>
                      </div>
                    )}
                    
                    {anime.aired && (
                      <div className="flex items-center space-x-1 bg-gray-700/50 px-3 py-1 rounded-full">
                        <Calendar size={16} />
                        <span>{anime.aired}</span>
                      </div>
                    )}
                    
                    {anime.status && (
                      <div className={`px-3 py-1 rounded-full font-semibold ${
                        anime.status === 'Ongoing' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {anime.status}
                      </div>
                    )}
                  </div>
                  
                  {anime.synopsis && anime.synopsis.paragraphs.length > 0 && (
                    <p className="text-gray-300 mb-4 md:mb-6 max-w-3xl leading-relaxed line-clamp-4 md:line-clamp-none">
                      {anime.synopsis.paragraphs[0]}
                    </p>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 md:gap-4">
                    <button className="flex items-center space-x-2 bg-aozora-blue-600 hover:bg-aozora-blue-700 px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-colors duration-200 text-sm md:text-base">
                      <Play size={20} />
                      <span>Mulai Menonton</span>
                    </button>
                    
                    <button 
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={`flex items-center space-x-2 px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-colors duration-200 text-sm md:text-base ${
                        isFavorite 
                          ? 'bg-red-600 hover:bg-red-700 text-white' 
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      }`}
                    >
                      <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
                      <span>{isFavorite ? 'Favorit' : 'Tambah ke Favorit'}</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-colors duration-200 text-sm md:text-base">
                      <Share2 size={20} />
                      <span>Bagikan</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="flex space-x-1 mb-6 bg-gray-800/50 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('episodes')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                    activeTab === 'episodes' 
                      ? 'bg-aozora-blue-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Play size={16} />
                  <span>Episode</span>
                </button>
                <button
                  onClick={() => setActiveTab('info')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                    activeTab === 'info' 
                      ? 'bg-aozora-blue-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <BookOpen size={16} />
                  <span>Info</span>
                </button>
              </div>

              {/* Episodes Tab */}
              {activeTab === 'episodes' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-4">Daftar Episode</h3>
                  <div className="grid gap-3">
                    {anime.episodeList && anime.episodeList.length > 0 ? (
                      anime.episodeList.map((episode) => (
                        <Link
                          key={episode.episodeId}
                          href={`/episode/${sanitizeSlug(episode.episodeId)}`}
                          className="flex items-center space-x-4 bg-gray-800/50 hover:bg-gray-700/50 p-4 rounded-lg transition-colors duration-200 group"
                        >
                          <div className="w-12 h-12 bg-aozora-blue-600 rounded-lg flex items-center justify-center group-hover:bg-aozora-blue-700 transition-colors duration-200">
                            <Play className="text-white" size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold group-hover:text-aozora-blue-400 transition-colors duration-200">
                              Episode {episode.title}
                            </h4>
                            <p className="text-gray-400 text-sm truncate">Episode {episode.title}</p>
                          </div>
                          <div className="text-gray-400">
                            <Clock size={16} />
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <p>Belum ada episode tersedia</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Info Tab */}
              {activeTab === 'info' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Sinopsis</h3>
                    <div className="text-gray-300 leading-relaxed space-y-3">
                      {anime.synopsis && anime.synopsis.paragraphs.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                      
                      {anime.synopsis && anime.synopsis.connections.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-white font-semibold mb-2">Related Anime:</h4>
                          <div className="space-y-1">
                            {anime.synopsis.connections.map((connection, index) => (
                              <Link
                                key={index}
                                href={`/anime/${connection.animeId}`}
                                className="block text-blue-400 hover:text-blue-300 text-sm"
                              >
                                {connection.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Anime Info */}
              <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Informasi Anime</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Users className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-400">Studio:</span>
                    <span className="text-sm">{anime.studios}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-400">Tanggal Rilis:</span>
                    <span className="text-sm">{anime.aired}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Play className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-400">Total Episode:</span>
                    <span className="text-sm">{anime.episodes || anime.episodeList?.length || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Genres */}
              <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Tag size={18} />
                  <span>Genre</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {anime.genreList && anime.genreList.map((genre, index) => (
                    <Link
                      key={index}
                      href={`/genres/${genre.genreId}`}
                      className="px-3 py-1 bg-aozora-blue-600/20 hover:bg-aozora-blue-600/30 text-aozora-blue-400 text-sm rounded-full transition-colors duration-200"
                    >
                      {genre.title}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Download */}
              <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Download size={18} />
                  <span>Download</span>
                </h3>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-200">
                  Download Batch
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
