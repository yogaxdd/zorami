'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Star, Play, Calendar, Eye, Clock, Zap } from 'lucide-react'
import { AnimeItem } from '@/lib/api'

interface AnimeCardProps {
  anime: AnimeItem
  showEpisode?: boolean
  className?: string
}

const AnimeCard = ({ anime, showEpisode = true, className = '' }: AnimeCardProps) => {
  return (
    <div className={`group cursor-pointer transform transition-all duration-500 hover:scale-105 ${className}`}>
      <Link href={`/anime/${anime.animeId}`}>
        <div className="relative overflow-hidden rounded-3xl aspect-[3/4] mb-4 shadow-2xl">
          <Image
            src={anime.poster}
            alt={anime.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
          />
          
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/20 group-hover:to-blue-600/20 transition-all duration-500" />
          
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
              <Play className="w-8 h-8 text-white" fill="currentColor" />
            </div>
          </div>
          
          {/* Episode Badge */}
          {showEpisode && anime.episodes && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-blue-600 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg">
              {typeof anime.episodes === 'number' ? `${anime.episodes} Eps` : anime.episodes}
            </div>
          )}
          
          {/* Status Badge */}
          {anime.status && (
            <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${
              anime.status === 'Ongoing' 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                : anime.status === 'Completed' 
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                : 'bg-gradient-to-r from-gray-500 to-gray-600'
            }`}>
              {anime.status}
            </div>
          )}
          
          {/* Bottom Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex items-center justify-between mb-3">
              {anime.score && (
                <div className="flex items-center space-x-2">
                  <Star className="text-yellow-400 fill-current w-4 h-4" />
                  <span className="text-sm font-bold text-white">{anime.score}</span>
                </div>
              )}
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-4 py-2 rounded-lg text-xs font-bold text-white transition-all duration-300 transform hover:scale-105 flex items-center space-x-1">
                <Play className="w-3 h-3" fill="currentColor" />
                <span>Watch</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Anime Info */}
        <div className="px-1 space-y-2">
          <h3 className="font-bold text-white mb-1 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 group-hover:bg-clip-text transition-all duration-300 leading-tight">
            {anime.title}
          </h3>
          
          <div className="flex items-center justify-between text-sm">
            {(anime.releaseDate || anime.releasedOn) && (
              <div className="flex items-center space-x-1 text-gray-400">
                <Calendar className="w-3 h-3" />
                <span className="text-xs">{anime.releaseDate || anime.releasedOn}</span>
              </div>
            )}
            
            {anime.type && (
              <div className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded-lg text-xs font-medium text-white">
                {anime.type}
              </div>
            )}
          </div>
          
          {/* Genres */}
          {anime.genreList && anime.genreList.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {anime.genreList.slice(0, 2).map((genre, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-500/30 text-xs rounded-lg text-purple-300 font-medium"
                >
                  {genre.title}
                </span>
              ))}
              {anime.genreList.length > 2 && (
                <span className="px-2 py-1 bg-white/10 backdrop-blur-sm text-xs rounded-lg text-gray-300 font-medium">
                  +{anime.genreList.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}

export default AnimeCard
