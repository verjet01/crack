const express = require('express');
const router = express.Router();
const statsService = require('../services/statsService');

/**
 * GET /api/v1/stats/usage
 * Get usage statistics
 */
router.get('/usage', (req, res) => {
  try {
    const stats = statsService.getStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;
