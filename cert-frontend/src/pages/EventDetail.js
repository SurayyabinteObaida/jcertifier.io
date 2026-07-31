import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsAPI, participantsAPI, certificatesAPI, templatesAPI, API_BASE } from '../api';

const TEMPLATE_COLORS = {
  classic: '#3466cc',
  elegant: '#b48c3c',
  modern: '#009688',
};

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [file, setFile] = useState(null);
  const [templateId, setTemplateId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [tab, setTab] = useState('participants');

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    try {
      const [eventRes, partRes, certRes, tmplRes] = await Promise.all([
        eventsAPI.get(id),
        participantsAPI.list(id),
        certificatesAPI.list(id),
        templatesAPI.list(),
      ]);
      setEvent(eventRes.data);
      setParticipants(partRes.data);
      setCertificates(certRes.data);
      setTemplates(tmplRes.data);
      if (tmplRes.data.length > 0 && !templateId) {
        const def = tmplRes.data.find(t => t.is_default) || tmplRes.data[0];
        setTemplateId(def.id);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to load event details');
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) { setError('Please select a CSV file'); return; }
    setError(''); setSuccess('');
    try {
      const res = await participantsAPI.upload(id, file);
      setSuccess(`Uploaded ${res.data.created} participants.`);
      setFile(null);
      fetchData();
    } catch (err) { setError(err.response?.data?.detail || 'Upload failed'); }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!templateId) { setError('Select a template first'); return; }
    setError(''); setSuccess(''); setGenerating(true);
    try {
      const res = await certificatesAPI.generate(id, { template_id: templateId });
      setSuccess(`Generated ${res.data.generated} certificates!`);
      setTab('certificates');
      fetchData();
    } catch (err) { setError(err.response?.data?.detail || 'Generation failed'); }
    finally { setGenerating(false); }
  };

  const handleRegenerate = async (e) => {
    e.preventDefault();
    if (!templateId) { setError('Select a template first'); return; }
    if (!window.confirm('This will delete all existing certificates and regenerate with the selected template. Continue?')) return;
    setError(''); setSuccess(''); setGenerating(true);
    try {
      const res = await certificatesAPI.regenerate(id, { template_id: templateId });
      setSuccess(`Regenerated ${res.data.generated} certificates with new template!`);
      fetchData();
    } catch (err) {
      const d = err.response?.data?.detail;
      setError(typeof d === 'string' ? d : 'Regeneration failed');
    }
    finally { setGenerating(false); }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSuccess('Link copied!');
    setTimeout(() => setSuccess(''), 2000);
  };

  const shareUrl = (token) => `${window.location.origin}/verify/${token}`;

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (!event) return <div className="container"><p>Event not found</p></div>;

  return (
    <div className="container">
      <button className="btn btn-outline btn-sm" onClick={() => navigate('/')} style={{ marginBottom: '1.5rem' }}>
        Back to Events
      </button>

      <h1 className="page-title">{event.event_name}</h1>
      <div className="card">
        <p><strong>Organization:</strong> {event.organization}</p>
        <p><strong>Date:</strong> {event.event_date}</p>
        <p><strong>Authority:</strong> {event.authority_name} ({event.signing_authority})</p>
        {event.sponsor && <p><strong>Sponsor:</strong> {event.sponsor}</p>}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="tabs">
        <button className={`tab-btn ${tab === 'participants' ? 'active' : ''}`} onClick={() => setTab('participants')}>
          Participants ({participants.length})
        </button>
        <button className={`tab-btn ${tab === 'certificates' ? 'active' : ''}`} onClick={() => setTab('certificates')}>
          Certificates ({certificates.length})
        </button>
      </div>

      {tab === 'participants' && (
        <div>
          <div className="card">
            <h2 className="section-title">Upload Participants</h2>
            <form onSubmit={handleUpload}>
              <div className="form-group">
                <label>CSV File (columns: name, email, role, participant_id)</label>
                <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} />
              </div>
              <div style={{display:'flex', gap:'1rem', alignItems:'center'}}>
                <button type="submit" className="btn btn-success">Upload CSV</button>
                <a href={`${API_BASE}/api/issuer/sample-csv`} className="sample-csv-link" download>Download sample CSV template</a>
              </div>
            </form>
          </div>

          <div className="card">
            <h2 className="section-title">Participants</h2>
            {participants.length === 0 ? (
              <div className="empty-state"><p>No participants yet. Upload a CSV file above.</p></div>
            ) : (
              <table className="table">
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr></thead>
                <tbody>
                  {participants.map(p => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.email}</td>
                      <td>{p.role || '-'}</td>
                      <td>
                        <span className={`badge ${p.certificate_issued ? 'badge-issued' : 'badge-pending'}`}>
                          {p.certificate_issued ? 'Issued' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {tab === 'certificates' && (
        <div>
          <div className="card">
            <h2 className="section-title">Select Template</h2>
            <div className="template-grid">
              {templates.map(t => (
                <div
                  key={t.id}
                  className={`template-card ${templateId === t.id ? 'selected' : ''}`}
                  onClick={() => setTemplateId(t.id)}
                >
                  <div className="swatch" style={{ background: TEMPLATE_COLORS[t.template_type] || '#4361ee' }}></div>
                  <p>{t.template_name}</p>
                </div>
              ))}
            </div>
           <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
  <button className="btn btn-success" onClick={handleGenerate} disabled={generating || participants.length === 0}>
    {generating ? 'Generating...' : 'Generate for All Participants'}
  </button>
  {certificates.length > 0 && (
    <button className="btn" onClick={handleRegenerate} disabled={generating} style={{ background: '#e67e22' }}>
      {generating ? 'Regenerating...' : 'Change Template & Regenerate'}
    </button>
  )}
</div>
            {participants.length === 0 && <p style={{color:'#999', fontSize:'0.85rem', marginTop:'0.5rem'}}>Upload participants first</p>}
          </div>

          <div className="card">
            <h2 className="section-title">Issued Certificates</h2>
            {certificates.length === 0 ? (
              <div className="empty-state"><p>No certificates generated yet.</p></div>
            ) : (
              <table className="table">
                <thead><tr><th>Participant</th><th>Token</th><th>Actions</th></tr></thead>
                <tbody>
                  {certificates.map(c => (
                    <tr key={c.id}>
                      <td>{c.participant_name}</td>
                      <td style={{ fontSize: '0.78rem', fontFamily: 'monospace', wordBreak: 'break-all', maxWidth: '200px' }}>
                        {c.certificate_token}
                      </td>
                      <td>
                        <div className="cert-actions">
                          <a href={`${API_BASE}/api/verify/${c.certificate_token}/pdf`} target="_blank" rel="noopener noreferrer" className="link-pdf">Preview PDF</a>
                          <a href={`${API_BASE}/api/verify/${c.certificate_token}/qr`} target="_blank" rel="noopener noreferrer" className="link-qr">QR Code</a>
                          <button className="link-share" onClick={() => copyToClipboard(shareUrl(c.certificate_token))}>Copy Link</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default EventDetail;
