# Anime Detail Scraper Documentation

Dokumentasi lengkap untuk scraping detail anime dari livechart.me

## 📖 Overview

Detail scraper mengambil informasi lengkap dari halaman anime individual, termasuk:
- Rating dan jumlah ratings
- Format (TV, Movie, OVA, etc)
- Source (Manga, Light Novel, etc)
- Total episodes dan episode saat ini
- Studios
- Tags/Genres
- Synopsis
- Streaming info
- Links ke platform lain (MyAnimeList, AniList, Kitsu, IMDB)

## 🔗 Endpoints

### 1. Detail Anime Lengkap
```
GET /api/detail/:id
```

**Parameter:**
- `id` (required): Anime ID dari livechart.me

**Contoh:**
```bash
curl http://localhost:3000/api/detail/12692
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "12692",
    "title": "SPY x FAMILY Season 3",
    "originalTitle": "SPY×FAMILY Season 3",
    "poster": "https://u.livechart.me/anime/12692/poster_image/...",
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
  },
  "cached": false,
  "timestamp": "2025-11-16T20:39:00.000Z"
}
```

### 2. Synopsis Saja
```
GET /api/detail/:id/synopsis
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "12692",
    "title": "SPY x FAMILY Season 3",
    "synopsis": "No synopsis has been added to this title."
  }
}
```

### 3. Info Streaming
```
GET /api/detail/:id/streaming
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "12692",
    "title": "SPY x FAMILY Season 3",
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

### 4. Statistik Anime
```
GET /api/detail/:id/stats
```

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

## 🏗️ Architecture

### Service: `animeDetailService.js`

Menangani scraping detail anime dari halaman individual.

**Methods:**
- `scrapeAnimeDetail(animeId)` - Scrape detail anime lengkap
- `_parseAnimeDetail(html, animeId)` - Parse HTML dan ekstrak data

### Controller: `animeDetailController.js`

Menangani request/response untuk detail endpoints.

**Methods:**
- `getDetail(req, res)` - GET /api/detail/:id
- `getSynopsis(req, res)` - GET /api/detail/:id/synopsis
- `getStreaming(req, res)` - GET /api/detail/:id/streaming
- `getStats(req, res)` - GET /api/detail/:id/stats

### Routes: `animeDetailRoutes.js`

Mendefinisikan semua detail endpoints.

## 📊 Data Fields

| Field | Type | Description |
|-------|------|-------------|
| id | string | Anime ID |
| title | string | Anime title |
| originalTitle | string | Original title (jika berbeda) |
| poster | string | URL poster image |
| rating | number | Rating score (0-10) |
| ratingsCount | string | Jumlah ratings |
| status | string | Status (Releasing, Finished, etc) |
| format | string | Format (TV, Movie, OVA, etc) |
| source | string | Source (Manga, Light Novel, etc) |
| totalEpisodes | number | Total episodes |
| currentEpisode | number | Episode saat ini |
| runTime | string | Runtime per episode |
| season | string | Season (e.g., "Fall 2025") |
| premiere | string | Premiere date |
| studios | array | Array of studio names |
| tags | array | Array of tags/genres |
| synopsis | string | Anime synopsis |
| streaming | string | Streaming info |
| links | object | Links ke platform lain |

## 💾 Caching

- **Duration**: 1 jam per anime ID
- **Key Format**: `detail-{animeId}`
- **Storage**: In-memory (cacheService)

Contoh cache keys:
- `detail-12692` - SPY x FAMILY Season 3
- `detail-11382` - One-Punch Man Season 3

## 🔍 HTML Selectors

Scraper menggunakan selector berikut:

| Data | Selector |
|------|----------|
| Title | `h1` |
| Poster | `img[alt*="poster"], img[class*="poster"]` |
| Rating | `[class*="rating"], .score` |
| Status | `[class*="status"]` |
| Format | `div:contains("Format")` |
| Source | `div:contains("Source")` |
| Episodes | `div:contains("Episodes")` |
| Run time | `div:contains("Run time")` |
| Season | `div:contains("Season")` |
| Premiere | `div:contains("Premiere")` |
| Studios | `div:contains("Studios")` |
| Tags | `[class*="tag"], [class*="genre"]` |
| Synopsis | `[class*="synopsis"]` |
| Links | `a[href*="myanimelist"]`, etc |

## 🚀 Usage Examples

### JavaScript/Node.js

```javascript
// Dapatkan detail anime
const response = await fetch('http://localhost:3000/api/detail/12692');
const { data } = await response.json();

console.log(`${data.title} - ${data.rating}/10`);
console.log(`Studios: ${data.studios.join(', ')}`);
console.log(`Episodes: ${data.currentEpisode}/${data.totalEpisodes}`);
```

### Python

```python
import requests

response = requests.get('http://localhost:3000/api/detail/12692')
data = response.json()['data']

print(f"{data['title']} - {data['rating']}/10")
print(f"Studios: {', '.join(data['studios'])}")
print(f"Episodes: {data['currentEpisode']}/{data['totalEpisodes']}")
```

### cURL

```bash
# Detail lengkap
curl http://localhost:3000/api/detail/12692

# Synopsis saja
curl http://localhost:3000/api/detail/12692/synopsis

# Streaming info
curl http://localhost:3000/api/detail/12692/streaming

# Statistik
curl http://localhost:3000/api/detail/12692/stats
```

## 🛡️ Error Handling

Jika anime ID tidak ditemukan atau terjadi error:

```json
{
  "success": false,
  "error": "Failed to scrape anime detail: ...",
  "timestamp": "2025-11-16T20:39:00.000Z"
}
```

## 📝 Notes

- Detail scraper cache per anime ID (berbeda dengan list scraper yang cache per season)
- Jika synopsis tidak tersedia, akan return "No synopsis available"
- Links ke platform lain bisa null jika tidak ada
- Tags di-deduplicate untuk menghindari duplikat
- Semua response dalam format JSON yang terstruktur
