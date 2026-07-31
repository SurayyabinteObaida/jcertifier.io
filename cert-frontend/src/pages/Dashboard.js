import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsAPI } from '../api';

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    event_name: '', organization: '', signing_authority: '', authority_name: '',
    event_date: '', event_time: '', sponsor: '', description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const res = await eventsAPI.list();
      setEvents(res.data);
      setLoading(false);
    } catch (err) { setError('Failed to load events'); setLoading(false); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
const payload = { ...formData };
if (!payload.event_time) delete payload.event_time;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await eventsAPI.create(payload);
      setEvents([...events, res.data]);
      setFormData({ event_name: '', organization: '', signing_authority: '', authority_name: '', event_date: '', event_time: '', sponsor: '', description: '' });
      setShowForm(false);
    } catch (err) {
  const d = err.response?.data?.detail;
  setError(typeof d === 'string' ? d : JSON.stringify(d) || 'Failed to create event');
}
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>My Events</h1>
        <button className="btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Event'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <div className="card">
          <h2 className="section-title">Create Event</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
              <div className="form-group">
                <label>Event Name *</label>
                <input name="event_name" value={formData.event_name} onChange={handleChange} required placeholder="e.g., Python Workshop 2024" />
              </div>
              <div className="form-group">
                <label>Organization</label>
                <input name="organization" value={formData.organization} onChange={handleChange} placeholder="e.g., Jinnah University" />
              </div>
              <div className="form-group">
                <label>Authority Name</label>
                <input name="authority_name" value={formData.authority_name} onChange={handleChange} placeholder="e.g., Dr. Ahmed Khan" />
              </div>
              <div className="form-group">
                <label>Authority Role</label>
                <input name="signing_authority" value={formData.signing_authority} onChange={handleChange} placeholder="e.g., Head of Department" />
              </div>
              <div className="form-group">
                <label>Event Date *</label>
                <input type="date" name="event_date" value={formData.event_date} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Sponsor</label>
                <input name="sponsor" value={formData.sponsor} onChange={handleChange} placeholder="Optional" />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="2" placeholder="Brief description of the event" />
            </div>
            <button type="submit" className="btn btn-success">Create Event</button>
          </form>
        </div>
      )}

      {events.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <p>No events yet. Click "New Event" to get started.</p>
          </div>
        </div>
      ) : (
        <div className="event-list">
          {events.map(event => (
            <div key={event.id} className="event-card" onClick={() => navigate(`/event/${event.id}`)}>
              <h3>{event.event_name}</h3>
              <p><strong>Organization:</strong> {event.organization || 'N/A'}</p>
              <p><strong>Date:</strong> {event.event_date}</p>
              <p><strong>Authority:</strong> {event.authority_name || 'N/A'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
