# LiveChart API Scraper

Web scraper untuk mengambil data anime dari livechart.me dan menyediakannya melalui REST API endpoints dengan arsitektur terstruktur (MVC-like).

## 📁 Struktur Project

```
LiveChartAPI/
├── src/
│   ├── controllers/
│   │   └── animeController.js      # Business logic untuk endpoints
│   ├── services/
│   │   ├── scrapeService.js        # Service untuk scraping
│   │   └── cacheService.js         # Service untuk cache management
│   ├── utils/
│   │   └── dataFormatter.js        # Utility functions
│   ├── routes/
│   │   └── animeRoutes.js          # Route definitions
│   ├── app.js                      # Express app setup
│   └── server.js                   # Server entry point
├── scraper.js                      # Standalone scraper
├── package.json
└── README.md
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Jalankan server:
```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

## 📡 Endpoints

### 📺 Anime Data

#### 1. Dapatkan Semua Anime (dengan Season & Year)
```
GET /api/anime?season=fall&year=2025
```

**Query Parameters:**
- `season` (optional): winter, spring, summer, fall (default: current season)
- `year` (optional): tahun (default: current year)

**Contoh:**
- `GET /api/anime` - Dapatkan anime musim sekarang
- `GET /api/anime?season=spring&year=2024` - Dapatkan anime Spring 2024
- `GET /api/anime?season=winter` - Dapatkan anime Winter tahun sekarang

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "11382",
      "title": "One-Punch Man Season 3",
      "link": "https://www.livechart.me/anime/11382",
      "status": "Ongoing",
      "episodes": "EP6",
      "studio": "J.C.STAFF",
      "score": "7.47",
      "poster": "https://..."
    }
  ],
  "total": 96,
  "season": "fall",
  "year": "2025",
  "cached": false,
  "timestamp": "2025-11-16T20:39:00.000Z"
}
```

#### 2. Dapatkan Anime by ID
```
GET /api/anime/:id
```

Contoh: `GET /api/anime/11382`

#### 3. Cari Anime
```
GET /api/anime/search/:title
```

Contoh: `GET /api/anime/search/One-Punch`

#### 4. Filter by Status
```
GET /api/anime/filter/status/:status
```

Contoh: `GET /api/anime/filter/status/ongoing`

### 🎬 Movie Endpoints

#### 5. Dapatkan Semua Movie
```
GET /api/movie?season=fall&year=2025
GET /api/movies?season=fall&year=2025
```

**Query Parameters:**
- `season` (optional): winter, spring, summer, fall (default: current season)
- `year` (optional): tahun (default: current year)

**Contoh:**
```bash
# Movie Fall 2025 (default)
curl http://localhost:3000/api/movie
curl http://localhost:3000/api/movies

# Movie Fall 2025 (explicit)
curl http://localhost:3000/api/movie?season=fall&year=2025
curl http://localhost:3000/api/movies?season=fall&year=2025

# Movie Spring 2024
curl http://localhost:3000/api/movie?season=spring&year=2024
curl http://localhost:3000/api/movies?season=spring&year=2024
```

**Note:** Kedua endpoint `/api/movie` dan `/api/movies` berfungsi sama (alias)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "movie-id",
      "title": "Movie Title",
      "link": "https://www.livechart.me/anime/...",
      "status": "Releasing",
      "episodes": "N/A",
      "studio": "Studio Name",
      "score": "8.5",
      "poster": "https://..."
    }
  ],
  "total": 15,
  "cached": false,
  "type": "movie"
}
```

#### 6. Refresh Movie Cache
```
POST /api/movie/refresh?season=fall&year=2025
POST /api/movies/refresh?season=fall&year=2025
```

**Query Parameters:**
- `season` (optional): winter, spring, summer, fall
- `year` (optional): tahun

**Contoh:**
```bash
curl -X POST http://localhost:3000/api/movie/refresh?season=fall&year=2025
curl -X POST http://localhost:3000/api/movies/refresh?season=fall&year=2025
```

**Response:** Movie data yang di-refresh

**Note:** 
- Kedua endpoint `/api/movie/refresh` dan `/api/movies/refresh` berfungsi sama (alias)
- Movie scraper menggunakan URL `https://www.livechart.me/{season}-{year}/movies?ongoing=all` (dengan `/movies` plural)

### 🔄 Cache Management

#### 7. Refresh Cache
```
POST /api/anime/refresh?season=fall&year=2025
```

**Query Parameters:**
- `season` (optional): winter, spring, summer, fall
- `year` (optional): tahun

Memaksa scraper untuk mengambil data terbaru dari website.

#### 6. Get Cache Info
```
GET /api/anime/info/cache
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalKeys": 2,
    "keys": [
      {
        "key": "fall-2025",
        "count": 96,
        "age": 3600000,
        "isValid": true
      }
    ]
  }
}
```

### ℹ️ Info Endpoints

#### 7. Get Available Seasons & Years
```
GET /api/anime/info/seasons
```

**Response:**
```json
{
  "success": true,
  "data": {
    "seasons": ["winter", "spring", "summer", "fall"],
    "years": [2020, 2021, ..., 2025, 2026],
    "currentYear": 2025
  }
}
```

### 📖 Anime Detail

#### 9. Dapatkan Detail Anime Lengkap
```
GET /api/detail/:id
```

Contoh: `GET /api/detail/12692`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "12692",
    "title": "SPY x FAMILY Season 3",
    "originalTitle": "SPY×FAMILY Season 3",
    "poster": "https://...",
    "rating": 8.06,
    "ratingsCount": "473",
    "status": "Releasing",
    "format": "TV",
    "source": "Manga",
    "totalEpisodes": 13,
    "currentEpisode": 8,
    "runTime": "24m",
    "season": "Fall 2025",
    "premiere": "Oct 4, 2025",
    "studios": ["WIT STUDIO", "CloverWorks"],
    "tags": ["Action", "Comedy", "Childcare", "Show All"],
    "synopsis": "No synopsis has been added to this title.",
    "streaming": "Available on multiple platforms",
    "links": {
      "livechart": "https://www.livechart.me/anime/12692",
      "myanimelist": "https://myanimelist.net/anime/...",
      "anilist": "https://anilist.co/anime/...",
      "kitsu": "https://kitsu.io/anime/...",
      "imdb": null
    }
  },
  "cached": false,
  "timestamp": "2025-11-16T20:39:00.000Z"
}
```

#### 10. Dapatkan Synopsis Anime
```
GET /api/detail/:id/synopsis
```

Contoh: `GET /api/detail/12692/synopsis`

#### 11. Dapatkan Info Streaming
```
GET /api/detail/:id/streaming
```

Contoh: `GET /api/detail/12692/streaming`

#### 12. Dapatkan Statistik Anime
```
GET /api/detail/:id/stats
```

Contoh: `GET /api/detail/12692/stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "12692",
    "title": "SPY x FAMILY Season 3",
    "rating": 8.06,
    "ratingsCount": "473",
    "totalEpisodes": 13,
    "currentEpisode": 8,
    "status": "Releasing"
  }
}
```

### 💾 Export to JSON

#### 13. Export Detail Anime ke JSON File
```
GET /api/detail/:id/export
```

Contoh: `GET /api/detail/12692/export`

**Response:** File JSON download dengan nama `anime_12692_SPY_x_FAMILY_Season_3.json`

**File Content:**
```json
{
  "exportedAt": "2025-11-16T20:39:00.000Z",
  "source": "LiveChart API",
  "anime": {
    "id": "12692",
    "title": "SPY x FAMILY Season 3",
    "originalTitle": "SPY×FAMILY Season 3",
    "poster": "https://...",
    "rating": 8.06,
    "ratingsCount": "473",
    "status": "Releasing",
    "format": "TV",
    "source": "Manga",
    "totalEpisodes": 13,
    "currentEpisode": 8,
    "runTime": "24m",
    "season": "Fall 2025",
    "premiere": "Oct 4, 2025",
    "studios": ["WIT STUDIO", "CloverWorks"],
    "tags": ["Action", "Comedy", "Childcare"],
    "synopsis": "No synopsis has been added to this title.",
    "streaming": "Available on multiple platforms",
    "links": {
      "livechart": "https://www.livechart.me/anime/12692",
      "myanimelist": "https://myanimelist.net/anime/...",
      "anilist": "https://anilist.co/anime/...",
      "kitsu": "https://kitsu.io/anime/...",
      "imdb": null
    }
  }
}
```

#### 14. Export Multiple Anime ke JSON File
```
POST /api/detail/export-multiple
```

**Request Body:**
```json
{
  "ids": ["12692", "11382", "12697"]
}
```

**Response:** File JSON download dengan nama `anime_export_1700000000000.json`

**File Content:**
```json
{
  "exportedAt": "2025-11-16T20:39:00.000Z",
  "source": "LiveChart API",
  "totalAnime": 3,
  "anime": [
    {
      "id": "12692",
      "title": "SPY x FAMILY Season 3",
      ...
    },
    {
      "id": "11382",
      "title": "One-Punch Man Season 3",
      ...
    },
    {
      "id": "12697",
      "title": "Gachiakuta",
      ...
    }
  ]
}
```

#### 15. Health Check
```
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-16T20:39:00.000Z",
  "uptime": 3600
}
```

## ✨ Fitur

- ✅ Web scraping dari livechart.me
- ✅ Caching data (1 jam per season/year)
- ✅ Search anime berdasarkan judul
- ✅ Filter by status (Ongoing, Upcoming, etc)
- ✅ Get anime by ID
- ✅ **Detail anime lengkap** (rating, studios, synopsis, streaming links, dll)
- ✅ **Export detail anime ke JSON file** (single & multiple)
- ✅ Multi-season & multi-year support
- ✅ Refresh cache manual
- ✅ Error handling
- ✅ Health check endpoint
- ✅ Terstruktur dengan MVC-like architecture

## 🏗️ Arsitektur

- **Controllers**: Menangani request/response logic
- **Services**: Business logic (scraping, caching)
- **Utils**: Helper functions untuk formatting data
- **Routes**: Endpoint definitions

## 📚 Dokumentasi Tambahan

- `ARCHITECTURE.md` - Penjelasan struktur project
- `USAGE_EXAMPLES.md` - Contoh penggunaan API dengan berbagai bahasa
- `DETAIL_SCRAPER.md` - Dokumentasi detail scraper
- `DETAIL_EXAMPLES.md` - Contoh penggunaan detail scraper
- `EXPORT_JSON.md` - Dokumentasi export ke JSON
- `HTML_SELECTORS.md` - Referensi lengkap HTML selectors yang digunakan

## 📝 Catatan

- Data di-cache selama 1 jam untuk mengurangi beban server
- Gunakan endpoint `/api/anime/refresh` untuk mendapatkan data terbaru
- Scraper menggunakan User-Agent untuk menghindari blocking
- Response selalu dalam format JSON yang terstruktur
- HTML selectors menggunakan Tailwind CSS classes dan data attributes untuk robustness
