const config = require('../config');

/**
 * Simple logger - no external dependencies
 * Compatible with Vercel Serverless environment
 */

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

const currentLevel = LOG_LEVELS[config.logLevel] || LOG_LEVELS.info;

function formatMessage(level, message, meta) {
  var timestamp = new Date().toISOString();
  var metaStr = (meta && Object.keys(meta).length > 0) ? ' ' + JSON.stringify(meta) : '';
  return timestamp + ' [' + level.toUpperCase() + ']: ' + message + metaStr;
}

var logger = {
  error: function(message, meta) {
    if (currentLevel >= LOG_LEVELS.error) {
      console.error(formatMessage('error', message, meta));
    }
  },
  
  warn: function(message, meta) {
    if (currentLevel >= LOG_LEVELS.warn) {
      console.warn(formatMessage('warn', message, meta));
    }
  },
  
  info: function(message, meta) {
    if (currentLevel >= LOG_LEVELS.info) {
      console.log(formatMessage('info', message, meta));
    }
  },
  
  debug: function(message, meta) {
    if (currentLevel >= LOG_LEVELS.debug) {
      console.log(formatMessage('debug', message, meta));
    }
  }
};

module.exports = logger;
