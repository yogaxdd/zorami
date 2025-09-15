'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { fetchAllAnime } from '@/lib/api'
import { Search } from 'lucide-react'

interface AllAnimeGroup {
  startWith: string
  animeList: Array<{
    title: string
    animeId: string
    href: string
    samehadakuUrl?: string
  }>
}

export default function AllAnimePage() {
  const [groups, setGroups] = useState<AllAnimeGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchAllAnime()
        setGroups(res.data.list as any)
      } catch (e) {
        console.error('Failed to load all anime', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = groups.map(g => ({
    ...g,
    animeList: g.animeList.filter(a => a.title.toLowerCase().includes(filter.toLowerCase()))
  })).filter(g => g.animeList.length > 0)

  const displayGroups = filter.trim() ? filtered : groups

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Navbar />
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-3">Semua Anime</h1>
            <p className="text-gray-400">Daftar lengkap anime dari A sampai Z</p>
          </div>

          <div className="max-w-2xl mx-auto mb-10">
            <div className="relative">
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                type="text"
                placeholder="Cari judul anime..."
                className="w-full px-6 py-4 pl-12 bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl focus:outline-none focus:border-aozora-blue-500 text-white placeholder-gray-400"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20 text-gray-400">Memuat daftar anime...</div>
          ) : displayGroups.length === 0 ? (
            <div className="text-center py-20 text-gray-400">Tidak ada data</div>
          ) : (
            <div className="space-y-10">
              {displayGroups.map((group) => (
                <div key={group.startWith}>
                  <div className="sticky top-20 z-10 backdrop-blur-md/0">
                    <h2 className="text-2xl font-bold mb-4">{group.startWith}</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {group.animeList.map((item) => (
                      <Link
                        key={item.animeId}
                        href={`/anime/${item.animeId}`}
                        className="block p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="font-semibold text-white line-clamp-2">{item.title}</div>
                        <div className="text-xs text-gray-400 mt-1">{item.animeId}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
