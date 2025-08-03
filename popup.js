// Time Tracker Extension - Popup Script
// Modern implementation with proper UI interactions and data management

class PopupManager {
  constructor() {
    this.data = null;
    this.init();
  }

  async init() {
    try {
      this.setupEventListeners();
      await this.loadData();
    } catch (error) {
      console.error('Failed to initialize popup:', error);
      this.showError('Failed to load data. Please try again.');
    }
  }

  setupEventListeners() {
    // Reset data button
    document.getElementById('resetBtn').addEventListener('click', () => {
      this.resetData();
    });

    // Export data button
    document.getElementById('exportBtn').addEventListener('click', () => {
      this.exportData();
    });
  }

  async loadData() {
    try {
      this.showLoading();
      
      const response = await this.sendMessage({ action: 'getData' });
      
      if (response.success) {
        this.data = response.data;
        this.renderData();
      } else {
        throw new Error(response.error || 'Failed to load data');
      }
    } catch (error) {
      console.error('Error loading data:', error);
      this.showError('Failed to load tracking data');
    }
  }

  renderData() {
    if (!this.data || Object.keys(this.data.sites).length === 0) {
      this.showEmptyState();
      return;
    }

    this.hideLoading();
    this.hideEmptyState();
    this.showContent();

    // Update stats
    this.updateStats();
    
    // Update sites list
    this.updateSitesList();
    
    // Update last updated time
    this.updateLastUpdated();
  }

  updateStats() {
    const totalTimeElement = document.getElementById('totalTime');
    const sitesCountElement = document.getElementById('sitesCount');

    // Format total time
    const totalMinutes = this.data.totalTime || 0;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    
    totalTimeElement.textContent = `${hours}h ${minutes}m`;
    
    // Update sites count
    const sitesCount = Object.keys(this.data.sites).length;
    sitesCountElement.textContent = sitesCount;
  }

  updateSitesList() {
    const sitesListElement = document.getElementById('sitesList');
    const sites = Object.values(this.data.sites);
    
    // Sort sites by total time (descending)
    sites.sort((a, b) => b.totalTime - a.totalTime);
    
    // Take top 10 sites
    const topSites = sites.slice(0, 10);
    
    sitesListElement.innerHTML = '';
    
    topSites.forEach(site => {
      const siteElement = this.createSiteElement(site);
      sitesListElement.appendChild(siteElement);
    });
  }

  createSiteElement(site) {
    const div = document.createElement('div');
    div.className = 'site-item';
    
    const hours = Math.floor(site.totalTime / 60);
    const minutes = Math.floor(site.totalTime % 60);
    const timeText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    
    div.innerHTML = `
      <div class="site-name">${this.capitalizeFirstLetter(site.name)}</div>
      <div class="site-time">${timeText}</div>
    `;
    
    return div;
  }

  updateLastUpdated() {
    const lastUpdatedElement = document.getElementById('lastUpdated');
    
    if (this.data.lastUpdated) {
      const date = new Date(this.data.lastUpdated);
      const now = new Date();
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      
      let timeText;
      if (diffInMinutes < 1) {
        timeText = 'Just now';
      } else if (diffInMinutes < 60) {
        timeText = `${diffInMinutes}m ago`;
      } else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60);
        timeText = `${hours}h ago`;
      } else {
        const days = Math.floor(diffInMinutes / 1440);
        timeText = `${days}d ago`;
      }
      
      lastUpdatedElement.textContent = `Updated ${timeText}`;
    } else {
      lastUpdatedElement.textContent = '';
    }
  }

  async resetData() {
    if (!confirm('Are you sure you want to reset all tracking data? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await this.sendMessage({ action: 'resetData' });
      
      if (response.success) {
        this.data = { sites: {}, totalTime: 0, lastUpdated: null };
        this.renderData();
        this.showSuccess('Data reset successfully');
      } else {
        throw new Error(response.error || 'Failed to reset data');
      }
    } catch (error) {
      console.error('Error resetting data:', error);
      this.showError('Failed to reset data');
    }
  }

  async exportData() {
    try {
      const response = await this.sendMessage({ action: 'exportData' });
      
      if (response.success) {
        this.downloadData(response.data);
        this.showSuccess('Data exported successfully');
      } else {
        throw new Error(response.error || 'Failed to export data');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      this.showError('Failed to export data');
    }
  }

  downloadData(data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `time-tracker-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  sendMessage(message) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response);
        }
      });
    });
  }

  // UI Helper Methods
  showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('content').style.display = 'none';
    document.getElementById('emptyState').style.display = 'none';
  }

  hideLoading() {
    document.getElementById('loading').style.display = 'none';
  }

  showContent() {
    document.getElementById('content').style.display = 'block';
  }

  showEmptyState() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('content').style.display = 'none';
    document.getElementById('emptyState').style.display = 'block';
  }

  hideEmptyState() {
    document.getElementById('emptyState').style.display = 'none';
  }

  showError(message) {
    this.hideLoading();
    this.showContent();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    
    const container = document.querySelector('.container');
    container.insertBefore(errorDiv, container.firstChild);
    
    // Remove error after 5 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
    }, 5000);
  }

  showSuccess(message) {
    // Create a temporary success message
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #27ae60;
      color: white;
      padding: 10px 15px;
      border-radius: 6px;
      font-size: 14px;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
      if (successDiv.parentNode) {
        successDiv.parentNode.removeChild(successDiv);
      }
    }, 3000);
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

// Add slide-in animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});