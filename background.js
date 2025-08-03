// Time Tracker Extension - Background Service Worker
// Modern implementation with proper state management and Chrome Storage API

class TimeTracker {
  constructor() {
    this.currentSite = null;
    this.currentSiteStartTime = null;
    this.isTracking = false;
    this.init();
  }

  async init() {
    try {
      // Load existing data from storage
      await this.loadData();
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Start tracking if there's an active tab
      this.updateCurrentSite();
      
      console.log('Time Tracker initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Time Tracker:', error);
    }
  }

  setupEventListeners() {
    // Tab events
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete') {
        this.updateCurrentSite();
      }
    });

    chrome.tabs.onActivated.addListener((activeInfo) => {
      this.updateCurrentSite();
    });

    // Window focus events
    chrome.windows.onFocusChanged.addListener((windowId) => {
      if (windowId === chrome.windows.WINDOW_ID_NONE) {
        this.setCurrentSite(null);
      } else {
        this.updateCurrentSite();
      }
    });

    // Handle messages from popup and content scripts
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
      return true; // Keep message channel open for async response
    });
  }

  async handleMessage(request, sender, sendResponse) {
    try {
      switch (request.action) {
        case 'getData':
          const data = await this.getTrackingData();
          sendResponse({ success: true, data });
          break;
          
        case 'resetData':
          await this.resetData();
          sendResponse({ success: true, message: 'Data reset successfully' });
          break;
          
        case 'exportData':
          const exportData = await this.exportData();
          sendResponse({ success: true, data: exportData });
          break;
          
        default:
          sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (error) {
      console.error('Error handling message:', error);
      sendResponse({ success: false, error: error.message });
    }
  }

  async updateCurrentSite() {
    try {
      const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
      
      if (tabs.length === 0) {
        this.setCurrentSite(null);
        return;
      }

      const tab = tabs[0];
      const window = await chrome.windows.get(tab.windowId);
      
      if (!window.focused) {
        this.setCurrentSite(null);
        return;
      }

      this.setCurrentSite(tab.url);
    } catch (error) {
      console.error('Error updating current site:', error);
    }
  }

  setCurrentSite(url) {
    // Update previous site's time
    this.updateCurrentSiteTime();
    
    if (!url) {
      this.currentSite = null;
      this.currentSiteStartTime = null;
      this.isTracking = false;
    } else {
      const domain = this.extractDomain(url);
      if (domain) {
        this.currentSite = domain;
        this.currentSiteStartTime = new Date();
        this.isTracking = true;
      }
    }
  }

  updateCurrentSiteTime() {
    if (!this.currentSite || !this.currentSiteStartTime || !this.isTracking) {
      return;
    }

    const now = new Date();
    const timeSpent = (now - this.currentSiteStartTime) / (1000 * 60); // Convert to minutes
    
    if (timeSpent > 0) {
      this.addTimeToSite(this.currentSite, timeSpent);
    }
  }

  extractDomain(url) {
    try {
      const urlObj = new URL(url);
      let domain = urlObj.hostname;
      
      // Remove www. prefix
      if (domain.startsWith('www.')) {
        domain = domain.substring(4);
      }
      
      // Get the main domain (e.g., "google" from "google.com")
      const parts = domain.split('.');
      if (parts.length >= 2) {
        return parts[parts.length - 2];
      }
      
      return domain;
    } catch (error) {
      console.error('Error extracting domain:', error);
      return null;
    }
  }

  async addTimeToSite(site, minutes) {
    try {
      const data = await this.getTrackingData();
      
      if (!data.sites[site]) {
        data.sites[site] = {
          name: site,
          totalTime: 0,
          visits: 0,
          lastVisit: null
        };
      }
      
      data.sites[site].totalTime += minutes;
      data.sites[site].visits += 1;
      data.sites[site].lastVisit = new Date().toISOString();
      
      // Update total time
      data.totalTime += minutes;
      
      // Save to storage
      await this.saveData(data);
      
      console.log(`Added ${minutes.toFixed(2)} minutes to ${site}`);
    } catch (error) {
      console.error('Error adding time to site:', error);
    }
  }

  async getTrackingData() {
    try {
      const result = await chrome.storage.local.get(['timeTrackerData']);
      return result.timeTrackerData || {
        sites: {},
        totalTime: 0,
        lastUpdated: null
      };
    } catch (error) {
      console.error('Error getting tracking data:', error);
      return { sites: {}, totalTime: 0, lastUpdated: null };
    }
  }

  async saveData(data) {
    try {
      data.lastUpdated = new Date().toISOString();
      await chrome.storage.local.set({ timeTrackerData: data });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  async loadData() {
    try {
      const data = await this.getTrackingData();
      console.log('Loaded tracking data:', data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  async resetData() {
    try {
      await chrome.storage.local.remove(['timeTrackerData']);
      console.log('Data reset successfully');
    } catch (error) {
      console.error('Error resetting data:', error);
      throw error;
    }
  }

  async exportData() {
    try {
      const data = await this.getTrackingData();
      return {
        ...data,
        exportDate: new Date().toISOString(),
        version: '2.0.0'
      };
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }
}

// Initialize the time tracker when the service worker starts
const timeTracker = new TimeTracker();