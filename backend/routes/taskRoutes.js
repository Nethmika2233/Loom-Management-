const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// Get tasks by board or all tasks
router.get("/", async (req, res) => {
  try {
    const { boardId } = req.query;
    const filter = boardId ? { boardId } : {};
    const tasks = await Task.find(filter);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new task
router.post("/", async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update task details or checklist
router.put("/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTask) return res.status(404).json({ message: "Task not found" });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a comment to a task
router.post("/:id/comments", async (req, res) => {
  try {
    const { text, content, actorId } = req.body;
    const comment = {
      id: `c${Date.now()}`,
      authorId: actorId || "u1",
      content: content || text,
      createdAt: new Date().toISOString(),
    };

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.comments = task.comments || [];
    task.comments.push(comment);
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a task
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;