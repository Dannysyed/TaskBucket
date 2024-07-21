const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const auth = require("../middleware/auth");

// Create a new comment
router.post("/:taskId", auth, async (req, res) => {
  try {
    const { content, userId } = req.body; // Destructure the necessary fields from the request body
    const { taskId } = req.params; // Extract taskId from the route parameter

    const comment = new Comment({
      content,
      userId,
      taskId,
      createdAt: new Date(), // Ensure createdAt is set if it's not handled by the schema
    });

    await comment.save();
    res.status(201).send(comment);
  } catch (error) {
    res.status(400).send({ message: "Failed to add comment", error });
  }
});

// Get all comments
router.get("/", auth, async (req, res) => {
  try {
    const comments = await Comment.find().populate("userId taskId");
    res.status(200).send(comments);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a comment by taskId
router.get("/:taskId", auth, async (req, res) => {
  try {
    const comments = await Comment.find({ taskId: req.params.taskId }).populate(
      "taskId"
    );
    if (!comments.length) {
      return res
        .status(200)
        .send({ message: ["No comments found for this task."] });
    }
    res.status(200).send(comments);
  } catch (error) {
    res.status(500).send({ message: "Server error", error });
  }
});

// Update a comment by ID
router.put("/:id", auth, async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!comment) {
      return res.status(404).send();
    }
    res.status(200).send(comment);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a comment by ID
router.delete("/:id", auth, async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) {
      return res.status(404).send();
    }
    res.status(200).send(comment);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
