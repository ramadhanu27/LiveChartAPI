# Export Anime Detail ke JSON

Dokumentasi lengkap untuk export detail anime ke file JSON.

## 📋 Overview

API menyediakan 2 endpoint untuk export detail anime ke file JSON:
1. **Single Export** - Export satu anime ke JSON file
2. **Batch Export** - Export multiple anime ke satu JSON file

## 🔗 Endpoints

### 1. Export Single Anime
```
GET /api/detail/:id/export
```

**Parameter:**
- `id` (required): Anime ID

**Contoh:**
```bash
curl http://localhost:3000/api/detail/12692/export -o anime.json
```

**Response:** File JSON download

**File Name:** `anime_12692_SPY_x_FAMILY_Season_3.json`

**File Content:**
```json
{
  "exportedAt": "2025-11-16T20:39:00.000Z",
  "source": "LiveChart API",
  "anime": {
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
    "studios": [
      "WIT STUDIO",
      "CloverWorks"
    ],
    "tags": [
      "Action",
      "Comedy",
      "Childcare"
    ],
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

### 2. Export Multiple Anime
```
POST /api/detail/export-multiple
```

**Request Body:**
```json
{
  "ids": ["12692", "11382", "12697", "12388"]
}
```

**Constraints:**
- Maximum 50 anime IDs per request
- Minimum 1 anime ID

**Contoh dengan cURL:**
```bash
curl -X POST http://localhost:3000/api/detail/export-multiple \
  -H "Content-Type: application/json" \
  -d '{"ids": ["12692", "11382", "12697"]}' \
  -o anime_batch.json
```

**Response:** File JSON download

**File Name:** `anime_export_1700000000000.json` (timestamp-based)

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

## 🔧 Contoh Penggunaan

### JavaScript/Node.js - Download Single Anime

```javascript
const fs = require('fs');
const https = require('https');

async function downloadAnimeJSON(animeId) {
  const url = `http://localhost:3000/api/detail/${animeId}/export`;
  
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(`anime_${animeId}.json`);
    
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded: anime_${animeId}.json`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(`anime_${animeId}.json`, () => {}); // Delete file on error
      reject(err);
    });
  });
}

// Usage
downloadAnimeJSON('12692');
```

### JavaScript/Node.js - Download Multiple Anime

```javascript
const fs = require('fs');
const http = require('http');

async function downloadMultipleAnime(animeIds) {
  const data = JSON.stringify({ ids: animeIds });
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/detail/export-multiple',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      const file = fs.createWriteStream('anime_batch.json');
      res.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log('✅ Downloaded: anime_batch.json');
        resolve();
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Usage
downloadMultipleAnime(['12692', '11382', '12697']);
```

### Python - Download Single Anime

```python
import requests
import json

def download_anime_json(anime_id):
    url = f'http://localhost:3000/api/detail/{anime_id}/export'
    response = requests.get(url)
    
    if response.status_code == 200:
        filename = f'anime_{anime_id}.json'
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(response.text)
        print(f'✅ Downloaded: {filename}')
    else:
        print(f'❌ Error: {response.status_code}')

# Usage
download_anime_json('12692')
```

### Python - Download Multiple Anime

```python
import requests
import json

def download_multiple_anime(anime_ids):
    url = 'http://localhost:3000/api/detail/export-multiple'
    payload = {'ids': anime_ids}
    
    response = requests.post(url, json=payload)
    
    if response.status_code == 200:
        filename = 'anime_batch.json'
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(response.text)
        print(f'✅ Downloaded: {filename}')
    else:
        print(f'❌ Error: {response.status_code}')

# Usage
download_multiple_anime(['12692', '11382', '12697'])
```

### Fetch API (Browser)

```javascript
// Download single anime
async function downloadAnime(animeId) {
  const response = await fetch(`http://localhost:3000/api/detail/${animeId}/export`);
  const blob = await response.blob();
  
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `anime_${animeId}.json`;
  a.click();
}

// Download multiple anime
async function downloadMultipleAnime(animeIds) {
  const response = await fetch('http://localhost:3000/api/detail/export-multiple', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids: animeIds })
  });
  
  const blob = await response.blob();
  
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `anime_batch_${Date.now()}.json`;
  a.click();
}
```

## 📊 JSON Structure

### Single Export
```
{
  exportedAt: string (ISO 8601)
  source: string ("LiveChart API")
  anime: {
    id: string
    title: string
    originalTitle: string
    poster: string (URL)
    rating: number
    ratingsCount: string
    status: string
    format: string
    source: string
    totalEpisodes: number
    currentEpisode: number
    runTime: string
    season: string
    premiere: string
    studios: string[]
    tags: string[]
    synopsis: string
    streaming: string
    links: {
      livechart: string (URL)
      myanimelist: string (URL) | null
      anilist: string (URL) | null
      kitsu: string (URL) | null
      imdb: string (URL) | null
    }
  }
}
```

### Batch Export
```
{
  exportedAt: string (ISO 8601)
  source: string ("LiveChart API")
  totalAnime: number
  anime: [
    { ... anime object ... },
    { ... anime object ... },
    ...
  ]
}
```

## 💾 Caching

- Export menggunakan cache yang sama dengan detail endpoint
- Cache duration: 1 jam per anime ID
- Jika anime belum di-cache, akan di-scrape terlebih dahulu

## 🛡️ Error Handling

### Single Export Error

```json
{
  "success": false,
  "error": "Anime ID diperlukan",
  "timestamp": "2025-11-16T20:39:00.000Z"
}
```

### Batch Export Error

```json
{
  "success": false,
  "error": "Array of anime IDs diperlukan dalam request body",
  "timestamp": "2025-11-16T20:39:00.000Z"
}
```

```json
{
  "success": false,
  "error": "Maximum 50 anime IDs per request",
  "timestamp": "2025-11-16T20:39:00.000Z"
}
```

## 📝 Notes

- File JSON di-format dengan indentasi 2 spaces untuk readability
- File name otomatis di-generate berdasarkan anime title
- Batch export max 50 anime per request
- Jika ada error saat scraping anime tertentu, anime tersebut di-skip
- Semua response dalam UTF-8 encoding
