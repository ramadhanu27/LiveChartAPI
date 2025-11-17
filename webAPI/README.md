# LiveChart API - Web Demo

A modern web interface to browse and search anime from the LiveChart API.

## 🚀 Quick Start

### Option 1: Using npm (Recommended)

```bash
# From the project root directory
npm run web
```

Then open your browser to: **http://localhost:3000**

### Option 2: Using Python

```bash
cd webAPI
python -m http.server 8000
```

Then open: **http://localhost:8000**

### Option 3: Using Node.js http-server

```bash
npm install -g http-server
cd webAPI
http-server
```

## ✨ Features

- 🎬 **Browse Anime**: Filter by season, year, and sort options
- 🔍 **Search**: Real-time search across anime titles
- 📊 **Statistics**: View aggregate data from your API
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 📱 **Responsive**: Works on desktop, tablet, and mobile
- ⚡ **Real-time Status**: Shows API online/offline status

## 🎨 UI Features

- Modern card-based layout inspired by LiveChart.me
- Smooth animations and transitions
- Modal details view for each anime
- Color-coded status badges
- Persistent theme preference

## 🔧 API Integration

The web demo connects to: `https://live-chart-api.vercel.app`

**Endpoints used:**
- `GET /api/anime` - Get anime list
- `GET /api/anime/sort` - Sort anime
- `GET /api/detail/:id` - Get anime details
- `GET /api/stats` - Get statistics
- `GET /api/health` - Check API status

## 📋 Requirements

- Node.js 14+ (for npm run web)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (to access the API)

## 🛠️ Troubleshooting

### "Error loading data. Make sure you're accessing via HTTP/HTTPS, not file://"

**Solution**: The website must be served via HTTP/HTTPS, not opened directly as a file.

Use one of the Quick Start options above.

### "API is Offline"

**Solution**: Check your internet connection and ensure the API is running at:
https://live-chart-api.vercel.app/api/health

### Port 3000 already in use

**Solution**: Kill the process using port 3000 or use a different port:

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

## 📝 Notes

- The website uses localStorage to save your theme preference
- API status is checked every 30 seconds
- Anime data is cached during the session
- All external links open in new tabs

## 🎯 Future Enhancements

- [ ] Favorites/Watchlist
- [ ] Advanced filtering options
- [ ] Anime recommendations
- [ ] User ratings and reviews
- [ ] Export functionality

---

**Made with ❤️ for anime lovers**
