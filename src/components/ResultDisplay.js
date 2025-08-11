import React from 'react';

const ResultDisplay = ({ data, onReset }) => {
  if (!data || data.error) {
    return (
      <div className="result-container">
        <div className="result-header bg-danger">
          <div className="result-icon">
            <i className="bi bi-x-circle-fill"></i>
          </div>
          <h2 className="result-title">Invalid Certificate</h2>
          <p className="result-subtitle">The scanned QR code is not a valid EU Green Pass</p>
        </div>
        <div className="result-body">
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            <strong>Error:</strong> {data?.error || 'Unknown error occurred'}
          </div>
          <button 
            className="btn btn-primary w-100"
            onClick={onReset}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Scan another QR code
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'N/A') return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="result-container">
      <div className="result-header bg-success">
        <div className="result-icon">
          <i className="bi bi-check-circle-fill"></i>
        </div>
        <h2 className="result-title">Valid Certificate</h2>
        <p className="result-subtitle">QR code successfully validated</p>
      </div>

      <div className="result-body">
        <div className="card mb-3">
          <div className="card-header">
            <h5 className="card-title mb-0">
              <i className="bi bi-info-circle me-2"></i>
              Details
            </h5>
          </div>
          <div className="card-body">
            <div className="result-item">
              <span className="result-label">QR Code:</span>
              <span className="result-value">{data.data?.qrCode?.substring(0, 20)}...</span>
            </div>
            <div className="result-item">
              <span className="result-label">Timestamp:</span>
              <span className="result-value">{formatDate(data.data?.timestamp)}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Status:</span>
              <span className="result-value text-success">Valid</span>
            </div>
          </div>
        </div>

        <div className="d-grid gap-2">
          <button 
            className="btn btn-primary"
            onClick={onReset}
          >
            <i className="bi bi-qr-code me-2"></i>
            Scan another QR code
          </button>
          <button 
            className="btn btn-outline-secondary"
            onClick={() => window.print()}
          >
            <i className="bi bi-printer me-2"></i>
            Print
          </button>
        </div>

        <div className="mt-3">
          <div className="alert alert-info" role="alert">
            <small>
              <i className="bi bi-info-circle me-1"></i>
              This application is for informational purposes only. Always verify certificates through official channels.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
