const express = require('express');
const movieDetailController = require('../controllers/movieDetailController');

const router = express.Router();

/**
 * Movie Detail Routes
 */

// Export endpoints (harus di atas karena lebih spesifik)
router.post('/export-multiple', movieDetailController.exportMultipleToJSON);
router.get('/:id/export', movieDetailController.exportToJSON);

// GET /api/movies/detail/:id - Dapatkan detail movie lengkap
router.get('/:id', movieDetailController.getDetail);

// GET /api/movies/detail/:id/synopsis - Dapatkan synopsis
router.get('/:id/synopsis', movieDetailController.getSynopsis);

// GET /api/movies/detail/:id/streaming - Dapatkan info streaming
router.get('/:id/streaming', movieDetailController.getStreaming);

// GET /api/movies/detail/:id/stats - Dapatkan statistik
router.get('/:id/stats', movieDetailController.getStats);

module.exports = router;
