import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

const QRScanner = ({ onScan, onError }) => {
  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [lastScannedCode, setLastScannedCode] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const hasShownError = useRef(false);
  const hasProcessedValidQR = useRef(false);
  const [showInvalidOverlay, setShowInvalidOverlay] = useState(false);

  const startScanning = async () => {
    try {
      setIsScanning(true);
      setError(null);
      const videoConstraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
          focusMode: 'continuous',
          exposureMode: 'continuous',
          whiteBalanceMode: 'continuous'
        }
      };

      try {
        await navigator.mediaDevices.getUserMedia(videoConstraints);
      } catch {
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
      }
      setCameraPermission('granted');

      await readerRef.current.decodeFromVideoDevice(
        null,
        videoRef.current,
        (result) => {
          if (result && result.getText() && !isProcessing) {
            const qrCode = result.getText();
            if (lastScannedCode === qrCode) return;
            if (qrCode.startsWith('HC1:') && !hasProcessedValidQR.current) {
              hasProcessedValidQR.current = true;
              setIsProcessing(true);
              setLastScannedCode(qrCode);
              hasShownError.current = false;
              onScan(qrCode);
              if (readerRef.current) readerRef.current.reset();
            } else {
              if (!hasShownError.current) {
                hasShownError.current = true;
                setLastScannedCode(qrCode);
                if (navigator.vibrate) navigator.vibrate(200);
                setShowInvalidOverlay(true);
                setError('Invalid QR code. Please scan an EU Green Pass (HC1).');
                setTimeout(() => {
                  setShowInvalidOverlay(false);
                  setError(null);
                  hasShownError.current = false;
                  if (readerRef.current) readerRef.current.reset();
                  startScanning();
                }, 1500);
              }
            }
          }
        },
        () => {
          setError('Scanning error. Please try again.');
        }
      );
    } catch (err) {
      if (err?.name === 'NotAllowedError') {
        setError('Camera permission denied. Please allow access.');
        setCameraPermission('denied');
      } else if (err?.name === 'NotFoundError') {
        setError('No camera found on this device.');
      } else {
        setError('Failed to start camera. Please check permissions.');
      }
      if (onError) onError(err);
    }
  };

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    readerRef.current = reader;
    startScanning();
    return () => {
      if (readerRef.current) readerRef.current.reset();
      setIsScanning(false);
      setIsProcessing(false);
      hasShownError.current = false;
      hasProcessedValidQR.current = false;
    };
  }, [onScan, onError]);

  const handleRetry = () => {
    setError(null);
    setLastScannedCode(null);
    setIsProcessing(false);
    hasShownError.current = false;
    hasProcessedValidQR.current = false;
    if (readerRef.current) {
      readerRef.current.reset();
      startScanning();
    }
  };

  const requestCameraPermission = async () => {
    try {
      const videoConstraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
          focusMode: 'continuous',
          exposureMode: 'continuous',
          whiteBalanceMode: 'continuous'
        }
      };
      await navigator.mediaDevices.getUserMedia(videoConstraints);
      setCameraPermission('granted');
      handleRetry();
    } catch {
      setCameraPermission('denied');
    }
  };

  useEffect(() => {
    window.qrScanner = {
      stop: () => {
        if (readerRef.current) readerRef.current.reset();
        setIsScanning(false);
        setIsProcessing(false);
      }
    };
  }, []);

  if (cameraPermission === 'denied') {
    return (
      <div className="text-center p-4">
        <div className="alert alert-warning" role="alert">
          <h5 className="alert-heading">
            <i className="bi bi-camera-video-off me-2"></i>
            Camera access required
          </h5>
          <p className="mb-3">
            Allow camera access in your browser settings to scan QR codes.
          </p>
          <button className="btn btn-primary" onClick={requestCameraPermission}>
            <i className="bi bi-camera-video me-2"></i>
            Enable camera
          </button>
        </div>
      </div>
    );
  }

  const cornerColor = showInvalidOverlay ? '#dc3545' : '#00ff00';

  return (
    <div className="w-100 mx-auto" style={{ maxWidth: 400 }}>
      <div className="position-relative rounded shadow overflow-hidden">
        <video
          ref={videoRef}
          className="w-100"
          style={{ height: 220, objectFit: 'cover' }}
          playsInline
          autoPlay
          muted
        />

        {isScanning && !error && (
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ pointerEvents: 'none' }}>
            <div className="position-relative" style={{ width: 180, height: 180 }}>
              <div className="position-absolute top-0 start-0" style={{ width: 30, height: 30, border: `3px solid ${cornerColor}`, borderRight: 'none', borderBottom: 'none' }} />
              <div className="position-absolute top-0 end-0" style={{ width: 30, height: 30, border: `3px solid ${cornerColor}`, borderLeft: 'none', borderBottom: 'none' }} />
              <div className="position-absolute bottom-0 start-0" style={{ width: 30, height: 30, border: `3px solid ${cornerColor}`, borderRight: 'none', borderTop: 'none' }} />
              <div className="position-absolute bottom-0 end-0" style={{ width: 30, height: 30, border: `3px solid ${cornerColor}`, borderLeft: 'none', borderTop: 'none' }} />
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2">
          <div className="alert alert-danger py-2 mb-0" role="status" aria-live="polite">
            <i className="bi bi-x-circle me-2"></i>
            {error}
          </div>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
