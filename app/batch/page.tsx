'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import LoadingSpinner from '@/components/LoadingSpinner'
import Pagination from '@/components/Pagination'
import { Download, Package, Star, Calendar } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { fetchBatchAnime, BatchItem } from '@/lib/api'

export default function BatchPage() {
  const [batchList, setBatchList] = useState<BatchItem[]>([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  })
  const [loading, setLoading] = useState(true)

  const loadBatch = async (page: number = 1) => {
    setLoading(true)
    try {
      const results = await fetchBatchAnime(page)
      setBatchList(results.data.batchList)
      if (results.pagination) {
        setPagination({
          currentPage: results.pagination.currentPage,
          totalPages: results.pagination.totalPages,
          hasNextPage: results.pagination.hasNextPage,
          hasPrevPage: results.pagination.hasPrevPage
        })
      }
    } catch (error) {
      console.error('Error loading batch anime:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBatch()
  }, [])

  const handlePageChange = (page: number) => {
    loadBatch(page)
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
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Download className="text-white" size={24} />
              </div>
              <h1 className="text-4xl font-bold gradient-text">Batch Download</h1>
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Download anime lengkap dalam satu paket. Hemat waktu dan bandwidth dengan batch download.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 text-center">
              <Package className="text-green-400 mx-auto mb-2" size={32} />
              <h3 className="text-2xl font-bold text-white mb-1">Batch</h3>
              <p className="text-gray-400">Paket lengkap</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 text-center">
              <Download className="text-blue-400 mx-auto mb-2" size={32} />
              <h3 className="text-2xl font-bold text-white mb-1">Fast</h3>
              <p className="text-gray-400">Download cepat</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 text-center">
              <Star className="text-yellow-400 mx-auto mb-2" size={32} />
              <h3 className="text-2xl font-bold text-white mb-1">Quality</h3>
              <p className="text-gray-400">Kualitas terjamin</p>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="text-gray-400 mt-4">Memuat batch anime...</p>
              </div>
            </div>
          )}

          {/* Batch Grid */}
          {!loading && batchList.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {batchList.map((batch) => (
                  <Link
                    key={batch.batchId}
                    href={`/batch/${batch.batchId}`}
                    className="group"
                  >
                    <div className="bg-gray-800/50 backdrop-blur-md rounded-lg overflow-hidden hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                      <div className="relative aspect-[16/9]">
                        <Image
                          src={batch.poster}
                          alt={batch.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Download icon overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-green-600/90 backdrop-blur-sm rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                            <Download className="text-white" size={24} />
                          </div>
                        </div>
                        
                        {/* Type badge */}
                        <div className="absolute top-2 left-2 px-2 py-1 bg-blue-600/80 rounded text-xs font-semibold">
                          {batch.type}
                        </div>
                        
                        {/* Status badge */}
                        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold ${
                          batch.status === 'Completed' 
                            ? 'bg-green-500/80' 
                            : 'bg-gray-500/80'
                        }`}>
                          {batch.status}
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold text-white line-clamp-2 group-hover:text-green-400 transition-colors duration-200 mb-2">
                          {batch.title}
                        </h3>
                        
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                          {batch.score && (
                            <div className="flex items-center space-x-1">
                              <Star className="text-yellow-400 fill-current" size={12} />
                              <span>{batch.score}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-1">
                            <Package size={12} />
                            <span>Batch</span>
                          </div>
                        </div>
                        
                        {/* Genres */}
                        {batch.genreList && batch.genreList.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {batch.genreList.slice(0, 3).map((genre, index) => (
                              <span
                                key={index}
                                className="px-1.5 py-0.5 bg-gray-700/50 text-xs rounded text-gray-300"
                              >
                                {genre.title}
                              </span>
                            ))}
                            {batch.genreList.length > 3 && (
                              <span className="px-1.5 py-0.5 bg-gray-700/50 text-xs rounded text-gray-300">
                                +{batch.genreList.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
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
          {!loading && batchList.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="text-gray-600" size={40} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Belum ada batch</h3>
              <p className="text-gray-400">Silakan coba lagi nanti</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
