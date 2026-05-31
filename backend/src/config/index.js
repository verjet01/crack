require('dotenv').config();

const config = {
  // Server
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  dbPath: process.env.DB_PATH || './data/database.sqlite',
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
  logFile: process.env.LOG_FILE || './logs/app.log',
  
  // Security
  corsOrigin: process.env.CORS_ORIGIN || '*',
  rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '15', 10),
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  
  // Site
  siteName: process.env.SITE_NAME || 'IDEActivation',
  siteUrl: process.env.SITE_URL || 'http://localhost:3000',
  
  // Products
  products: {
    'II': { name: 'IntelliJ IDEA', code: 'II' },
    'CL': { name: 'CLion', code: 'CL' },
    'PS': { name: 'PhpStorm', code: 'PS' },
    'GO': { name: 'GoLand', code: 'GO' },
    'PC': { name: 'PyCharm', code: 'PC' },
    'WS': { name: 'WebStorm', code: 'WS' },
    'RD': { name: 'Rider', code: 'RD' },
    'DB': { name: 'DataGrip', code: 'DB' },
    'RM': { name: 'RubyMine', code: 'RM' },
    'AC': { name: 'AppCode', code: 'AC' },
    'DS': { name: 'DataSpell', code: 'DS' },
    'RR': { name: 'RustRover', code: 'RR' },
    'PCWMP': { name: 'Platform', code: 'PCWMP' },
    'PSI': { name: 'Platform Core', code: 'PSI' }
  }
};

module.exports = config;
