/**
 * Role-Based Dashboard System
 * Dynamically loads widgets based on user role
 */

const { ROLES, PERMISSIONS } = require('../auth/roles');

class RoleBasedDashboard {
  constructor(user, rbac) {
    this.user = user;
    this.rbac = rbac;
    this.role = user.role;
    this.widgets = [];
    this.layout = 'default';
    this.initializeDashboardForRole();
  }

  /**
   * Initialize dashboard widgets based on user role
   */
  initializeDashboardForRole() {
    switch (this.role) {
      case ROLES.INVESTOR:
      case ROLES.CUSTOMER:
        this.initializeInvestorDashboard();
        break;
      case ROLES.COMPANY:
        this.initializeCompanyDashboard();
        break;
      case ROLES.BROKER:
        this.initializeBrokerDashboard();
        break;
      case ROLES.SUB_BROKER:
        this.initializeSubBrokerDashboard();
        break;
      case ROLES.TRADER:
        this.initializeTraderDashboard();
        break;
      default:
        this.initializeDefaultDashboard();
    }
  }

  /**
   * Initialize dashboard for Investor/Customer role
   */
  initializeInvestorDashboard() {
    this.addWidget({
      id: 'investment_portfolio',
      title: 'My Investment Portfolio',
      type: 'chart',
      icon: 'portfolio',
      description: 'View your investment allocation',
      data: {
        totalInvested: this.user.profile.investmentAmount || 0,
        currentValue: 0,
        gainLoss: 0,
        gainLossPercent: 0
      }
    });

    this.addWidget({
      id: 'fund_performance',
      title: 'Fund Performance',
      type: 'chart',
      icon: 'trending',
      description: 'Track your investment performance',
      data: []
    });

    this.addWidget({
      id: 'recent_transactions',
      title: 'Recent Transactions',
      type: 'table',
      icon: 'transaction',
      description: 'View your recent trades and transfers',
      data: []
    });

    this.addWidget({
      id: 'account_balance',
      title: 'Account Balance',
      type: 'metric',
      icon: 'wallet',
      description: 'Current investment balance',
      data: {
        balance: 0,
        currency: 'USD',
        investmentAmount: this.user.profile.investmentAmount || 0
      }
    });

    this.addWidget({
      id: 'available_funds',
      title: 'Available Funds to Trade',
      type: 'table',
      icon: 'funds',
      description: 'Funds available for trading',
      data: []
    });

    this.addWidget({
      id: 'market_news',
      title: 'Market Updates',
      type: 'list',
      icon: 'news',
      description: 'Latest market news and alerts',
      data: []
    });
  }

  /**
   * Initialize dashboard for Company Admin role
   */
  initializeCompanyDashboard() {
    this.addWidget({
      id: 'platform_overview',
      title: 'Platform Overview',
      type: 'metric',
      icon: 'chart',
      description: 'Overall platform statistics',
      data: {
        totalUsers: 0,
        activeTraders: 0,
        totalAssets: 0,
        currency: 'USD'
      }
    });

    this.addWidget({
      id: 'units_management',
      title: 'Units Management',
      type: 'table',
      icon: 'package',
      description: 'Create and manage trading units',
      data: []
    });

    this.addWidget({
      id: 'unit_distribution',
      title: 'Unit Distribution',
      type: 'chart',
      icon: 'distribution',
      description: 'Track unit allocation to brokers',
      data: []
    });

    this.addWidget({
      id: 'all_trades',
      title: 'All Platform Trades',
      type: 'table',
      icon: 'trades',
      description: 'View all trades on the platform',
      data: []
    });

    this.addWidget({
      id: 'brokers_management',
      title: 'Brokers Management',
      type: 'table',
      icon: 'users',
      description: 'Manage broker accounts and commissions',
      data: []
    });

    this.addWidget({
      id: 'platform_analytics',
      title: 'Platform Analytics',
      type: 'chart',
      icon: 'analytics',
      description: 'Detailed platform performance metrics',
      data: []
    });

    this.addWidget({
      id: 'company_trades',
      title: 'Company Trades',
      type: 'table',
      icon: 'trade',
      description: 'Execute and manage company trades',
      data: []
    });
  }

  /**
   * Initialize dashboard for Broker role
   */
  initializeBrokerDashboard() {
    this.addWidget({
      id: 'broker_overview',
      title: 'Broker Overview',
      type: 'metric',
      icon: 'chart',
      description: 'Your broker statistics',
      data: {
        subBrokers: 0,
        activeTraders: 0,
        assetsUnderManagement: 0,
        currency: 'USD'
      }
    });

    this.addWidget({
      id: 'sub_brokers',
      title: 'Sub Brokers Management',
      type: 'table',
      icon: 'users',
      description: 'Manage your sub-brokers',
      data: []
    });

    this.addWidget({
      id: 'broker_trades',
      title: 'Broker Trades',
      type: 'table',
      icon: 'trades',
      description: 'View all trades under your management',
      data: []
    });

    this.addWidget({
      id: 'broker_analytics',
      title: 'Broker Analytics',
      type: 'chart',
      icon: 'analytics',
      description: 'Your broker performance metrics',
      data: []
    });

    this.addWidget({
      id: 'commissions',
      title: 'Commissions Earned',
      type: 'metric',
      icon: 'money',
      description: 'Track your commissions',
      data: {
        totalCommission: 0,
        currency: 'USD'
      }
    });
  }

  /**
   * Initialize dashboard for Sub Broker role
   */
  initializeSubBrokerDashboard() {
    this.addWidget({
      id: 'subbroker_overview',
      title: 'Sub Broker Overview',
      type: 'metric',
      icon: 'chart',
      description: 'Your sub-broker statistics',
      data: {
        clients: 0,
        activeTraders: 0,
        assetsUnderManagement: 0,
        currency: 'USD'
      }
    });

    this.addWidget({
      id: 'client_details',
      title: 'Client Details',
      type: 'table',
      icon: 'clients',
      description: 'View and manage your client accounts',
      data: []
    });

    this.addWidget({
      id: 'can_trade',
      title: 'Execute Trades',
      type: 'table',
      icon: 'trade',
      description: 'Execute trades for your clients',
      data: []
    });

    this.addWidget({
      id: 'subbroker_trades',
      title: 'Sub Broker Trades',
      type: 'table',
      icon: 'trades',
      description: 'All trades under your management',
      data: []
    });

    this.addWidget({
      id: 'client_performance',
      title: 'Client Performance',
      type: 'chart',
      icon: 'analytics',
      description: 'Analyze your client portfolio performance',
      data: []
    });

    this.addWidget({
      id: 'subbroker_settings',
      title: 'Sub Broker Settings',
      type: 'form',
      icon: 'settings',
      description: 'Manage your sub-broker settings',
      data: {}
    });
  }

  /**
   * Initialize dashboard for Trader role
   */
  initializeTraderDashboard() {
    this.addWidget({
      id: 'trader_portfolio',
      title: 'My Trading Portfolio',
      type: 'chart',
      icon: 'portfolio',
      description: 'View your trading positions',
      data: {}
    });

    this.addWidget({
      id: 'my_trades',
      title: 'My Trades',
      type: 'table',
      icon: 'trades',
      description: 'View your trading history',
      data: []
    });

    this.addWidget({
      id: 'trading_account',
      title: 'Trading Account',
      type: 'metric',
      icon: 'wallet',
      description: 'Your trading account balance',
      data: {
        balance: 0,
        currency: 'USD'
      }
    });

    this.addWidget({
      id: 'market_watch',
      title: 'Market Watch',
      type: 'table',
      icon: 'chart',
      description: 'Monitor market trends',
      data: []
    });
  }

  /**
   * Initialize default dashboard
   */
  initializeDefaultDashboard() {
    this.addWidget({
      id: 'welcome',
      title: 'Welcome',
      type: 'text',
      data: { message: 'Welcome to Trade Bot' }
    });
  }

  /**
   * Add a widget to the dashboard
   */
  addWidget(widget) {
    if (!widget.id || !widget.title) {
      throw new Error('Widget must have id and title');
    }
    this.widgets.push(widget);
  }

  /**
   * Remove a widget from the dashboard
   */
  removeWidget(widgetId) {
    this.widgets = this.widgets.filter(w => w.id !== widgetId);
  }

  /**
   * Update widget data
   */
  updateWidgetData(widgetId, newData) {
    const widget = this.widgets.find(w => w.id === widgetId);
    if (widget) {
      widget.data = { ...widget.data, ...newData };
    }
  }

  /**
   * Get dashboard state
   */
  getDashboardState() {
    return {
      user: {
        username: this.user.username,
        role: this.user.role,
        roleDisplay: this.rbac.getRoleDisplayName(this.user.role),
        profile: this.user.profile
      },
      layout: this.layout,
      widgets: this.widgets,
      lastUpdated: new Date()
    };
  }

  /**
   * Render dashboard as HTML
   */
  renderHTML() {
    const roleDisplay = this.rbac.getRoleDisplayName(this.role);
    let html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Trade Bot Dashboard - ${roleDisplay}</title>
        <link rel="stylesheet" href="/styles/dashboard.css">
        <link rel="stylesheet" href="/styles/role-dashboard.css">
      </head>
      <body>
        <nav class="navbar">
          <div class="navbar-brand">
            <h1>Trade Bot</h1>
            <span class="role-badge">${roleDisplay}</span>
          </div>
          <div class="user-menu">
            <div class="user-info">
              <span>${this.user.profile.firstName || this.user.username}</span>
              <small>${this.user.email}</small>
            </div>
            <button id="logout" class="btn-logout">Logout</button>
          </div>
        </nav>
        <main class="dashboard-container">
          <div class="dashboard-grid">
    `;

    this.widgets.forEach(widget => {
      html += this.renderWidget(widget);
    });

    html += `
          </div>
        </main>
        <script src="/scripts/dashboard.js"></script>
      </body>
      </html>
    `;

    return html;
  }

  /**
   * Render individual widget
   */
  renderWidget(widget) {
    const icon = widget.icon ? `<span class="widget-icon">${widget.icon}</span>` : '';
    return `
      <div class="widget ${widget.type}" id="${widget.id}">
        <div class="widget-header">
          ${icon}
          <h3>${widget.title}</h3>
          ${widget.description ? `<p class="widget-description">${widget.description}</p>` : ''}
        </div>
        <div class="widget-content">
          ${this.renderWidgetContent(widget)}
        </div>
      </div>
    `;
  }

  /**
   * Render widget content based on type
   */
  renderWidgetContent(widget) {
    switch (widget.type) {
      case 'metric':
        const metrics = Object.entries(widget.data)
          .filter(([key]) => key !== 'currency')
          .map(([key, value]) => `<div class="metric-item"><strong>${key}:</strong> ${value}</div>`)
          .join('');
        return `<div class="metrics">${metrics}</div>`;
      case 'chart':
        return '<div class="chart-placeholder">📊 Chart Loading...</div>';
      case 'table':
        return '<table><thead><tr><th>Column 1</th><th>Column 2</th><th>Action</th></tr></thead><tbody></tbody></table>';
      case 'list':
        return '<ul id="items-list"></ul>';
      case 'form':
        return '<form id="settings-form"></form>';
      case 'text':
        return `<p>${widget.data.message}</p>`;
      default:
        return '<p>Widget content</p>';
    }
  }
}

module.exports = RoleBasedDashboard;
