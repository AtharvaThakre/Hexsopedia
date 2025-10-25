import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTags, setSearchTags] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim() && !searchTags.trim()) {
      setError('Please enter a search query or tags');
      return;
    }

    setError('');
    setLoading(true);
    setSearched(true);

    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('q', searchQuery);
      if (searchTags.trim()) params.append('tags', searchTags);

      const response = await fetch(`/api/entries/search?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setResults(data.entries);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  return (
    <div className="search-container">
      <div className="card">
        <h2>Search Knowledge Base</h2>
        <form onSubmit={handleSearch}>
          <div className="form-group">
            <label>Search by Title or Content</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter search query..."
            />
          </div>
          <div className="form-group">
            <label>Search by Tags (comma-separated)</label>
            <input
              type="text"
              value={searchTags}
              onChange={(e) => setSearchTags(e.target.value)}
              placeholder="e.g., javascript, tutorial, react"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {searched && !loading && (
        <div className="search-results">
          <h3>
            {results.length} {results.length === 1 ? 'result' : 'results'} found
          </h3>
          {results.length === 0 ? (
            <div className="card">
              <p style={{textAlign: 'center', color: '#666'}}>
                No entries found matching your search criteria.
              </p>
            </div>
          ) : (
            <div className="entries-grid">
              {results.map(entry => (
                <div 
                  key={entry._id} 
                  className="entry-card"
                  onClick={() => navigate(`/entries/${entry._id}`)}
                >
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
                    <span style={{fontSize: '12px', color: '#999'}}>
                      {entry.views} views
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Search;
