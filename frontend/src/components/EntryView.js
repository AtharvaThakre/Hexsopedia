import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getApiUrl } from '../config/api';

function EntryView() {
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchEntry = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(getApiUrl(`/api/entries/${id}`), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch entry');
      }

      const data = await response.json();
      setEntry(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEntry();
  }, [fetchEntry]);

  const handleDelete = async () => {
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

      navigate('/dashboard');
    } catch (err) {
      alert('Error deleting entry: ' + err.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Loading entry...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-error">{error}</div>
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!entry) {
    return <div className="loading">Entry not found</div>;
  }

  return (
    <div className="container" style={{maxWidth: '900px', marginTop: '40px'}}>
      <div className="card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
          <h1 style={{margin: 0}}>{entry.title}</h1>
          <div style={{display: 'flex', gap: '10px'}}>
            <button 
              onClick={() => navigate(`/entries/edit/${id}`)}
              className="btn btn-primary"
            >
              Edit
            </button>
            <button 
              onClick={handleDelete}
              className="btn btn-danger"
            >
              Delete
            </button>
          </div>
        </div>

        <div style={{marginBottom: '20px', color: '#666', fontSize: '14px'}}>
          <span>Created: {formatDate(entry.createdAt)}</span>
          {entry.updatedAt !== entry.createdAt && (
            <span style={{marginLeft: '20px'}}>
              Updated: {formatDate(entry.updatedAt)}
            </span>
          )}
          <span style={{marginLeft: '20px'}}>Views: {entry.views}</span>
        </div>

        {entry.tags && entry.tags.length > 0 && (
          <div style={{marginBottom: '20px'}}>
            {entry.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        )}

        <div className="markdown-content" style={{
          lineHeight: '1.6',
          fontSize: '16px'
        }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {entry.content}
          </ReactMarkdown>
        </div>

        <div style={{marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eee'}}>
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn btn-secondary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default EntryView;
