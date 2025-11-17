const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3009;
const WEBAPI_DIR = path.join(__dirname, 'webAPI');

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Remove /webAPI prefix if present and route to webAPI folder
  let urlPath = req.url;
  if (urlPath.startsWith('/webAPI')) {
    urlPath = urlPath.substring(7); // Remove '/webAPI'
  }
  if (!urlPath) urlPath = '/';

  // Route to webAPI folder
  let filePath = path.join(WEBAPI_DIR, urlPath === '/' ? 'index.html' : urlPath);

  // Security: prevent directory traversal
  if (!filePath.startsWith(WEBAPI_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // Check if file exists
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Try index.html for directories
      filePath = path.join(WEBAPI_DIR, 'index.html');
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end('Not Found');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      });
      return;
    }

    // Determine content type
    const ext = path.extname(filePath);
    let contentType = 'text/plain';
    if (ext === '.html') contentType = 'text/html';
    else if (ext === '.css') contentType = 'text/css';
    else if (ext === '.js') contentType = 'application/javascript';
    else if (ext === '.json') contentType = 'application/json';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.svg') contentType = 'image/svg+xml';
    else if (ext === '.webp') contentType = 'image/webp';

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║        LiveChart API Web Demo Server                   ║
╚════════════════════════════════════════════════════════╝

✅ Server running at: http://localhost:${PORT}
📁 Serving from: ${WEBAPI_DIR}
🌐 Open in browser: http://localhost:${PORT}

📝 Available URLs:
   • http://localhost:${PORT}           (Web Demo)
   • http://localhost:${PORT}/webAPI/   (Web Demo)

Press Ctrl+C to stop the server
  `);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    console.error('Try killing the process or using a different port');
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});
