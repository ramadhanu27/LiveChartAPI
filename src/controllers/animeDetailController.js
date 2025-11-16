const fs = require('fs').promises;
const path = require('path');
const animeDetailService = require('../services/animeDetailService');
const cacheService = require('../services/cacheService');
const { formatResponse } = require('../utils/dataFormatter');

/**
 * Controller untuk anime detail endpoints
 */

const animeDetailController = {
  /**
   * GET /api/anime/detail/:id - Dapatkan detail anime lengkap
   */
  async getDetail(req, res) {
    try {
      const { id } = req.params;

      if (!id || id.length === 0) {
        return res.status(400).json(formatResponse({
          success: false,
          error: 'Anime ID diperlukan'
        }));
      }

      // Cek cache terlebih dahulu
      const cacheKey = `detail-${id}`;
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
      const detailData = await animeDetailService.scrapeAnimeDetail(id);
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
   * GET /api/anime/detail/:id/synopsis - Dapatkan synopsis saja
   */
  async getSynopsis(req, res) {
    try {
      const { id } = req.params;

      if (!id || id.length === 0) {
        return res.status(400).json(formatResponse({
          success: false,
          error: 'Anime ID diperlukan'
        }));
      }

      // Cek cache terlebih dahulu
      const cacheKey = `detail-${id}`;
      let detailData = cacheService.get(cacheKey)?.data;

      if (!detailData) {
        detailData = await animeDetailService.scrapeAnimeDetail(id);
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
   * GET /api/anime/detail/:id/streaming - Dapatkan info streaming
   */
  async getStreaming(req, res) {
    try {
      const { id } = req.params;

      if (!id || id.length === 0) {
        return res.status(400).json(formatResponse({
          success: false,
          error: 'Anime ID diperlukan'
        }));
      }

      // Cek cache terlebih dahulu
      const cacheKey = `detail-${id}`;
      let detailData = cacheService.get(cacheKey)?.data;

      if (!detailData) {
        detailData = await animeDetailService.scrapeAnimeDetail(id);
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
   * GET /api/anime/detail/:id/stats - Dapatkan statistik anime
   */
  async getStats(req, res) {
    try {
      const { id } = req.params;

      if (!id || id.length === 0) {
        return res.status(400).json(formatResponse({
          success: false,
          error: 'Anime ID diperlukan'
        }));
      }

      // Cek cache terlebih dahulu
      const cacheKey = `detail-${id}`;
      let detailData = cacheService.get(cacheKey)?.data;

      if (!detailData) {
        detailData = await animeDetailService.scrapeAnimeDetail(id);
        cacheService.set(detailData, cacheKey);
      }

      res.json(formatResponse({
        success: true,
        data: {
          id: detailData.id,
          title: detailData.title,
          rating: detailData.rating,
          ratingsCount: detailData.ratingsCount,
          totalEpisodes: detailData.totalEpisodes,
          currentEpisode: detailData.currentEpisode,
          status: detailData.status
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
   * GET /api/detail/:id/export - Export detail anime ke JSON file
   */
  async exportToJSON(req, res) {
    try {
      const { id } = req.params;

      if (!id || id.length === 0) {
        return res.status(400).json(formatResponse({
          success: false,
          error: 'Anime ID diperlukan'
        }));
      }

      // Cek cache terlebih dahulu
      const cacheKey = `detail-${id}`;
      let detailData = cacheService.get(cacheKey)?.data;

      if (!detailData) {
        detailData = await animeDetailService.scrapeAnimeDetail(id);
        cacheService.set(detailData, cacheKey);
      }

      // Format data untuk export
      const exportData = {
        exportedAt: new Date().toISOString(),
        source: 'LiveChart API',
        anime: detailData
      };

      // Set response headers untuk download
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="anime_${id}_${detailData.title.replace(/\s+/g, '_')}.json"`);
      
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
   * POST /api/detail/export-multiple - Export multiple anime ke JSON file
   */
  async exportMultipleToJSON(req, res) {
    try {
      const { ids } = req.body;

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json(formatResponse({
          success: false,
          error: 'Array of anime IDs diperlukan dalam request body'
        }));
      }

      if (ids.length > 50) {
        return res.status(400).json(formatResponse({
          success: false,
          error: 'Maximum 50 anime IDs per request'
        }));
      }

      // Dapatkan detail untuk semua anime
      const animeDetails = [];
      for (const id of ids) {
        try {
          const cacheKey = `detail-${id}`;
          let detailData = cacheService.get(cacheKey)?.data;

          if (!detailData) {
            detailData = await animeDetailService.scrapeAnimeDetail(id);
            cacheService.set(detailData, cacheKey);
          }

          animeDetails.push(detailData);
        } catch (err) {
          console.warn(`⚠️ Failed to scrape anime ${id}:`, err.message);
        }
      }

      // Format data untuk export
      const exportData = {
        exportedAt: new Date().toISOString(),
        source: 'LiveChart API',
        totalAnime: animeDetails.length,
        anime: animeDetails
      };

      // Set response headers untuk download
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="anime_export_${new Date().getTime()}.json"`);
      
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

module.exports = animeDetailController;
