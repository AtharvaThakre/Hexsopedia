import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getApiUrl } from '../config/api';

function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(getApiUrl('/api/entries'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch entries');
      }

      const data = await response.json();
      setEntries(data.entries);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(getApiUrl(`/api/entries/${id}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }

      setEntries(entries.filter(entry => entry._id !== id));
    } catch (err) {
      alert('Error deleting entry: ' + err.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return <div className="loading">Loading entries...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>My Knowledge Base</h1>
        <Link to="/entries/new" className="btn btn-primary">
          Create New Entry
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {entries.length === 0 ? (
        <div className="card">
          <p style={{textAlign: 'center', color: '#666'}}>
            No entries yet. Create your first entry to get started!
          </p>
        </div>
      ) : (
        <div className="entries-grid">
          {entries.map(entry => (
            <div key={entry._id} className="entry-card">
              <h3>{entry.title}</h3>
              <div className="entry-card-content">
                {entry.content.substring(0, 150)}...
              </div>
              {entry.tags && entry.tags.length > 0 && (
                <div className="entry-card-tags">
                  {entry.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              )}
              <div className="entry-card-footer">
                <span className="entry-card-date">
                  {formatDate(entry.createdAt)}
                </span>
                <div className="entry-actions">
                  <button 
                    onClick={() => navigate(`/entries/${entry._id}`)}
                    className="icon-btn"
                    title="View"
                  >
                    👁️ View
                  </button>
                  <button 
                    onClick={() => navigate(`/entries/edit/${entry._id}`)}
                    className="icon-btn"
                    title="Edit"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(entry._id)}
                    className="icon-btn"
                    title="Delete"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
