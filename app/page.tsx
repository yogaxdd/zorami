'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import { Play, Star, Calendar, TrendingUp, Film, Download, ChevronRight, Eye, Clock, Users, Zap, Flame, Grid3X3 } from 'lucide-react'
import { fetchHome } from '@/lib/api'



const categories = [
  { name: 'Anime Terbaru', href: '/latest', icon: Flame, color: 'from-red-500 to-pink-500' },
  { name: 'Movie', href: '/movie', icon: Film, color: 'from-blue-500 to-cyan-500' },
  { name: 'Batch Download', href: '/batch', icon: Download, color: 'from-yellow-500 to-orange-500' },
  { name: 'All Anime', href: '/all', icon: Grid3X3, color: 'from-indigo-500 to-purple-500' },
]

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [homeData, setHomeData] = useState<{
    ongoing_anime: Array<{
      title: string
      slug: string
      poster: string
      current_episode: string
      release_day: string
      newest_release_date: string
      otakudesu_url: string
    }>
    complete_anime: Array<{
      title: string
      slug: string
      poster: string
      episode_count: string
      rating: string
      last_release_date: string
      otakudesu_url: string
    }>
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsLoaded(true)
    loadHomeData()
  }, [])

  const loadHomeData = async () => {
    try {
      const data = await fetchHome()
      setHomeData(data)
    } catch (error) {
      console.error('Error loading home data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (homeData?.ongoing_anime?.length) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % Math.min(homeData.ongoing_anime.length, 3))
      }, 6000)
      return () => clearInterval(timer)
    }
  }, [homeData])

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
      
        {/* Loading State */}
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white text-lg font-medium">Loading Zorami...</p>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="relative min-h-screen overflow-hidden bg-black">
          {/* Background Carousel */}
          <div className="absolute inset-0">
            {homeData?.ongoing_anime?.slice(0, 3).map((anime, index) => (
              <div
                key={anime.slug}
                className={`absolute inset-0 transition-all duration-1000 ${
                  index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30 z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                <div 
                  className="w-full h-full bg-cover bg-center filter brightness-75"
                  style={{
                    backgroundImage: `url(${anime.poster})`
                  }}
                />
              </div>
            )) || []}
          </div>
          
          {/* Hero Content */}
          <div className="relative z-20 min-h-screen flex items-center pt-20 sm:pt-24 lg:pt-32 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-16 items-center justify-center min-h-[calc(100vh-10rem)]">
                {/* Featured Anime Info - Mobile First */}
                <div className={`transform transition-all duration-1000 delay-300 text-center lg:text-left lg:pl-8 mb-6 lg:mb-0 w-full lg:order-2 ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                  {homeData?.ongoing_anime?.[currentSlide] && (
                    <div className="relative bg-black/60 backdrop-blur-md border border-white/30 rounded-2xl p-4 lg:p-6 shadow-2xl mx-auto max-w-md lg:max-w-none">
                      <div className="flex items-center justify-center lg:justify-start space-x-2 mb-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-xs font-medium text-gray-300">SEDANG TRENDING</span>
                      </div>
                      
                      <h2 className="text-lg lg:text-2xl xl:text-3xl font-bold mb-2 text-white leading-tight">
                        {homeData.ongoing_anime[currentSlide].title}
                      </h2>
                      <p className="text-gray-300 mb-3 leading-relaxed text-xs lg:text-sm">
                        {homeData.ongoing_anime[currentSlide].current_episode}
                      </p>
                      
                      <div className="flex items-center justify-center lg:justify-start flex-wrap gap-2 mb-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="text-blue-400 w-3 h-3" />
                          <span className="text-gray-300 text-xs">{homeData.ongoing_anime[currentSlide].newest_release_date}</span>
                        </div>
                        <div className="px-2 py-0.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs rounded-full font-medium">
                          Ongoing
                        </div>
                      </div>
                      
                      <Link href={`/anime/${homeData.ongoing_anime[currentSlide].slug}`} className="inline-flex bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 px-4 lg:py-3 lg:px-6 rounded-xl font-bold text-xs lg:text-base transition-all duration-300 transform hover:scale-105 items-center justify-center space-x-2 w-full lg:w-auto">
                        <Play className="w-3 h-3 lg:w-5 lg:h-5" fill="currentColor" />
                        <span>Tonton Sekarang</span>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Main Content */}
                <div className={`transform transition-all duration-1000 delay-500 lg:pr-8 w-full lg:order-1 text-center lg:text-left ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                  <div className="mb-6">
                    <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-purple-600/40 to-blue-600/40 backdrop-blur-sm border border-purple-500/50 rounded-full mb-4">
                      <Zap className="w-3 h-3 text-purple-400 mr-2" />
                      <span className="text-xs font-medium text-purple-300">Streaming Terbaik Indonesia</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 leading-tight">
                      <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        ZORAMI
                      </span>
                    </h1>
                    <p className="text-xl sm:text-xl lg:text-2xl font-bold text-white mb-3">
                       Anime Streaming
                    </p>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-300 mb-6 leading-relaxed max-w-lg mx-auto lg:mx-0">
                      Nikmati ribuan anime terbaik dengan kualitas 4K HDR. 
                      Streaming tanpa batas, tanpa iklan, kapan saja di mana saja.
                    </p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-center lg:justify-start">
                    <Link href="/popular" className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-3 rounded-xl font-bold text-base transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 inline-block">
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative flex items-center justify-center space-x-2">
                        <Play className="w-5 h-5" fill="currentColor" />
                        <span>Mulai Streaming</span>
                      </div>
                    </Link>
                    <Link href="/genres" className="group relative overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 px-6 py-3 rounded-xl font-bold text-base transition-all duration-300 transform hover:scale-105 inline-block">
                      <div className="relative flex items-center justify-center space-x-2">
                        <Eye className="w-5 h-5" />
                        <span>Jelajahi</span>
                      </div>
                    </Link>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto lg:mx-0">
                    <div className="text-center">
                      <div className="text-xl font-bold text-white mb-1">10K+</div>
                      <div className="text-xs text-gray-400">Anime</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-white mb-1">4K</div>
                      <div className="text-xs text-gray-400">Quality</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-white mb-1">24/7</div>
                      <div className="text-xs text-gray-400">Streaming</div>
                    </div>
                  </div>
                </div>
                
              </div>
              
              {/* Slide indicators */}
              <div className="absolute bottom-6 lg:bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
                {homeData?.ongoing_anime?.slice(0, 3).map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-white' : 'bg-white/30'
                    }`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Jelajahi Kategori
                </span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Temukan anime favorit Anda berdasarkan kategori yang tersedia
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {categories.map((category, index) => {
                const Icon = category.icon
                return (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    <div className="relative z-10 text-center">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <Icon className="text-white" size={28} />
                      </div>
                      <h3 className="font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 group-hover:bg-clip-text transition-all duration-300">
                        {category.name}
                      </h3>
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/0 via-blue-600/0 to-cyan-600/0 group-hover:from-purple-600/5 group-hover:via-blue-600/5 group-hover:to-cyan-600/5 transition-all duration-500" />
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Latest Anime Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-black mb-2">
                  <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Anime Terbaru
                  </span>
                </h2>
                <p className="text-gray-400">Episode terbaru yang baru saja dirilis</p>
              </div>
              <Link
                href="/latest"
                className="group flex items-center space-x-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-500/30 hover:border-purple-400/50 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                <span className="text-white group-hover:text-purple-300">Lihat Semua</span>
                <ChevronRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-700 rounded-2xl aspect-[3/4] mb-4"></div>
                    <div className="bg-gray-700 h-4 rounded mb-2"></div>
                    <div className="bg-gray-700 h-3 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {homeData?.ongoing_anime?.slice(0, 6).map((anime, index) => (
                <Link 
                  key={anime.slug} 
                  href={`/anime/${anime.slug}`}
                  className="group cursor-pointer transform transition-all duration-500 hover:scale-105 block"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative overflow-hidden rounded-2xl aspect-[3/4] mb-4 shadow-2xl">
                    <div 
                      className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                      style={{
                        backgroundImage: `url(${anime.poster})`
                      }}
                    />
                    
                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/20 group-hover:to-blue-600/20 transition-all duration-500" />
                    
                    {/* Episode Badge */}
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-blue-600 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg">
                      {anime.current_episode}
                    </div>
                    
                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-8 h-8 text-white" fill="currentColor" />
                      </div>
                    </div>
                    
                    {/* Bottom Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Calendar className="text-blue-400 w-4 h-4" />
                          <span className="text-sm font-bold text-white">{anime.newest_release_date}</span>
                        </div>
                        <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-4 py-2 rounded-lg text-xs font-bold text-white transition-all duration-300 transform hover:scale-105">
                          Tonton
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-1">
                    <h3 className="font-bold text-white mb-1 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 group-hover:bg-clip-text transition-all duration-300">
                      {anime.title}
                    </h3>
                  </div>
                </Link>
                )) || []}
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="relative py-20 px-4 sm:px-6 lg:px-8 mt-20">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-900/50 to-transparent" />
          <div className="relative max-w-7xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <span className="text-white font-black text-2xl">Z</span>
                </div>
                <span className="text-4xl font-black bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  ZORAMI
                </span>
              </div>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Platform streaming anime terbaik Indonesia dengan koleksi lengkap, kualitas 4K HDR, dan pengalaman menonton yang tak terlupakan.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">10,000+</div>
                  <div className="text-gray-400">Anime Series</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">4K HDR</div>
                  <div className="text-gray-400">Ultra Quality</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">24/7</div>
                  <div className="text-gray-400">Non-Stop Streaming</div>
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-8">
                <p className="text-gray-500">
                  © 2025 Zorami - Anime Streaming. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
