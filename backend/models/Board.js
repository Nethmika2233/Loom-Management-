const mongoose = require('mongoose');

const ColumnSchema = new mongoose.Schema({
  id: { type: String },
  boardId: { type: String },
  title: { type: String, required: true },
  order: { type: Number, required: true },
  color: { type: String, default: "#94A3B8" }
}, { _id: false });

const BoardSchema = new mongoose.Schema({
  _id: { type: String },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  workspaceId: { type: String, default: 'w1' },
  columns: {
    type: [ColumnSchema],
    default: [
      { id: 'c-todo', title: 'To Do', order: 0, color: '#94A3B8' },
      { id: 'c-doing', title: 'Doing', order: 1, color: '#4F46E5' },
      { id: 'c-review', title: 'Review', order: 2, color: '#F97316' },
      { id: 'c-done', title: 'Done', order: 3, color: '#16A34A' }
    ]
  },
  memberIds: { type: [String], default: [] },
  favorite: { type: Boolean, default: false },
  archived: { type: Boolean, default: false },
  color: { type: String, default: 'from-indigo-500 to-violet-500' },
  coverImage: { type: String },
  userId: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Board', BoardSchema);