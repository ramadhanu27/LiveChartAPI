const express = require('express');
const animeController = require('../controllers/animeController');

const router = express.Router();

/**
 * Specific Routes (harus di atas karena lebih spesifik)
 */

// Info endpoints
router.get('/info/seasons', animeController.getSeasons);
router.get('/info/cache', animeController.getCacheInfo);

// Sort endpoints (harus di atas search karena lebih spesifik)
router.get('/sort', animeController.sortAnime);

// Search endpoints
router.get('/search/:title', animeController.search);

// Filter endpoints
router.get('/filter/status/:status', animeController.filterByStatus);

// Refresh endpoint
router.post('/refresh', animeController.refresh);

/**
 * Generic Routes (harus di bawah karena kurang spesifik)
 */

// GET /api/anime - Dapatkan semua anime (support query: ?season=fall&year=2025)
router.get('/', animeController.getAll);

// GET /api/anime/:id - Dapatkan anime by ID
router.get('/:id', animeController.getById);

module.exports = router;
