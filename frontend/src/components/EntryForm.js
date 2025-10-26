import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

function EntryForm() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [],
    isPublic: false
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  useEffect(() => {
    if (isEdit && !initialLoadDone) {
      fetchEntry();
    }
  }, [id, isEdit, initialLoadDone]);

  const fetchEntry = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/entries/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch entry');
      }

      const entry = await response.json();
      setFormData({
        title: entry.title,
        content: entry.content,
        tags: entry.tags || [],
        isPublic: entry.isPublic || false
      });
      setInitialLoadDone(true);
    } catch (err) {
      setError(err.message);
      setInitialLoadDone(true);
    }
  };

  // Memoize SimpleMDE options to prevent re-renders
  const editorOptions = useMemo(() => ({
    spellChecker: false,
    placeholder: "Write your content in Markdown...",
    toolbar: ["bold", "italic", "heading", "|", "quote", "unordered-list", "ordered-list", "|", "link", "image", "|", "preview", "side-by-side", "fullscreen", "|", "guide"],
    autosave: {
      enabled: true,
      uniqueId: id || 'new-entry',
      delay: 1000,
    }
  }), [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleContentChange = (value) => {
    setFormData({
      ...formData,
      content: value
    });
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag]
      });
    }
    setTagInput('');
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const url = isEdit ? `/api/entries/${id}` : '/api/entries';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(isEdit ? 'Failed to update entry' : 'Failed to create entry');
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="entry-form">
      <div className="card">
        <h2>{isEdit ? 'Edit Entry' : 'Create New Entry'}</h2>
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter entry title"
            />
          </div>

          <div className="form-group">
            <label>Content (Markdown) *</label>
            <SimpleMDE
              value={formData.content}
              onChange={handleContentChange}
              options={editorOptions}
            />
          </div>

          <div className="form-group">
            <label>Tags</label>
            <div className="tag-input-container">
              {formData.tags.map((tag, index) => (
                <div key={index} className="tag-item">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)}>×</button>
                </div>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                onBlur={addTag}
                placeholder="Add tags (press Enter)"
              />
            </div>
          </div>

          <div className="form-group">
            <label style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
                style={{width: 'auto'}}
              />
              Make this entry public
            </label>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/dashboard')} 
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (isEdit ? 'Update Entry' : 'Create Entry')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EntryForm;
