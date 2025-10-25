const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

// @route   GET /api/admin/stats
// @desc    Get analytics and statistics
// @access  Private (Admin only)
router.get('/stats', [auth, adminAuth], async (req, res) => {
  try {
    // Total users
    const totalUsers = await User.countDocuments();
    
    // Total entries
    const totalEntries = await Entry.countDocuments();
    
    // Entries by user
    const entriesByUser = await Entry.aggregate([
      {
        $group: {
          _id: '$author',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          username: '$user.username',
          email: '$user.email',
          entryCount: '$count'
        }
      },
      {
        $sort: { entryCount: -1 }
      }
    ]);

    // Most popular tags
    const popularTags = await Entry.aggregate([
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Recent entries
    const recentEntries = await Entry.find()
      .sort('-createdAt')
      .limit(10)
      .populate('author', 'username email');

    // Most viewed entries
    const mostViewedEntries = await Entry.find()
      .sort('-views')
      .limit(10)
      .populate('author', 'username email');

    // Entries created over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const entriesOverTime = await Entry.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      totalUsers,
      totalEntries,
      entriesByUser,
      popularTags,
      recentEntries,
      mostViewedEntries,
      entriesOverTime
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/users', [auth, adminAuth], async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// @route   GET /api/admin/entries
// @desc    Get all entries (from all users)
// @access  Private (Admin only)
router.get('/entries', [auth, adminAuth], async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = '-createdAt' } = req.query;
    
    const entries = await Entry.find()
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('author', 'username email');

    const count = await Entry.countDocuments();

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

// @route   DELETE /api/admin/entries/:id
// @desc    Delete any entry
// @access  Private (Admin only)
router.delete('/entries/:id', [auth, adminAuth], async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    await Entry.findByIdAndDelete(req.params.id);

    res.json({ message: 'Entry deleted successfully by admin' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting entry', error: error.message });
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Private (Admin only)
router.put('/users/:id/role', [auth, adminAuth], async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({
      message: 'User role updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role', error: error.message });
  }
});

module.exports = router;
