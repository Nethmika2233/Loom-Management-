const express = require('express');
const router = express.Router();
const { 
  getLooms, 
  createLoom, 
  updateLoom, 
  deleteLoom 
} = require('../controllers/loomController');
const { protect } = require('../middleware/authMiddleware');

// Public route: view looms
router.get('/', getLooms);

// Protected routes: require JWT token
router.post('/', protect, createLoom);
router.put('/:id', protect, updateLoom);
router.delete('/:id', protect, deleteLoom);

module.exports = router;