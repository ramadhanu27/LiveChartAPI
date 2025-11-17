const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware untuk pretty-print JSON
app.set('json spaces', 2);
app.use(express.json());

// Serve static files dari Web directory
app.use(express.static(path.join(__dirname, 'Web')));

// Cache untuk menyimpan data scrape
let cachedData = null;
let lastScrapedTime = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 jam

// Fungsi untuk scrape data dari livechart.me
async function scrapeAnimeData() {
  try {
    const url = 'https://www.livechart.me/fall-2025/tv?ongoing=all';
    
    console.log('Scraping data dari:', url);
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const animeList = [];

    // Scrape setiap anime entry berdasarkan struktur HTML yang terlihat
    $('article.anime').each((index, element) => {
      const $element = $(element);
      
      // Ambil judul dari data-anime-card-list-target atau h3
      const title = $element.find('h3, [data-anime-card-list-target]').first().text().trim();
      
      // Ambil link dari href di dalam article
      const link = $element.find('a[href*="/anime/"]').first().attr('href');
      
      // Ambil informasi dari data attributes
      const animeId = $element.attr('data-anime-id');
      const animeTitle = $element.attr('data-anime-title');
      
      // Ambil status dari span atau div dengan class tertentu
      let status = $element.find('[class*="status"], .badge').first().text().trim();
      if (!status) {
        // Cek di dalam data-native-type atau class lain
        const statusText = $element.find('span, div').text();
        if (statusText.includes('Ongoing')) status = 'Ongoing';
        else if (statusText.includes('Upcoming')) status = 'Upcoming';
        else status = 'Unknown';
      }
      
      // Ambil episode info dan bersihkan
      let episodeInfo = $element.find('[class*="episode"], .eps').text().trim();
      // Ekstrak hanya angka episode (e.g., "EP6" dari "EP6 · TV (JP)...")
      const epMatch = episodeInfo.match(/(?:EP|ep)?(\d+).*?(?:eps?|episodes?)/i);
      if (epMatch) {
        episodeInfo = 'EP' + epMatch[1];
      } else {
        const justNumber = episodeInfo.match(/(\d+)/);
        episodeInfo = justNumber ? 'EP' + justNumber[1] : 'N/A';
      }
      
      // Ambil studio dari data attribute atau text
      let studio = $element.find('[class*="studio"]').text().trim();
      // Bersihkan multiple studio names
      studio = studio.replace(/\s+/g, ' ').split(/[,\n]/)[0].trim() || 'N/A';
      
      // Ambil rating/score
      const score = $element.find('.score, [class*="rating"]').text().trim();
      
      // Ambil poster image
      const posterImg = $element.find('img').first().attr('src');

      if (title || animeTitle) {
        animeList.push({
          id: animeId || null,
          title: title || animeTitle,
          link: link ? (link.startsWith('http') ? link : 'https://www.livechart.me' + link) : null,
          status: status,
          episodes: episodeInfo,
          studio: studio,
          score: score || 'N/A',
          poster: posterImg || null
        });
      }
    });

    console.log(`Berhasil scrape ${animeList.length} anime`);
    return animeList;
  } catch (error) {
    console.error('Error saat scraping:', error.message);
    throw error;
  }
}

// Endpoint untuk mendapatkan semua anime
app.get('/api/anime', async (req, res) => {
  try {
    const now = Date.now();
    
    // Gunakan cache jika masih valid
    if (cachedData && lastScrapedTime && (now - lastScrapedTime) < CACHE_DURATION) {
      return res.json({
        success: true,
        data: cachedData,
        cached: true,
        cachedAt: new Date(lastScrapedTime).toISOString()
      });
    }

    // Scrape data baru
    const animeData = await scrapeAnimeData();
    
    // Simpan ke cache
    cachedData = animeData;
    lastScrapedTime = now;

    res.json({
      success: true,
      data: animeData,
      cached: false,
      scrapedAt: new Date(now).toISOString(),
      total: animeData.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint untuk refresh cache
app.post('/api/anime/refresh', async (req, res) => {
  try {
    const animeData = await scrapeAnimeData();
    
    // Update cache
    cachedData = animeData;
    lastScrapedTime = Date.now();

    res.json({
      success: true,
      message: 'Cache refreshed successfully',
      data: animeData,
      total: animeData.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint untuk mendapatkan anime berdasarkan judul
app.get('/api/anime/search/:title', async (req, res) => {
  try {
    const searchTitle = req.params.title.toLowerCase();
    
    // Gunakan cache atau scrape baru
    let animeData = cachedData;
    if (!animeData) {
      animeData = await scrapeAnimeData();
      cachedData = animeData;
      lastScrapedTime = Date.now();
    }

    const results = animeData.filter(anime => 
      anime.title.toLowerCase().includes(searchTitle)
    );

    res.json({
      success: true,
      data: results,
      total: results.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    cacheStatus: cachedData ? 'filled' : 'empty',
    lastScrapedAt: lastScrapedTime ? new Date(lastScrapedTime).toISOString() : null
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
  console.log(`Endpoints:`);
  console.log(`  GET  /api/anime - Dapatkan semua anime`);
  console.log(`  POST /api/anime/refresh - Refresh cache`);
  console.log(`  GET  /api/anime/search/:title - Cari anime berdasarkan judul`);
  console.log(`  GET  /api/health - Health check`);
});
