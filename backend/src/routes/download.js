const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');

// Base path for ja-netfilter files
const JA_NETFILTER_PATH = path.join(__dirname, '../../../../idea-set');

/**
 * GET /api/v1/download/ja-netfilter/:filename
 * Download ja-netfilter files
 */
router.get('/ja-netfilter/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    
    // Security: prevent directory traversal
    if (filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid filename'
      });
    }

    const filePath = path.join(JA_NETFILTER_PATH, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      logger.warn('File not found', { filename });
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    // Get file stats
    const stats = fs.statSync(filePath);
    
    // Set response headers
    res.setHeader('Content-Type', 'application/java-archive');
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Stream file
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
    
    logger.info('File downloaded', { filename });
  } catch (error) {
    logger.error('Download error', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/v1/download/config/:filename
 * Download config files
 */
router.get('/config/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    
    // Security: prevent directory traversal
    if (filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid filename'
      });
    }

    const filePath = path.join(JA_NETFILTER_PATH, 'config', filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      logger.warn('Config file not found', { filename });
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    // Get file stats
    const stats = fs.statSync(filePath);
    
    // Set response headers
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Stream file
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
    
    logger.info('Config file downloaded', { filename });
  } catch (error) {
    logger.error('Download config error', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /api/v1/download/plugin/:filename
 * Download plugin files
 */
router.get('/plugin/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    
    // Security: prevent directory traversal
    if (filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid filename'
      });
    }

    const filePath = path.join(JA_NETFILTER_PATH, 'plugins', filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      logger.warn('Plugin file not found', { filename });
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }

    // Get file stats
    const stats = fs.statSync(filePath);
    
    // Set response headers
    res.setHeader('Content-Type', 'application/java-archive');
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Stream file
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
    
    logger.info('Plugin file downloaded', { filename });
  } catch (error) {
    logger.error('Download plugin error', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;
