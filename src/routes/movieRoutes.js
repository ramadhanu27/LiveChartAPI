const express = require('express');
const animeController = require('../controllers/animeController');

const router = express.Router();

/**
 * Movie Routes
 */

// Sort endpoints (harus di atas generic routes)
router.get('/sort', animeController.sortMovies);

// GET /api/movie - Dapatkan semua movie (support query: ?season=fall&year=2025)
router.get('/', animeController.getAllMovies);

// POST /api/movie/refresh - Refresh movie cache (support query: ?season=fall&year=2025)
router.post('/refresh', animeController.refreshMovies);

module.exports = router;
