const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");
require("dotenv").config();
const multer = require("multer");
const Attachment = require("../models/Attachment");
const auth = require("../middleware/auth");

// Set up AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Multer setup
const upload = multer();

router.post("/", auth, upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const { filename, originalname, buffer } = req.file;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${Date.now()}-${req.file.originalname}`,
    Body: req.file.buffer,
    ACL: "private",
  };

  console.log("AWS_BUCKET_NAME:", process.env.AWS_BUCKET_NAME); // Debugging line

  try {
    // Upload file to S3
    const data = await s3.upload(params).promise();
    const fileUrl = data.Location;

    // Create a new attachment document
    const attachment = new Attachment({
      filename: originalname,
      filePath: fileUrl,
      taskId: req.body.taskId, // Ensure taskId is passed in the request body
    });

    await attachment.save();
    res.status(201).send(attachment);
  } catch (error) {
    console.error(error); // Log the error to see detailed information
    res.status(400).send(error);
  }
});
// Get all attachments
router.get("/", auth, async (req, res) => {
  try {
    const attachments = await Attachment.find().populate("taskId");
    res.status(200).send(attachments);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get an attachment by ID
router.get("/:taskId", auth, async (req, res) => {
  try {
    const attachment = await Attachment.find({
      taskId: req.params.taskId,
    }).populate("taskId");

    if (!attachment) {
      return res.status(404).send();
    }
    res.status(200).send(attachment);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update an attachment by ID
router.put("/:id", auth, async (req, res) => {
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
router.delete("/:id", auth, async (req, res) => {
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
