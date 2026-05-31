const express = require('express');
const router = express.Router();
const licenseService = require('../services/licenseService');
const config = require('../config');

/**
 * GET /api/v1/scripts/activate
 * Generate activation script
 */
router.get('/activate', (req, res) => {
  try {
    const { os = 'windows' } = req.query;
    const baseUrl = config.siteUrl || `${req.protocol}://${req.get('host')}`;
    
    let script;
    let contentType;
    let filename;
    
    if (os === 'windows') {
      script = licenseService.generateWindowsScript(baseUrl);
      contentType = 'text/plain; charset=utf-8';
      filename = 'activate.ps1';
    } else {
      script = licenseService.generateUnixScript(baseUrl);
      contentType = 'text/plain; charset=utf-8';
      filename = 'activate.sh';
    }
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(script);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /activate
 * Direct activation endpoint (for irm ... | iex)
 */
router.get('/', (req, res) => {
  try {
    const userAgent = req.headers['user-agent'] || '';
    const baseUrl = config.siteUrl || `${req.protocol}://${req.get('host')}`;
    
    // Detect OS and return appropriate script
    if (userAgent.includes('Windows') || userAgent.includes('PowerShell')) {
      const script = licenseService.generateWindowsScript(baseUrl);
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.send(script);
    } else {
      const script = licenseService.generateUnixScript(baseUrl);
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.send(script);
    }
  } catch (error) {
    res.status(500).send('echo "Error generating script"');
  }
});

module.exports = router;
