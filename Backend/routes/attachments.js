const express = require("express");
const router = express.Router();
const Attachment = require("../models/Attachment");

// Create a new attachment
router.post("/", async (req, res) => {
  try {
    const attachment = new Attachment(req.body);
    await attachment.save();
    res.status(201).send(attachment);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all attachments
router.get("/", async (req, res) => {
  try {
    const attachments = await Attachment.find().populate("taskId");
    res.status(200).send(attachments);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get an attachment by ID
router.get("/:id", async (req, res) => {
  try {
    const attachment = await Attachment.findById(req.params.id).populate(
      "taskId"
    );
    if (!attachment) {
      return res.status(404).send();
    }
    res.status(200).send(attachment);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update an attachment by ID
router.put("/:id", async (req, res) => {
  try {
    const attachment = await Attachment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!attachment) {
      return res.status(404).send();
    }
    res.status(200).send(attachment);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete an attachment by ID
router.delete("/:id", async (req, res) => {
  try {
    const attachment = await Attachment.findByIdAndDelete(req.params.id);
    if (!attachment) {
      return res.status(404).send();
    }
    res.status(200).send(attachment);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
