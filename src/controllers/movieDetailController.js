const fs = require('fs').promises;
const path = require('path');
const movieDetailService = require('../services/movieDetailService');
const cacheService = require('../services/cacheService');
const { formatResponse } = require('../utils/dataFormatter');

/**
 * Controller untuk movie detail endpoints
 */

const movieDetailController = {
  /**
   * GET /api/movies/detail/:id - Dapatkan detail movie lengkap
   */
  async getDetail(req, res) {
    try {
      const { id } = req.params;

      if (!id || id.length === 0) {
        return res.status(400).json(formatResponse({
          success: false,
          error: 'Movie ID diperlukan'
        }));
      }

      // Cek cache terlebih dahulu
      const cacheKey = `movie-detail-${id}`;
      const cachedResult = cacheService.get(cacheKey);
      if (cachedResult) {
        return res.json(formatResponse({
          success: true,
          data: cachedResult.data,
          cached: true,
          timestamp: new Date(cachedResult.timestamp).toISOString()
        }));
      }

      // Scrape detail baru jika cache tidak ada
      const detailData = await movieDetailService.scrapeMovieDetail(id);
      cacheService.set(detailData, cacheKey);

      res.json(formatResponse({
        success: true,
        data: detailData,
        cached: false
      }));
    } catch (error) {
      console.error('Error in getDetail:', error);
      res.status(500).json(formatResponse({
        success: false,
        error: error.message
      }));
    }
  },

  /**
   * GET /api/movies/detail/:id/synopsis - Dapatkan synopsis saja
   */
  async getSynopsis(req, res) {
    try {
      const { id } = req.params;

      if (!id || id.length === 0) {
        return res.status(400).json(formatResponse({
          success: false,
          error: 'Movie ID diperlukan'
        }));
      }

      // Cek cache terlebih dahulu
      const cacheKey = `movie-detail-${id}`;
      let detailData = cacheService.get(cacheKey)?.data;

      if (!detailData) {
        detailData = await movieDetailService.scrapeMovieDetail(id);
        cacheService.set(detailData, cacheKey);
      }

      res.json(formatResponse({
        success: true,
        data: {
          id: detailData.id,
          title: detailData.title,
          synopsis: detailData.synopsis
        }
      }));
    } catch (error) {
      console.error('Error in getSynopsis:', error);
      res.status(500).json(formatResponse({
        success: false,
        error: error.message
      }));
    }
  },

  /**
   * GET /api/movies/detail/:id/streaming - Dapatkan info streaming
   */
  async getStreaming(req, res) {
    try {
      const { id } = req.params;

      if (!id || id.length === 0) {
        return res.status(400).json(formatResponse({
          success: false,
          error: 'Movie ID diperlukan'
        }));
      }

      // Cek cache terlebih dahulu
      const cacheKey = `movie-detail-${id}`;
      let detailData = cacheService.get(cacheKey)?.data;

      if (!detailData) {
        detailData = await movieDetailService.scrapeMovieDetail(id);
        cacheService.set(detailData, cacheKey);
      }

      res.json(formatResponse({
        success: true,
        data: {
          id: detailData.id,
          title: detailData.title,
          streaming: detailData.streaming,
          links: detailData.links
        }
      }));
    } catch (error) {
      console.error('Error in getStreaming:', error);
      res.status(500).json(formatResponse({
        success: false,
        error: error.message
      }));
    }
  },

  /**
   * GET /api/movies/detail/:id/stats - Dapatkan statistik movie
   */
  async getStats(req, res) {
    try {
      const { id } = req.params;

      if (!id || id.length === 0) {
        return res.status(400).json(formatResponse({
          success: false,
          error: 'Movie ID diperlukan'
        }));
      }

      // Cek cache terlebih dahulu
      const cacheKey = `movie-detail-${id}`;
      let detailData = cacheService.get(cacheKey)?.data;

      if (!detailData) {
        detailData = await movieDetailService.scrapeMovieDetail(id);
        cacheService.set(detailData, cacheKey);
      }

      res.json(formatResponse({
        success: true,
        data: {
          id: detailData.id,
          title: detailData.title,
          rating: detailData.rating,
          ratingsCount: detailData.ratingsCount,
          status: detailData.status,
          format: detailData.format
        }
      }));
    } catch (error) {
      console.error('Error in getStats:', error);
      res.status(500).json(formatResponse({
        success: false,
        error: error.message
      }));
    }
  },

  /**
   * GET /api/movies/detail/:id/export - Export detail movie ke JSON file
   */
  async exportToJSON(req, res) {
    try {
      const { id } = req.params;

      if (!id || id.length === 0) {
        return res.status(400).json(formatResponse({
          success: false,
          error: 'Movie ID diperlukan'
        }));
      }

      // Cek cache terlebih dahulu
      const cacheKey = `movie-detail-${id}`;
      let detailData = cacheService.get(cacheKey)?.data;

      if (!detailData) {
        detailData = await movieDetailService.scrapeMovieDetail(id);
        cacheService.set(detailData, cacheKey);
      }

      // Format data untuk export
      const exportData = {
        exportedAt: new Date().toISOString(),
        source: 'LiveChart API',
        type: 'movie',
        movie: detailData
      };

      // Set response headers untuk download
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="movie_${id}_${detailData.title.replace(/\s+/g, '_')}.json"`);
      
      // Send file
      res.send(JSON.stringify(exportData, null, 2));
    } catch (error) {
      console.error('Error in exportToJSON:', error);
      res.status(500).json(formatResponse({
        success: false,
        error: error.message
      }));
    }
  },

  /**
   * POST /api/movies/detail/export-multiple - Export multiple movies ke JSON file
   */
  async exportMultipleToJSON(req, res) {
    try {
      const { ids } = req.body;

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json(formatResponse({
          success: false,
          error: 'Array of movie IDs diperlukan dalam request body'
        }));
      }

      if (ids.length > 50) {
        return res.status(400).json(formatResponse({
          success: false,
          error: 'Maximum 50 movie IDs per request'
        }));
      }

      // Dapatkan detail untuk semua movies
      const movieDetails = [];
      for (const id of ids) {
        try {
          const cacheKey = `movie-detail-${id}`;
          let detailData = cacheService.get(cacheKey)?.data;

          if (!detailData) {
            detailData = await movieDetailService.scrapeMovieDetail(id);
            cacheService.set(detailData, cacheKey);
          }

          movieDetails.push(detailData);
        } catch (err) {
          console.warn(`⚠️ Failed to scrape movie ${id}:`, err.message);
        }
      }

      // Format data untuk export
      const exportData = {
        exportedAt: new Date().toISOString(),
        source: 'LiveChart API',
        type: 'movie',
        totalMovies: movieDetails.length,
        movies: movieDetails
      };

      // Set response headers untuk download
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="movies_export_${new Date().getTime()}.json"`);
      
      // Send file
      res.send(JSON.stringify(exportData, null, 2));
    } catch (error) {
      console.error('Error in exportMultipleToJSON:', error);
      res.status(500).json(formatResponse({
        success: false,
        error: error.message
      }));
    }
  }
};

module.exports = movieDetailController;
