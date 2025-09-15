'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import zoramiLogo from '@/app/img/zorami.png'
import { Search, Menu, X, Home, Film, Calendar, Star, Play, Grid3X3, Download, Zap, Clock, TrendingUp, Tag } from 'lucide-react'

type NavbarProps = {
  forceSolid?: boolean
}

const Navbar = ({ forceSolid = false }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const menuItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Terbaru', href: '/latest', icon: Zap },
    { name: 'Movie', href: '/movie', icon: Film },
    { name: 'Batch', href: '/batch', icon: Download },
    { name: 'Genre', href: '/genres', icon: Tag },
    { name: 'All Anime', href: '/all', icon: Grid3X3 },
  ]

  const solid = forceSolid || isScrolled

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      solid
        ? (forceSolid ? 'bg-black border-b border-white/10 shadow-2xl' : 'bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-2xl')
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="group flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg group-hover:scale-110 transition-transform duration-300 bg-black/20">
                <Image
                  src={zoramiLogo}
                  alt="Zorami"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain p-1"
                  priority
                />
              </div>
              <div className="absolute inset-0 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
            </div>
            <div className="hidden sm:block">
              <span className="text-2xl font-black bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                ZORAMI
              </span>
              <div className="text-xs text-gray-400 font-medium tracking-wider">ANIME STREAMING</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group relative px-4 py-2 rounded-xl text-white/80 hover:text-white transition-all duration-300 hover:bg-white/10 backdrop-blur-sm"
                >
                  <div className="flex items-center space-x-2">
                    <Icon size={18} className="group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/20 group-hover:to-blue-600/20 transition-all duration-300" />
                </Link>
              )
            })}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="relative z-10 w-72 px-5 py-3 pl-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:outline-none focus:border-purple-400 focus:bg-white/20 text-white placeholder-white/60 transition-all duration-300 group-hover:bg-white/15"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
                  }
                }}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 group-hover:text-white/80 transition-colors duration-300 z-10" size={20} />
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/10 group-hover:to-blue-600/10 transition-all duration-300 z-0" />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
          <div className="px-4 py-6">
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-3 pl-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:outline-none focus:border-purple-400 text-white placeholder-white/60 transition-all duration-300"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
                    setIsMenuOpen(false)
                  }
                }}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group flex items-center space-x-3 p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl transition-all duration-300 hover:scale-105"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <Icon size={18} className="text-white" />
                    </div>
                    <span className="font-medium text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 group-hover:bg-clip-text transition-all duration-300">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
