const express = require('express');
const animeRoutes = require('./routes/animeRoutes');
const movieRoutes = require('./routes/movieRoutes');
const ovaRoutes = require('./routes/ovaRoutes');
const allRoutes = require('./routes/allRoutes');
const animeDetailRoutes = require('./routes/animeDetailRoutes');
const movieDetailRoutes = require('./routes/movieDetailRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();

// Middleware
app.set('json spaces', 2);
app.use(express.json());

// Root endpoint - API status dan credit
app.get('/', (req, res) => {
  res.json({
    success: true,
    api: {
      name: 'LiveChart API Scraper',
      version: '1.0.0',
      description: 'Web scraper untuk mengambil data anime dan movie dari livechart.me',
      status: 'running',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    },
    credit: {
      developer: 'ramadhanu',
      github: 'https://github.com/ramadhanu27',
      email: 'contact@ramadhanu.dev'
    },
    endpoints: {
      total: 31,
      categories: {
        anime: 4,
        movie: 4,
        ova: 4,
        all: 2,
        animeDetail: 4,
        movieDetail: 4,
        export: 4,
        cache: 2,
        info: 2,
        health: 1
      }
    },
    documentation: {
      readme: '/README.md',
      architecture: '/ARCHITECTURE.md',
      detailScraper: '/DETAIL_SCRAPER.md',
      movieScraper: '/MOVIE_SCRAPER.md',
      htmlSelectors: '/HTML_SELECTORS.md',
      exportJson: '/EXPORT_JSON.md'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Routes
app.use('/api/anime', animeRoutes);
app.use('/api/movie', movieRoutes);
app.use('/api/movies', movieRoutes);  // Alias untuk /api/movie
app.use('/api/ova', ovaRoutes);
app.use('/api/ovas', ovaRoutes);      // Alias untuk /api/ova
app.use('/api/all', allRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/detail', animeDetailRoutes);
app.use('/api/movies/detail', movieDetailRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint tidak ditemukan',
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

module.exports = app;
