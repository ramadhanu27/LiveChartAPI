# 🔧 Troubleshooting Guide

## Problem: "Error loading data. Make sure you're accessing via HTTP/HTTPS, not file://"

### ✅ Solution

This error means the website is being opened as a local file instead of through a web server.

### **Step 1: Stop any running servers**
Press `Ctrl+C` in the terminal to stop any existing servers.

### **Step 2: Start the correct server**

Choose ONE of these options:

#### Option A: Using npm (Recommended)
```bash
npm run web
```

#### Option B: Using npm dev (runs full API + web demo)
```bash
npm run dev
```

#### Option C: Using http-server
```bash
npx http-server webAPI
```

### **Step 3: Open the correct URL**

After starting the server, open ONE of these URLs in your browser:

- `http://localhost:3000` ✅ (if using npm run web)
- `http://localhost:3000/webAPI/` ✅ (alternative)
- `http://localhost:8080` ✅ (if using http-server)

### ❌ Do NOT use:
- `file:///C:/Users/User/Desktop/...` ❌ (local file)
- `C:\Users\User\Desktop\...` ❌ (file path)

---

## Problem: "API is Offline"

### Causes:
1. Internet connection is down
2. The API server is not running
3. The API URL is incorrect

### Solutions:

**Check your internet:**
- Try visiting https://google.com in your browser

**Check the API:**
- Visit https://live-chart-api.vercel.app/api/health
- Should show: `{"status":"ok",...}`

**Check the web server:**
- Make sure you see "✅ Server running" in the terminal

---

## Problem: "Port 3000 already in use"

### Solution 1: Kill the process using port 3000

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -i :3000
kill -9 <PID>
```

### Solution 2: Use a different port

Edit `server.js` and change:
```javascript
const PORT = 3000;  // Change to 3001, 3002, etc.
```

---

## Problem: "Cannot GET /"

### Causes:
1. Wrong URL (using file:// instead of http://)
2. Server not running
3. Server is running on different port

### Solutions:

**Check the terminal output:**
Look for: `✅ Server running at: http://localhost:XXXX`

**Use the correct URL:**
Copy the URL from the terminal output and paste it in your browser.

**Restart the server:**
```bash
npm run web
```

---

## Problem: "Cannot find module 'http-server'"

### Solution:
Install it globally:
```bash
npm install -g http-server
```

Or use npm run web instead (doesn't require global install).

---

## Problem: Anime cards not loading / showing blank

### Causes:
1. API is offline
2. CORS error (check browser console)
3. Network issue

### Solutions:

**Check browser console (F12):**
- Open DevTools: Press `F12`
- Go to "Console" tab
- Look for error messages

**Check the API directly:**
- Visit: https://live-chart-api.vercel.app/api/anime
- Should show JSON data

**Try refreshing:**
- Press `Ctrl+Shift+R` (hard refresh)
- Clear cache and reload

---

## Problem: Search not working

### Solutions:

1. **Make sure you clicked Search button** or pressed Enter
2. **Check if anime list loaded first** (cards should be visible)
3. **Try searching with different keywords**
4. **Refresh the page** (Ctrl+R)

---

## Problem: Dark mode not saving

### Solution:
This is a browser feature. If it's not saving:

1. Check if localStorage is enabled
2. Try a different browser
3. Check browser privacy settings

---

## Problem: Images not loading

### Causes:
1. Poster URL is broken
2. Image server is down
3. Network issue

### Solutions:
1. Check your internet connection
2. Try refreshing the page
3. Try a different anime

---

## 🆘 Still Having Issues?

### Debug Steps:

1. **Open Browser Console** (F12 → Console)
2. **Look for red error messages**
3. **Check the terminal** where the server is running
4. **Try a different browser** (Chrome, Firefox, Safari, Edge)
5. **Restart everything:**
   ```bash
   # Stop the server (Ctrl+C)
   # Clear browser cache (Ctrl+Shift+Delete)
   # Restart the server (npm run web)
   # Refresh the browser (Ctrl+R)
   ```

### Common Error Messages:

| Error | Meaning | Solution |
|-------|---------|----------|
| `Failed to fetch` | Network/CORS issue | Check internet, restart server |
| `Cannot GET /` | Wrong URL or server not running | Use correct URL from terminal |
| `EADDRINUSE` | Port already in use | Kill process or use different port |
| `Cannot find module` | Missing dependency | Run `npm install` |
| `CORS error` | API doesn't allow requests | Check API CORS settings |

---

## 📞 Getting Help

If you're still stuck:

1. Check the terminal output for error messages
2. Open browser DevTools (F12) and check Console tab
3. Verify the API is online: https://live-chart-api.vercel.app/api/health
4. Try the steps in this guide again

---

**Good luck! 🎬**
