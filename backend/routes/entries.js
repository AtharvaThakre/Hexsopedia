const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Entry = require('../models/Entry');
const { auth } = require('../middleware/auth');

// @route   GET /api/entries
// @desc    Get all entries for the logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
    
    const entries = await Entry.find({ author: req.user._id })
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('author', 'username email');

    const count = await Entry.countDocuments({ author: req.user._id });

    res.json({
      entries,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalEntries: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching entries', error: error.message });
  }
});

// @route   GET /api/entries/search
// @desc    Search entries by title or tags
// @access  Private
router.get('/search', auth, async (req, res) => {
  try {
    const { q, tags } = req.query;

    if (!q && !tags) {
      return res.status(400).json({ message: 'Please provide a search query or tags' });
    }

    let query = { author: req.user._id };

    if (q) {
      // Search in title and content
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } }
      ];
    }

    if (tags) {
      // Search by tags (comma-separated)
      const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
      query.tags = { $in: tagArray };
    }

    const entries = await Entry.find(query)
      .sort('-createdAt')
      .populate('author', 'username email');

    res.json({
      entries,
      count: entries.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error searching entries', error: error.message });
  }
});

// @route   GET /api/entries/:id
// @desc    Get a single entry by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id).populate('author', 'username email');

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    // Check if user owns the entry or it's public
    if (entry.author._id.toString() !== req.user._id.toString() && !entry.isPublic) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Increment views
    entry.views += 1;
    await entry.save();

    res.json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching entry', error: error.message });
  }
});

// @route   POST /api/entries
// @desc    Create a new entry
// @access  Private
router.post('/', [
  auth,
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, tags, isPublic } = req.body;

    // Process tags
    const processedTags = tags ? tags.map(tag => tag.trim().toLowerCase()) : [];

    const entry = new Entry({
      title,
      content,
      tags: processedTags,
      author: req.user._id,
      isPublic: isPublic || false
    });

    await entry.save();

    const populatedEntry = await Entry.findById(entry._id).populate('author', 'username email');

    res.status(201).json({
      message: 'Entry created successfully',
      entry: populatedEntry
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating entry', error: error.message });
  }
});

// @route   PUT /api/entries/:id
// @desc    Update an entry
// @access  Private
router.put('/:id', [
  auth,
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('content').optional().trim().notEmpty().withMessage('Content cannot be empty')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const entry = await Entry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    // Check if user owns the entry
    if (entry.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, content, tags, isPublic } = req.body;

    // Update fields
    if (title) entry.title = title;
    if (content) entry.content = content;
    if (tags) entry.tags = tags.map(tag => tag.trim().toLowerCase());
    if (typeof isPublic !== 'undefined') entry.isPublic = isPublic;

    await entry.save();

    const updatedEntry = await Entry.findById(entry._id).populate('author', 'username email');

    res.json({
      message: 'Entry updated successfully',
      entry: updatedEntry
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating entry', error: error.message });
  }
});

// @route   DELETE /api/entries/:id
// @desc    Delete an entry
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    // Check if user owns the entry
    if (entry.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Entry.findByIdAndDelete(req.params.id);

    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting entry', error: error.message });
  }
});

module.exports = router;
