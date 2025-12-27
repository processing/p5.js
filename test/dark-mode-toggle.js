/**
 * Dark/Light Mode Toggle for p5.js Test Interfaces
 *
 * This module provides a dark/light mode toggle functionality that:
 * - Allows one-click theme switching
 * - Persists user preference in localStorage
 * - Works for both anonymous and logged-in users
 * - Applies theme to background, sidebar, and code panels
 */

(function() {
  'use strict';

  // Theme configuration
  var THEME_STORAGE_KEY = 'p5js-theme-preference';
  var DARK_THEME_CLASS = 'dark-mode';
  var LIGHT_THEME_CLASS = 'light-mode';

  // Get current theme from localStorage or default to light
  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) || 'light';
    } catch (e) {
      return 'light';
    }
  }

  // Save theme preference to localStorage
  function saveTheme(theme) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      // localStorage might not be available, silently fail
      console.warn('Could not save theme preference:', e);
    }
  }

  // Apply theme to document
  function applyTheme(theme) {
    var html = document.documentElement;
    var body = document.body;

    // Remove existing theme classes
    html.classList.remove(DARK_THEME_CLASS, LIGHT_THEME_CLASS);
    body.classList.remove(DARK_THEME_CLASS, LIGHT_THEME_CLASS);

    // Add new theme class
    html.classList.add(theme === 'dark' ? DARK_THEME_CLASS : LIGHT_THEME_CLASS);
    body.classList.add(theme === 'dark' ? DARK_THEME_CLASS : LIGHT_THEME_CLASS);

    // Save preference
    saveTheme(theme);
  }

  // Toggle between dark and light themes
  function toggleTheme() {
    var currentTheme = getStoredTheme();
    var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    updateToggleButton(newTheme);
    return newTheme;
  }

  // Create and insert toggle button
  function createToggleButton() {
    var button = document.createElement('button');
    button.id = 'theme-toggle';
    button.className = 'theme-toggle-button';
    button.setAttribute('aria-label', 'Toggle dark/light mode');
    button.setAttribute('title', 'Toggle dark/light mode');

    // Set initial icon based on current theme
    var currentTheme = getStoredTheme();
    updateToggleButton(currentTheme, button);

    // Add click handler
    button.addEventListener('click', function() {
      toggleTheme();
    });

    // Insert button into page
    // Try to find a good location (header, stats area, etc.)
    var stats = document.getElementById('mocha-stats');
    if (stats) {
      stats.appendChild(button);
    } else {
      // Fallback: insert at top of body
      var header = document.querySelector('header') || document.body;
      if (header) {
        header.style.position = 'relative';
        header.appendChild(button);
      } else {
        document.body.insertBefore(button, document.body.firstChild);
      }
    }

    return button;
  }

  // Update toggle button icon and aria-label
  function updateToggleButton(theme, button) {
    button = button || document.getElementById('theme-toggle');
    if (!button) return;

    // Update icon (using Unicode symbols for simplicity)
    if (theme === 'dark') {
      button.textContent = '☀️';
      button.setAttribute('aria-label', 'Switch to light mode');
      button.setAttribute('title', 'Switch to light mode');
    } else {
      button.textContent = '🌙';
      button.setAttribute('aria-label', 'Switch to dark mode');
      button.setAttribute('title', 'Switch to dark mode');
    }
  }

  // Initialize dark mode on page load
  function initDarkMode() {
    // Apply stored theme or default
    var theme = getStoredTheme();
    applyTheme(theme);

    // Create toggle button
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createToggleButton);
    } else {
      createToggleButton();
    }
  }

  // Export for external use if needed
  window.p5DarkMode = {
    toggle: toggleTheme,
    setTheme: applyTheme,
    getTheme: getStoredTheme,
    init: initDarkMode
  };

  // Auto-initialize
  initDarkMode();
})();

