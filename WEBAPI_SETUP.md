# 🚀 LiveChart API Web Demo - Setup Guide

## Quick Start (3 Steps)

### Step 1: Open Terminal
Navigate to the project root directory:
```bash
cd c:\Users\User\Desktop\File HTML\LiveChartAPI
```

### Step 2: Start the Web Server
```bash
npm run web
```

You should see:
```
╔════════════════════════════════════════╗
║   LiveChart API Web Demo Server        ║
╚════════════════════════════════════════╝

✅ Server running at: http://localhost:3000
📁 Serving from: webAPI folder
🌐 Open in browser: http://localhost:3000

Press Ctrl+C to stop the server
```

### Step 3: Open in Browser
Click or copy-paste this link in your browser:
```
http://localhost:3000
```

---

## ✨ What You Can Do

### Browse Anime
- Filter by **Season** (Winter, Spring, Summer, Fall)
- Filter by **Year** (2023, 2024, 2025)
- Sort by **Rating**, **Title**, or **Episodes**

### Search
- Type anime name in the search box
- Results update in real-time

### View Details
- Click any anime card to see full details
- View synopsis, studio, tags, and more
- Links to external sources

### Check Status
- Green dot = API is Online ✅
- Red dot = API is Offline ❌
- Status updates every 30 seconds

### Toggle Theme
- Click the moon icon (🌙) for Dark Mode
- Click the sun icon (☀️) for Light Mode
- Your preference is saved automatically

---

## 🔧 Alternative Methods

### If npm doesn't work, try Python:
```bash
cd webAPI
python -m http.server 8000
```
Then open: `http://localhost:8000`

### Or use Node.js directly:
```bash
npx http-server webAPI
```

---

## ❓ Troubleshooting

### "Command not found: npm"
- Install Node.js from https://nodejs.org/
- Restart your terminal after installation

### "Port 3000 already in use"
- Close other applications using port 3000
- Or use Python/http-server method above

### "Cannot GET /"
- Make sure you're using `http://localhost:3000`
- Not `file:///C:/Users/...`

### "API is Offline"
- Check your internet connection
- Verify the API is running: https://live-chart-api.vercel.app/api/health

---

## 📁 File Structure

```
LiveChartAPI/
├── webAPI/
│   ├── index.html          ← Main web interface
│   └── README.md           ← Web demo documentation
├── server.js               ← HTTP server for web demo
├── package.json            ← Project configuration
└── WEBAPI_SETUP.md        ← This file
```

---

## 🎯 Features

✅ Modern UI inspired by LiveChart.me  
✅ Real-time API status monitoring  
✅ Dark/Light theme toggle  
✅ Responsive design (mobile-friendly)  
✅ Search and filter anime  
✅ Detailed anime information modal  
✅ Statistics dashboard  
✅ Smooth animations  

---

## 📞 Support

If you encounter any issues:

1. Check the browser console (F12 → Console tab)
2. Verify the API is online: https://live-chart-api.vercel.app/api/health
3. Try a different browser
4. Clear browser cache and reload

---

**Enjoy browsing anime! 🎬**
