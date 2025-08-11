# Green Pass Checker - React App

A simple React application for scanning and validating European COVID-19 Green Pass QR codes.

## 🚀 Features

- **QR Code Scanner**: Real-time camera-based QR code scanning
- **PWA Support**: Installable as a native app on mobile devices
- **Mobile-First Design**: Optimized for mobile devices with Bootstrap 5
- **Responsive UI**: Beautiful, modern interface
- **Offline Support**: Works offline with service worker caching

## 🛠️ Tech Stack

- **Frontend**: React 18
- **Styling**: Bootstrap 5 + Bootstrap Icons
- **QR Scanner**: @zxing/library
- **PWA**: Service Worker + Web App Manifest
- **Deploy**: AWS Amplify

## 📱 PWA Features

- ✅ Installable on mobile devices
- ✅ Offline functionality
- ✅ App-like experience
- ✅ Native app integration

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run development server**
   ```bash
   npm start
   ```

3. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

## 🚀 Deploy to AWS Amplify

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to AWS Amplify**
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click "New app" → "Host web app"
   - Choose "GitHub" as source
   - Select your repository and branch (main)

3. **Build Settings**
   - Amplify will auto-detect React
   - Build command: `npm run build`
   - Output directory: `build`

## 📱 PWA Installation

### Mobile Devices

1. **iOS (Safari)**
   - Open the app in Safari
   - Tap the Share button
   - Select "Add to Home Screen"

2. **Android (Chrome)**
   - Open the app in Chrome
   - Tap the menu (⋮)
   - Select "Add to Home screen"

### Desktop

- **Chrome/Edge**: Click the install icon in the address bar
- **Firefox**: Click the install icon in the address bar

## 🔧 Configuration

### Environment Variables

Create a `.env` file:
```env
REACT_APP_NAME=Green Pass Checker
REACT_APP_VERSION=1.0.0
```

### PWA Configuration

The PWA is configured in:
- `public/manifest.json` - App manifest
- `public/sw.js` - Service worker
- `public/index.html` - PWA meta tags

## 🧪 Testing

### Manual Testing

1. **QR Code Scanning**
   - Test with valid Green Pass QR codes (HC1: format)
   - Test with invalid QR codes
   - Test camera permissions

2. **PWA Features**
   - Test offline functionality
   - Test app installation
   - Test responsive design

## 🐛 Troubleshooting

### Common Issues

1. **Camera Not Working**
   - Check browser permissions
   - Ensure HTTPS is enabled
   - Try refreshing the page

2. **PWA Not Installing**
   - Check if service worker is registered
   - Ensure manifest.json is accessible
   - Verify HTTPS connection

3. **Build Errors**
   - Check Node.js version (16+)
   - Clear node_modules and reinstall
   - Check for syntax errors

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

- **Issues**: Create an issue on GitHub
- **Documentation**: Check the README
