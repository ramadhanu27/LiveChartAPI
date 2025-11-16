const scrapeService = require('../services/scrapeService');
const cacheService = require('../services/cacheService');
const { formatResponse } = require('../utils/dataFormatter');

/**
 * Controller untuk anime endpoints
 */

const animeController = {
  /**
   * GET /api/anime - Dapatkan semua anime
   * Query params: ?season=fall&year=2025
   */
  async getAll(req, res) {
    try {
      const { season, year } = req.query;
      
      // Buat cache key berdasarkan season dan year
      const cacheKey = `${season || 'current'}-${year || 'current'}`;
      
      // Cek cache terlebih dahulu
      const cachedResult = cacheService.get(cacheKey);
      if (cachedResult) {
        return res.json(formatResponse({
          success: true,
          data: cachedResult.data,
          total: cachedResult.data.length,
          cached: true,
          season: season || 'current',
          year: year || 'current',
          timestamp: new Date(cachedResult.timestamp).toISOString()
        }));
      }

      // Scrape data baru jika cache tidak ada
      const animeData = await scrapeService.scrapeAllAnime(season, year ? parseInt(year) : null);
      cacheService.set(animeData, cacheKey);

      res.json(formatResponse({
        success: true,
        data: animeData,
        total: animeData.length,
        cached: false
      }));
    } catch (error) {
      console.error('Error in getAll:', error);
      res.status(500).json(formatResponse({
        success: false,
        error: error.message
      }));
    }
  },

  /**
   * POST /api/anime/refresh - Refresh cache
   * Query params: ?season=fall&year=2025
   */
  async refresh(req, res) {
    try {
      const { season, year } = req.query;
      const cacheKey = `${season || 'current'}-${year || 'current'}`;
      
      console.log(`🔄 Refreshing cache for key: ${cacheKey}`);
      const animeData = await scrapeService.scrapeAllAnime(season, year ? parseInt(year) : null);
      cacheService.set(animeData, cacheKey);

      res.json(formatResponse({
        success: true,
        message: 'Cache refreshed successfully',
        data: animeData,
        total: animeData.length,
        season: season || 'current',
        year: year || 'current'
      }));
    } catch (error) {
      console.error('Error in refresh:', error);
      res.status(500).json(formatResponse({
        success: false,
        error: error.message
      }));
    }
  },

  /**
   * GET /api/anime/search/:title - Cari anime
   */
  async search(req, res) {
    try {
      const searchTitle = req.params.title.toLowerCase();

      if (!searchTitle || searchTitle.length < 2) {
        return res.status(400).json(formatResponse({
          success: false,
          error: 'Search query harus minimal 2 karakter'
        }));
      }

      // Ambil dari cache atau scrape baru
      let animeData = cacheService.get()?.data;
      if (!animeData) {
        animeData = await scrapeService.scrapeAllAnime();
        cacheService.set(animeData);
      }

      const results = animeData.filter(anime =>
        anime.title.toLowerCase().includes(searchTitle)
      );

      res.json(formatResponse({
        success: true,
        data: results,
        total: results.length
      }));
    } catch (error) {
      console.error('Error in search:', error);
      res.status(500).json(formatResponse({
        success: false,
        error: error.message
      }));
    }
  },

  /**
   * GET /api/anime/:id - Dapatkan anime by ID
   */
  async getById(req, res) {
    try {
      const animeId = req.params.id;

      let animeData = cacheService.get()?.data;
      if (!animeData) {
        animeData = await scrapeService.scrapeAllAnime();
        cacheService.set(animeData);
      }

      const anime = animeData.find(a => a.id === animeId);

      if (!anime) {
        return res.status(404).json(formatResponse({
          success: false,
          error: 'Anime tidak ditemukan'
        }));
      }

      res.json(formatResponse({
        success: true,
        data: anime
      }));
    } catch (error) {
      console.error('Error in getById:', error);
      res.status(500).json(formatResponse({
        success: false,
        error: error.message
      }));
    }
  },

  /**
   * GET /api/anime/filter/status/:status - Filter by status
   */
  async filterByStatus(req, res) {
    try {
      const status = req.params.status.toLowerCase();

      let animeData = cacheService.get()?.data;
      if (!animeData) {
        animeData = await scrapeService.scrapeAllAnime();
        cacheService.set(animeData);
      }

      const results = animeData.filter(anime =>
        anime.status.toLowerCase() === status
      );

      res.json(formatResponse({
        success: true,
        data: results,
        total: results.length
      }));
    } catch (error) {
      console.error('Error in filterByStatus:', error);
      res.status(500).json(formatResponse({
        success: false,
        error: error.message
      }));
    }
  },

  /**
   * GET /api/anime/info/seasons - Dapatkan list available seasons
   */
  async getSeasons(req, res) {
    try {
      const seasons = ['winter', 'spring', 'summer', 'fall'];
      const currentYear = new Date().getFullYear();
      const years = [];
      
      // Generate years dari 2020 sampai tahun depan
      for (let year = 2020; year <= currentYear + 1; year++) {
        years.push(year);
      }

      res.json(formatResponse({
        success: true,
        data: {
          seasons: seasons,
          years: years,
          currentYear: currentYear
        }
      }));
    } catch (error) {
      console.error('Error in getSeasons:', error);
      res.status(500).json(formatResponse({
        success: false,
        error: error.message
      }));
    }
  },

  /**
   * GET /api/anime/info/cache - Dapatkan cache info
   */
  async getCacheInfo(req, res) {
    try {
      const cacheInfo = cacheService.getInfo();

      res.json(formatResponse({
        success: true,
        data: cacheInfo
      }));
    } catch (error) {
      console.error('Error in getCacheInfo:', error);
      res.status(500).json(formatResponse({
        success: false,
        error: error.message
      }));
    }
  },

  /**
   * GET /api/movie - Dapatkan semua movie
   * Query params: ?season=fall&year=2025
   */
  async getAllMovies(req, res) {
    try {
      const { season, year } = req.query;
      
      // Buat cache key berdasarkan season dan year
      const cacheKey = `movie-${season || 'current'}-${year || 'current'}`;
      
      // Cek cache terlebih dahulu
      const cachedResult = cacheService.get(cacheKey);
      if (cachedResult) {
        return res.json(formatResponse({
          success: true,
          data: cachedResult.data,
          total: cachedResult.data.length,
          cached: true,
          season: season || 'current',
          year: year || 'current',
          type: 'movie',
          timestamp: new Date(cachedResult.timestamp).toISOString()
        }));
      }

      // Scrape data baru jika cache tidak ada
      const movieData = await scrapeService.scrapeAllMovies(season, year ? parseInt(year) : null);
      cacheService.set(movieData, cacheKey);

      res.json(formatResponse({
        success: true,
        data: movieData,
        total: movieData.length,
        cached: false,
        type: 'movie'
      }));
    } catch (error) {
      console.error('Error in getAllMovies:', error);
      res.status(500).json(formatResponse({
        success: false,
        error: error.message
      }));
    }
  },

  /**
   * POST /api/movie/refresh - Refresh movie cache
   * Query params: ?season=fall&year=2025
   */
  async refreshMovies(req, res) {
    try {
      const { season, year } = req.query;
      const cacheKey = `movie-${season || 'current'}-${year || 'current'}`;
      
      console.log(`🔄 Refreshing movie cache for key: ${cacheKey}`);
      const movieData = await scrapeService.scrapeAllMovies(season, year ? parseInt(year) : null);
      cacheService.set(movieData, cacheKey);

      res.json(formatResponse({
        success: true,
        message: 'Movie cache refreshed successfully',
        data: movieData,
        total: movieData.length,
        season: season || 'current',
        year: year || 'current',
        type: 'movie'
      }));
    } catch (error) {
      console.error('Error in refreshMovies:', error);
      res.status(500).json(formatResponse({
        success: false,
        error: error.message
      }));
    }
  },

  /**
   * GET /api/ova - Dapatkan semua OVA
   * Query params: ?season=fall&year=2025
   */
  async getAllOVAs(req, res) {
    try {
      const { season, year } = req.query;
      
      // Buat cache key berdasarkan season dan year
      const cacheKey = `ova-${season || 'current'}-${year || 'current'}`;
      
      // Cek cache terlebih dahulu
      const cachedResult = cacheService.get(cacheKey);
      if (cachedResult) {
        return res.json(formatResponse({
          success: true,
          data: cachedResult.data,
          total: cachedResult.data.length,
          cached: true,
          season: season || 'current',
          year: year || 'current',
          type: 'ova',
          timestamp: new Date(cachedResult.timestamp).toISOString()
        }));
      }

      // Scrape data baru jika cache tidak ada
      const ovaData = await scrapeService.scrapeAllOVAs(season, year ? parseInt(year) : null);
      cacheService.set(ovaData, cacheKey);

      res.json(formatResponse({
        success: true,
        data: ovaData,
        total: ovaData.length,
        cached: false,
        type: 'ova'
      }));
    } catch (error) {
      console.error('Error in getAllOVAs:', error);
      res.status(500).json(formatResponse({
        success: false,
        error: error.message
      }));
    }
  },

  /**
   * POST /api/ova/refresh - Refresh OVA cache
   * Query params: ?season=fall&year=2025
   */
  async refreshOVAs(req, res) {
    try {
      const { season, year } = req.query;
      const cacheKey = `ova-${season || 'current'}-${year || 'current'}`;
      
      console.log(`🔄 Refreshing OVA cache for key: ${cacheKey}`);
      const ovaData = await scrapeService.scrapeAllOVAs(season, year ? parseInt(year) : null);
      cacheService.set(ovaData, cacheKey);

      res.json(formatResponse({
        success: true,
        message: 'OVA cache refreshed successfully',
        data: ovaData,
        total: ovaData.length,
        season: season || 'current',
        year: year || 'current',
        type: 'ova'
      }));
    } catch (error) {
      console.error('Error in refreshOVAs:', error);
      res.status(500).json(formatResponse({
        success: false,
        error: error.message
      }));
    }
  },

  /**
   * GET /api/all - Dapatkan semua (anime + movie + OVA)
   * Query params: ?season=fall&year=2025
   */
  async getAll(req, res) {
    try {
      const { season, year } = req.query;
      
      // Buat cache key berdasarkan season dan year
      const cacheKey = `all-${season || 'current'}-${year || 'current'}`;
      
      // Cek cache terlebih dahulu
      const cachedResult = cacheService.get(cacheKey);
      if (cachedResult) {
        return res.json(formatResponse({
          success: true,
          data: cachedResult.data,
          total: cachedResult.data.length,
          cached: true,
          season: season || 'current',
          year: year || 'current',
          type: 'all',
          timestamp: new Date(cachedResult.timestamp).toISOString()
        }));
      }

      // Scrape data baru jika cache tidak ada
      const allData = await scrapeService.scrapeAll(season, year ? parseInt(year) : null);
      cacheService.set(allData, cacheKey);

      res.json(formatResponse({
        success: true,
        data: allData,
        total: allData.length,
        cached: false,
        type: 'all'
      }));
    } catch (error) {
      console.error('Error in getAll:', error);
      res.status(500).json(formatResponse({
        success: false,
        error: error.message
      }));
    }
  },

  /**
   * POST /api/all/refresh - Refresh all cache
   * Query params: ?season=fall&year=2025
   */
  async refreshAll(req, res) {
    try {
      const { season, year } = req.query;
      const cacheKey = `all-${season || 'current'}-${year || 'current'}`;
      
      console.log(`🔄 Refreshing all cache for key: ${cacheKey}`);
      const allData = await scrapeService.scrapeAll(season, year ? parseInt(year) : null);
      cacheService.set(allData, cacheKey);

      res.json(formatResponse({
        success: true,
        message: 'All cache refreshed successfully',
        data: allData,
        total: allData.length,
        season: season || 'current',
        year: year || 'current',
        type: 'all'
      }));
    } catch (error) {
      console.error('Error in refreshAll:', error);
      res.status(500).json(formatResponse({
        success: false,
        error: error.message
      }));
    }
  },

  /**
   * GET /api/anime/sort - Sort anime data
   * Query params: ?sortBy=rating&order=desc&season=fall&year=2025
   */
  async sortAnime(req, res) {
    try {
      const { sortBy = 'rating', order = 'desc', season, year } = req.query;
      
      // Validate sortBy parameter
      const validSortOptions = ['rating', 'title', 'episodes', 'airdates'];
      if (!validSortOptions.includes(sortBy.toLowerCase())) {
        return res.status(400).json(formatResponse({
          success: false,
          error: `Invalid sortBy. Must be one of: ${validSortOptions.join(', ')}`
        }));
      }

      // Validate order parameter
      const validOrderOptions = ['asc', 'desc'];
      if (!validOrderOptions.includes(order.toLowerCase())) {
        return res.status(400).json(formatResponse({
          success: false,
          error: `Invalid order. Must be 'asc' or 'desc'`
        }));
      }

      // Buat cache key berdasarkan season dan year
      const cacheKey = `${season || 'current'}-${year || 'current'}`;
      
      // Cek cache terlebih dahulu
      let animeData = cacheService.get(cacheKey)?.data;
      if (!animeData) {
        animeData = await scrapeService.scrapeAllAnime(season, year ? parseInt(year) : null);
        cacheService.set(animeData, cacheKey);
      }

      // Sort data
      const sortedData = scrapeService._sortAnimeData(animeData, sortBy, order);

      res.json(formatResponse({
        success: true,
        data: sortedData,
        total: sortedData.length,
        sortBy: sortBy,
        order: order,
        season: season || 'current',
        year: year || 'current',
        cached: true
      }));
    } catch (error) {
      console.error('Error in sortAnime:', error);
      res.status(500).json(formatResponse({
        success: false,
        error: error.message
      }));
    }
  },

  /**
   * GET /api/movie/sort - Sort movie data
   * Query params: ?sortBy=rating&order=desc&season=fall&year=2025
   */
  async sortMovies(req, res) {
    try {
      const { sortBy = 'rating', order = 'desc', season, year } = req.query;
      
      // Validate sortBy parameter
      const validSortOptions = ['rating', 'title', 'episodes', 'airdates'];
      if (!validSortOptions.includes(sortBy.toLowerCase())) {
        return res.status(400).json(formatResponse({
          success: false,
          error: `Invalid sortBy. Must be one of: ${validSortOptions.join(', ')}`
        }));
      }

      // Validate order parameter
      const validOrderOptions = ['asc', 'desc'];
      if (!validOrderOptions.includes(order.toLowerCase())) {
        return res.status(400).json(formatResponse({
          success: false,
          error: `Invalid order. Must be 'asc' or 'desc'`
        }));
      }

      // Buat cache key berdasarkan season dan year
      const cacheKey = `movie-${season || 'current'}-${year || 'current'}`;
      
      // Cek cache terlebih dahulu
      let movieData = cacheService.get(cacheKey)?.data;
      if (!movieData) {
        movieData = await scrapeService.scrapeAllMovies(season, year ? parseInt(year) : null);
        cacheService.set(movieData, cacheKey);
      }

      // Sort data
      const sortedData = scrapeService._sortAnimeData(movieData, sortBy, order);

      res.json(formatResponse({
        success: true,
        data: sortedData,
        total: sortedData.length,
        sortBy: sortBy,
        order: order,
        season: season || 'current',
        year: year || 'current',
        type: 'movie',
        cached: true
      }));
    } catch (error) {
      console.error('Error in sortMovies:', error);
      res.status(500).json(formatResponse({
        success: false,
        error: error.message
      }));
    }
  },

  /**
   * GET /api/ova/sort - Sort OVA data
   * Query params: ?sortBy=rating&order=desc&season=fall&year=2025
   */
  async sortOVAs(req, res) {
    try {
      const { sortBy = 'rating', order = 'desc', season, year } = req.query;
      
      // Validate sortBy parameter
      const validSortOptions = ['rating', 'title', 'episodes', 'airdates'];
      if (!validSortOptions.includes(sortBy.toLowerCase())) {
        return res.status(400).json(formatResponse({
          success: false,
          error: `Invalid sortBy. Must be one of: ${validSortOptions.join(', ')}`
        }));
      }

      // Validate order parameter
      const validOrderOptions = ['asc', 'desc'];
      if (!validOrderOptions.includes(order.toLowerCase())) {
        return res.status(400).json(formatResponse({
          success: false,
          error: `Invalid order. Must be 'asc' or 'desc'`
        }));
      }

      // Buat cache key berdasarkan season dan year
      const cacheKey = `ova-${season || 'current'}-${year || 'current'}`;
      
      // Cek cache terlebih dahulu
      let ovaData = cacheService.get(cacheKey)?.data;
      if (!ovaData) {
        ovaData = await scrapeService.scrapeAllOVAs(season, year ? parseInt(year) : null);
        cacheService.set(ovaData, cacheKey);
      }

      // Sort data
      const sortedData = scrapeService._sortAnimeData(ovaData, sortBy, order);

      res.json(formatResponse({
        success: true,
        data: sortedData,
        total: sortedData.length,
        sortBy: sortBy,
        order: order,
        season: season || 'current',
        year: year || 'current',
        type: 'ova',
        cached: true
      }));
    } catch (error) {
      console.error('Error in sortOVAs:', error);
      res.status(500).json(formatResponse({
        success: false,
        error: error.message
      }));
    }
  }
};

module.exports = animeController;
