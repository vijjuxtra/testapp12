/**
 * Role-Based Access Control (RBAC) System
 * Defines roles, permissions, and access levels for the Trade Bot
 */

const ROLES = {
  COMPANY: 'company',
  BROKER: 'broker',
  SUB_BROKER: 'sub_broker',
  TRADER: 'trader',
  CUSTOMER: 'customer',  // Investor
  INVESTOR: 'investor'   // Alias for customer
};

const PERMISSIONS = {
  // Company Admin permissions
  MANAGE_BROKERS: 'manage_brokers',
  VIEW_ALL_ACCOUNTS: 'view_all_accounts',
  VIEW_PLATFORM_ANALYTICS: 'view_platform_analytics',
  MANAGE_PLATFORM_SETTINGS: 'manage_platform_settings',
  VIEW_ALL_TRADES: 'view_all_trades',
  MANAGE_COMPANY_ADMINS: 'manage_company_admins',
  CREATE_UNITS: 'create_units',
  TRANSFER_UNITS: 'transfer_units',
  EXECUTE_COMPANY_TRADES: 'execute_company_trades',
  MANAGE_UNIT_DISTRIBUTION: 'manage_unit_distribution',

  // Broker permissions
  MANAGE_SUB_BROKERS: 'manage_sub_brokers',
  VIEW_BROKER_ACCOUNTS: 'view_broker_accounts',
  VIEW_BROKER_ANALYTICS: 'view_broker_analytics',
  MANAGE_BROKER_SETTINGS: 'manage_broker_settings',
  VIEW_BROKER_TRADES: 'view_broker_trades',

  // Sub-Broker permissions
  MANAGE_TRADERS: 'manage_traders',
  VIEW_SUB_BROKER_ACCOUNTS: 'view_sub_broker_accounts',
  VIEW_SUB_BROKER_ANALYTICS: 'view_sub_broker_analytics',
  VIEW_SUB_BROKER_TRADES: 'view_sub_broker_trades',
  MANAGE_SUB_BROKER_SETTINGS: 'manage_sub_broker_settings',
  EXECUTE_SUB_BROKER_TRADES: 'execute_sub_broker_trades',
  VIEW_CLIENT_DETAILS: 'view_client_details',
  MANAGE_CLIENT_ACCOUNTS: 'manage_client_accounts',

  // Trader permissions
  VIEW_OWN_ACCOUNT: 'view_own_account',
  EXECUTE_TRADES: 'execute_trades',
  VIEW_OWN_TRADES: 'view_own_trades',
  MANAGE_OWN_PROFILE: 'manage_own_profile',

  // Customer/Investor permissions
  VIEW_INVESTMENT_PORTFOLIO: 'view_investment_portfolio',
  VIEW_INVESTMENT_DETAILS: 'view_investment_details',
  EXECUTE_INVESTMENT_TRADES: 'execute_investment_trades',
  VIEW_INVESTMENT_PERFORMANCE: 'view_investment_performance',
  MANAGE_INVESTMENT_PROFILE: 'manage_investment_profile',
  VIEW_FUND_DETAILS: 'view_fund_details'
};

const ROLE_PERMISSIONS = {
  [ROLES.COMPANY]: [
    // All company admin permissions
    PERMISSIONS.MANAGE_BROKERS,
    PERMISSIONS.VIEW_ALL_ACCOUNTS,
    PERMISSIONS.VIEW_PLATFORM_ANALYTICS,
    PERMISSIONS.MANAGE_PLATFORM_SETTINGS,
    PERMISSIONS.VIEW_ALL_TRADES,
    PERMISSIONS.MANAGE_COMPANY_ADMINS,
    PERMISSIONS.CREATE_UNITS,
    PERMISSIONS.TRANSFER_UNITS,
    PERMISSIONS.EXECUTE_COMPANY_TRADES,
    PERMISSIONS.MANAGE_UNIT_DISTRIBUTION,
    PERMISSIONS.VIEW_OWN_ACCOUNT,
    PERMISSIONS.MANAGE_OWN_PROFILE
  ],

  [ROLES.BROKER]: [
    PERMISSIONS.MANAGE_SUB_BROKERS,
    PERMISSIONS.VIEW_BROKER_ACCOUNTS,
    PERMISSIONS.VIEW_BROKER_ANALYTICS,
    PERMISSIONS.MANAGE_BROKER_SETTINGS,
    PERMISSIONS.VIEW_BROKER_TRADES,
    PERMISSIONS.VIEW_OWN_ACCOUNT,
    PERMISSIONS.MANAGE_OWN_PROFILE
  ],

  [ROLES.SUB_BROKER]: [
    PERMISSIONS.MANAGE_TRADERS,
    PERMISSIONS.VIEW_SUB_BROKER_ACCOUNTS,
    PERMISSIONS.VIEW_SUB_BROKER_ANALYTICS,
    PERMISSIONS.VIEW_SUB_BROKER_TRADES,
    PERMISSIONS.MANAGE_SUB_BROKER_SETTINGS,
    PERMISSIONS.EXECUTE_SUB_BROKER_TRADES,
    PERMISSIONS.VIEW_CLIENT_DETAILS,
    PERMISSIONS.MANAGE_CLIENT_ACCOUNTS,
    PERMISSIONS.VIEW_OWN_ACCOUNT,
    PERMISSIONS.MANAGE_OWN_PROFILE
  ],

  [ROLES.TRADER]: [
    PERMISSIONS.VIEW_OWN_ACCOUNT,
    PERMISSIONS.EXECUTE_TRADES,
    PERMISSIONS.VIEW_OWN_TRADES,
    PERMISSIONS.MANAGE_OWN_PROFILE
  ],

  [ROLES.CUSTOMER]: [
    // Customer/Investor permissions
    PERMISSIONS.VIEW_INVESTMENT_PORTFOLIO,
    PERMISSIONS.VIEW_INVESTMENT_DETAILS,
    PERMISSIONS.EXECUTE_INVESTMENT_TRADES,
    PERMISSIONS.VIEW_INVESTMENT_PERFORMANCE,
    PERMISSIONS.MANAGE_INVESTMENT_PROFILE,
    PERMISSIONS.VIEW_FUND_DETAILS
  ],

  [ROLES.INVESTOR]: [
    // Same as Customer
    PERMISSIONS.VIEW_INVESTMENT_PORTFOLIO,
    PERMISSIONS.VIEW_INVESTMENT_DETAILS,
    PERMISSIONS.EXECUTE_INVESTMENT_TRADES,
    PERMISSIONS.VIEW_INVESTMENT_PERFORMANCE,
    PERMISSIONS.MANAGE_INVESTMENT_PROFILE,
    PERMISSIONS.VIEW_FUND_DETAILS
  ]
};

/**
 * Role-Based Access Control Manager
 */
class RBACManager {
  constructor() {
    this.roles = ROLES;
    this.permissions = PERMISSIONS;
    this.rolePermissions = ROLE_PERMISSIONS;
  }

  /**
   * Check if a user has a specific permission
   * @param {string} role - User role
   * @param {string} permission - Required permission
   * @returns {boolean} True if user has permission
   */
  hasPermission(role, permission) {
    const rolePerms = this.rolePermissions[role];
    return rolePerms ? rolePerms.includes(permission) : false;
  }

  /**
   * Check if a user has any of the required permissions
   * @param {string} role - User role
   * @param {array} permissions - Array of permissions to check
   * @returns {boolean} True if user has at least one permission
   */
  hasAnyPermission(role, permissions) {
    return permissions.some(perm => this.hasPermission(role, perm));
  }

  /**
   * Check if a user has all required permissions
   * @param {string} role - User role
   * @param {array} permissions - Array of permissions to check
   * @returns {boolean} True if user has all permissions
   */
  hasAllPermissions(role, permissions) {
    return permissions.every(perm => this.hasPermission(role, perm));
  }

  /**
   * Get all permissions for a role
   * @param {string} role - User role
   * @returns {array} Array of permissions
   */
  getPermissionsForRole(role) {
    return this.rolePermissions[role] || [];
  }

  /**
   * Validate if a role is valid
   * @param {string} role - Role to validate
   * @returns {boolean} True if role is valid
   */
  isValidRole(role) {
    return Object.values(this.roles).includes(role);
  }

  /**
   * Get role hierarchy level (higher = more privileges)
   * @param {string} role - User role
   * @returns {number} Hierarchy level
   */
  getRoleHierarchyLevel(role) {
    const hierarchy = {
      [ROLES.COMPANY]: 5,
      [ROLES.BROKER]: 4,
      [ROLES.SUB_BROKER]: 3,
      [ROLES.TRADER]: 2,
      [ROLES.CUSTOMER]: 1,
      [ROLES.INVESTOR]: 1
    };
    return hierarchy[role] || 0;
  }

  /**
   * Check if user can manage another role
   * @param {string} userRole - Manager's role
   * @param {string} targetRole - Role to manage
   * @returns {boolean} True if user can manage target role
   */
  canManageRole(userRole, targetRole) {
    const userLevel = this.getRoleHierarchyLevel(userRole);
    const targetLevel = this.getRoleHierarchyLevel(targetRole);
    return userLevel > targetLevel;
  }

  /**
   * Get role display name
   * @param {string} role - User role
   * @returns {string} Display name
   */
  getRoleDisplayName(role) {
    const displayNames = {
      [ROLES.COMPANY]: 'Company Admin',
      [ROLES.BROKER]: 'Broker',
      [ROLES.SUB_BROKER]: 'Sub Broker',
      [ROLES.TRADER]: 'Trader',
      [ROLES.CUSTOMER]: 'Investor',
      [ROLES.INVESTOR]: 'Investor'
    };
    return displayNames[role] || 'Unknown';
  }
}

module.exports = {
  ROLES,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  RBACManager
};
