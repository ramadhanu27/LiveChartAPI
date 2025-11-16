# Anime Detail Scraper - Contoh Penggunaan

## 🚀 Quick Start

```bash
npm start
```

Server berjalan di `http://localhost:3000`

## 📋 Contoh Request Detail Anime

### 1. Dapatkan Detail Lengkap

```bash
# SPY x FAMILY Season 3
curl http://localhost:3000/api/detail/12692

# One-Punch Man Season 3
curl http://localhost:3000/api/detail/11382
```

### 2. Dapatkan Synopsis

```bash
curl http://localhost:3000/api/detail/12692/synopsis
```

### 3. Dapatkan Info Streaming

```bash
curl http://localhost:3000/api/detail/12692/streaming
```

### 4. Dapatkan Statistik

```bash
curl http://localhost:3000/api/detail/12692/stats
```

## 🔧 Contoh dengan JavaScript/Node.js

### Dapatkan Detail Lengkap

```javascript
const response = await fetch('http://localhost:3000/api/detail/12692');
const { data } = await response.json();

console.log(`Title: ${data.title}`);
console.log(`Rating: ${data.rating}/10 (${data.ratingsCount} ratings)`);
console.log(`Status: ${data.status}`);
console.log(`Format: ${data.format}`);
console.log(`Episodes: ${data.currentEpisode}/${data.totalEpisodes}`);
console.log(`Studios: ${data.studios.join(', ')}`);
console.log(`Genres: ${data.tags.join(', ')}`);
console.log(`Premiere: ${data.premiere}`);
console.log(`Season: ${data.season}`);
console.log(`Synopsis: ${data.synopsis}`);
```

### Dapatkan Anime dengan Rating Tertinggi

```javascript
// Dapatkan list anime Fall 2025
const listResponse = await fetch('http://localhost:3000/api/anime?season=fall&year=2025');
const { data: animeList } = await listResponse.json();

// Dapatkan detail untuk setiap anime
const detailedAnime = await Promise.all(
  animeList.slice(0, 10).map(async (anime) => {
    const response = await fetch(`http://localhost:3000/api/detail/${anime.id}`);
    return response.json();
  })
);

// Urutkan berdasarkan rating
const sorted = detailedAnime
  .map(r => r.data)
  .sort((a, b) => (b.rating || 0) - (a.rating || 0));

// Tampilkan top 5
sorted.slice(0, 5).forEach((anime, i) => {
  console.log(`${i + 1}. ${anime.title} - ${anime.rating}/10`);
});
```

### Dapatkan Anime berdasarkan Studio

```javascript
// Dapatkan list anime
const listResponse = await fetch('http://localhost:3000/api/anime?season=fall&year=2025');
const { data: animeList } = await listResponse.json();

// Dapatkan detail untuk setiap anime
const detailedAnime = await Promise.all(
  animeList.map(async (anime) => {
    const response = await fetch(`http://localhost:3000/api/detail/${anime.id}`);
    return response.json();
  })
);

// Filter anime dari studio tertentu
const witStudioAnime = detailedAnime
  .map(r => r.data)
  .filter(anime => anime.studios.some(s => s.includes('WIT')));

console.log(`Anime dari WIT STUDIO:`);
witStudioAnime.forEach(anime => {
  console.log(`- ${anime.title}`);
});
```

### Dapatkan Anime dengan Genre Tertentu

```javascript
// Dapatkan list anime
const listResponse = await fetch('http://localhost:3000/api/anime?season=fall&year=2025');
const { data: animeList } = await listResponse.json();

// Dapatkan detail untuk setiap anime
const detailedAnime = await Promise.all(
  animeList.map(async (anime) => {
    const response = await fetch(`http://localhost:3000/api/detail/${anime.id}`);
    return response.json();
  })
);

// Filter anime dengan genre Action
const actionAnime = detailedAnime
  .map(r => r.data)
  .filter(anime => anime.tags.some(tag => tag.toLowerCase().includes('action')));

console.log(`Anime dengan genre Action:`);
actionAnime.forEach(anime => {
  console.log(`- ${anime.title} (${anime.rating}/10)`);
});
```

## 🐍 Contoh dengan Python

### Dapatkan Detail Anime

```python
import requests

response = requests.get('http://localhost:3000/api/detail/12692')
data = response.json()['data']

print(f"Title: {data['title']}")
print(f"Rating: {data['rating']}/10")
print(f"Status: {data['status']}")
print(f"Format: {data['format']}")
print(f"Episodes: {data['currentEpisode']}/{data['totalEpisodes']}")
print(f"Studios: {', '.join(data['studios'])}")
print(f"Genres: {', '.join(data['tags'])}")
```

### Bandingkan Rating Anime

```python
import requests

anime_ids = ['12692', '11382', '12697']  # SPY x FAMILY, One-Punch Man, Gachiakuta

for anime_id in anime_ids:
    response = requests.get(f'http://localhost:3000/api/detail/{anime_id}')
    data = response.json()['data']
    print(f"{data['title']}: {data['rating']}/10 ({data['ratingsCount']} ratings)")
```

### Cari Anime dengan Rating Tertentu

```python
import requests

# Dapatkan list anime
response = requests.get('http://localhost:3000/api/anime?season=fall&year=2025')
anime_list = response.json()['data']

# Dapatkan detail dan filter
high_rated = []
for anime in anime_list[:20]:  # Check first 20
    detail_response = requests.get(f"http://localhost:3000/api/detail/{anime['id']}")
    detail = detail_response.json()['data']
    
    if detail['rating'] and detail['rating'] >= 8.0:
        high_rated.append(detail)

# Tampilkan
for anime in sorted(high_rated, key=lambda x: x['rating'], reverse=True):
    print(f"{anime['title']}: {anime['rating']}/10")
```

## 📊 Response Format

### Detail Lengkap

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

### Synopsis Saja

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

### Streaming Info

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

### Statistik

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

## 💡 Tips & Tricks

1. **Batch Request** - Dapatkan detail multiple anime sekaligus dengan Promise.all()
2. **Cache** - Detail di-cache 1 jam, gunakan untuk request yang sering
3. **Filter** - Combine dengan list API untuk filter berdasarkan criteria
4. **Error Handling** - Always check `success` field sebelum mengakses `data`
5. **Rate Limiting** - Jangan spam request, gunakan cache yang tersedia

## 🚨 Error Handling

```javascript
try {
  const response = await fetch('http://localhost:3000/api/detail/invalid-id');
  const data = await response.json();
  
  if (!data.success) {
    console.error('Error:', data.error);
  } else {
    console.log('Data:', data.data);
  }
} catch (error) {
  console.error('Network error:', error);
}
```

## 📝 Notes

- Detail scraper cache per anime ID (berbeda dengan list scraper)
- Cache duration: 1 jam
- Jika synopsis tidak tersedia, akan return "No synopsis available"
- Links bisa null jika tidak ada di halaman
- Rating bisa null jika belum ada rating
- Semua response dalam format JSON terstruktur
