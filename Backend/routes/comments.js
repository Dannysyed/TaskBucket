const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const auth = require("../middleware/auth");

// Create a new comment
router.post("/", auth, async (req, res) => {
  try {
    const comment = new Comment(req.body);
    await comment.save();
    res.status(201).send(comment);
  } catch (error) {
    res.status(400).send(error);
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

// Get a comment by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate(
      "userId taskId"
    );
    if (!comment) {
      return res.status(404).send();
    }
    res.status(200).send(comment);
  } catch (error) {
    res.status(500).send(error);
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
