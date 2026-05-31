const express = require('express');
const router = express.Router();
const licenseService = require('../services/licenseService');
const statsService = require('../services/statsService');
const { validateGenerateRequest } = require('../utils/validator');
const logger = require('../utils/logger');

/**
 * POST /api/v1/license/generate
 * Generate a JetBrains activation code
 */
router.post('/generate', (req, res) => {
  try {
    // Validate request
    const validation = validateGenerateRequest(req.body);
    
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors
      });
    }

    // Generate license
    const result = licenseService.generateLicense(validation.data);

    // Record stats
    const os = statsService.detectOS(req.headers['user-agent']);
    statsService.recordActivation({
      os,
      ip: req.ip || req.connection.remoteAddress
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Generate license error', { error: error.message, stack: error.stack });
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * POST /api/v1/license/validate
 * Validate a license key
 */
router.post('/validate', (req, res) => {
  try {
    const { licenseKey } = req.body;

    if (!licenseKey) {
      return res.status(400).json({
        success: false,
        error: 'licenseKey is required'
      });
    }

    const result = licenseService.validateLicense(licenseKey);

    res.json({
      success: result.valid,
      data: result.valid ? result.data : null,
      error: result.error || null
    });
  } catch (error) {
    logger.error('Validate license error', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;
