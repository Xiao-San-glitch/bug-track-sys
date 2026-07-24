const Bug = require('../models/Bug');

// @desc    Get all bugs
// @route   GET /api/bugs
// @access  Public
const getBugs = async (req, res) => {
  try {
    const bugs = await Bug.find();
    res.status(200).json(bugs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a bug
// @route   POST /api/bugs
// @access  Public
const createBug = async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Please provide title and description' });
    }

    const bug = await Bug.create({
      title,
      description,
      status: status || 'Open',
      priority: priority || 'Medium',
    });

    res.status(201).json(bug);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a bug
// @route   PUT /api/bugs/:id
// @access  Public
const updateBug = async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);

    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }

    const updatedBug = await Bug.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedBug);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a bug
// @route   DELETE /api/bugs/:id
// @access  Public
const deleteBug = async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);

    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }

    await bug.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBugs,
  createBug,
  updateBug,
  deleteBug,
};
