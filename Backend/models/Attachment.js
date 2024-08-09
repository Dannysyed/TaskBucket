const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  filePath: { type: String, required: true },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
});

module.exports = mongoose.model("Attachment", attachmentSchema);
