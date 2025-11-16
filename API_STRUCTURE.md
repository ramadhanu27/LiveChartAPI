# LiveChart API - Struktur RESTful yang Dioptimalkan

## 📌 Endpoint Structure

### 1. Anime Data
```
GET    /api/anime                           – Daftar anime
GET    /api/anime?season=fall&year=2025    – Daftar anime dengan filter
GET    /api/anime/sort?sortBy=rating       – Sort anime
GET    /api/anime/search?q=title           – Cari anime
GET    /api/anime/filter?status=ongoing    – Filter anime
GET    /api/anime/:id                      – Detail lengkap anime
GET    /api/anime/:id/stats                – Statistik anime
GET    /api/anime/:id/streaming            – Info streaming anime
POST   /api/anime/cache/refresh            – Refresh anime cache
GET    /api/anime/cache/info               – Info cache anime
```

### 2. Movies Data
```
GET    /api/movies                         – Daftar movie
GET    /api/movies?season=fall&year=2025  – Daftar movie dengan filter
GET    /api/movies/sort?sortBy=rating     – Sort movie
GET    /api/movies/:id                     – Detail lengkap movie
GET    /api/movies/:id/stats               – Statistik movie
GET    /api/movies/:id/streaming           – Info streaming movie
POST   /api/movies/cache/refresh           – Refresh movie cache
```

### 3. OVA Data
```
GET    /api/ovas                           – Daftar OVA
GET    /api/ovas?season=fall&year=2025    – Daftar OVA dengan filter
GET    /api/ovas/sort?sortBy=rating       – Sort OVA
GET    /api/ovas/:id                       – Detail lengkap OVA
GET    /api/ovas/:id/stats                 – Statistik OVA
GET    /api/ovas/:id/streaming             – Info streaming OVA
POST   /api/ovas/cache/refresh             – Refresh OVA cache
```

### 4. Kombinasi Semua (Anime + Movie + OVA)
```
GET    /api/all                            – Daftar semua
GET    /api/all?season=fall&year=2025     – Daftar semua dengan filter
POST   /api/all/cache/refresh              – Refresh all cache
```

### 5. Export
```
GET    /api/export/anime/:id               – Export detail anime ke JSON
GET    /api/export/movie/:id               – Export detail movie ke JSON
POST   /api/export/anime                   – Export multiple anime
POST   /api/export/movie                   – Export multiple movie
```

### 6. Info Sistem
```
GET    /api/info/seasons                   – Daftar season & year
GET    /api/health                         – Health check
GET    /                                   – API status & credit
```

## 🎯 Keuntungan Struktur Baru

✅ **Rapi & Konsisten** - Semua endpoint mengikuti pola yang sama
✅ **Tidak Ada Duplikasi** - Tidak ada alias /api/movies, /api/ovas
✅ **RESTful** - Mengikuti REST principles dengan baik
✅ **Cache Terpusat** - Semua cache di `/cache/*` sub-path
✅ **Export Konsisten** - Semua export di `/api/export/*`
✅ **Mudah Dokumentasi** - Cocok untuk Swagger/Postman
✅ **Front-end Friendly** - Naming yang predictable

## 📊 Total Endpoints: 37

- Anime: 10
- Movies: 7
- OVA: 7
- All: 3
- Export: 4
- Info: 3
- Health: 1
- Root: 1

## 🔄 Migration Guide

### Sebelumnya → Sekarang

| Sebelumnya | Sekarang |
|-----------|----------|
| `/api/anime` | `/api/anime` ✓ (sama) |
| `/api/movie` | `/api/movies` |
| `/api/movies` (alias) | ❌ (dihapus) |
| `/api/ova` | `/api/ovas` |
| `/api/ovas` (alias) | ❌ (dihapus) |
| `/api/detail/:id` | `/api/anime/:id` |
| `/api/detail/:id/stats` | `/api/anime/:id/stats` |
| `/api/movies/detail/:id` | `/api/movies/:id` |
| `/api/anime/refresh` | `/api/anime/cache/refresh` |
| `/api/anime/info/cache` | `/api/anime/cache/info` |
| `/api/detail/:id/export` | `/api/export/anime/:id` |
| `/api/detail/export-multiple` | `/api/export/anime` |

## 💡 Contoh Penggunaan

### Anime
```bash
# Daftar anime Fall 2025
curl http://localhost:3000/api/anime?season=fall&year=2025

# Sort anime by rating
curl http://localhost:3000/api/anime/sort?sortBy=rating&order=desc

# Detail anime
curl http://localhost:3000/api/anime/12692

# Export anime
curl http://localhost:3000/api/export/anime/12692 -o anime.json
```

### Movies
```bash
# Daftar movie
curl http://localhost:3000/api/movies

# Sort movie
curl http://localhost:3000/api/movies/sort?sortBy=rating

# Detail movie
curl http://localhost:3000/api/movies/12692
```

### Export Multiple
```bash
# Export multiple anime
curl -X POST http://localhost:3000/api/export/anime \
  -H "Content-Type: application/json" \
  -d '{"ids": ["12692", "11382"]}'
```
