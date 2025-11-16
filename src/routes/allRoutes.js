const express = require('express');
const animeController = require('../controllers/animeController');

const router = express.Router();

/**
 * All (Anime + Movie + OVA) Routes
 */

// GET /api/all - Dapatkan semua (support query: ?season=fall&year=2025)
router.get('/', animeController.getAll);

// POST /api/all/refresh - Refresh all cache (support query: ?season=fall&year=2025)
router.post('/refresh', animeController.refreshAll);

module.exports = router;
