// Time Tracker Extension - Content Script
// Minimal content script for debugging and future enhancements

'use strict';

// Log current page for debugging
console.log('Time Tracker: Tracking page -', window.location.href);

// Future: This script can be used for:
// - Page-specific time tracking enhancements
// - User interaction tracking
// - Productivity features
// - Site-specific notifications

// Example: Track when user is actively scrolling or clicking
let isActive = false;
let activityTimeout;

function resetActivityTimeout() {
  isActive = true;
  clearTimeout(activityTimeout);
  activityTimeout = setTimeout(() => {
    isActive = false;
    console.log('Time Tracker: User inactive on', window.location.href);
  }, 300000); // 5 minutes of inactivity
}

// Track user activity
document.addEventListener('scroll', resetActivityTimeout, { passive: true });
document.addEventListener('click', resetActivityTimeout, { passive: true });
document.addEventListener('keypress', resetActivityTimeout, { passive: true });

// Initialize activity tracking
resetActivityTimeout();


