const express = require('express');
const scheduleController = require('../controllers/scheduleController');

const router = express.Router();

/**
 * Schedule Routes
 */

// GET /api/schedule - Get full schedule
router.get('/', scheduleController.getSchedule);

// GET /api/schedule/today - Get today's schedule
router.get('/today', scheduleController.getTodaySchedule);

// GET /api/schedule/upcoming - Get upcoming schedule (this week)
router.get('/upcoming', scheduleController.getUpcomingSchedule);

// GET /api/schedule/day/:day - Get schedule for specific day
router.get('/day/:day', scheduleController.getScheduleByDay);

module.exports = router;
