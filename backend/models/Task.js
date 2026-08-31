const mongoose = require("mongoose");

const ChecklistItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  done: { type: Boolean, default: false },
});

const CommentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  authorId: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const AttachmentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  url: { type: String, required: true },
  size: { type: String },
});

const ActivitySchema = new mongoose.Schema({
  id: { type: String },
  actorId: { type: String },
  action: { type: String },
  target: { type: String },
  createdAt: { type: Date },
}, { _id: false });

const TaskSchema = new mongoose.Schema(
  {
    _id: { type: String },
    boardId: { type: String, required: true },
    columnId: { type: String },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["backlog", "todo", "doing", "in_progress", "in_review", "review", "done"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    dueDate: { type: Date },
    assigneeIds: [{ type: String }],
    labelIds: [{ type: String }],
    estimatedHours: { type: Number, default: 0 },
    loggedHours: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
    checklist: [ChecklistItemSchema],
    comments: [CommentSchema],
    attachments: [AttachmentSchema],
    activity: [ActivitySchema],
  },
  { timestamps: true, strict: false }
);

module.exports = mongoose.model("Task", TaskSchema);