# Arsitektur LiveChart API

Dokumentasi lengkap tentang struktur dan arsitektur project.

## 📁 Struktur Direktori

```
src/
├── controllers/
│   └── animeController.js       # Menghandle request/response
├── services/
│   ├── scrapeService.js         # Scraping logic
│   └── cacheService.js          # Cache management
├── utils/
│   └── dataFormatter.js         # Helper functions
├── routes/
│   └── animeRoutes.js           # Route definitions
├── app.js                       # Express app configuration
└── server.js                    # Server entry point
```

## 🔄 Request Flow

```
Request
  ↓
Routes (animeRoutes.js)
  ↓
Controller (animeController.js)
  ↓
Service (scrapeService.js / cacheService.js)
  ↓
Utils (dataFormatter.js)
  ↓
Response
```

## 📋 Komponen

### 1. Controllers (`src/controllers/animeController.js`)

Menangani HTTP request dan response. Setiap method adalah handler untuk satu endpoint.

**Methods:**
- `getAll()` - GET /api/anime
- `getById()` - GET /api/anime/:id
- `search()` - GET /api/anime/search/:title
- `filterByStatus()` - GET /api/anime/filter/status/:status
- `refresh()` - POST /api/anime/refresh

### 2. Services

#### scrapeService.js
Menangani web scraping dari livechart.me.

**Methods:**
- `scrapeAllAnime()` - Scrape semua anime
- `_parseAnimeData()` - Parse HTML (private)
- `_extractAnimeInfo()` - Ekstrak info anime (private)

#### cacheService.js
Mengelola cache data dengan TTL 1 jam.

**Methods:**
- `set(data)` - Set cache
- `get()` - Get cache (null jika expired)
- `isValid()` - Check cache validity
- `clear()` - Clear cache
- `getInfo()` - Get cache info

### 3. Utils (`src/utils/dataFormatter.js`)

Helper functions untuk formatting dan validasi data.

**Functions:**
- `cleanEpisodeInfo()` - Format episode (EP6)
- `cleanStudio()` - Format studio name
- `formatScore()` - Format score
- `formatResponse()` - Format API response
- `isValidAnime()` - Validate anime object

### 4. Routes (`src/routes/animeRoutes.js`)

Mendefinisikan semua endpoint dan menghubungkan ke controller.

### 5. App (`src/app.js`)

Express app configuration, middleware setup, dan error handling.

### 6. Server (`src/server.js`)

Entry point untuk menjalankan server.

## 🔌 Middleware

- `express.json()` - Parse JSON request body
- `app.set('json spaces', 2)` - Format JSON response dengan indentasi

## 🛡️ Error Handling

Semua error ditangani di level controller dan di-return sebagai JSON response dengan format:

```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2025-11-16T20:39:00.000Z"
}
```

## 💾 Cache Strategy

- **Duration**: 1 jam (3600000 ms)
- **Storage**: In-memory (cacheService)
- **Invalidation**: Automatic setelah 1 jam atau manual via `/api/anime/refresh`

## 🔄 Data Flow

1. Client request ke endpoint
2. Router mengarahkan ke controller
3. Controller check cache via cacheService
4. Jika cache valid, return cached data
5. Jika cache expired, call scrapeService
6. scrapeService fetch HTML dari livechart.me
7. Parse HTML dan ekstrak data
8. Format data menggunakan dataFormatter
9. Cache data baru
10. Return response ke client

## 📝 Menambah Endpoint Baru

1. Tambah method di `animeController.js`
2. Tambah route di `animeRoutes.js`
3. Update dokumentasi di README.md

Contoh:

```javascript
// animeController.js
async getByStudio(req, res) {
  // Implementation
}

// animeRoutes.js
router.get('/filter/studio/:studio', animeController.getByStudio);
```

## 🧪 Testing

Gunakan tools seperti Postman atau curl untuk test endpoints:

```bash
# Get all anime
curl http://localhost:3000/api/anime

# Search anime
curl http://localhost:3000/api/anime/search/One-Punch

# Refresh cache
curl -X POST http://localhost:3000/api/anime/refresh

# Health check
curl http://localhost:3000/api/health
```

## 🚀 Deployment

1. Set `NODE_ENV=production`
2. Pastikan `PORT` environment variable sudah diset
3. Run `npm start`

## 📚 Dependencies

- **express**: Web framework
- **axios**: HTTP client untuk scraping
- **cheerio**: HTML parser

## 🔐 Security Notes

- User-Agent header diset untuk menghindari blocking
- Timeout 10 detik untuk request
- Error messages tidak expose sensitive info
- Input validation untuk search query (min 2 karakter)
