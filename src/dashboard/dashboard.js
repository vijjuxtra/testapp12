/**
 * Dashboard Module
 * Manages dashboard home page and user interface
 */

class Dashboard {
  constructor(user) {
    this.user = user;
    this.widgets = [];
    this.layout = 'default';
    this.initializeDefaultWidgets();
  }

  /**
   * Initialize default dashboard widgets
   */
  initializeDefaultWidgets() {
    this.addWidget({
      id: 'portfolio_overview',
      title: 'Portfolio Overview',
      type: 'chart',
      data: {}
    });

    this.addWidget({
      id: 'recent_trades',
      title: 'Recent Trades',
      type: 'table',
      data: []
    });

    this.addWidget({
      id: 'account_balance',
      title: 'Account Balance',
      type: 'metric',
      data: {
        balance: 0,
        currency: 'USD'
      }
    });

    this.addWidget({
      id: 'market_alerts',
      title: 'Market Alerts',
      type: 'list',
      data: []
    });
  }

  /**
   * Add a widget to the dashboard
   * @param {Object} widget - Widget configuration
   */
  addWidget(widget) {
    if (!widget.id || !widget.title) {
      throw new Error('Widget must have id and title');
    }
    this.widgets.push(widget);
  }

  /**
   * Remove a widget from the dashboard
   * @param {string} widgetId - Widget ID
   */
  removeWidget(widgetId) {
    this.widgets = this.widgets.filter(w => w.id !== widgetId);
  }

  /**
   * Update widget data
   * @param {string} widgetId - Widget ID
   * @param {Object} newData - New data for widget
   */
  updateWidgetData(widgetId, newData) {
    const widget = this.widgets.find(w => w.id === widgetId);
    if (widget) {
      widget.data = { ...widget.data, ...newData };
    }
  }

  /**
   * Get dashboard state
   * @returns {Object} Current dashboard state
   */
  getDashboardState() {
    return {
      user: this.user.username,
      layout: this.layout,
      widgets: this.widgets,
      lastUpdated: new Date()
    };
  }

  /**
   * Render dashboard as HTML
   * @returns {string} HTML representation
   */
  renderHTML() {
    let html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Trade Bot Dashboard</title>
        <link rel="stylesheet" href="/styles/dashboard.css">
      </head>
      <body>
        <nav class="navbar">
          <h1>Trade Bot</h1>
          <div class="user-menu">
            <span>Welcome, ${this.user.username}</span>
            <button id="logout">Logout</button>
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
   * @param {Object} widget - Widget to render
   * @returns {string} HTML for widget
   */
  renderWidget(widget) {
    return `
      <div class="widget ${widget.type}" id="${widget.id}">
        <h3>${widget.title}</h3>
        <div class="widget-content">
          ${this.renderWidgetContent(widget)}
        </div>
      </div>
    `;
  }

  /**
   * Render widget content based on type
   * @param {Object} widget - Widget to render
   * @returns {string} HTML for widget content
   */
  renderWidgetContent(widget) {
    switch (widget.type) {
      case 'metric':
        return `<div class="metric">${widget.data.balance} ${widget.data.currency}</div>`;
      case 'chart':
        return '<div id="chart-placeholder">Loading chart...</div>';
      case 'table':
        return '<table><thead><tr><th>Trade</th><th>Amount</th><th>Status</th></tr></thead><tbody></tbody></table>';
      case 'list':
        return '<ul id="alerts-list"></ul>';
      default:
        return '<p>Widget content</p>';
    }
  }
}

module.exports = Dashboard;
