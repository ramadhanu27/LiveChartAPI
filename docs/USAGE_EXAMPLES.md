# Contoh Penggunaan LiveChart API

## 🚀 Quick Start

```bash
npm install
npm start
```

Server akan berjalan di `http://localhost:3000`

## 📋 Contoh Request

### 1. Dapatkan Anime Musim Sekarang

```bash
curl http://localhost:3000/api/anime
```

### 2. Dapatkan Anime Season Tertentu

```bash
# Fall 2025
curl http://localhost:3000/api/anime?season=fall&year=2025

# Spring 2024
curl http://localhost:3000/api/anime?season=spring&year=2024

# Winter (tahun sekarang)
curl http://localhost:3000/api/anime?season=winter
```

### 3. Cari Anime Spesifik

```bash
# Cari "One-Punch"
curl http://localhost:3000/api/anime/search/One-Punch

# Cari "Spy x Family"
curl http://localhost:3000/api/anime/search/Spy
```

### 4. Dapatkan Anime by ID

```bash
curl http://localhost:3000/api/anime/11382
```

### 5. Filter by Status

```bash
# Dapatkan anime yang Ongoing
curl http://localhost:3000/api/anime/filter/status/ongoing

# Dapatkan anime yang Upcoming
curl http://localhost:3000/api/anime/filter/status/upcoming
```

### 6. Refresh Cache

```bash
# Refresh cache untuk musim sekarang
curl -X POST http://localhost:3000/api/anime/refresh

# Refresh cache untuk Fall 2025
curl -X POST "http://localhost:3000/api/anime/refresh?season=fall&year=2025"
```

### 7. Lihat Info Cache

```bash
curl http://localhost:3000/api/anime/info/cache
```

### 8. Lihat Available Seasons & Years

```bash
curl http://localhost:3000/api/anime/info/seasons
```

### 9. Health Check

```bash
curl http://localhost:3000/api/health
```

## 🔧 Contoh dengan JavaScript/Node.js

### Fetch Anime Fall 2025

```javascript
const response = await fetch('http://localhost:3000/api/anime?season=fall&year=2025');
const data = await response.json();
console.log(data.data); // Array of anime
```

### Search Anime

```javascript
const response = await fetch('http://localhost:3000/api/anime/search/One-Punch');
const data = await response.json();
console.log(data.data); // Array of matching anime
```

### Refresh Cache

```javascript
const response = await fetch('http://localhost:3000/api/anime/refresh', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
console.log(data.message); // "Cache refreshed successfully"
```

## 🐍 Contoh dengan Python

### Fetch Anime

```python
import requests

response = requests.get('http://localhost:3000/api/anime?season=fall&year=2025')
data = response.json()
print(data['data'])  # List of anime
```

### Search Anime

```python
import requests

response = requests.get('http://localhost:3000/api/anime/search/One-Punch')
data = response.json()
for anime in data['data']:
    print(f"{anime['title']} - {anime['studio']}")
```

## 📊 Response Format

Semua response mengikuti format standar:

```json
{
  "success": true,
  "data": [...],
  "total": 96,
  "timestamp": "2025-11-16T20:39:00.000Z"
}
```

Untuk error:

```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2025-11-16T20:39:00.000Z"
}
```

## 🎯 Use Cases

### 1. Membuat Aplikasi Anime Tracker

```javascript
// Dapatkan semua anime Fall 2025
const response = await fetch('http://localhost:3000/api/anime?season=fall&year=2025');
const { data: animeList } = await response.json();

// Filter yang sedang ongoing
const ongoingAnime = animeList.filter(a => a.status === 'Ongoing');

// Tampilkan di aplikasi
ongoingAnime.forEach(anime => {
  console.log(`${anime.title} - Episode ${anime.episodes}`);
});
```

### 2. Membuat Anime Recommendation Engine

```javascript
// Cari anime berdasarkan keyword
const keyword = 'Action';
const response = await fetch(`http://localhost:3000/api/anime/search/${keyword}`);
const { data: results } = await response.json();

// Urutkan berdasarkan score
const sorted = results.sort((a, b) => 
  parseFloat(b.score) - parseFloat(a.score)
);

// Tampilkan top 5
sorted.slice(0, 5).forEach(anime => {
  console.log(`${anime.title} - Score: ${anime.score}`);
});
```

### 3. Monitoring Cache Status

```javascript
// Check cache status
const response = await fetch('http://localhost:3000/api/anime/info/cache');
const { data: cacheInfo } = await response.json();

console.log(`Total cached seasons: ${cacheInfo.totalKeys}`);
cacheInfo.keys.forEach(key => {
  console.log(`${key.key}: ${key.count} anime, age: ${key.age}ms`);
});
```

### 4. Membuat Scheduler untuk Refresh Cache

```javascript
// Refresh cache setiap hari pada jam 00:00
const schedule = require('node-schedule');

schedule.scheduleJob('0 0 * * *', async () => {
  const response = await fetch('http://localhost:3000/api/anime/refresh', {
    method: 'POST'
  });
  const data = await response.json();
  console.log('Cache refreshed:', data.message);
});
```

## 💡 Tips

1. **Gunakan Query Parameters** untuk mendapatkan data season tertentu
2. **Cache berlaku 1 jam** - gunakan `/api/anime/refresh` untuk data terbaru
3. **Search minimal 2 karakter** untuk menghindari query yang terlalu luas
4. **Check `/api/anime/info/seasons`** untuk melihat season dan year yang tersedia
5. **Monitor cache** dengan `/api/anime/info/cache` untuk optimasi

## 🚨 Error Handling

```javascript
try {
  const response = await fetch('http://localhost:3000/api/anime?season=invalid');
  const data = await response.json();
  
  if (!data.success) {
    console.error('Error:', data.error);
  }
} catch (error) {
  console.error('Network error:', error);
}
```

## 📝 Notes

- Semua endpoint return JSON
- Response selalu include `success` field
- Timestamp dalam format ISO 8601
- Cache duration: 1 jam per season/year
- Scraper menggunakan User-Agent untuk menghindari blocking
