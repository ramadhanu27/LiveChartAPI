# Anime Movie Scraper Documentation

Dokumentasi lengkap untuk scraping anime movie dari livechart.me

## 📋 Overview

Movie scraper mengambil data anime movie dari livechart.me dengan support untuk:
- Multi-season support (winter, spring, summer, fall)
- Multi-year support (2020 - current year + 1)
- Caching per season/year
- Same data structure sebagai TV anime

## 🔗 Endpoints

### 1. Dapatkan Semua Movie
```
GET /api/anime/movie?season=fall&year=2025
```

**Query Parameters:**
- `season` (optional): winter, spring, summer, fall (default: current season)
- `year` (optional): tahun (default: current year)

**Contoh:**
```bash
# Movie Fall 2025 (default)
curl http://localhost:3000/api/anime/movie

# Movie Spring 2024
curl http://localhost:3000/api/anime/movie?season=spring&year=2024

# Movie Winter 2025
curl http://localhost:3000/api/anime/movie?season=winter&year=2025
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "movie-12345",
      "title": "Movie Title",
      "link": "https://www.livechart.me/anime/movie-12345",
      "status": "Releasing",
      "episodes": "N/A",
      "studio": "Studio Name",
      "score": "8.5",
      "poster": "https://u.livechart.me/anime/movie-12345/poster_image/..."
    },
    {
      "id": "movie-12346",
      "title": "Another Movie",
      "link": "https://www.livechart.me/anime/movie-12346",
      "status": "Upcoming",
      "episodes": "N/A",
      "studio": "Another Studio",
      "score": "N/A",
      "poster": "https://..."
    }
  ],
  "total": 15,
  "cached": false,
  "type": "movie",
  "season": "fall",
  "year": "2025",
  "timestamp": "2025-11-16T20:39:00.000Z"
}
```

### 2. Refresh Movie Cache
```
POST /api/anime/movie/refresh?season=fall&year=2025
```

**Query Parameters:**
- `season` (optional): winter, spring, summer, fall
- `year` (optional): tahun

**Contoh:**
```bash
# Refresh Fall 2025 movie cache
curl -X POST http://localhost:3000/api/anime/movie/refresh?season=fall&year=2025

# Refresh current season movie cache
curl -X POST http://localhost:3000/api/anime/movie/refresh
```

**Response:**
```json
{
  "success": true,
  "message": "Movie cache refreshed successfully",
  "data": [ ... movie array ... ],
  "total": 15,
  "season": "fall",
  "year": "2025",
  "type": "movie"
}
```

## 🏗️ Architecture

### Service: `scrapeService.js`

**Method:**
```javascript
async scrapeAllMovies(season = null, year = null)
```

- Scrape movie dari URL: `https://www.livechart.me/{season}-{year}/movie?ongoing=all`
- Support dynamic season dan year
- Default ke current season/year jika tidak ada parameter
- Reuse `_parseAnimeData()` untuk parsing (sama dengan TV anime)

### Controller: `animeController.js`

**Methods:**
- `getAllMovies(req, res)` - GET /api/anime/movie
- `refreshMovies(req, res)` - POST /api/anime/movie/refresh

**Features:**
- Cache per season/year dengan key: `movie-{season}-{year}`
- Query parameter support
- Same response format sebagai TV anime

### Routes: `animeRoutes.js`

```javascript
router.get('/movie', animeController.getAllMovies);
router.post('/movie/refresh', animeController.refreshMovies);
```

## 📊 Data Structure

Movie data memiliki struktur yang sama dengan TV anime:

```json
{
  "id": "string",           // Movie ID dari livechart.me
  "title": "string",        // Movie title
  "link": "string",         // URL ke halaman movie
  "status": "string",       // Status (Releasing, Upcoming, Finished)
  "episodes": "string",     // N/A untuk movie
  "studio": "string",       // Studio name
  "score": "string",        // Rating score
  "poster": "string"        // URL poster image
}
```

## 💾 Caching

- **Duration**: 1 jam per season/year
- **Key Format**: `movie-{season}-{year}`
- **Example Keys**: 
  - `movie-fall-2025`
  - `movie-spring-2024`
  - `movie-current-current`

## 🔍 URL Patterns

**TV Anime:**
```
https://www.livechart.me/{season}-{year}/tv?ongoing=all
```

**Movie:**
```
https://www.livechart.me/{season}-{year}/movies?ongoing=all
```

**Note:** Movie URL menggunakan `/movies` (plural) bukan `/movie`

## 🚀 Usage Examples

### JavaScript/Node.js

```javascript
// Dapatkan semua movie Fall 2025
const response = await fetch('http://localhost:3000/api/anime/movie?season=fall&year=2025');
const { data: movies } = await response.json();

console.log(`Total movies: ${movies.length}`);
movies.forEach(movie => {
  console.log(`- ${movie.title} (${movie.score}/10)`);
});
```

### Python

```python
import requests

# Dapatkan movie Spring 2024
response = requests.get('http://localhost:3000/api/anime/movie', 
                       params={'season': 'spring', 'year': 2024})
data = response.json()

print(f"Total movies: {data['total']}")
for movie in data['data']:
    print(f"- {movie['title']}")
```

### cURL

```bash
# Dapatkan movie current season
curl http://localhost:3000/api/anime/movie

# Dapatkan movie dengan season dan year spesifik
curl http://localhost:3000/api/anime/movie?season=winter&year=2025

# Refresh cache
curl -X POST http://localhost:3000/api/anime/movie/refresh?season=fall&year=2025
```

## 📝 Perbedaan Movie vs TV Anime

| Aspek | TV Anime | Movie |
|-------|----------|-------|
| **Endpoint** | `/api/anime` | `/api/anime/movie` |
| **URL Pattern** | `/tv?ongoing=all` | `/movie?ongoing=all` |
| **Cache Key** | `{season}-{year}` | `movie-{season}-{year}` |
| **Episodes Field** | EP number | N/A |
| **Status** | Ongoing, Upcoming, Finished | Releasing, Upcoming, Finished |
| **Data Structure** | Same | Same |

## 🛡️ Error Handling

**Invalid Season:**
```json
{
  "success": false,
  "error": "Invalid season. Must be one of: winter, spring, summer, fall"
}
```

**Network Error:**
```json
{
  "success": false,
  "error": "Movie scraping failed: ..."
}
```

## 📈 Performance

- **First Request**: 3-5 detik (scrape dari livechart.me)
- **Cached Request**: <100ms (dari cache)
- **Cache Duration**: 1 jam
- **Auto-Refresh**: Manual via `/refresh` endpoint

## 🔄 Workflow

```
1. User request GET /api/anime/movie?season=fall&year=2025
2. Server check cache key "movie-fall-2025"
3. If cache hit → return cached data (instant)
4. If cache miss → scrape dari livechart.me
5. Parse HTML dan ekstrak movie data
6. Save ke cache dengan TTL 1 jam
7. Return response ke user
```

## 📝 Notes

- Movie scraper menggunakan URL pattern `/movie` bukan `/tv`
- Data parsing menggunakan method yang sama dengan TV anime
- Cache terpisah antara movie dan TV anime
- Support untuk semua season dan year yang sama dengan TV anime
- Response format konsisten dengan TV anime endpoints
