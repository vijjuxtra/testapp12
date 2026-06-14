/**
 * Authentication Module
 * Handles user login, signup, and session management
 */

class AuthSystem {
  constructor() {
    this.users = new Map();
    this.sessions = new Map();
    this.sessionTimeout = 3600000; // 1 hour
  }

  /**
   * Register a new user
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @param {string} email - User's email
   * @returns {Object} Registration result
   */
  signup(username, password, email) {
    if (this.users.has(username)) {
      return { success: false, error: 'Username already exists' };
    }

    if (!this.validatePassword(password)) {
      return { success: false, error: 'Password must be at least 8 characters' };
    }

    const hashedPassword = this.hashPassword(password);
    this.users.set(username, {
      username,
      password: hashedPassword,
      email,
      createdAt: new Date(),
      verified: false
    });

    return { success: true, message: 'User registered successfully' };
  }

  /**
   * Login user
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @returns {Object} Login result with session token
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
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + this.sessionTimeout)
    };

    this.sessions.set(sessionToken, sessionData);

    return {
      success: true,
      token: sessionToken,
      user: {
        username: user.username,
        email: user.email
      }
    };
  }

  /**
   * Validate session token
   * @param {string} token - Session token
   * @returns {boolean} Token validity
   */
  validateSession(token) {
    const session = this.sessions.get(token);

    if (!session) {
      return false;
    }

    if (new Date() > session.expiresAt) {
      this.sessions.delete(token);
      return false;
    }

    return true;
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
