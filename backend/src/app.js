const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const config = require('./config');
const logger = require('./utils/logger');

// Import routes
const licenseRoutes = require('./routes/license');
const downloadRoutes = require('./routes/download');
const statsRoutes = require('./routes/stats');
const scriptRoutes = require('./routes/scripts');

// Create Express app
const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: config.corsOrigin,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindow * 60 * 1000, // 15 minutes
  max: config.rateLimitMax, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests, please try again later.'
  }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// HTTP request logging
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../../frontend')));

// Serve ja-netfilter files
app.use('/ja-netfilter', express.static(path.join(__dirname, '../../../idea-set')));

// API routes
app.use('/api/v1/license', licenseRoutes);
app.use('/api/v1/download', downloadRoutes);
app.use('/api/v1/stats', statsRoutes);
app.use('/api/v1/scripts', scriptRoutes);

// Direct activation endpoint (for irm ... | iex)
app.use('/activate', scriptRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });

  res.status(err.status || 500).json({
    success: false,
    error: config.nodeEnv === 'production' ? 'Internal server error' : err.message
  });
});

module.exports = app;
