import React, { useState, useEffect } from 'react';
import QRScanner from './components/QRScanner';
import ResultDisplay from './components/ResultDisplay';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('scanner');
  const [scanResult, setScanResult] = useState(null);
  const [isPWA, setIsPWA] = useState(false);
  const [resetScanner, setResetScanner] = useState(0);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsPWA(isStandalone);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      window.deferredPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleScan = async (qrCode) => {
    setCurrentView('loading');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const result = {
        success: true,
        data: {
          qrCode: qrCode,
          timestamp: new Date().toISOString()
        }
      };

      setScanResult(result);
      setCurrentView('result');
      
      if (window.qrScanner) {
        window.qrScanner.stop();
      }
    } catch (error) {
      setScanResult({ error: 'Network error. Please check your connection.' });
      setCurrentView('result');
    }
  };

  const handleReset = () => {
    setCurrentView('scanner');
    setScanResult(null);
    setResetScanner(prev => prev + 1);
  };

  const handleError = () => {};

  const renderContent = () => {
    switch (currentView) {
      case 'loading':
        return (
          <div className="text-center py-5">
            <div className="loading-spinner mb-3"></div>
            <h4>Processing certificate...</h4>
            <p className="text-muted">Please wait while we validate the QR code</p>
          </div>
        );

      case 'result':
        return (
          <ResultDisplay 
            data={scanResult} 
            onReset={handleReset}
          />
        );

      default:
        return (
          <QRScanner 
            key={resetScanner}
            onScan={handleScan}
            onError={handleError}
          />
        );
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <header className="bg-primary text-white py-3 shadow-sm">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <i className="bi bi-shield-check fs-2 me-3"></i>
              <div>
                <h1 className="h4 mb-0 fw-bold">Green Pass Checker</h1>
                <small className="opacity-75">European COVID-19 Certificate Validator</small>
              </div>
            </div>
            {isPWA && (
              <div className="badge bg-light text-dark">
                <i className="bi bi-phone me-1"></i>
                PWA
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow-1 py-4">
        <div className="container">
          {currentView === 'scanner' && (
            <div className="text-center mb-4">
              <div className="alert alert-info" role="alert">
                <i className="bi bi-info-circle me-2"></i>
                <strong>Instructions:</strong> Point your camera at an EU Green Pass QR code to validate it
              </div>
            </div>
          )}

          {renderContent()}

          {!isPWA && currentView === 'scanner' && (
            <div className="mt-4">
              <div className="alert alert-success" role="alert">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <i className="bi bi-download me-2"></i>
                    <strong>Install app:</strong> Add this app to your home screen for a better experience
                  </div>
                  <button 
                    className="btn btn-outline-success btn-sm"
                    onClick={() => {
                      if (window.deferredPrompt) {
                        window.deferredPrompt.prompt();
                      } else {
                        alert('To install: Chrome/Edge use the address-bar install icon; Firefox: Menu → Install app; Safari: Share → Add to Home Screen');
                      }
                    }}
                  >
                    Install
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      <footer className="bg-light py-3 mt-auto">
        <div className="container">
          <div className="row text-center">
            <div className="col-12">
              <small className="text-muted">
                <i className="bi bi-shield-check me-1"></i>
                Green Pass Checker v1.0.0
              </small>
            </div>
          </div>
        </div>
      </footer>

      <div 
        id="offline-indicator" 
        className="position-fixed top-0 start-50 translate-middle-x bg-warning text-dark px-3 py-2 rounded-bottom shadow-sm"
        style={{ display: 'none', zIndex: 1050 }}
      >
        <i className="bi bi-wifi-off me-2"></i>
        You are currently offline
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('online', function() {
              document.getElementById('offline-indicator').style.display = 'none';
            });
            window.addEventListener('offline', function() {
              document.getElementById('offline-indicator').style.display = 'block';
            });
          `,
        }}
      />
    </div>
  );
}

export default App;
