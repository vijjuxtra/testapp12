/**
 * Dashboard Client-Side Scripts
 */

(function() {
  'use strict';

  // Initialize dashboard when DOM is loaded
  document.addEventListener('DOMContentLoaded', initializeDashboard);

  function initializeDashboard() {
    console.log('Dashboard initialized');
    setupEventListeners();
    loadWidgetData();
  }

  function setupEventListeners() {
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', handleLogout);
    }
  }

  function loadWidgetData() {
    // Load data for each widget
    console.log('Loading widget data...');
  }

  function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
      // Perform logout
      window.location.href = '/logout';
    }
  }

  // Expose functions if needed
  window.Dashboard = {
    initialize: initializeDashboard,
    loadData: loadWidgetData
  };
})();
