/**
 * Application Configuration
 */

module.exports = {
  app: {
    name: 'Trade Bot',
    version: '1.0.0',
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || 'development'
  },
  auth: {
    sessionTimeout: 3600000, // 1 hour
    passwordMinLength: 8,
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key'
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'tradebot',
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'password'
  },
  api: {
    baseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
    timeout: 30000
  }
};
