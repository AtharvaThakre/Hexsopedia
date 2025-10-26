import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../config/api';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(getApiUrl('/api/admin/stats'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(getApiUrl(`/api/admin/entries/${entryId}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }

      fetchStats(); // Refresh data
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
    return <div className="loading">Loading admin dashboard...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="container" style={{maxWidth: '1400px', marginTop: '40px'}}>
      <h1 style={{marginBottom: '30px'}}>Admin Dashboard</h1>

      {/* Statistics Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.totalUsers}</h3>
          <p>Total Users</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalEntries}</h3>
          <p>Total Entries</p>
        </div>
        <div className="stat-card">
          <h3>{stats.popularTags.length}</h3>
          <p>Unique Tags</p>
        </div>
        <div className="stat-card">
          <h3>{stats.recentEntries.length}</h3>
          <p>Recent Entries</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{marginBottom: '20px', borderBottom: '2px solid #dee2e6'}}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'overview' ? '3px solid #007bff' : 'none',
            fontWeight: activeTab === 'overview' ? 'bold' : 'normal'
          }}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'users' ? '3px solid #007bff' : 'none',
            fontWeight: activeTab === 'users' ? 'bold' : 'normal'
          }}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('entries')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'entries' ? '3px solid #007bff' : 'none',
            fontWeight: activeTab === 'entries' ? 'bold' : 'normal'
          }}
        >
          Recent Entries
        </button>
        <button
          onClick={() => setActiveTab('popular')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'popular' ? '3px solid #007bff' : 'none',
            fontWeight: activeTab === 'popular' ? 'bold' : 'normal'
          }}
        >
          Popular Content
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          <div className="admin-section">
            <h2>Popular Tags</h2>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
              {stats.popularTags.map((tag, index) => (
                <div key={index} style={{
                  padding: '8px 16px',
                  background: '#007bff',
                  color: 'white',
                  borderRadius: '20px',
                  fontSize: '14px'
                }}>
                  {tag._id} ({tag.count})
                </div>
              ))}
            </div>
          </div>

          <div className="admin-section">
            <h2>Entries by User</h2>
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Entry Count</th>
                </tr>
              </thead>
              <tbody>
                {stats.entriesByUser.map((user, index) => (
                  <tr key={index}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.entryCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="admin-section">
            <h2>Activity Over Time (Last 30 Days)</h2>
            <div style={{overflowX: 'auto'}}>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Entries Created</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.entriesOverTime.map((day, index) => (
                    <tr key={index}>
                      <td>{day._id}</td>
                      <td>{day.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="admin-section">
          <h2>User Management</h2>
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Entries</th>
              </tr>
            </thead>
            <tbody>
              {stats.entriesByUser.map((user, index) => (
                <tr key={index}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.entryCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Recent Entries Tab */}
      {activeTab === 'entries' && (
        <div className="admin-section">
          <h2>Recent Entries</h2>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Created</th>
                <th>Views</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentEntries.map((entry) => (
                <tr key={entry._id}>
                  <td>
                    <span 
                      style={{cursor: 'pointer', color: '#007bff'}}
                      onClick={() => navigate(`/entries/${entry._id}`)}
                    >
                      {entry.title}
                    </span>
                  </td>
                  <td>{entry.author.username}</td>
                  <td>{formatDate(entry.createdAt)}</td>
                  <td>{entry.views}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteEntry(entry._id)}
                      className="btn btn-danger"
                      style={{padding: '5px 10px', fontSize: '12px'}}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Popular Content Tab */}
      {activeTab === 'popular' && (
        <div className="admin-section">
          <h2>Most Viewed Entries</h2>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Views</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {stats.mostViewedEntries.map((entry) => (
                <tr key={entry._id}>
                  <td>
                    <span 
                      style={{cursor: 'pointer', color: '#007bff'}}
                      onClick={() => navigate(`/entries/${entry._id}`)}
                    >
                      {entry.title}
                    </span>
                  </td>
                  <td>{entry.author.username}</td>
                  <td>{entry.views}</td>
                  <td>{formatDate(entry.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
