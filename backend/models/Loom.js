const mongoose = require('mongoose');

const loomSchema = new mongoose.Schema({
  loomNumber: { type: String, required: true, unique: true },
  loomType: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Running', 'Idle', 'Maintenance', 'Stopped'], 
    default: 'Idle' 
  },
  speedRpm: { type: Number, default: 0 },
  assignedOrder: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Loom', loomSchema);