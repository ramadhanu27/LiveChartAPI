# 📅 Schedule Endpoints - Jadwal Tayang Anime

## 🎯 Overview

Schedule endpoints menyediakan informasi jadwal tayang anime per hari. Data diambil dari https://www.livechart.me/schedule

---

## 📌 Endpoint List

### 1. Full Schedule (Semua Hari)
```
GET /api/schedule
```

**Description:** Dapatkan jadwal lengkap untuk semua hari (Senin - Minggu)

**Response:**
```json
{
  "success": true,
  "data": {
    "monday": {
      "day": "monday",
      "count": 12,
      "anime": [
        {
          "id": "12692",
          "title": "SPY x FAMILY Season 3",
          "time": "5:15 AM",
          "link": "https://www.livechart.me/anime/12692",
          "studio": "WIT STUDIO",
          "status": "Airing",
          "poster": "https://..."
        }
      ]
    },
    "tuesday": {...},
    "wednesday": {...},
    ...
  }
}
```

---

### 2. Schedule by Day (Query Parameter)
```
GET /api/schedule?day=monday
```

**Description:** Dapatkan jadwal untuk hari tertentu menggunakan query parameter

**Valid Days:**
- `monday`
- `tuesday`
- `wednesday`
- `thursday`
- `friday`
- `saturday`
- `sunday`

**Example:**
```bash
curl http://localhost:3000/api/schedule?day=friday
```

**Response:**
```json
{
  "success": true,
  "data": {
    "friday": {
      "day": "friday",
      "count": 15,
      "anime": [...]
    }
  }
}
```

---

### 3. Today's Schedule
```
GET /api/schedule/today
```

**Description:** Dapatkan jadwal untuk hari ini

**Response:**
```json
{
  "success": true,
  "data": {
    "today": "sunday",
    "date": "2025-11-16",
    "schedule": {
      "day": "sunday",
      "count": 10,
      "anime": [...]
    }
  }
}
```

---

### 4. Upcoming Schedule (This Week)
```
GET /api/schedule/upcoming
```

**Description:** Dapatkan jadwal lengkap minggu ini dengan total anime

**Response:**
```json
{
  "success": true,
  "data": {
    "week": "upcoming",
    "totalAnime": 85,
    "schedule": {
      "monday": {...},
      "tuesday": {...},
      ...
    }
  }
}
```

---

### 5. Schedule for Specific Day (Path Parameter)
```
GET /api/schedule/day/:day
```

**Description:** Dapatkan jadwal untuk hari tertentu menggunakan path parameter

**Example:**
```bash
curl http://localhost:3000/api/schedule/day/wednesday
```

**Response:**
```json
{
  "success": true,
  "data": {
    "wednesday": {
      "day": "wednesday",
      "count": 14,
      "anime": [...]
    }
  }
}
```

---

## 📊 Response Fields

Setiap anime dalam schedule memiliki field berikut:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Anime ID dari livechart.me |
| `title` | string | Judul anime |
| `time` | string | Waktu tayang (format: HH:MM AM/PM) |
| `link` | string | Link ke halaman anime di livechart.me |
| `studio` | string | Studio produksi |
| `status` | string | Status (Airing, Upcoming, dll) |
| `poster` | string | URL poster anime |

---

## 💡 Use Cases

### 1. Cek Jadwal Hari Ini
```bash
curl http://localhost:3000/api/schedule/today
```

### 2. Cek Jadwal Hari Spesifik
```bash
# Cek jadwal Jumat
curl http://localhost:3000/api/schedule/day/friday

# Atau menggunakan query parameter
curl http://localhost:3000/api/schedule?day=friday
```

### 3. Cek Jadwal Minggu Ini
```bash
curl http://localhost:3000/api/schedule/upcoming
```

### 4. Cek Semua Jadwal
```bash
curl http://localhost:3000/api/schedule
```

---

## 🔄 Caching

Schedule data di-cache dengan TTL 1 jam. Untuk mendapatkan data terbaru, tunggu cache expire atau refresh manual.

---

## 📈 Contoh Integrasi

### JavaScript/Node.js
```javascript
// Ambil jadwal hari ini
fetch('http://localhost:3000/api/schedule/today')
  .then(res => res.json())
  .then(data => {
    console.log(`Jadwal ${data.data.today}:`, data.data.schedule.anime);
  });
```

### Python
```python
import requests

# Ambil jadwal Jumat
response = requests.get('http://localhost:3000/api/schedule/day/friday')
data = response.json()

for anime in data['data']['friday']['anime']:
    print(f"{anime['title']} - {anime['time']}")
```

### cURL
```bash
# Ambil jadwal Senin
curl http://localhost:3000/api/schedule/day/monday | jq '.data.monday.anime'

# Ambil jadwal hari ini
curl http://localhost:3000/api/schedule/today | jq '.data.schedule.anime'
```

---

## ⚠️ Catatan

1. **Waktu Tayang** - Waktu dalam format AM/PM (timezone Japan)
2. **Data Update** - Data di-update setiap jam dari livechart.me
3. **Incomplete Data** - Beberapa field mungkin kosong jika belum tersedia
4. **Error Handling** - Jika ada error scraping, endpoint akan return error message

---

## 🚀 Future Enhancements

- [ ] Filter by studio
- [ ] Filter by genre
- [ ] Notification untuk anime baru
- [ ] Comparison dengan season sebelumnya
- [ ] Trending anime di schedule
- [ ] Export schedule ke calendar format

---

## 📞 Support

Untuk pertanyaan atau issue, silakan buat issue di repository.

**Happy scheduling! 📅**
