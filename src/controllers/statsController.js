const statsService = require('../services/statsService');
const { formatResponse } = require('../utils/dataFormatter');

/**
 * Controller untuk statistics endpoints
 */

const statsController = {
  /**
   * GET /api/stats/total-anime - Total anime statistics
   */
  async getTotalAnime(req, res) {
    try {
      const { season, year } = req.query;

      const stats = await statsService.getTotalAnime(season, year ? parseInt(year) : null);

      res.json(formatResponse({
        success: true,
        data: stats
      }));
    } catch (error) {
      console.error('Error in getTotalAnime:', error);
      res.status(500).json(formatResponse({
        success: false,
        error: error.message
      }));
    }
  },

  /**
   * GET /api/stats/by-genre - Statistics by genre
   */
  async getStatsByGenre(req, res) {
    try {
      const { season, year } = req.query;

      const stats = await statsService.getStatsByGenre(season, year ? parseInt(year) : null);

      res.json(formatResponse({
        success: true,
        data: stats
      }));
    } catch (error) {
      console.error('Error in getStatsByGenre:', error);
      res.status(500).json(formatResponse({
        success: false,
        error: error.message
      }));
    }
  },

  /**
   * GET /api/stats/by-studio - Statistics by studio
   */
  async getStatsByStudio(req, res) {
    try {
      const { season, year } = req.query;

      const stats = await statsService.getStatsByStudio(season, year ? parseInt(year) : null);

      res.json(formatResponse({
        success: true,
        data: stats
      }));
    } catch (error) {
      console.error('Error in getStatsByStudio:', error);
      res.status(500).json(formatResponse({
        success: false,
        error: error.message
      }));
    }
  },

  /**
   * GET /api/stats/by-season - Statistics by season
   */
  async getStatsBySeason(req, res) {
    try {
      const stats = await statsService.getStatsBySeason();

      res.json(formatResponse({
        success: true,
        data: stats
      }));
    } catch (error) {
      console.error('Error in getStatsBySeason:', error);
      res.status(500).json(formatResponse({
        success: false,
        error: error.message
      }));
    }
  }
};

module.exports = statsController;
