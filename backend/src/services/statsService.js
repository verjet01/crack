const logger = require('../utils/logger');

class StatsService {
  constructor() {
    // In-memory stats (in production, use database)
    this.stats = {
      today: {
        date: this.getTodayDate(),
        total: 0,
        windows: 0,
        mac: 0,
        linux: 0
      },
      total: {
        activations: 0,
        uniqueUsers: new Set()
      }
    };
  }

  /**
   * Get today's date string
   * @returns {string} Date string (YYYY-MM-DD)
   */
  getTodayDate() {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  /**
   * Reset daily stats if needed
   */
  resetDailyStatsIfNeeded() {
    const today = this.getTodayDate();
    if (this.stats.today.date !== today) {
      this.stats.today = {
        date: today,
        total: 0,
        windows: 0,
        mac: 0,
        linux: 0
      };
    }
  }

  /**
   * Record an activation
   * @param {Object} data - Activation data
   * @param {string} data.os - Operating system
   * @param {string} data.ip - IP address
   */
  recordActivation(data) {
    this.resetDailyStatsIfNeeded();

    const { os = 'unknown', ip = 'unknown' } = data;

    // Update daily stats
    this.stats.today.total++;
    if (os === 'windows') {
      this.stats.today.windows++;
    } else if (os === 'mac') {
      this.stats.today.mac++;
    } else if (os === 'linux') {
      this.stats.today.linux++;
    }

    // Update total stats
    this.stats.total.activations++;
    this.stats.total.uniqueUsers.add(ip);

    logger.info('Activation recorded', { os, ip });
  }

  /**
   * Get usage statistics
   * @returns {Object} Usage statistics
   */
  getStats() {
    this.resetDailyStatsIfNeeded();

    return {
      today: { ...this.stats.today },
      total: {
        activations: this.stats.total.activations,
        uniqueUsers: this.stats.total.uniqueUsers.size
      }
    };
  }

  /**
   * Detect OS from user agent
   * @param {string} userAgent - User agent string
   * @returns {string} OS type
   */
  detectOS(userAgent) {
    if (!userAgent) return 'unknown';
    
    const ua = userAgent.toLowerCase();
    
    if (ua.includes('windows') || ua.includes('powershell')) {
      return 'windows';
    } else if (ua.includes('macintosh') || ua.includes('mac os')) {
      return 'mac';
    } else if (ua.includes('linux')) {
      return 'linux';
    }
    
    return 'unknown';
  }
}

module.exports = new StatsService();
