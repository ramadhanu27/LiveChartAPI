# 🚀 Future Seasons API - Tahun Depan & Seterusnya

## 📅 Endpoint untuk Tahun Depan

API sudah **fully support** untuk scraping data tahun depan dan tahun-tahun berikutnya. Gunakan query parameter `season` dan `year` untuk mengakses data masa depan.

---

## 🎯 Contoh Penggunaan - Spring 2026

### 1. Daftar Anime Spring 2026
```bash
curl http://localhost:3000/api/anime?season=spring&year=2026
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "12345",
      "title": "New Anime Title",
      "link": "https://www.livechart.me/anime/12345",
      "status": "Upcoming",
      "episodes": "12",
      "studio": "Studio Name",
      "score": "N/A",
      "poster": "https://..."
    }
  ],
  "total": 45,
  "season": "spring",
  "year": "2026"
}
```

### 2. Sort Anime Spring 2026
```bash
curl http://localhost:3000/api/anime/sort?sortBy=title&order=asc&season=spring&year=2026
```

### 3. Search Anime Spring 2026
```bash
curl http://localhost:3000/api/anime/search?q=naruto&season=spring&year=2026
```

### 4. Filter Anime Spring 2026
```bash
curl http://localhost:3000/api/anime/filter?status=upcoming&season=spring&year=2026
```

### 5. Detail Anime Spring 2026
```bash
curl http://localhost:3000/api/anime/12345?season=spring&year=2026
```

---

## 📊 Semua Endpoint Support Tahun Depan

### Anime
```
GET    /api/anime?season=spring&year=2026
GET    /api/anime/sort?sortBy=rating&season=spring&year=2026
GET    /api/anime/search?q=title&season=spring&year=2026
GET    /api/anime/filter?status=upcoming&season=spring&year=2026
GET    /api/anime/:id
```

### Movies
```
GET    /api/movies?season=spring&year=2026
GET    /api/movies/sort?sortBy=rating&season=spring&year=2026
GET    /api/movies/:id
```

### OVAs
```
GET    /api/ovas?season=spring&year=2026
GET    /api/ovas/sort?sortBy=rating&season=spring&year=2026
GET    /api/ovas/:id
```

### All (Anime + Movie + OVA)
```
GET    /api/all?season=spring&year=2026
```

### Statistics
```
GET    /api/stats/total-anime?season=spring&year=2026
GET    /api/stats/by-genre?season=spring&year=2026
GET    /api/stats/by-studio?season=spring&year=2026
```

---

## 📅 Daftar Season & Year yang Valid

### Seasons
- `winter` - Januari - Maret
- `spring` - April - Juni
- `summer` - Juli - September
- `fall` - Oktober - Desember

### Years
- Support dari tahun 2020 hingga current year + 1
- Contoh (November 2025): support 2020 - 2026

---

## 🔄 Caching untuk Tahun Depan

Setiap kombinasi season dan year memiliki cache terpisah dengan TTL 1 jam:

```
Cache key format: {season}-{year}
Contoh: spring-2026
TTL: 1 hour
```

Untuk refresh cache tahun depan:
```bash
POST /api/anime/cache/refresh?season=spring&year=2026
```

---

## 💡 Use Cases

### 1. Persiapan Musim Depan
```bash
# Lihat anime yang akan tayang musim depan
curl http://localhost:3000/api/anime?season=spring&year=2026&status=upcoming
```

### 2. Analisis Trend Tahunan
```bash
# Bandingkan statistik antar season
curl http://localhost:3000/api/stats/by-season
```

### 3. Monitoring Studio Baru
```bash
# Lihat studio mana yang aktif di musim depan
curl http://localhost:3000/api/stats/by-studio?season=spring&year=2026
```

### 4. Genre Prediction
```bash
# Prediksi genre populer musim depan
curl http://localhost:3000/api/stats/by-genre?season=spring&year=2026
```

---

## 🎯 Contoh Lengkap - Spring 2026 Analysis

```bash
#!/bin/bash

# 1. Ambil semua anime Spring 2026
echo "=== Spring 2026 Anime ==="
curl http://localhost:3000/api/anime?season=spring&year=2026

# 2. Ambil statistik
echo "=== Spring 2026 Statistics ==="
curl http://localhost:3000/api/stats/total-anime?season=spring&year=2026

# 3. Ambil top studio
echo "=== Top Studio Spring 2026 ==="
curl http://localhost:3000/api/stats/by-studio?season=spring&year=2026

# 4. Ambil genre breakdown
echo "=== Genre Breakdown Spring 2026 ==="
curl http://localhost:3000/api/stats/by-genre?season=spring&year=2026

# 5. Sort by rating
echo "=== Top Rated Spring 2026 ==="
curl http://localhost:3000/api/anime/sort?sortBy=rating&order=desc&season=spring&year=2026
```

---

## ⚠️ Catatan Penting

1. **Data Availability** - Data tahun depan hanya tersedia jika sudah di-publish di livechart.me
2. **Incomplete Data** - Anime yang belum close registration mungkin memiliki data yang tidak lengkap
3. **Status Upcoming** - Anime tahun depan biasanya memiliki status "Upcoming"
4. **Score N/A** - Rating belum tersedia untuk anime yang belum tayang
5. **Cache Refresh** - Gunakan cache refresh untuk mendapatkan data terbaru

---

## 🚀 Roadmap Fitur Tambahan

- [ ] Notification untuk anime baru tahun depan
- [ ] Comparison tool antar season
- [ ] Prediction engine untuk trending anime
- [ ] Historical data tracking
- [ ] Season calendar view

---

## 📞 Support

Untuk pertanyaan atau issue, silakan buat issue di repository atau hubungi developer.

**Happy scraping! 🎉**
