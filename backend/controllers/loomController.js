const Loom = require('../models/Loom');

// Get all looms
exports.getLooms = async (req, res) => {
  try {
    const looms = await Loom.find();
    res.status(200).json(looms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new loom
exports.createLoom = async (req, res) => {
  try {
    const newLoom = new Loom(req.body);
    const savedLoom = await newLoom.save();
    res.status(201).json(savedLoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update loom status/speed
exports.updateLoom = async (req, res) => {
  try {
    const updatedLoom = await Loom.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.status(200).json(updatedLoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a loom
exports.deleteLoom = async (req, res) => {
  try {
    await Loom.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Loom deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};