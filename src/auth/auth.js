/**
 * Enhanced Authentication System with Role-Based Login
 * Handles user login, signup, and session management with role support
 */

const { RBACManager, ROLES } = require('./roles');

class AuthSystem {
  constructor() {
    this.users = new Map();
    this.sessions = new Map();
    this.sessionTimeout = 3600000; // 1 hour
    this.rbac = new RBACManager();
    this.initializeDefaultUsers();
  }

  /**
   * Initialize default test users for each role
   */
  initializeDefaultUsers() {
    // Default Investor/Customer account (default login)
    this.users.set('investor_demo', {
      username: 'investor_demo',
      password: this.hashPassword('password123'),
      email: 'investor@example.com',
      role: ROLES.INVESTOR,
      createdAt: new Date(),
      verified: true,
      profile: {
        firstName: 'John',
        lastName: 'Investor',
        phone: '+1-555-0001',
        investmentAmount: 50000
      }
    });

    // Company Admin
    this.users.set('company_admin', {
      username: 'company_admin',
      password: this.hashPassword('password123'),
      email: 'admin@company.com',
      role: ROLES.COMPANY,
      createdAt: new Date(),
      verified: true,
      profile: {
        firstName: 'Admin',
        lastName: 'Company',
        phone: '+1-555-0002',
        companyName: 'Trade Bot Company'
      }
    });

    // Broker
    this.users.set('broker_demo', {
      username: 'broker_demo',
      password: this.hashPassword('password123'),
      email: 'broker@example.com',
      role: ROLES.BROKER,
      createdAt: new Date(),
      verified: true,
      profile: {
        firstName: 'Robert',
        lastName: 'Broker',
        phone: '+1-555-0003',
        brokerCode: 'BR001'
      }
    });

    // Sub Broker
    this.users.set('subbroker_demo', {
      username: 'subbroker_demo',
      password: this.hashPassword('password123'),
      email: 'subbroker@example.com',
      role: ROLES.SUB_BROKER,
      createdAt: new Date(),
      verified: true,
      profile: {
        firstName: 'Susan',
        lastName: 'SubBroker',
        phone: '+1-555-0004',
        subBrokerCode: 'SB001'
      }
    });

    // Trader
    this.users.set('trader_demo', {
      username: 'trader_demo',
      password: this.hashPassword('password123'),
      email: 'trader@example.com',
      role: ROLES.TRADER,
      createdAt: new Date(),
      verified: true,
      profile: {
        firstName: 'Tom',
        lastName: 'Trader',
        phone: '+1-555-0005'
      }
    });
  }

  /**
   * Register a new user
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @param {string} email - User's email
   * @param {string} role - User's role (defaults to INVESTOR)
   * @param {Object} profile - User profile information
   * @returns {Object} Registration result
   */
  signup(username, password, email, role = ROLES.INVESTOR, profile = {}) {
    if (this.users.has(username)) {
      return { success: false, error: 'Username already exists' };
    }

    if (!this.validatePassword(password)) {
      return { success: false, error: 'Password must be at least 8 characters' };
    }

    if (!this.rbac.isValidRole(role)) {
      return { success: false, error: 'Invalid role specified' };
    }

    const hashedPassword = this.hashPassword(password);
    this.users.set(username, {
      username,
      password: hashedPassword,
      email,
      role,
      createdAt: new Date(),
      verified: false,
      profile: {
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || '',
        ...profile
      }
    });

    return { success: true, message: 'User registered successfully', role };
  }

  /**
   * Login user
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @returns {Object} Login result with session token and user details
   */
  login(username, password) {
    const user = this.users.get(username);

    if (!user) {
      return { success: false, error: 'Invalid username or password' };
    }

    if (!this.verifyPassword(password, user.password)) {
      return { success: false, error: 'Invalid username or password' };
    }

    const sessionToken = this.generateSessionToken();
    const sessionData = {
      username,
      role: user.role,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + this.sessionTimeout)
    };

    this.sessions.set(sessionToken, sessionData);

    return {
      success: true,
      token: sessionToken,
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
        roleDisplay: this.rbac.getRoleDisplayName(user.role),
        profile: user.profile
      },
      permissions: this.rbac.getPermissionsForRole(user.role)
    };
  }

  /**
   * Validate session token
   * @param {string} token - Session token
   * @returns {Object} Session validation result
   */
  validateSession(token) {
    const session = this.sessions.get(token);

    if (!session) {
      return { valid: false, error: 'Invalid session token' };
    }

    if (new Date() > session.expiresAt) {
      this.sessions.delete(token);
      return { valid: false, error: 'Session expired' };
    }

    const user = this.users.get(session.username);
    return {
      valid: true,
      username: session.username,
      role: session.role,
      user: user
    };
  }

  /**
   * Check user permissions
   * @param {string} token - Session token
   * @param {string} permission - Permission to check
   * @returns {boolean} Has permission
   */
  checkPermission(token, permission) {
    const sessionValidation = this.validateSession(token);
    if (!sessionValidation.valid) {
      return false;
    }
    return this.rbac.hasPermission(sessionValidation.role, permission);
  }

  /**
   * Get user details from token
   * @param {string} token - Session token
   * @returns {Object} User details
   */
  getUserDetails(token) {
    const sessionValidation = this.validateSession(token);
    if (!sessionValidation.valid) {
      return null;
    }
    const user = this.users.get(sessionValidation.username);
    return {
      username: user.username,
      email: user.email,
      role: user.role,
      roleDisplay: this.rbac.getRoleDisplayName(user.role),
      profile: user.profile,
      permissions: this.rbac.getPermissionsForRole(user.role)
    };
  }

  /**
   * Logout user
   * @param {string} token - Session token
   * @returns {Object} Logout result
   */
  logout(token) {
    if (this.sessions.has(token)) {
      this.sessions.delete(token);
      return { success: true, message: 'Logged out successfully' };
    }
    return { success: false, error: 'Invalid session token' };
  }

  /**
   * Get user by username (admin function)
   * @param {string} username - Username
   * @returns {Object} User details
   */
  getUser(username) {
    const user = this.users.get(username);
    if (!user) {
      return null;
    }
    return {
      username: user.username,
      email: user.email,
      role: user.role,
      profile: user.profile,
      createdAt: user.createdAt,
      verified: user.verified
    };
  }

  /**
   * Get all users by role (admin function)
   * @param {string} role - Filter by role
   * @returns {Array} Array of users
   */
  getUsersByRole(role) {
    return Array.from(this.users.values())
      .filter(user => user.role === role)
      .map(user => ({
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile,
        verified: user.verified
      }));
  }

  /**
   * Get all available demo users for testing
   * @returns {Array} Array of demo user credentials
   */
  getAvailableDemoUsers() {
    return [
      { username: 'investor_demo', password: 'password123', role: ROLES.INVESTOR },
      { username: 'company_admin', password: 'password123', role: ROLES.COMPANY },
      { username: 'broker_demo', password: 'password123', role: ROLES.BROKER },
      { username: 'subbroker_demo', password: 'password123', role: ROLES.SUB_BROKER },
      { username: 'trader_demo', password: 'password123', role: ROLES.TRADER }
    ];
  }

  // Helper methods
  validatePassword(password) {
    return password && password.length >= 8;
  }

  hashPassword(password) {
    // In production, use bcrypt or similar
    return Buffer.from(password).toString('base64');
  }

  verifyPassword(password, hash) {
    return this.hashPassword(password) === hash;
  }

  generateSessionToken() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}

module.exports = AuthSystem;
