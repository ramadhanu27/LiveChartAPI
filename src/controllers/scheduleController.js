const scheduleService = require('../services/scheduleService');
const { formatResponse } = require('../utils/dataFormatter');

/**
 * Controller untuk schedule endpoints
 */

const scheduleController = {
  /**
   * GET /api/schedule - Get full schedule
   */
  async getSchedule(req, res) {
    try {
      const { day } = req.query;

      let schedule;
      if (day) {
        schedule = await scheduleService.getScheduleByDay(day);
      } else {
        schedule = await scheduleService.getSchedule();
      }

      res.json(formatResponse({
        success: true,
        data: schedule
      }));
    } catch (error) {
      console.error('Error in getSchedule:', error);
      res.status(500).json(formatResponse({
        success: false,
        error: error.message
      }));
    }
  },

  /**
   * GET /api/schedule/today - Get today's schedule
   */
  async getTodaySchedule(req, res) {
    try {
      const schedule = await scheduleService.getTodaySchedule();

      res.json(formatResponse({
        success: true,
        data: schedule
      }));
    } catch (error) {
      console.error('Error in getTodaySchedule:', error);
      res.status(500).json(formatResponse({
        success: false,
        error: error.message
      }));
    }
  },

  /**
   * GET /api/schedule/upcoming - Get upcoming schedule (this week)
   */
  async getUpcomingSchedule(req, res) {
    try {
      const schedule = await scheduleService.getUpcomingSchedule();

      res.json(formatResponse({
        success: true,
        data: schedule
      }));
    } catch (error) {
      console.error('Error in getUpcomingSchedule:', error);
      res.status(500).json(formatResponse({
        success: false,
        error: error.message
      }));
    }
  },

  /**
   * GET /api/schedule/day/:day - Get schedule for specific day
   */
  async getScheduleByDay(req, res) {
    try {
      const { day } = req.params;

      const schedule = await scheduleService.getScheduleByDay(day);

      res.json(formatResponse({
        success: true,
        data: schedule
      }));
    } catch (error) {
      console.error('Error in getScheduleByDay:', error);
      res.status(400).json(formatResponse({
        success: false,
        error: error.message
      }));
    }
  }
};

module.exports = scheduleController;
