const Board = require('../models/Board');

// Get all boards
exports.getBoards = async (req, res) => {
  try {
    const boards = await Board.find();
    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single board by ID
exports.getBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    res.status(200).json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new board
exports.createBoard = async (req, res) => {
  try {
    const newBoard = new Board(req.body);
    await newBoard.save();
    res.status(201).json(newBoard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a board
exports.updateBoard = async (req, res) => {
  try {
    const updatedBoard = await Board.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    res.status(200).json(updatedBoard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a board
exports.deleteBoard = async (req, res) => {
  try {
    await Board.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Board deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};