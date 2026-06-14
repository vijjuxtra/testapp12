/**
 * Main Application Entry Point
 */

const AuthSystem = require('./auth/auth');
const Dashboard = require('./dashboard/dashboard');

class TradeBot {
  constructor() {
    this.auth = new AuthSystem();
    this.dashboards = new Map();
  }

  /**
   * Initialize the application
   */
  start() {
    console.log('Trade Bot Application Starting...');
    console.log('Authentication System Initialized');
    console.log('Dashboard Module Ready');
  }

  /**
   * Create user dashboard after login
   * @param {string} username - Username
   * @param {Object} user - User object
   */
  createDashboard(username, user) {
    const dashboard = new Dashboard(user);
    this.dashboards.set(username, dashboard);
    return dashboard;
  }

  /**
   * Get user dashboard
   * @param {string} username - Username
   */
  getDashboard(username) {
    return this.dashboards.get(username);
  }
}

module.exports = TradeBot;
