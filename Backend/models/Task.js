const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
    default: "Pending",
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },
  dueDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  assignedTo: { type: String, ref: "User" },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" }, // Reference to Project
});

module.exports = mongoose.model("Task", taskSchema);
