# ⏱️ Time Tracker - Website Usage Monitor

A modern Chrome extension that helps you track and analyze your time spent on different websites with detailed insights and productivity metrics.

## ✨ Features

- **Real-time Tracking**: Automatically tracks time spent on each website
- **Beautiful Dashboard**: Modern, intuitive UI with visual statistics
- **Data Persistence**: Your data is safely stored locally using Chrome Storage API
- **Export Functionality**: Export your tracking data as JSON for analysis
- **Privacy First**: All data stays on your device - no external servers
- **Modern Architecture**: Built with Manifest V3 and modern JavaScript

## 🚀 Installation

### Method 1: Load Unpacked (Development)
1. Clone this repository:
   ```bash
   git clone https://github.com/utsavprabhakar/Time.git
   cd Time
   ```

2. Open Chrome and go to `chrome://extensions/`

3. Enable **Developer mode** in the top right corner

4. Click **Load unpacked** and select the extension folder

### Method 2: Chrome Web Store (Coming Soon)
- Extension will be available on the Chrome Web Store for easy installation

## 📊 Usage

1. **Install the extension** using one of the methods above

2. **Start browsing** - The extension automatically begins tracking your time

3. **View your data** by clicking the Time Tracker icon in your browser toolbar

4. **Explore your stats**:
   - Total time spent browsing
   - Number of sites visited
   - Top sites by time spent
   - Last updated timestamp

5. **Manage your data**:
   - Reset all tracking data
   - Export data for external analysis

## 🎯 Key Improvements (v2.0.0)

### Phase 1: Foundation & Security ✅
- **Manifest V3**: Updated to latest Chrome extension standards
- **Chrome Storage API**: Proper data persistence and management
- **Removed External Dependencies**: No more hardcoded localhost URLs
- **Better Error Handling**: Robust error management throughout
- **Modern JavaScript**: ES6+ features and async/await patterns

### Phase 2: User Interface ✅
- **Modern Design**: Beautiful gradient UI with smooth animations
- **Real-time Stats**: Live updates of your browsing statistics
- **Interactive Dashboard**: Click to view detailed site information
- **Export Functionality**: Download your data as JSON
- **Responsive Layout**: Works great on different screen sizes

## 🔧 Technical Details

### Architecture
- **Background Service Worker**: Handles time tracking logic
- **Popup Interface**: Modern React-like UI for data display
- **Content Script**: Minimal script for future enhancements
- **Chrome Storage**: Local data persistence

### Data Structure
```json
{
  "sites": {
    "google": {
      "name": "google",
      "totalTime": 120.5,
      "visits": 15,
      "lastVisit": "2024-01-15T10:30:00.000Z"
    }
  },
  "totalTime": 120.5,
  "lastUpdated": "2024-01-15T10:30:00.000Z"
}
```

## 🛡️ Privacy & Security

- **Local Storage**: All data is stored locally on your device
- **No External Servers**: No data is sent to external services
- **Minimal Permissions**: Only requests necessary permissions
- **Open Source**: Transparent code for security review

## 🚧 Future Enhancements

### Phase 3: Advanced Features (Planned)
- [ ] Productivity insights and reports
- [ ] Time goals and notifications
- [ ] Category-based tracking (work, social, etc.)
- [ ] Real-time dashboard with detailed analytics

### Phase 4: Modern Architecture (Planned)
- [ ] TypeScript implementation
- [ ] Proper state management
- [ ] Unit tests
- [ ] Build system with bundling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Original concept by Utsav Prabhakar
- Modern redesign and improvements by the development team
- Built with modern web technologies and best practices

---

**Note**: This extension is designed for personal use and productivity tracking. Please respect your privacy and use responsibly.

