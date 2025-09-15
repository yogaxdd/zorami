# Aozora - Blue Sky Anime Streaming

Aozora adalah platform streaming anime modern yang dibangun dengan Next.js 14, TypeScript, dan Tailwind CSS. Website ini menyediakan pengalaman menonton anime yang luar biasa dengan desain yang indah dan fitur-fitur lengkap.

## ✨ Fitur Utama

- 🎬 **Streaming Anime HD** - Nikmati anime favorit dengan kualitas tinggi
- 🔍 **Pencarian Canggih** - Temukan anime dengan mudah
- 📱 **Responsive Design** - Tampil sempurna di semua perangkat
- 🌙 **Dark Theme** - Desain gelap yang nyaman untuk mata
- ⚡ **Fast Loading** - Optimasi performa untuk pengalaman terbaik
- 🎯 **Kategori Lengkap** - Anime terbaru, ongoing, populer, movie, dan lainnya

## 🚀 Teknologi

- **Framework**: Next.js 14 dengan App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animation**: Framer Motion
- **HTTP Client**: Axios

## 📦 Instalasi

1. Clone repository ini:
```bash
git clone <repository-url>
cd aozora
```

2. Install dependencies:
```bash
npm install
```

3. Jalankan development server:
```bash
npm run dev
```

4. Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 🌐 Deployment

Website ini siap untuk di-deploy ke Vercel:

1. Push code ke GitHub repository
2. Connect repository ke Vercel
3. Deploy otomatis akan berjalan

## 📁 Struktur Project

```
aozora/
├── app/                    # App Router pages
│   ├── anime/[id]/        # Detail anime
│   ├── episode/[id]/      # Player episode
│   ├── latest/            # Anime terbaru
│   ├── ongoing/           # Anime ongoing
│   ├── popular/           # Anime populer
│   ├── movie/             # Anime movie
│   ├── search/            # Halaman pencarian
│   └── page.tsx           # Homepage
├── components/            # Reusable components
│   ├── AnimeCard.tsx      # Card anime
│   ├── Navbar.tsx         # Navigation
│   ├── LoadingSpinner.tsx # Loading indicator
│   └── Pagination.tsx     # Pagination component
├── lib/                   # Utilities
│   └── api.ts             # API integration
└── public/               # Static assets
```

## 🎨 Desain

Aozora menggunakan tema "Blue Sky" dengan:
- Gradient biru yang menenangkan
- Animasi halus dan modern
- Typography yang mudah dibaca
- Hover effects yang responsif
- Card design yang elegant

## 🔧 Konfigurasi API

Untuk mengintegrasikan dengan Samehadaku API, update environment variables:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-endpoint.com
```

## 📱 Fitur Halaman

### Homepage
- Hero section dengan featured anime
- Kategori navigasi
- Anime terbaru
- Design responsive

### Pencarian
- Real-time search
- Filter dan sorting
- Pagination
- Popular searches

### Detail Anime
- Informasi lengkap anime
- Daftar episode
- Rating dan genre
- Download links

### Video Player
- Multiple server options
- Quality selection
- Episode navigation
- Responsive player

## 🤝 Kontribusi

Kontribusi selalu diterima! Silakan:

1. Fork repository
2. Buat feature branch
3. Commit changes
4. Push ke branch
5. Buat Pull Request

## 📄 License

MIT License - lihat file LICENSE untuk detail.

## 🙏 Credits

- Design inspiration dari platform streaming modern
- Icons dari Lucide React
- Fonts dari Google Fonts
- API dari Samehadaku

---

Dibuat dengan ❤️ untuk komunitas anime Indonesia
