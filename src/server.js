const app = require('./app');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   LiveChart API Server                 ║
║   Running on http://localhost:${PORT}  ║
╚════════════════════════════════════════╝
  `);
  console.log('📚 Available Endpoints (RESTful Structure):');
  console.log('');
  console.log('  📺 Anime');
  console.log('    GET    /api/anime                           - Daftar anime');
  console.log('    GET    /api/anime?season=fall&year=2025     - Daftar anime dengan filter');
  console.log('    GET    /api/anime/sort?sortBy=rating        - Sort anime');
  console.log('    GET    /api/anime/search?q=title            - Cari anime');
  console.log('    GET    /api/anime/filter?status=ongoing     - Filter anime');
  console.log('    GET    /api/anime/:id                       - Detail lengkap anime');
  console.log('    GET    /api/anime/:id/stats                 - Statistik anime');
  console.log('    GET    /api/anime/:id/streaming             - Info streaming anime');
  console.log('    POST   /api/anime/cache/refresh             - Refresh cache');
  console.log('    GET    /api/anime/cache/info                - Info cache');
  console.log('');
  console.log('  🎬 Movies');
  console.log('    GET    /api/movies                          - Daftar movie');
  console.log('    GET    /api/movies?season=fall&year=2025    - Daftar movie dengan filter');
  console.log('    GET    /api/movies/sort?sortBy=rating       - Sort movie');
  console.log('    GET    /api/movies/:id                      - Detail lengkap movie');
  console.log('    GET    /api/movies/:id/stats                - Statistik movie');
  console.log('    GET    /api/movies/:id/streaming            - Info streaming movie');
  console.log('    POST   /api/movies/cache/refresh            - Refresh cache');
  console.log('');
  console.log('  📀 OVAs');
  console.log('    GET    /api/ovas                            - Daftar OVA');
  console.log('    GET    /api/ovas?season=fall&year=2025      - Daftar OVA dengan filter');
  console.log('    GET    /api/ovas/sort?sortBy=rating         - Sort OVA');
  console.log('    GET    /api/ovas/:id                        - Detail lengkap OVA');
  console.log('    GET    /api/ovas/:id/stats                  - Statistik OVA');
  console.log('    GET    /api/ovas/:id/streaming              - Info streaming OVA');
  console.log('    POST   /api/ovas/cache/refresh              - Refresh cache');
  console.log('');
  console.log('  � All (Anime + Movie + OVA)');
  console.log('    GET    /api/all                             - Daftar semua');
  console.log('    GET    /api/all?season=fall&year=2025       - Daftar semua dengan filter');
  console.log('    POST   /api/all/cache/refresh               - Refresh cache');
  console.log('');
  console.log('  💾 Export');
  console.log('    GET    /api/export/anime/:id                - Export anime ke JSON');
  console.log('    GET    /api/export/movie/:id                - Export movie ke JSON');
  console.log('    POST   /api/export/anime                    - Export multiple anime');
  console.log('    POST   /api/export/movie                    - Export multiple movie');
  console.log('');
  console.log('  📊 Statistics');
  console.log('    GET    /api/stats/total-anime               - Total anime statistics');
  console.log('    GET    /api/stats/by-genre                  - Statistics by genre');
  console.log('    GET    /api/stats/by-studio                 - Statistics by studio');
  console.log('    GET    /api/stats/by-season                 - Statistics by season');
  console.log('');
  console.log('  📅 Schedule');
  console.log('    GET    /api/schedule                        - Full schedule (all days)');
  console.log('    GET    /api/schedule?day=monday             - Schedule by day');
  console.log('    GET    /api/schedule/today                  - Today schedule');
  console.log('    GET    /api/schedule/upcoming                - Upcoming schedule (this week)');
  console.log('    GET    /api/schedule/day/:day               - Schedule for specific day');
  console.log('');
  console.log('  ℹ️  Info');
  console.log('    GET    /api/info/seasons                    - Daftar season & year');
  console.log('    GET    /api/health                          - Health check');
  console.log('    GET    /                                    - API status & credit');
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
