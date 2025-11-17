# 🚀 START HERE - LiveChart API Web Demo

## ⚡ Quick Start (30 seconds)

### Step 1: Open Terminal
```bash
cd c:\Users\User\Desktop\File HTML\LiveChartAPI
```

### Step 2: Start Server
```bash
npm run web
```

### Step 3: Open Browser
```
http://localhost:3000
```

**Done!** 🎉

---

## 📋 What You'll See

When the server starts, you'll see:
```
╔════════════════════════════════════════════════════════╗
║        LiveChart API Web Demo Server                   ║
╚════════════════════════════════════════════════════════╝

✅ Server running at: http://localhost:3000
📁 Serving from: webAPI folder
🌐 Open in browser: http://localhost:3000

Press Ctrl+C to stop the server
```

---

## 🎬 Features

✨ **Browse Anime**
- Filter by Season (Winter, Spring, Summer, Fall)
- Filter by Year (2023, 2024, 2025)
- Sort by Rating, Title, or Episodes

🔍 **Search**
- Real-time anime search
- Instant results

📊 **Details**
- Click any anime card to see full information
- View synopsis, studio, tags, ratings
- External links to streaming services

🌙 **Theme**
- Toggle between Light and Dark modes
- Your preference is saved automatically

📱 **Responsive**
- Works on Desktop, Tablet, and Mobile

---

## 🔗 Important URLs

| URL | Purpose |
|-----|---------|
| `http://localhost:3000` | Web Demo (Main) |
| `http://localhost:3000/webAPI/` | Web Demo (Alternative) |
| `https://live-chart-api.vercel.app/api/health` | Check if API is online |
| `https://live-chart-api.vercel.app/api/anime` | Get anime data |

---

## ⚠️ Common Issues

### "Error loading data. Make sure you're accessing via HTTP/HTTPS, not file://"

**Solution:** Make sure you're using `http://localhost:3000` NOT `file:///C:/Users/...`

### "API is Offline"

**Solution:** Check your internet connection and verify the API is running:
https://live-chart-api.vercel.app/api/health

### "Port 3000 already in use"

**Solution:** Kill the process using port 3000 or use a different port.

See **TROUBLESHOOTING.md** for detailed solutions.

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| `START_HERE.md` | This file - Quick start guide |
| `WEBAPI_SETUP.md` | Detailed setup instructions |
| `TROUBLESHOOTING.md` | Problem solving guide |
| `webAPI/README.md` | Web demo documentation |

---

## 🛠️ Alternative Methods

### Using Python:
```bash
cd webAPI
python -m http.server 8000
# Open: http://localhost:8000
```

### Using http-server:
```bash
npx http-server webAPI
# Open: http://localhost:8080
```

### Using npm dev (Full API + Web Demo):
```bash
npm run dev
# Open: http://localhost:3000
```

---

## 🎯 Next Steps

1. ✅ Start the server: `npm run web`
2. ✅ Open browser: `http://localhost:3000`
3. ✅ Browse anime!
4. ✅ Try searching and filtering
5. ✅ Click on anime cards for details
6. ✅ Toggle dark mode with the moon icon

---

## 📞 Need Help?

1. Check **TROUBLESHOOTING.md** for common issues
2. Open browser DevTools (F12) to see error messages
3. Verify the API is online: https://live-chart-api.vercel.app/api/health
4. Restart the server and browser

---

## 🎨 Features Showcase

### Browse Section
- Season filter (Winter, Spring, Summer, Fall)
- Year selector (2023, 2024, 2025)
- Sort options (Rating, Title, Episodes)
- Search box for quick lookup

### Anime Cards
- Poster image
- Title and studio
- Episode count
- Rating (⭐)
- Status badge (Ongoing, Upcoming)
- Click to view details

### Detail Modal
- Full anime information
- Synopsis
- Studio and tags
- Episode information
- External links
- Streaming information

### Statistics
- Total anime count
- Average rating
- Ongoing count
- Real-time updates

### Status Indicator
- Green dot = API Online ✅
- Red dot = API Offline ❌
- Updates every 30 seconds

---

## 💡 Tips

- **Dark Mode:** Click the moon icon (🌙) in the top right
- **Search:** Type anime name and click Search or press Enter
- **Details:** Click any anime card to see full information
- **External Links:** Click "View on LiveChart →" to visit the source
- **Refresh:** Press Ctrl+R to reload the page
- **Hard Refresh:** Press Ctrl+Shift+R to clear cache

---

## 🎬 Enjoy!

You're all set! Start browsing anime now.

**Happy watching! 🍿**

---

**Questions?** See **TROUBLESHOOTING.md** for detailed help.
