import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { verificationAPI, API_BASE } from '../api';

function Verify() {
  const { token } = useParams();
  const [cert, setCert] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchCert = async () => {
      try {
        const res = await verificationAPI.verify(token);
        setCert(res.data);
        setLoading(false);
      } catch (err) {
        setError('Certificate not found or invalid token');
        setLoading(false);
      }
    };
    fetchCert();
  }, [token]);

  const shareUrl = window.location.href;
  const shareText = cert ? `I received a certificate for "${cert.event_name}" from ${cert.organization}!` : '';

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="verify-page"><p>Verifying certificate...</p></div>;

  return (
    <div className="verify-page">
      {error ? (
        <div className="verify-card">
          <h1 style={{ color: '#e94560' }}>Certificate Not Found</h1>
          <p style={{ color: '#888', marginTop: '1rem' }}>The certificate token is invalid or does not exist.</p>
        </div>
      ) : cert ? (
        <div className="verify-card">
          <div className="verified-badge">Verified Certificate</div>
          <h1 style={{ color: '#1a1a2e', fontSize: '1.5rem' }}>{cert.participant_name}</h1>

          <div className="verify-details">
            <p><strong>Event:</strong> {cert.event_name}</p>
            <p><strong>Organization:</strong> {cert.organization}</p>
            <p><strong>Date:</strong> {cert.event_date}</p>
            <p><strong>Signed by:</strong> {cert.authority_name} ({cert.signing_authority})</p>
            <p><strong>Issued:</strong> {new Date(cert.issued_at).toLocaleDateString()}</p>
          </div>

          <div className="download-links">
            <a href={`${API_BASE}/api/verify/${token}/pdf`} target="_blank" rel="noopener noreferrer" className="dl-pdf">
              View / Download PDF
            </a>
            <a href={`${API_BASE}/api/verify/${token}/qr`} target="_blank" rel="noopener noreferrer" className="dl-qr">
              Download QR Code
            </a>
          </div>

          <div className="share-section">
            <h3>Share this certificate</h3>
            <div className="share-buttons">
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank" rel="noopener noreferrer"
                className="share-btn share-linkedin"
              >LinkedIn</a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank" rel="noopener noreferrer"
                className="share-btn share-twitter"
              >Twitter / X</a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
                target="_blank" rel="noopener noreferrer"
                className="share-btn share-whatsapp"
              >WhatsApp</a>
              <button onClick={copyLink} className="share-btn share-copy">
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Verify;
