const express = require('express');
const statsController = require('../controllers/statsController');

const router = express.Router();

/**
 * Statistics Routes
 */

// GET /api/stats/total-anime - Total anime statistics
router.get('/total-anime', statsController.getTotalAnime);

// GET /api/stats/by-genre - Statistics by genre
router.get('/by-genre', statsController.getStatsByGenre);

// GET /api/stats/by-studio - Statistics by studio
router.get('/by-studio', statsController.getStatsByStudio);

// GET /api/stats/by-season - Statistics by season
router.get('/by-season', statsController.getStatsBySeason);

module.exports = router;
