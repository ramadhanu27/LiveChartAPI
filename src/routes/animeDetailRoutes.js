const express = require('express');
const animeDetailController = require('../controllers/animeDetailController');

const router = express.Router();

/**
 * Anime Detail Routes
 */

// Export endpoints (harus di atas karena lebih spesifik)
router.post('/export-multiple', animeDetailController.exportMultipleToJSON);
router.get('/:id/export', animeDetailController.exportToJSON);

// GET /api/detail/:id - Dapatkan detail anime lengkap
router.get('/:id', animeDetailController.getDetail);

// GET /api/detail/:id/synopsis - Dapatkan synopsis
router.get('/:id/synopsis', animeDetailController.getSynopsis);

// GET /api/detail/:id/streaming - Dapatkan info streaming
router.get('/:id/streaming', animeDetailController.getStreaming);

// GET /api/detail/:id/stats - Dapatkan statistik
router.get('/:id/stats', animeDetailController.getStats);

module.exports = router;
