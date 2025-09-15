import axios from 'axios'

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://www.sankavollerei.com'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// API response types based on Samehadaku API
export interface AnimeItem {
  id?: string
  animeId: string
  title: string
  poster: string
  episodes?: string
  score?: string
  status?: string
  type?: string
  releaseDate?: string
  releasedOn?: string
  totalEpisodes?: number
  genreList?: Array<{
    title: string
    genreId: string
    href: string
    samehadakuUrl: string
  }>
  href: string
  samehadakuUrl: string
}

export interface Genre {
  title: string
  genreId: string
  href: string
  samehadakuUrl: string
}

export interface BatchItem {
  title: string
  poster: string
  type: string
  score: string
  status: string
  batchId: string
  href: string
  samehadakuUrl: string
  genreList: Genre[]
}

export interface AnimeDetail {
  title: string
  poster: string
  score: {
    value: string
    users: string
  }
  japanese: string
  synonyms: string
  english: string
  status: string
  type: string
  source: string
  duration: string
  episodes: number | null
  season: string
  studios: string
  producers: string
  aired: string
  trailer: string
  synopsis: {
    paragraphs: string[]
    connections: any[]
  }
  genreList: Genre[]
  batchList: Array<{
    title: string
    batchId: string
    href: string
    samehadakuUrl: string
  }>
  episodeList: Array<{
    title: number | string
    episodeId: string
    href: string
    samehadakuUrl: string
  }>
}

export interface BatchDetail {
  title: string
  animeId: string
  poster: string
  japanese: string
  synonyms: string
  english: string
  status: string
  type: string
  source: string
  score: string
  duration: string
  episodes: number
  season: string
  studios: string
  producers: string
  aired: string
  releasedOn: string
  synopsis: {
    paragraphs: string[]
    connections: Array<{
      title: string
      animeId: string
      href: string
      samehadakuUrl: string
    }>
  }
  genreList: Genre[]
  downloadUrl: {
    formats: Array<{
      title: string
      qualities: Array<{
        title: string
        urls: Array<{
          title: string
          url: string
        }>
      }>
    }>
  }
  recommendedAnimeList: AnimeItem[]
}

export interface ServerLink {
  serverId: string
  serverName: string
  embedUrl: string
  directUrl: string
  quality: string
  size: string
}

export interface TopAnimeItem extends AnimeItem {
  rank: number
}

export interface ApiResponse<T> {
  creator: string
  message: string
  data: T
  pagination?: {
    currentPage: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
    nextPage: number | null
    prevPage: number | null
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    currentPage: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface HomeData {
  recent: {
    href: string
    samehadakuUrl: string
    animeList: AnimeItem[]
  }
  batch: {
    href: string
    samehadakuUrl: string
    batchList: any[]
  }
  movie: {
    href: string
    samehadakuUrl: string
    animeList: AnimeItem[]
  }
  top10: {
    href: string
    samehadakuUrl: string
    animeList: TopAnimeItem[]
  }
}

// API endpoints
export const apiEndpoints = {
  home: '/anime/home',
  schedule: '/anime/schedule',
  ongoing: '/anime/ongoing-anime',
  completed: '/anime/complete-anime',
  movies: '/anime/complete-anime',
  genres: '/anime/genre',
  search: (query: string) => `/anime/search/${encodeURIComponent(query)}`,
  animeDetail: (slug: string) => `/anime/anime/${slug}`,
  episodeDetail: (slug: string) => `/anime/episode/${slug}`,
  batchDetail: (slug: string) => `/anime/batch/${slug}`,
  genreAnime: (slug: string, page: number = 1) => `/anime/genre/${slug}?page=${page}`,
  completedPage: (page: number) => `/anime/complete-anime/${page}`,
  list: '/anime/unlimited'
}

// API functions
export const fetchHome = async (): Promise<{
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
}> => {
  try {
    const response = await api.get(apiEndpoints.home)
    return response.data.data
  } catch (error) {
    console.error('Error fetching home data:', error)
    // Return mock data for development
    return {
      ongoing_anime: [
        {
          title: "Kaoru Hana wa Rin to Saku",
          slug: "kaoru-hana-wa-rin-to-saku-sub-indo",
          poster: "https://otakudesu.best/wp-content/uploads/2025/07/Kaoru-Hana-wa-Rin-to-Saku.jpg",
          current_episode: "Episode 11",
          release_day: "Minggu",
          newest_release_date: "14 Sep",
          otakudesu_url: "https://otakudesu.best/anime/kaoru-hana-wa-rin-to-saku-sub-indo/"
        },
        {
          title: "Witch Watch",
          slug: "wch-watch-sub-indo",
          poster: "https://otakudesu.best/wp-content/uploads/2025/04/148017.jpg",
          current_episode: "Episode 23",
          release_day: "Minggu",
          newest_release_date: "14 Sep",
          otakudesu_url: "https://otakudesu.best/anime/wch-watch-sub-indo/"
        }
      ],
      complete_anime: [
        {
          title: "Kuroshitsuji: Midori no Majo-hen",
          slug: "kuroshitsuji-midori-no-majo-hen-subtitle-indonesia",
          poster: "https://otakudesu.best/wp-content/uploads/2025/09/Kuroshitsuji-Midori-no-Majo-hen-Sub-Indo.jpg",
          episode_count: "13",
          rating: "8.18",
          last_release_date: "06 Sep",
          otakudesu_url: "https://otakudesu.best/anime/kuroshitsuji-midori-no-majo-hen-subtitle-indonesia/"
        }
      ]
    }
  }
}

export const fetchRecentAnime = async (page: number = 1): Promise<ApiResponse<{ animeList: AnimeItem[] }>> => {
  try {
    const response = await api.get(`${apiEndpoints.ongoing}?page=${page}`)
    return {
      creator: response.data.creator || '',
      message: '',
      data: { animeList: response.data.data.ongoingAnimeData.map((item: any) => ({
        id: item.slug,
        animeId: item.slug,
        title: item.title,
        poster: item.poster,
        episodes: item.current_episode,
        status: 'Ongoing',
        type: 'TV',
        releasedOn: item.newest_release_date,
        href: `/anime/${item.slug}`,
        samehadakuUrl: item.otakudesu_url
      })) },
      pagination: {
        currentPage: response.data.data.paginationData?.current_page || 1,
        hasPrevPage: response.data.data.paginationData?.has_previous_page || false,
        prevPage: response.data.data.paginationData?.previous_page || null,
        hasNextPage: response.data.data.paginationData?.has_next_page || false,
        nextPage: response.data.data.paginationData?.next_page || null,
        totalPages: response.data.data.paginationData?.last_visible_page || 1
      }
    }
  } catch (error) {
    console.error('Error fetching recent anime:', error)
    return {
      creator: '',
      message: '',
      data: { animeList: [] },
      pagination: {
        currentPage: 1,
        hasPrevPage: false,
        prevPage: null,
        hasNextPage: false,
        nextPage: null,
        totalPages: 1
      }
    }
  }
}

// Alias for latest anime (same as recent)
export const fetchLatestAnime = fetchRecentAnime

export const fetchPopularAnime = async (page: number = 1): Promise<PaginatedResponse<AnimeItem>> => {
  try {
    const response = await api.get(`${apiEndpoints.completed}?page=${page}`)
    return {
      data: response.data.data.completeAnimeData?.map((item: any) => ({
        id: item.slug,
        animeId: item.slug,
        title: item.title,
        poster: item.poster,
        episodes: item.episode_count,
        score: item.rating,
        status: 'Completed',
        type: 'TV',
        releasedOn: item.last_release_date,
        href: `/anime/${item.slug}`,
        samehadakuUrl: item.otakudesu_url
      })) || [],
      pagination: {
        currentPage: response.data.data.paginationData?.current_page || 1,
        totalPages: response.data.data.paginationData?.last_visible_page || 1,
        hasNext: response.data.data.paginationData?.has_next_page || false,
        hasPrev: response.data.data.paginationData?.has_previous_page || false
      }
    }
  } catch (error) {
    console.error('Error fetching popular anime:', error)
    return {
      data: [
        {
          id: 'popular-1',
          title: 'Attack on Titan',
          animeId: 'attack-on-titan',
          poster: 'https://via.placeholder.com/300x400',
          href: '/anime/attack-on-titan',
          samehadakuUrl: '#',
          score: '9.0',
          type: 'TV',
          status: 'Completed',
          totalEpisodes: 87,
          genreList: [
            { title: 'Action', genreId: 'action', href: '/genres/action', samehadakuUrl: '#' },
            { title: 'Drama', genreId: 'drama', href: '/genres/drama', samehadakuUrl: '#' }
          ],
          releasedOn: '2 years ago'
        }
      ],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      }
    }
  }
}

export const fetchMovies = async (page: number = 1): Promise<ApiResponse<{ animeList: AnimeItem[] }>> => {
  try {
    const response = await api.get(`${apiEndpoints.completedPage(page)}`)
    return {
      creator: response.data.creator || '',
      message: '',
      data: { animeList: response.data.data.completeAnimeData?.map((item: any) => ({
        id: item.slug,
        animeId: item.slug,
        title: item.title,
        poster: item.poster,
        episodes: item.episode_count,
        score: item.rating,
        status: 'Completed',
        type: 'Movie',
        releasedOn: item.last_release_date,
        href: `/anime/${item.slug}`,
        samehadakuUrl: item.otakudesu_url
      })) || [] },
      pagination: {
        currentPage: response.data.data.paginationData?.current_page || 1,
        hasPrevPage: response.data.data.paginationData?.has_previous_page || false,
        prevPage: response.data.data.paginationData?.previous_page || null,
        hasNextPage: response.data.data.paginationData?.has_next_page || false,
        nextPage: response.data.data.paginationData?.next_page || null,
        totalPages: response.data.data.paginationData?.last_visible_page || 1
      }
    }
  } catch (error) {
    console.error('Error fetching movies:', error)
    return {
      creator: '',
      message: '',
      data: { animeList: [] },
      pagination: {
        currentPage: 1,
        hasPrevPage: false,
        prevPage: null,
        hasNextPage: false,
        nextPage: null,
        totalPages: 1
      }
    }
  }
}

export const fetchOngoingAnime = async (page: number = 1): Promise<ApiResponse<{ animeList: AnimeItem[] }>> => {
  try {
    const response = await api.get(`${apiEndpoints.ongoing}?page=${page}`)
    return response.data
  } catch (error) {
    console.error('Error fetching ongoing anime:', error)
    return {
      creator: '',
      message: '',
      data: { animeList: [] },
      pagination: {
        currentPage: 1,
        hasPrevPage: false,
        prevPage: null,
        hasNextPage: false,
        nextPage: null,
        totalPages: 1
      }
    }
  }
}

export const fetchCompletedAnime = async (page: number = 1): Promise<ApiResponse<{ animeList: AnimeItem[] }>> => {
  try {
    const response = await api.get(`${apiEndpoints.completed}?page=${page}`)
    return response.data
  } catch (error) {
    console.error('Error fetching completed anime:', error)
    return {
      creator: '',
      message: '',
      data: { animeList: [] },
      pagination: {
        currentPage: 1,
        hasPrevPage: false,
        prevPage: null,
        hasNextPage: false,
        nextPage: null,
        totalPages: 1
      }
    }
  }
}

export const fetchMovieAnime = async (page: number = 1): Promise<ApiResponse<{ animeList: AnimeItem[] }>> => {
  try {
    const response = await api.get(`${apiEndpoints.movies}?page=${page}`)
    return response.data
  } catch (error) {
    console.error('Error fetching movie anime:', error)
    return {
      creator: '',
      message: '',
      data: { animeList: [] },
      pagination: {
        currentPage: 1,
        hasPrevPage: false,
        prevPage: null,
        hasNextPage: false,
        nextPage: null,
        totalPages: 1
      }
    }
  }
}

export const searchAnime = async (query: string, page: number = 1): Promise<ApiResponse<{ animeList: AnimeItem[] }>> => {
  try {
    const response = await api.get(`${apiEndpoints.search(query)}&page=${page}`)
    const data = response.data?.data ?? {}
    const rawList = (Array.isArray(data)
      ? data
      : (data.anime || data.results || data.ongoingAnimeData || data.completeAnimeData || [])) as any[]
    const animeList: AnimeItem[] = rawList.map((item: any) => ({
      id: item.slug,
      animeId: item.slug,
      title: item.title,
      poster: item.poster,
      episodes: item.episode_count || item.current_episode,
      score: item.rating,
      status: item.status || (typeof item.episode_count !== 'undefined' ? 'Completed' : 'Unknown'),
      type: item.type || 'TV',
      releasedOn: item.last_release_date || item.season || item.newest_release_date,
      href: `/anime/${item.slug}`,
      samehadakuUrl: item.url || item.otakudesu_url,
      genreList: item.genres?.map((g: any) => ({
        title: g.name,
        genreId: g.slug,
        href: `/genres/${g.slug}`,
        samehadakuUrl: g.otakudesu_url
      })) || []
    }))

    const p = (Array.isArray(data) ? {} : (data.paginationData || data.pagination || {}))
    let result: ApiResponse<{ animeList: AnimeItem[] }> = {
      creator: response.data.creator || '',
      message: response.data.message || '',
      data: { animeList },
      pagination: {
        currentPage: p.current_page || 1,
        totalPages: p.last_visible_page || p.total_pages || 1,
        hasNextPage: p.has_next_page || p.current_page < (p.last_visible_page || p.total_pages || 1) || false,
        hasPrevPage: p.has_previous_page || (p.current_page || 1) > 1 || false,
        nextPage: p.next_page ?? null,
        prevPage: p.previous_page ?? null
      }
    }

    // Fallback: if empty, synthesize results by scanning other endpoints
    if (result.data.animeList.length === 0) {
      const q = query.toLowerCase()
      try {
        const [homeRes, completedRes] = await Promise.all([
          api.get(apiEndpoints.home),
          api.get(apiEndpoints.completedPage(1))
        ])
        const homeOngoing = homeRes.data?.data?.ongoing_anime || []
        const homeComplete = homeRes.data?.data?.complete_anime || []
        const completed = completedRes.data?.data?.completeAnimeData || []

        const pool = [...homeOngoing, ...homeComplete, ...completed]
        const dedup = new Map<string, AnimeItem>()
        for (const item of pool) {
          const title: string = item.title || ''
          if (title.toLowerCase().includes(q)) {
            const slug: string = item.slug
            dedup.set(slug, {
              id: slug,
              animeId: slug,
              title,
              poster: item.poster,
              episodes: item.episode_count || item.current_episode,
              score: item.rating,
              status: typeof item.episode_count !== 'undefined' ? 'Completed' : 'Ongoing',
              type: 'TV',
              releasedOn: item.last_release_date || item.season || item.newest_release_date,
              href: `/anime/${slug}`,
              samehadakuUrl: item.otakudesu_url
            })
          }
        }
        result = {
          creator: response.data.creator || '',
          message: response.data.message || '',
          data: { animeList: Array.from(dedup.values()) },
          pagination: {
            currentPage: 1,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
            nextPage: null,
            prevPage: null
          }
        }
      } catch (_) {
        // ignore fallback errors; return original empty result
      }
    }

    return result
  } catch (error) {
    console.error('Error searching anime:', error)
    return {
      creator: '',
      message: '',
      data: { animeList: [] },
      pagination: {
        currentPage: 1,
        hasPrevPage: false,
        prevPage: null,
        hasNextPage: false,
        nextPage: null,
        totalPages: 1
      }
    }
  }
}

export const fetchAllAnime = async (): Promise<ApiResponse<{ list: { startWith: string; animeList: { title: string; animeId: string; href: string; samehadakuUrl: string }[] }[] }>> => {
  try {
    const response = await api.get(apiEndpoints.list)
    return response.data
  } catch (error) {
    console.error('Error fetching all anime:', error)
    return {
      creator: '',
      message: '',
      data: { list: [] },
      pagination: undefined
    }
  }
}

export const fetchGenres = async (): Promise<Genre[]> => {
  try {
    const response = await api.get(apiEndpoints.genres)
    return response.data.data?.map((genre: any) => ({
      title: genre.name,
      genreId: genre.slug,
      href: `/genres/${genre.slug}`,
      samehadakuUrl: genre.otakudesu_url
    })) || []
  } catch (error) {
    console.error('Error fetching genres:', error)
    return [
      { title: 'Action', genreId: 'action', href: '/genres/action', samehadakuUrl: '#' },
      { title: 'Adventure', genreId: 'adventure', href: '/genres/adventure', samehadakuUrl: '#' },
      { title: 'Comedy', genreId: 'comedy', href: '/genres/comedy', samehadakuUrl: '#' },
      { title: 'Drama', genreId: 'drama', href: '/genres/drama', samehadakuUrl: '#' },
      { title: 'Fantasy', genreId: 'fantasy', href: '/genres/fantasy', samehadakuUrl: '#' },
      { title: 'Romance', genreId: 'romance', href: '/genres/romance', samehadakuUrl: '#' },
      { title: 'Sci-Fi', genreId: 'sci-fi', href: '/genres/sci-fi', samehadakuUrl: '#' },
      { title: 'Slice of Life', genreId: 'slice-of-life', href: '/genres/slice-of-life', samehadakuUrl: '#' }
    ]
  }
}

export const fetchAnimeByGenre = async (genreSlug: string, page: number = 1): Promise<ApiResponse<{ animeList: AnimeItem[] }>> => {
  try {
    const response = await api.get(apiEndpoints.genreAnime(genreSlug, page))
    return {
      creator: response.data.creator || '',
      message: '',
      data: { animeList: response.data.data.anime?.map((item: any) => ({
        id: item.slug,
        animeId: item.slug,
        title: item.title,
        poster: item.poster,
        episodes: item.episode_count,
        score: item.rating,
        status: 'Unknown',
        type: 'TV',
        releasedOn: item.season,
        href: `/anime/${item.slug}`,
        samehadakuUrl: item.otakudesu_url,
        genreList: item.genres?.map((genre: any) => ({
          title: genre.name,
          genreId: genre.slug,
          href: `/genres/${genre.slug}`,
          samehadakuUrl: genre.otakudesu_url
        })) || []
      })) || [] },
      pagination: {
        currentPage: response.data.data.pagination?.current_page || 1,
        hasPrevPage: response.data.data.pagination?.has_previous_page || false,
        prevPage: response.data.data.pagination?.previous_page || null,
        hasNextPage: response.data.data.pagination?.has_next_page || false,
        nextPage: response.data.data.pagination?.next_page || null,
        totalPages: response.data.data.pagination?.last_visible_page || 1
      }
    }
  } catch (error) {
    console.error('Error fetching anime by genre:', error)
    return {
      creator: '',
      message: '',
      data: { animeList: [] },
      pagination: {
        currentPage: 1,
        hasPrevPage: false,
        prevPage: null,
        hasNextPage: false,
        nextPage: null,
        totalPages: 1
      }
    }
  }
}

export const fetchBatchAnime = async (page: number = 1): Promise<ApiResponse<{ batchList: BatchItem[] }>> => {
  try {
    const response = await api.get(`${apiEndpoints.completedPage(page)}`)
    return {
      creator: response.data.creator || '',
      message: '',
      data: { batchList: response.data.data.completeAnimeData?.map((item: any) => ({
        title: item.title,
        poster: item.poster,
        type: 'TV',
        score: item.rating,
        status: 'Completed',
        batchId: String(item.slug || '').replace(/-sub-indo$/, '-batch-sub-indo'),
        href: `/batch/${String(item.slug || '').replace(/-sub-indo$/, '-batch-sub-indo')}`,
        samehadakuUrl: item.otakudesu_url,
        genreList: []
      })) || [] },
      pagination: {
        currentPage: response.data.data.paginationData?.current_page || 1,
        hasPrevPage: response.data.data.paginationData?.has_previous_page || false,
        prevPage: response.data.data.paginationData?.previous_page || null,
        hasNextPage: response.data.data.paginationData?.has_next_page || false,
        nextPage: response.data.data.paginationData?.next_page || null,
        totalPages: response.data.data.paginationData?.last_visible_page || 1
      }
    }
  } catch (error) {
    console.error('Error fetching batch anime:', error)
    return {
      creator: '',
      message: '',
      data: { batchList: [] },
      pagination: {
        currentPage: 1,
        hasPrevPage: false,
        prevPage: null,
        hasNextPage: false,
        nextPage: null,
        totalPages: 1
      }
    }
  }
}

export const fetchAnimeDetail = async (animeSlug: string): Promise<ApiResponse<AnimeDetail>> => {
  try {
    const response = await api.get(apiEndpoints.animeDetail(animeSlug))
    const data = response.data.data
    return {
      creator: response.data.creator || '',
      message: '',
      data: {
        title: data.title,
        poster: data.poster,
        score: { value: data.rating || '0', users: '0' },
        japanese: data.japanese_title || '',
        synonyms: '',
        english: data.title,
        status: data.status || 'Unknown',
        type: data.type || 'TV',
        source: 'Unknown',
        duration: data.duration || '24 min',
        episodes: parseInt(data.episode_count) || 0,
        season: data.release_date || 'Unknown',
        studios: data.studio || 'Unknown',
        producers: data.produser || 'Unknown',
        aired: data.release_date || 'Unknown',
        trailer: '',
        synopsis: { 
          paragraphs: data.synopsis ? [data.synopsis] : ['No synopsis available'], 
          connections: [] 
        },
        genreList: data.genres?.map((genre: any) => ({
          title: genre.name,
          genreId: genre.slug,
          href: `/genres/${genre.slug}`,
          samehadakuUrl: genre.otakudesu_url
        })) || [],
        batchList: data.batch ? [{
          title: data.batch.title || 'Batch Download',
          batchId: (animeSlug || '').replace(/-sub-indo$/, '-batch-sub-indo'),
          href: `/batch/${(animeSlug || '').replace(/-sub-indo$/, '-batch-sub-indo')}`,
          samehadakuUrl: '#'
        }] : [],
        episodeList: (data.episode_lists || data.episode_list || [])?.map((ep: any, idx: number) => {
          const num = typeof ep.episode_number !== 'undefined' ? parseInt(String(ep.episode_number)) : (idx + 1)
          let slug = ep.slug as string
          if (slug) {
            try {
              if (/https?:\/\/?/i.test(slug)) {
                // Normalize URL and take last segment
                const normalized = slug.replace(/https?:\/\/?/i, (m) => (m.endsWith('//') ? m : m.replace(/\/?$/, '//')))
                const u = new URL(normalized)
                const parts = u.pathname.split('/').filter(Boolean)
                slug = parts.pop() || slug
              } else if (slug.includes('/')) {
                const parts = slug.split('/').filter(Boolean)
                slug = parts.pop() || slug
              }
            } catch { /* ignore */ }
          }
          if (!slug || !/episode-\d+/i.test(slug)) {
            slug = `${animeSlug}-episode-${num}-sub-indo`
          }
          return {
            title: String(num),
            episodeId: slug,
            href: `/episode/${slug}`,
            samehadakuUrl: ep.otakudesu_url
          }
        }) || []
      },
      pagination: undefined
    }
  } catch (error) {
    console.error('Error fetching anime detail:', error)
    return {
      creator: '',
      message: '',
      data: {
        title: 'Sample Anime Title',
        poster: 'https://via.placeholder.com/300x400',
        score: { value: '8.5', users: '1000' },
        japanese: 'サンプルアニメ',
        synonyms: '',
        english: 'Sample Anime',
        status: 'Ongoing',
        type: 'TV',
        source: 'Manga',
        duration: '24 min per ep',
        episodes: 12,
        season: 'Fall 2024',
        studios: 'Sample Studio',
        producers: 'Sample Producer',
        aired: 'Oct 2024',
        trailer: '',
        synopsis: { 
          paragraphs: ['This is a sample anime description for testing purposes.'], 
          connections: [] 
        },
        genreList: [
          { title: 'Action', genreId: 'action', href: '/genres/action', samehadakuUrl: '#' },
          { title: 'Adventure', genreId: 'adventure', href: '/genres/adventure', samehadakuUrl: '#' }
        ],
        batchList: [],
        episodeList: [
          { title: '1', episodeId: 'ep1', href: '/episode/ep1', samehadakuUrl: '#' },
          { title: '2', episodeId: 'ep2', href: '/episode/ep2', samehadakuUrl: '#' }
        ]
      },
      pagination: undefined
    }
  }
}

export const fetchBatchDetail = async (batchId: string): Promise<ApiResponse<BatchDetail>> => {
  try {
    const response = await api.get(apiEndpoints.batchDetail(batchId))
    return response.data
  } catch (error) {
    console.error('Error fetching batch detail:', error)
    return {
      creator: '',
      message: '',
      data: {
        title: 'Sample Anime Title',
        animeId: batchId,
        poster: 'https://via.placeholder.com/300x400',
        japanese: 'サンプルアニメ',
        synonyms: '',
        english: 'Sample Anime',
        status: 'Ongoing',
        type: 'TV',
        source: 'Manga',
        score: '8.5',
        duration: '24 min per ep',
        episodes: 12,
        season: 'Fall 2024',
        studios: 'Sample Studio',
        producers: 'Sample Producer',
        aired: 'Oct 2024',
        releasedOn: '1 month ago',
        synopsis: { 
          paragraphs: ['This is a sample anime description for testing purposes.'], 
          connections: [] 
        },
        genreList: [
          { title: 'Action', genreId: 'action', href: '/genres/action', samehadakuUrl: '#' },
          { title: 'Adventure', genreId: 'adventure', href: '/genres/adventure', samehadakuUrl: '#' }
        ],
        downloadUrl: { formats: [] },
        recommendedAnimeList: []
      },
      pagination: undefined
    }
  }
}

export const fetchServerLink = async (serverId: string): Promise<ApiResponse<ServerLink>> => {
  try {
    return {
      creator: 'Sanka Vollerei',
      message: '',
      data: {
        serverId: serverId,
        serverName: 'Sample Server',
        embedUrl: 'https://example.com/embed/sample',
        directUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        quality: '1080p',
        size: '500MB'
      },
      pagination: undefined
    }
  } catch (error) {
    console.error('Error fetching server link:', error)
    return {
      creator: '',
      message: '',
      data: {
        serverId: serverId,
        serverName: 'Sample Server',
        embedUrl: 'https://example.com/embed/sample',
        directUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        quality: '1080p',
        size: '500MB'
      },
      pagination: undefined
    }
  }
}

// Fetch anime episode list
export const fetchAnimeEpisodes = async (animeSlug: string): Promise<Array<{
  slug: string
  title: string
  number: number
  downloadUrl?: string
}>> => {
  try {
    const response = await api.get(apiEndpoints.animeDetail(animeSlug))
    const data = response.data.data
    
    // Extract episodes from API response (support both keys)
    const rawList = (data.episode_lists || data.episode_list || []) as any[]
    const episodes = rawList.map((ep: any, index: number) => {
      const num = typeof ep.episode_number !== 'undefined'
        ? parseInt(String(ep.episode_number))
        : (ep.title ? parseInt(String(ep.title).match(/\d+/)?.[0] || `${index + 1}`) : index + 1)
      // Sanitize slug
      let slug: string | undefined = ep.slug
      if (slug) {
        try {
          if (/https?:\/\/?/i.test(slug)) {
            const normalized = slug.replace(/https?:\/\/?/i, (m) => (m.endsWith('//') ? m : m.replace(/\/?$/, '//')))
            const u = new URL(normalized)
            const parts = u.pathname.split('/').filter(Boolean)
            slug = parts.pop() || slug
          } else if (slug.includes('/')) {
            const parts = slug.split('/').filter(Boolean)
            slug = parts.pop() || slug
          }
        } catch { /* ignore */ }
      }
      if (!slug || !/episode-\d+/i.test(slug)) {
        slug = `${animeSlug}-episode-${num}-sub-indo`
      }
      return {
        slug,
        title: ep.title || `Episode ${num}`,
        number: num,
        downloadUrl: ep.download_url
      }
    })
    
    return episodes
  } catch (error) {
    console.error('Error fetching anime episodes:', error)
    // Fallback: generate episodes based on common pattern
    return Array.from({ length: 12 }, (_, i) => ({
      slug: `${animeSlug}-episode-${i + 1}-sub-indo`,
      title: `Episode ${i + 1}`,
      number: i + 1
    }))
  }
}

export const fetchEpisodeDetail = async (episodeSlug: string): Promise<{
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
}> => {
  try {
    const response = await api.get(apiEndpoints.episodeDetail(episodeSlug))
    const data = response.data.data
    
    // Extract episode number from slug or title
    const episodeMatch = episodeSlug.match(/-episode-(\d+)-/) || data.episode?.match(/(\d+)/)
    const episodeNumber = episodeMatch ? parseInt(episodeMatch[1]) : 1
    
    // Try to get full anime slug from API response, then sanitize to a last path segment
    const sanitizeToSlug = (value: string) => {
      try {
        if (/https?:\/?\/?/i.test(value)) {
          const normalized = value.replace(/https?:\/?\/?/i, (m) => (m.endsWith('//') ? m : m.replace(/\/?$/, '//')))
          const u = new URL(normalized)
          const afterAnime = u.pathname.includes('/anime/') ? u.pathname.split('/anime/')[1] : u.pathname
          return (afterAnime.split('/').filter(Boolean).pop() || value).replace(/\/+$/,'')
        }
        if (value.includes('/')) {
          return value.split('/').filter(Boolean).pop() as string
        }
        return value
      } catch {
        return value
      }
    }

    // initial from episode slug
    let animeSlug = sanitizeToSlug(episodeSlug.replace(/-episode-\d+.*$/, ''))
    const apiAnimeSlug = (data.anime?.slug || data.anime_slug) as string | undefined
    if (apiAnimeSlug && typeof apiAnimeSlug === 'string') {
      animeSlug = sanitizeToSlug(apiAnimeSlug)
    } else if (data.anime?.otakudesu_url || data.otakudesu_url) {
      const url: string = data.anime?.otakudesu_url || data.otakudesu_url
      const m = url.match(/anime\/(.+?)\/?$/)
      if (m && m[1]) animeSlug = sanitizeToSlug(m[1])
    }
    
    // Best-effort anime title resolution
    let cleanAnimeTitle: string | undefined = data.anime?.title || data.anime_title
    if (!cleanAnimeTitle) {
      try {
        const detail = await api.get(apiEndpoints.animeDetail(animeSlug))
        cleanAnimeTitle = detail.data?.data?.title
      } catch (_) {
        // ignore and fallback below
      }
    }
    if (!cleanAnimeTitle) {
      cleanAnimeTitle = animeSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }
    // If API returned a URL-like string as title, parse a readable title
    const looksLikeUrl = (str: string) => /https?:\/?\/?/i.test(str) || /otakudesu/i.test(str) || /\/.+\//.test(str) || /\banime\b/i.test(str)
    if (cleanAnimeTitle && looksLikeUrl(cleanAnimeTitle)) {
      try {
        // Normalize to a parseable URL
        const normalized = /https?:\/?\/?/i.test(cleanAnimeTitle)
          ? cleanAnimeTitle.replace(/https?:\/?\/?/i, (m) => (m.endsWith('//') ? m : m.replace(/\/?$/, '//')))
          : `https://dummy.local/${cleanAnimeTitle.replace(/^\/*/, '')}`
        const url = new URL(normalized)
        // Get the part after '/anime/' if present
        const afterAnime = url.pathname.includes('/anime/') ? url.pathname.split('/anime/')[1] : url.pathname
        const segment = afterAnime.split('/')
          .filter(Boolean)
          .pop() || ''
        const decoded = decodeURIComponent(segment)
        cleanAnimeTitle = decoded
          .replace(/-/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .replace(/\b\w/g, (c) => c.toUpperCase())
      } catch {
        // fallback: strip protocol manually
        const path = cleanAnimeTitle.replace(/^https?:\/?\/?/i, '')
        const last = path.split('/')
          .filter(Boolean)
          .pop() || path
        cleanAnimeTitle = last.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      }
    }
    
    return {
      id: episodeSlug,
      title: data.episode || `Episode ${episodeNumber}`,
      animeTitle: cleanAnimeTitle || 'Anime Title',
      animeSlug: animeSlug,
      number: episodeNumber,
      downloadUrl: data.download_url,
      servers: data.stream_servers?.qualities?.flatMap((quality: any) => 
        quality.serverList?.map((server: any) => ({
          name: server.title,
          url: server.url || data.stream_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          quality: quality.title
        }))
      ) || [
        { name: 'Streamtape', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', quality: '1080p' },
        { name: 'Mixdrop', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', quality: '720p' },
        { name: 'Upstream', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', quality: '480p' }
      ]
    }
  } catch (error) {
    console.error('Error fetching episode detail:', error)
    
    // Extract info from slug for fallback
    const episodeMatch = episodeSlug.match(/-episode-(\d+)-/) 
    const episodeNumber = episodeMatch ? parseInt(episodeMatch[1]) : 1
    const animeSlug = episodeSlug.replace(/-episode-\d+.*$/, '')
    
    // Map common anime slugs to proper titles
    const animeSlugToTitle: { [key: string]: string } = {
      'khwrs': 'Kaoru Hana wa Rin to Saku',
      'bnha': 'Boku no Hero Academia',
      'op': 'One Piece',
      'aot': 'Attack on Titan',
      'ds': 'Demon Slayer',
      'jjk': 'Jujutsu Kaisen'
    }
    
    const cleanAnimeTitle = animeSlugToTitle[animeSlug] ||
                           animeSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    
    return {
      id: episodeSlug,
      title: `Episode ${episodeNumber}`,
      animeTitle: cleanAnimeTitle || 'Anime Title',
      animeSlug: animeSlug,
      number: episodeNumber,
      downloadUrl: undefined,
      servers: [
        { name: 'Streamtape', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', quality: '1080p' },
        { name: 'Mixdrop', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', quality: '720p' },
        { name: 'Upstream', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', quality: '480p' }
      ]
    }
  }
}

export default api
