'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Play, ArrowLeft, ArrowRight, Download, Share2, Settings, Volume2, Maximize } from 'lucide-react'
import { fetchEpisodeDetail, fetchAnimeEpisodes } from '@/lib/api'

interface EpisodeDetail {
  id: string
  title: string
  animeTitle: string
  animeSlug: string
  number: number
  downloadUrl?: string
  servers: Array<{
    name: string
    url: string
    quality: string
  }>
}

interface EpisodeListItem {
  slug: string
  title: string
  number: number
  downloadUrl?: string
}

export default function EpisodePage() {
  const params = useParams()
  const id = params.id as string
  
  const [episode, setEpisode] = useState<EpisodeDetail | null>(null)
  const [episodeList, setEpisodeList] = useState<EpisodeListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedServer, setSelectedServer] = useState(0)
  const [isVideoLoading, setIsVideoLoading] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  
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

  // Helper: find current index in episodeList
  const currentIndex = (() => {
    if (!episode || episodeList.length === 0) return -1
    const bySlug = episodeList.findIndex((e) => sanitizeSlug(e.slug) === sanitizeSlug(episode.id))
    if (bySlug !== -1) return bySlug
    return episodeList.findIndex((e) => e.number === episode.number)
  })()
  const prevEp = currentIndex > 0 ? episodeList[currentIndex - 1] : null
  const nextEp = currentIndex >= 0 && currentIndex < episodeList.length - 1 ? episodeList[currentIndex + 1] : null

  useEffect(() => {
    const loadEpisodeDetail = async () => {
      if (!id) return
      
      setLoading(true)
      try {
        const episodeData = await fetchEpisodeDetail(id)
        setEpisode(episodeData)
        
        // Load episode list for the anime
        const episodes = await fetchAnimeEpisodes(episodeData.animeSlug)
        setEpisodeList(episodes)
      } catch (error) {
        console.error('Error loading episode detail:', error)
      } finally {
        setLoading(false)
      }
    }

    loadEpisodeDetail()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="text-gray-400 mt-4">Memuat episode...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!episode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Episode tidak ditemukan</h2>
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
        {/* Breadcrumb */}
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto">
            <nav className="flex items-center space-x-2 text-sm text-gray-400">
              <Link href="/" className="hover:text-white transition-colors duration-200">
                Home
              </Link>
              <span>/</span>
              <Link href={`/anime/${episode.animeSlug}`} className="hover:text-white transition-colors duration-200">
                {episode.animeTitle}
              </Link>
              <span>/</span>
              <span className="text-white">Episode {episode.number}</span>
            </nav>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Video Player */}
              <div className="lg:col-span-3">
                <div className="bg-black rounded-lg overflow-hidden mb-6">
                  <div className="relative aspect-video bg-gray-900">
                    {/* Loading overlay */}
                    {isVideoLoading && (
                      <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
                        <div className="text-center">
                          <LoadingSpinner size="lg" />
                          <p className="text-white mt-4">Memuat server...</p>
                        </div>
                      </div>
                    )}
                    {episode.servers && episode.servers.length > 0 && episode.servers[selectedServer] ? (
                      <div className="w-full h-full" key={selectedServer}>
                        {/* Check if server URL is a direct video link or embed */}
                        {episode.servers[selectedServer].url !== '#' ? (
                          episode.servers[selectedServer].url.includes('.mp4') || 
                          episode.servers[selectedServer].url.includes('.m3u8') ? (
                            /* Direct video file */
                            <video 
                              className="w-full h-full"
                              controls
                              poster="/api/placeholder/800/450"
                              preload="metadata"
                              key={`video-${selectedServer}`}
                            >
                              <source src={episode.servers[selectedServer].url} type="video/mp4" />
                              <p className="text-white p-4">
                                Browser Anda tidak mendukung video player. 
                                <a href={episode.servers[selectedServer].url} className="text-purple-400 underline">
                                  Download video
                                </a>
                              </p>
                            </video>
                          ) : (
                            /* Embed iframe for streaming servers */
                            <iframe
                              src={episode.servers[selectedServer].url}
                              className="w-full h-full border-0"
                              allowFullScreen
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              key={`iframe-${selectedServer}`}
                              title={`${episode.animeTitle} Episode ${episode.number} - ${episode.servers[selectedServer].name}`}
                            />
                          )
                        ) : (
                          /* Fallback for placeholder URLs */
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Play className="text-white fill-current" size={32} />
                              </div>
                              <p className="text-white text-lg font-semibold mb-2">
                                Episode {episode.number}
                              </p>
                              <p className="text-gray-400 mb-4">
                                {episode.animeTitle}
                              </p>
                              <p className="text-gray-500 text-sm">
                                Server: {episode.servers[selectedServer].name} ({episode.servers[selectedServer].quality})
                              </p>
                              <p className="text-yellow-400 text-sm mt-2">
                                Video akan tersedia setelah API server aktif
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Play className="text-gray-400" size={32} />
                          </div>
                          <p className="text-white text-lg font-semibold mb-2">
                            Episode {episode.number}
                          </p>
                          <p className="text-gray-400 mb-4">
                            {episode.animeTitle}
                          </p>
                          <p className="text-red-400 text-sm">
                            Tidak ada server video tersedia
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Episode Info */}
                <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 mb-6">
                  <h1 className="text-2xl font-bold mb-2">
                    Episode {episode.number}
                  </h1>
                  <h2 className="text-xl text-gray-300 mb-4">{episode.animeTitle}</h2>
                  
                  <div className="flex flex-wrap gap-4">
                    {episode.downloadUrl ? (
                      <a 
                        href={episode.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 bg-aozora-blue-600 hover:bg-aozora-blue-700 px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                      >
                        <Download size={16} />
                        <span>Download</span>
                      </a>
                    ) : (
                      <button 
                        onClick={() => {
                          // Use current server URL as download fallback
                          if (episode.servers && episode.servers[selectedServer]) {
                            window.open(episode.servers[selectedServer].url, '_blank')
                          }
                        }}
                        className="flex items-center space-x-2 bg-aozora-blue-600 hover:bg-aozora-blue-700 px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                      >
                        <Download size={16} />
                        <span>Download</span>
                      </button>
                    )}
                    <button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-semibold transition-colors duration-200">
                      <Share2 size={16} />
                      <span>Share</span>
                    </button>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center bg-gray-800/50 backdrop-blur-md rounded-lg p-4">
                  <button
                    disabled={!prevEp}
                    onClick={() => { if (prevEp) window.location.href = `/episode/${sanitizeSlug(prevEp.slug)}` }}
                    className={`flex items-center space-x-2 transition-colors duration-200 ${prevEp ? 'text-gray-400 hover:text-white' : 'text-gray-600 cursor-not-allowed'}`}
                  >
                    <ArrowLeft size={16} />
                    <span>Episode Sebelumnya</span>
                  </button>
                  <Link 
                    href={`/anime/${episode.animeSlug}`}
                    className="text-aozora-blue-400 hover:text-aozora-blue-300 font-semibold"
                  >
                    Daftar Episode
                  </Link>
                  <button
                    disabled={!nextEp}
                    onClick={() => { if (nextEp) window.location.href = `/episode/${sanitizeSlug(nextEp.slug)}` }}
                    className={`flex items-center space-x-2 transition-colors duration-200 ${nextEp ? 'text-gray-400 hover:text-white' : 'text-gray-600 cursor-not-allowed'}`}
                  >
                    <span>Episode Selanjutnya</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Server Selection */}
                <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Pilih Server</h3>
                  <div className="space-y-2">
                    {episode.servers && episode.servers.length > 0 ? episode.servers.map((server, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setIsVideoLoading(true)
                          setSelectedServer(index)
                          // Reset loading state after a short delay
                          setTimeout(() => setIsVideoLoading(false), 1000)
                        }}
                        className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                          selectedServer === index
                            ? 'bg-aozora-blue-600 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{server.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm opacity-75">{server.quality}</span>
                            {server.url !== '#' && (
                              <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                                Aktif
                              </span>
                            )}
                            {server.url === '#' && (
                              <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded">
                                Demo
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    )) : (
                      <div className="text-center py-4 text-gray-400">
                        <p>Tidak ada server tersedia</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quality Info */}
                <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Kualitas Video</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Resolusi:</span>
                      <span className="font-semibold">{episode.servers && episode.servers[selectedServer] ? episode.servers[selectedServer].quality : 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Format:</span>
                      <span className="font-semibold">MP4</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Subtitle:</span>
                      <span className="font-semibold">Indonesia</span>
                    </div>
                  </div>
                </div>

                {/* Episode List Preview */}
                <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Episode Lainnya</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {episodeList.length > 0 ? episodeList.map((ep) => (
                      <Link
                        key={ep.slug}
                        href={`/episode/${sanitizeSlug(ep.slug)}`}
                        className={`block p-2 rounded-lg transition-colors duration-200 ${
                          ep.number === episode.number
                            ? 'bg-aozora-blue-600 text-white'
                            : 'hover:bg-gray-700 text-gray-300'
                        }`}
                      >
                        {ep.title}
                      </Link>
                    )) : (
                      <div className="text-center py-4 text-gray-400">
                        <p>Memuat episode list...</p>
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/anime/${episode.animeSlug}`}
                    className="block mt-4 text-center text-aozora-blue-400 hover:text-aozora-blue-300 font-semibold"
                  >
                    Lihat Semua Episode
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
