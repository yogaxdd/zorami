'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import AnimeCard from '@/components/AnimeCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Download, ArrowLeft, Star, Calendar, Clock, Play, ExternalLink, Copy } from 'lucide-react'
import { fetchBatchDetail, BatchDetail } from '@/lib/api'

export default function BatchDetailPage() {
  const params = useParams()
  const batchId = params.batchId as string
  
  const [batchData, setBatchData] = useState<BatchDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  useEffect(() => {
    const loadBatchDetail = async () => {
      setLoading(true)
      try {
        const response = await fetchBatchDetail(batchId)
        setBatchData(response.data)
      } catch (error) {
        console.error('Error loading batch detail:', error)
      } finally {
        setLoading(false)
      }
    }

    if (batchId) {
      loadBatchDetail()
    }
  }, [batchId])

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(url)
      setTimeout(() => setCopiedUrl(null), 2000)
    } catch (error) {
      console.error('Failed to copy URL:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="text-gray-400 mt-4">Memuat detail batch...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!batchData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Batch tidak ditemukan</h2>
            <Link href="/batch" className="text-blue-400 hover:text-blue-300">
              Kembali ke halaman batch
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Navbar />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              href="/batch"
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft size={20} />
              <span>Kembali ke Batch</span>
            </Link>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Poster and Basic Info */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 sticky top-24">
                <div className="relative aspect-[3/4] mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={batchData.poster}
                    alt={batchData.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                
                <h1 className="text-xl font-bold text-white mb-4 line-clamp-3">
                  {batchData.title}
                </h1>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Star className="text-yellow-400 fill-current" size={16} />
                    <span className="text-gray-300">Score: {batchData.score}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Play className="text-blue-400" size={16} />
                    <span className="text-gray-300">Episodes: {batchData.episodes}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="text-green-400" size={16} />
                    <span className="text-gray-300">{batchData.duration}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="text-purple-400" size={16} />
                    <span className="text-gray-300">{batchData.season}</span>
                  </div>
                </div>

                {/* Genres */}
                {batchData.genreList.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Genre:</h3>
                    <div className="flex flex-wrap gap-1">
                      {batchData.genreList.slice(0, 6).map((genre, index) => (
                        <Link
                          key={index}
                          href={`/genres/${genre.genreId}`}
                          className="px-2 py-1 bg-gray-700/50 text-xs rounded text-gray-300 hover:bg-gray-600/50 transition-colors"
                        >
                          {genre.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Details and Downloads */}
            <div className="lg:col-span-2 space-y-6">
              {/* Synopsis */}
              {batchData.synopsis.paragraphs.length > 0 && (
                <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Sinopsis</h2>
                  <div className="space-y-3 text-gray-300">
                    {batchData.synopsis.paragraphs.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                  
                  {/* Connections */}
                  {batchData.synopsis.connections.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-semibold text-gray-400 mb-2">Related:</h3>
                      <div className="space-y-1">
                        {batchData.synopsis.connections.map((connection, index) => (
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
              )}

              {/* Download Links */}
              <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Download className="text-green-400" size={24} />
                  <h2 className="text-xl font-bold text-white">Download Links</h2>
                </div>

                <div className="space-y-6">
                  {batchData.downloadUrl.formats.map((format, formatIndex) => (
                    <div key={formatIndex} className="border border-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                        <span className="px-3 py-1 bg-blue-600 rounded text-sm">{format.title}</span>
                      </h3>
                      
                      <div className="space-y-4">
                        {format.qualities.map((quality, qualityIndex) => (
                          <div key={qualityIndex} className="bg-gray-700/30 rounded-lg p-4">
                            <h4 className="text-md font-medium text-gray-300 mb-3">
                              {quality.title}
                            </h4>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                              {quality.urls.map((urlItem, urlIndex) => (
                                <div key={urlIndex} className="flex items-center space-x-2">
                                  <a
                                    href={urlItem.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center space-x-2 px-3 py-2 bg-gray-600/50 hover:bg-gray-500/50 rounded-lg transition-colors text-sm"
                                  >
                                    <ExternalLink size={14} />
                                    <span className="text-white">{urlItem.title}</span>
                                  </a>
                                  <button
                                    onClick={() => copyToClipboard(urlItem.url)}
                                    className={`p-2 rounded-lg transition-colors ${
                                      copiedUrl === urlItem.url
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-600/50 hover:bg-gray-500/50 text-gray-300'
                                    }`}
                                    title="Copy URL"
                                  >
                                    <Copy size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Anime */}
              {batchData.recommendedAnimeList.length > 0 && (
                <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Rekomendasi Anime</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {batchData.recommendedAnimeList.slice(0, 8).map((anime) => (
                      <AnimeCard key={anime.animeId} anime={anime} showEpisode={false} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
