const express = require('express');
const animeController = require('../controllers/animeController');

const router = express.Router();

/**
 * OVA Routes
 */

// Sort endpoints (harus di atas generic routes)
router.get('/sort', animeController.sortOVAs);

// GET /api/ova - Dapatkan semua OVA (support query: ?season=fall&year=2025)
router.get('/', animeController.getAllOVAs);

// POST /api/ova/refresh - Refresh OVA cache (support query: ?season=fall&year=2025)
router.post('/refresh', animeController.refreshOVAs);

module.exports = router;
